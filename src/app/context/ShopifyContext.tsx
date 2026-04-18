import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { shopifyConfig, isShopifyConfigured } from '../config/shopify';

// Shopify Cart Line Item
export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  quantity: number;
  price: string;
  image?: string;
}

interface ShopifyContextType {
  cart: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  checkoutUrl: string | null;
  addToCart: (variantId: string, productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isConfigured: boolean;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error('useShopify must be used within ShopifyProvider');
  }
  return context;
};

interface ShopifyProviderProps {
  children: ReactNode;
}

export function ShopifyProvider({ children }: ShopifyProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const isConfigured = isShopifyConfigured();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('swy-cart');
    const savedCheckoutId = localStorage.getItem('swy-checkout-id');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedCheckoutId) {
      setCheckoutId(savedCheckoutId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('swy-cart', JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Create Shopify Checkout
  const createCheckout = async (items: CartItem[]) => {
    if (!isConfigured) {
      console.warn('Shopify not configured. Using mock checkout.');
      return null;
    }

    try {
      const lineItems = items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }));

      console.log('🛒 Creating cart with items:', lineItems);

      // ✅ Updated to use cartCreate (new Storefront API)
      const query = `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
              lines(first: 250) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        priceV2 {
                          amount
                          currencyCode
                        }
                        image {
                          url
                        }
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              message
              field
            }
          }
        }
      `;

      const response = await fetch(
        `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
          },
          body: JSON.stringify({
            query,
            variables: {
              input: {
                lines: lineItems,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        console.error('❌ Cart API response not OK:', response.status, response.statusText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Cart API response:', data);
      console.log('📦 Full response JSON:', JSON.stringify(data, null, 2));

      // Check for GraphQL errors at root level
      if (data.errors) {
        console.error('❌ GraphQL errors:', data.errors);
        console.error('❌ Full errors JSON:', JSON.stringify(data.errors, null, 2));
        const errorMessages = data.errors.map((e: any) => e.message).join(', ');
        alert(`GraphQL error: ${errorMessages}`);
        return null;
      }

      // Check for user errors
      if (data.data?.cartCreate?.userErrors?.length > 0) {
        const errors = data.data.cartCreate.userErrors;
        console.error('❌ Cart user errors:', errors);
        alert(`Cart error: ${errors.map((e: any) => e.message).join(', ')}`);
        return null;
      }
      
      if (data.data?.cartCreate?.cart) {
        const cart = data.data.cartCreate.cart;
        console.log('✅ Cart created successfully:', cart.checkoutUrl);
        setCheckoutId(cart.id);
        setCheckoutUrl(cart.checkoutUrl);
        localStorage.setItem('swy-checkout-id', cart.id);
        return cart.checkoutUrl;
      } else {
        console.error('❌ No cart in response:', data);
        alert('Failed to create cart. Please check console for details.');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to create cart:', error);
      alert(`Cart creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return null;
  };

  // Add item to cart
  const addToCart = async (variantId: string, productId: string, quantity: number = 1) => {
    // Find product from data
    const { products } = await import('../data/products');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    const { productImageFallbacks } = await import('../data/productImageFallbacks');

    const existingItem = cart.find(item => item.variantId === variantId);
    
    if (existingItem) {
      // Update quantity if item already exists
      updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${Date.now()}-${variantId}`,
        variantId,
        productId,
        title: product.name,
        quantity,
        price: product.price || '0.00',
        image: productImageFallbacks[productId],
      };
      
      const newCart = [...cart, newItem];
      setCart(newCart);
      
      // Create/update checkout
      if (isConfigured) {
        await createCheckout(newCart);
      }
    }
    
    // Open cart sidebar
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    
    if (isConfigured && newCart.length > 0) {
      createCheckout(newCart);
    } else {
      setCheckoutUrl(null);
      setCheckoutId(null);
      localStorage.removeItem('swy-checkout-id');
    }
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCart(newCart);
    
    if (isConfigured) {
      createCheckout(newCart);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCheckoutUrl(null);
    setCheckoutId(null);
    localStorage.removeItem('swy-cart');
    localStorage.removeItem('swy-checkout-id');
  };

  // Cart sidebar controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <ShopifyContext.Provider
      value={{
        cart,
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