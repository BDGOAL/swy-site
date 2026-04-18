import { motion } from 'motion/react';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { useShopifyCart } from '../shopify/hooks/useShopifyCart';

interface AddToCartButtonProps {
  variantId: string;
  productName?: string;
  className?: string;
  onSuccess?: () => void;
}

/**
 * "加入购物车" 按钮组件
 * 
 * @param variantId - Shopify 产品变体 ID（从 Shopify Admin 获取）
 * @param productName - 产品名称（用于成功提示）
 * @param className - 自定义样式
 * @param onSuccess - 添加成功后的回调
 */
export function AddToCartButton({ 
  variantId, 
  productName,
  className = '',
  onSuccess 
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useShopifyCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    const result = await addToCart(variantId, 1);
    
    if (result.success) {
      setIsAdded(true);
      onSuccess?.();
      
      // 2秒后重置状态
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      whileHover={{ scale: isAdded ? 1 : 1.02 }}
      whileTap={{ scale: isAdded ? 1 : 0.98 }}
      className={`
        relative overflow-hidden
        px-8 py-4 
        border border-[#F2F0ED]
        flex items-center justify-center gap-3
        transition-all duration-300
        group
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isAdded ? 'bg-[#F2F0ED]' : 'hover:bg-[#F2F0ED]'}
        ${className}
      `}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '10px',
        letterSpacing: '0.3em',
        color: isAdded ? '#0A0A0A' : '#F2F0ED',
      }}
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-[#F2F0ED]"
        initial={{ x: '-100%' }}
        animate={{ x: isAdded ? '0%' : '-100%' }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-3">
        {isAdded ? (
          <>
            <Check size={14} />
            <span>ADDED TO CART</span>
          </>
        ) : (
          <>
            <ShoppingBag 
              size={14} 
              className={isAdded ? 'text-[#0A0A0A]' : 'text-[#F2F0ED] group-hover:text-[#0A0A0A]'}
            />
            <span className={isAdded ? 'text-[#0A0A0A]' : 'text-[#F2F0ED] group-hover:text-[#0A0A0A]'}>
              {isLoading ? 'ADDING...' : 'ADD TO CART'}
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
}
