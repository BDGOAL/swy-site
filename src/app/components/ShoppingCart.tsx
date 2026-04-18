import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';
import { useState } from 'react';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { 
    cart,
    cartCount,
    checkoutUrl,
    removeFromCart, 
    updateQuantity,
    isConfigured,
  } = useShopify();

  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);

  const handleCheckout = () => {
    if (checkoutUrl) {
      // Redirect to Shopify checkout
      window.location.href = checkoutUrl;
    } else if (!isConfigured) {
      alert('Shopify is not configured. Please complete setup to enable checkout.');
    } else {
      setIsCreatingCheckout(true);
      setCheckoutError(null);
      // Simulate creating checkout
      setTimeout(() => {
        setIsCreatingCheckout(false);
        setCheckoutError('Failed to create checkout. Please try again.');
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[70]"
            style={{
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#0A0A0A] z-[70] flex flex-col"
            style={{
              border: '0.5px solid rgba(242,240,237,0.15)',
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between px-6 py-5"
              style={{
                borderBottom: '0.5px solid rgba(242,240,237,0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} color="#F2F0ED" opacity={0.6} />
                <h2 
                  className="text-sm tracking-[0.3em] uppercase"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: '#F2F0ED',
                  }}
                >
                  Cart ({cartCount})
                </h2>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:opacity-60 transition-opacity"
              >
                <X size={20} color="#F2F0ED" opacity={0.6} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <ShoppingBag size={48} color="#F2F0ED" opacity={0.3} />
                  <p 
                    className="mt-4 text-[10px] tracking-wider"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: '#F2F0ED',
                    }}
                  >
                    YOUR CART IS EMPTY
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4"
                      style={{
                        borderBottom: '0.5px solid rgba(242,240,237,0.1)',
                        paddingBottom: '1.5rem',
                      }}
                    >
                      {/* Product Image */}
                      <div 
                        className="w-20 h-20 bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: item.image 
                            ? `url(${item.image})`
                            : 'none',
                          backgroundColor: 'rgba(242,240,237,0.05)',
                          filter: 'grayscale(100%)',
                        }}
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-[11px] tracking-wider mb-2"
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 900,
                            color: '#F2F0ED',
                          }}
                        >
                          {item.title}
                        </h3>
                        
                        <p 
                          className="text-[9px] tracking-wider opacity-50 mb-3"
                          style={{
                            fontFamily: 'var(--font-sans)',
                            color: '#F2F0ED',
                          }}
                        >
                          40mm × 60mm
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-[#F2F0ED]/20 hover:border-[#F2F0ED]/40 transition-colors"
                          >
                            <Minus size={12} color="#F2F0ED" />
                          </button>

                          <span 
                            className="text-[10px] tracking-wider w-6 text-center"
                            style={{
                              fontFamily: 'var(--font-sans)',
                              color: '#F2F0ED',
                            }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-[#F2F0ED]/20 hover:border-[#F2F0ED]/40 transition-colors"
                          >
                            <Plus size={12} color="#F2F0ED" />
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-[8px] tracking-wider opacity-40 hover:opacity-100 transition-opacity"
                            style={{
                              fontFamily: 'var(--font-sans)',
                              color: '#F2F0ED',
                            }}
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p 
                          className="text-[11px] tracking-wider"
                          style={{
                            fontFamily: 'var(--font-sans)',
                            color: '#F2F0ED',
                          }}
                        >
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div 
                className="px-6 py-5"
                style={{
                  borderTop: '0.5px solid rgba(242,240,237,0.15)',
                }}
              >
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-5">
                  <span 
                    className="text-[10px] tracking-[0.3em] uppercase opacity-60"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: '#F2F0ED',
                    }}
                  >
                    Subtotal
                  </span>
                  <span 
                    className="text-sm tracking-wider"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: '#F2F0ED',
                    }}
                  >
                    ${parseFloat(subtotal).toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 flex items-center justify-center border border-[#F2F0ED] hover:bg-[#F2F0ED] hover:text-[#0A0A0A] transition-all duration-300 group"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    color: '#F2F0ED',
                  }}
                >
                  {isCreatingCheckout ? 'CREATING CHECKOUT...' : 'PROCEED TO CHECKOUT'}
                </button>

                {checkoutError && (
                  <p 
                    className="text-[8px] tracking-wider opacity-30 mt-3 text-center"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: '#F2F0ED',
                    }}
                  >
                    {checkoutError}
                  </p>
                )}

                <p 
                  className="text-[8px] tracking-wider opacity-30 mt-3 text-center"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: '#F2F0ED',
                  }}
                >
                  Shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}