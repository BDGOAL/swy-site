import { motion } from "motion/react";
import { useState } from "react";
import { products } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { productDescriptor } from "../lib/productLocale";

interface ArchiveTabsProps {
  onProductSelect?: (id: string) => void;
}

export function ArchiveTabs({ onProductSelect }: ArchiveTabsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { locale } = useLanguage();

  return (
    <div 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center"
      style={{
        paddingLeft: '24px',
      }}
    >
      {/* 0.5px vertical divider */}
      <div 
        className="w-[0.5px] h-[60vh] mr-8"
        style={{
          backgroundColor: 'rgba(26,26,26,0.15)',
        }}
      />
      
      {/* Vertical tabs */}
      <div className="flex flex-col gap-6">
        {products.map((product, index) => (
          <motion.button
            key={product.id}
            className="relative group text-left"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onProductSelect?.(product.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* White label background on hover - 像瓶貼一樣 */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: hoveredId === product.id ? '200px' : '0px',
                opacity: hoveredId === product.id ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: '#F2F0ED',
                border: '0.5px solid rgba(26,26,26,0.1)',
                borderRadius: '1px',
                boxShadow: '1px 1px 0px rgba(0,0,0,0.05)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Text content */}
            <div className="relative z-10 px-4 py-2">
              <div className="flex items-center gap-3">
                {/* Index number */}
                <span 
                  className="text-[8px] opacity-30 tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-sans)',
                    minWidth: '16px',
                  }}
                >
                  0{index + 1}
                </span>
                
                {/* Vertical text - English name */}
                <p 
                  className="text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
                  style={{ 
                    writingMode: 'vertical-rl',
                    fontFamily: 'var(--font-sans)',
                    opacity: hoveredId === product.id ? 1 : 0.5,
                    letterSpacing: hoveredId === product.id ? '0.4em' : '0.3em',
                  }}
                >
                  {product.name}
                </p>
                
                {/* Localized descriptor — appears on hover */}
                <motion.p
                  className="max-w-[14rem] text-[11px] leading-snug"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: hoveredId === product.id ? 1 : 0,
                    x: hoveredId === product.id ? 0 : -10,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {productDescriptor(product, locale)}
                </motion.p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
