/**
 * Storefront Cart normalization — single source of truth for drawer UI (images + money).
 *
 * Line money (Shopify CartLineCost):
 * - `subtotalAmount` — line merchandise cost **before** line-level discounts
 * - `totalAmount` — **final** line total the buyer pays (use for drawer line price)
 * - `amountPerQuantity` — unit/list price for the line
 */

export type ShopifyMoney = { amount: string; currencyCode: string };

export interface NormalizedCartItem {
  /** Storefront CartLine GID */
  lineId: string;
  variantId: string;
  title: string;
  quantity: number;
  imageUrl: string | null;
  /** Unit price from Shopify (amountPerQuantity). */
  unitPrice: ShopifyMoney;
  /** Line total before line-level discounts (subtotalAmount). */
  lineSubtotal: ShopifyMoney;
  /** Final line total after line-level discounts (totalAmount) — primary display. */
  lineTotal: ShopifyMoney;
  /** True when line-level discount reduces total below pre-discount subtotal. */
  hasLineDiscount: boolean;
}

export type NormalizedCart = {
  cartId: string;
  checkoutUrl: string | null;
  lines: NormalizedCartItem[];
  /** Cart subtotal from `cart.cost.subtotalAmount` (Shopify-defined; pre cart-level discount per API). */
  subtotal: ShopifyMoney | null;
};

type MoneyNode = { amount?: string; currencyCode?: string } | null | undefined;

type VariantMerchandise = {
  id?: string;
  title?: string;
  image?: { url?: string } | null;
  product?: {
    title?: string;
    featuredImage?: { url?: string } | null;
  } | null;
};

type CartLineNode = {
  id?: string;
  quantity?: number;
  cost?: {
    amountPerQuantity?: MoneyNode;
    subtotalAmount?: MoneyNode;
    totalAmount?: MoneyNode;
  } | null;
  merchandise?: VariantMerchandise | null;
};

function pickMoney(m: MoneyNode): ShopifyMoney | null {
  if (!m?.amount || !m.currencyCode) return null;
  return { amount: m.amount, currencyCode: m.currencyCode };
}

function lineImageUrl(m: VariantMerchandise | null | undefined): string | null {
  if (!m) return null;
  const v = m.image?.url;
  if (v) return v;
  const f = m.product?.featuredImage?.url;
  return f ?? null;
}

function lineTitle(m: VariantMerchandise | null | undefined): string {
  if (!m) return "Product";
  const productTitle = m.product?.title?.trim() || "Product";
  const variantTitle = m.title?.trim();
  if (!variantTitle || variantTitle === "Default Title") return productTitle;
  return `${productTitle} — ${variantTitle}`;
}

function moneyGreater(a: ShopifyMoney, b: ShopifyMoney): boolean {
  return Number(a.amount) > Number(b.amount) + 1e-9;
}

/** Map a single CartLine node from Storefront API to drawer row. */
export function normalizeCartLineNode(node: CartLineNode): NormalizedCartItem | null {
  if (!node?.id || !node.merchandise?.id) return null;
  const m = node.merchandise;
  const unit = pickMoney(node.cost?.amountPerQuantity);
  const lineSub = pickMoney(node.cost?.subtotalAmount);
  const lineTot = pickMoney(node.cost?.totalAmount) ?? lineSub;
  if (!unit || !lineSub || !lineTot) return null;

  const hasLineDiscount =
    lineSub.currencyCode === lineTot.currencyCode && moneyGreater(lineSub, lineTot);

  return {
    lineId: node.id,
    variantId: m.id,
    title: lineTitle(m),
    quantity: node.quantity ?? 1,
    imageUrl: lineImageUrl(m),
    unitPrice: unit,
    lineSubtotal: lineSub,
    lineTotal: lineTot,
    hasLineDiscount,
  };
}

/** Fragment fields for cart queries/mutations (lines + cost + merchandise image). */
export const STOREFRONT_CART_SELECTION = `
  id
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 250) {
    edges {
      node {
        id
        quantity
        cost {
          amountPerQuantity {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
            }
            product {
              title
              featuredImage {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export function normalizeStorefrontCart(cart: {
  id?: string;
  checkoutUrl?: string | null;
  cost?: { subtotalAmount?: MoneyNode } | null;
  lines?: { edges?: { node?: CartLineNode }[] } | null;
} | null | undefined): NormalizedCart | null {
  if (!cart?.id) return null;
  const edges = cart.lines?.edges ?? [];
  const lines: NormalizedCartItem[] = [];
  for (const e of edges) {
    const row = normalizeCartLineNode(e?.node ?? {});
    if (row) lines.push(row);
  }
  const subtotal = pickMoney(cart.cost?.subtotalAmount);
  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl ?? null,
    lines,
    subtotal,
  };
}
