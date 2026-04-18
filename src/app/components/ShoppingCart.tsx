import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useShopify } from '../context/ShopifyContext';
import { useLanguage } from '../context/LanguageContext';
import { siteCopy } from '../content/siteCopy';
import { useState, useEffect } from 'react';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { t } = useLanguage();
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

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + parseFloat(item.price) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else if (!isConfigured) {
      alert('Shopify is not configured. Please complete setup to enable checkout.');
    } else {
      setIsCreatingCheckout(true);
      setCheckoutError(null);
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/80"
            style={{
              backdropFilter: 'blur(8px)',
            }}
            aria-hidden
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="fixed right-0 top-0 z-[115] flex h-screen w-full max-w-md flex-col bg-[#0A0A0A] shadow-[0_0_80px_rgba(0,0,0,0.65)]"
            style={{
              border: '0.5px solid rgba(242,240,237,0.15)',
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-6 py-5"
              style={{
                borderBottom: '0.5px solid rgba(242,240,237,0.15)',
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <ShoppingBag size={18} color="#F2F0ED" opacity={0.6} />
                <h2
                  id="cart-drawer-title"
                  className="truncate text-sm tracking-[0.3em] uppercase"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: '#F2F0ED',
                  }}
                >
                  {t(siteCopy.product.floatingCart)} ({cartCount})
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex shrink-0 items-center gap-2 border border-white/25 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#F2F0ED]/90 transition hover:border-white/40 hover:bg-white/[0.06]"
                style={{ fontFamily: 'var(--font-sans)' }}
                aria-label={t(siteCopy.product.cartDrawerClose)}
              >
                <X size={16} strokeWidth={1.75} className="opacity-80" aria-hidden />
                {t(siteCopy.product.cartDrawerClose)}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center opacity-40">
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
                      <div
                        className="h-20 w-20 flex-shrink-0 bg-cover bg-center"
                        style={{
                          backgroundImage: item.image
                            ? `url(${item.image})`
                            : 'none',
                          backgroundColor: 'rgba(242,240,237,0.05)',
                          filter: 'grayscale(100%)',
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <h3
                          className="mb-2 text-[11px] tracking-wider"
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 900,
                            color: '#F2F0ED',
                          }}
                        >
                          {item.title}
                        </h3>

                        <p
                          className="mb-3 text-[9px] tracking-wider opacity-50"
                          style={{
                            fontFamily: 'var(--font-sans)',
                            color: '#F2F0ED',
                          }}
                        >
                          {t(siteCopy.product.capacityValue)}
                        </p>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-6 w-6 items-center justify-center border border-[#F2F0ED]/20 transition-colors hover:border-[#F2F0ED]/40"
                          >
                            <Minus size={12} color="#F2F0ED" />
                          </button>

                          <span
                            className="w-6 text-center text-[10px] tracking-wider"
                            style={{
                              fontFamily: 'var(--font-sans)',
                              color: '#F2F0ED',
                            }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-6 w-6 items-center justify-center border border-[#F2F0ED]/20 transition-colors hover:border-[#F2F0ED]/40"
                          >
                            <Plus size={12} color="#F2F0ED" />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-[8px] tracking-wider opacity-40 transition-opacity hover:opacity-100"
                            style={{
                              fontFamily: 'var(--font-sans)',
                              color: '#F2F0ED',
                            }}
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
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

            {cart.length > 0 && (
              <div
                className="px-6 py-5"
                style={{
                  borderTop: '0.5px solid rgba(242,240,237,0.15)',
                }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className="text-[10px] uppercase tracking-[0.3em] opacity-60"
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
                    ${parseFloat(String(subtotal)).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="group flex w-full items-center justify-center border border-[#F2F0ED] py-4 transition-all duration-300 hover:bg-[#F2F0ED] hover:text-[#0A0A0A]"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    color: '#F2F0ED',
                  }}
                >
                  {isCreatingCheckout
                    ? 'CREATING CHECKOUT...'
                    : 'PROCEED TO CHECKOUT'}
                </button>

                {checkoutError && (
                  <p
                    className="mt-3 text-center text-[8px] tracking-wider opacity-30"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: '#F2F0ED',
                    }}
                  >
                    {checkoutError}
                  </p>
                )}

                <p
                  className="mt-3 text-center text-[8px] tracking-wider opacity-30"
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
