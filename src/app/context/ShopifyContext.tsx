import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { shopifyConfig, isShopifyConfigured, storefrontInContextDirective } from "../config/shopify";
import {
  STOREFRONT_CART_SELECTION,
  normalizeStorefrontCart,
  type NormalizedCartItem,
  type ShopifyMoney,
} from "../lib/shopifyCart";

export type CartItem = NormalizedCartItem;

interface ShopifyContextType {
  cart: CartItem[];
  cartSubtotal: ShopifyMoney | null;
  cartCount: number;
  isCartOpen: boolean;
  checkoutUrl: string | null;
  addToCart: (variantId: string, productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isConfigured: boolean;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

const CART_ID_STORAGE = "swy-checkout-id";

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error("useShopify must be used within ShopifyProvider");
  }
  return context;
};

interface ShopifyProviderProps {
  children: ReactNode;
}

async function storefrontGraphql<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": shopifyConfig.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) {
    throw new Error(`Storefront API ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function ShopifyProvider({ children }: ShopifyProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState<ShopifyMoney | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(CART_ID_STORAGE) : null
  );
  const isConfigured = isShopifyConfigured();

  const applyNormalizedCart = useCallback((raw: Parameters<typeof normalizeStorefrontCart>[0]) => {
    const normalized = normalizeStorefrontCart(raw);
    if (!normalized) return;
    setCart(normalized.lines);
    setCartSubtotal(normalized.subtotal);
    setCheckoutUrl(normalized.checkoutUrl);
    setCartId(normalized.cartId);
    localStorage.setItem(CART_ID_STORAGE, normalized.cartId);
  }, []);

  const clearServerCartState = useCallback(() => {
    setCart([]);
    setCartSubtotal(null);
    setCheckoutUrl(null);
    setCartId(null);
    localStorage.removeItem(CART_ID_STORAGE);
  }, []);

  /** Hydrate drawer from persisted Shopify cart id (no local mock lines). */
  useEffect(() => {
    if (!isConfigured) return;
    const savedId = localStorage.getItem(CART_ID_STORAGE);
    if (!savedId) return;

    const query = `
      query CartHydrate($id: ID!) ${storefrontInContextDirective()} {
        cart(id: $id) {
          ${STOREFRONT_CART_SELECTION}
        }
      }
    `;

    let cancelled = false;
    (async () => {
      try {
        const data = await storefrontGraphql<{ data?: { cart?: unknown }; errors?: unknown }>(query, { id: savedId });
        if (cancelled) return;
        if (data.errors) {
          clearServerCartState();
          return;
        }
        const c = data.data?.cart;
        if (!c) {
          clearServerCartState();
          return;
        }
        applyNormalizedCart(c as Parameters<typeof normalizeStorefrontCart>[0]);
      } catch {
        if (!cancelled) clearServerCartState();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isConfigured, applyNormalizedCart, clearServerCartState]);

  /** Drop legacy local-only cart JSON; Shopify cart id is the only persistence. */
  useEffect(() => {
    localStorage.removeItem("swy-cart");
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartCreate = async (lines: { merchandiseId: string; quantity: number }[]) => {
    const query = `
      mutation cartCreate($input: CartInput!) ${storefrontInContextDirective()} {
        cartCreate(input: $input) {
          cart {
            ${STOREFRONT_CART_SELECTION}
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const data = await storefrontGraphql<{
      data?: { cartCreate?: { cart?: unknown; userErrors?: { message: string }[] } };
      errors?: { message: string }[];
    }>(query, { input: { lines } });

    if (data.errors?.length) {
      alert(`Cart error: ${data.errors.map((e) => e.message).join(", ")}`);
      return;
    }
    const errs = data.data?.cartCreate?.userErrors;
    if (errs?.length) {
      alert(`Cart error: ${errs.map((e) => e.message).join(", ")}`);
      return;
    }
    const c = data.data?.cartCreate?.cart;
    if (c) applyNormalizedCart(c as Parameters<typeof normalizeStorefrontCart>[0]);
  };

  const cartLinesAdd = async (lines: { merchandiseId: string; quantity: number }[]) => {
    if (!cartId) return;
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) ${storefrontInContextDirective()} {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ${STOREFRONT_CART_SELECTION}
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const data = await storefrontGraphql<{
      data?: { cartLinesAdd?: { cart?: unknown; userErrors?: { message: string }[] } };
      errors?: { message: string }[];
    }>(query, { cartId, lines });

    if (data.errors?.length) {
      alert(`Cart error: ${data.errors.map((e) => e.message).join(", ")}`);
      return;
    }
    const errs = data.data?.cartLinesAdd?.userErrors;
    if (errs?.length) {
      alert(`Cart error: ${errs.map((e) => e.message).join(", ")}`);
      return;
    }
    const c = data.data?.cartLinesAdd?.cart;
    if (c) applyNormalizedCart(c as Parameters<typeof normalizeStorefrontCart>[0]);
  };

  const cartLinesUpdate = async (lines: { id: string; quantity: number }[]) => {
    if (!cartId) return;
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) ${storefrontInContextDirective()} {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${STOREFRONT_CART_SELECTION}
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const data = await storefrontGraphql<{
      data?: { cartLinesUpdate?: { cart?: unknown; userErrors?: { message: string }[] } };
      errors?: { message: string }[];
    }>(query, { cartId, lines });

    if (data.errors?.length) {
      alert(`Cart error: ${data.errors.map((e) => e.message).join(", ")}`);
      return;
    }
    const errs = data.data?.cartLinesUpdate?.userErrors;
    if (errs?.length) {
      alert(`Cart error: ${errs.map((e) => e.message).join(", ")}`);
      return;
    }
    const c = data.data?.cartLinesUpdate?.cart;
    if (c) applyNormalizedCart(c as Parameters<typeof normalizeStorefrontCart>[0]);
  };

  const cartLinesRemove = async (lineIds: string[]) => {
    if (!cartId) return;
    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) ${storefrontInContextDirective()} {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${STOREFRONT_CART_SELECTION}
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const data = await storefrontGraphql<{
      data?: { cartLinesRemove?: { cart?: unknown; userErrors?: { message: string }[] } };
      errors?: { message: string }[];
    }>(query, { cartId, lineIds });

    if (data.errors?.length) {
      alert(`Cart error: ${data.errors.map((e) => e.message).join(", ")}`);
      return;
    }
    const errs = data.data?.cartLinesRemove?.userErrors;
    if (errs?.length) {
      alert(`Cart error: ${errs.map((e) => e.message).join(", ")}`);
      return;
    }
    const c = data.data?.cartLinesRemove?.cart;
    if (c) applyNormalizedCart(c as Parameters<typeof normalizeStorefrontCart>[0]);
  };

  const addToCart = async (variantId: string, _productId: string, quantity: number = 1) => {
    if (!isConfigured) {
      console.warn("Shopify not configured.");
      return;
    }

    const existing = cart.find((item) => item.variantId === variantId);
    if (existing) {
      await cartLinesUpdate([{ id: existing.lineId, quantity: existing.quantity + quantity }]);
    } else if (!cartId) {
      await cartCreate([{ merchandiseId: variantId, quantity }]);
    } else {
      await cartLinesAdd([{ merchandiseId: variantId, quantity }]);
    }

    setIsCartOpen(true);
  };

  const removeFromCart = async (lineId: string) => {
    if (!isConfigured || !cartId) {
      setCart((c) => c.filter((item) => item.lineId !== lineId));
      return;
    }
    await cartLinesRemove([lineId]);
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(lineId);
      return;
    }
    if (!isConfigured || !cartId) return;
    await cartLinesUpdate([{ id: lineId, quantity }]);
  };

  const clearCart = () => {
    clearServerCartState();
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <ShopifyContext.Provider
      value={{
        cart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        checkoutUrl,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        isConfigured,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
}
