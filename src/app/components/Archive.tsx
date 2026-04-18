import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useTheme } from "../context/ThemeContext"; // 延續你的主題系統

// 假設這個 product 物件是從 Shopify API 或 Liquid 傳入的
export function ProductDetail({ product }) {
  const scrollRef = useRef(null);
  const { mode } = useTheme();

  // 解析 Description (Shopify 的 description 通常是 HTML 字串)
  // 建議在 Shopify 後台用 <h2> 或 <p> 標籤區分，這裡做簡單拆解
  const descriptionHtml = product.descriptionHtml;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F2F0ED] selection:bg-white/20">
      {/* 頂部導覽 */}
      <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <span className="font-mono text-[10px] tracking-[0.4em] opacity-50 uppercase">
          Archive / {product.productType || "Fragrance"}
        </span>
      </nav>

      <main className="relative">
        {/* 視覺焦點區域：左圖右文 */}
        <section className="flex flex-col md:flex-row min-h-screen">
          
          {/* 左側：大圖 (Sticky 效果) */}
          <div className="w-full md:w-1/2 h-[60vh] md:h-screen sticky top-0 overflow-hidden bg-[#111]">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              src={product.images[0]?.url} 
              alt={product.title}
              className="w-full h-full object-cover grayscale-[0.5] contrast-[1.1]"
            />
            {/* 檔案感浮水印 */}
            <div className="absolute bottom-8 left-8 font-mono text-[8px] opacity-30 tracking-widest">
              IMG_REF: {product.id.split('/').pop()}
            </div>
          </div>

          {/* 右側：文字資訊 (Scroll 區域) */}
          <div className="w-full md:w-1/2 px-8 md:px-20 py-24 md:py-40">
            
            {/* 標題與標籤 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="h-[1px] w-8 bg-white/30" />
                <p className="text-[10px] tracking-[0.5em] font-mono opacity-50 uppercase">
                  {product.vendor}
                </p>
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
                {product.title}
              </h1>
            </motion.div>

            {/* 核心內容 - 直接渲染 Shopify 的 HTML */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="prose prose-invert max-w-none 
                prose-p:text-sm prose-p:leading-relaxed prose-p:opacity-70
                prose-strong:text-white prose-strong:tracking-widest prose-strong:uppercase prose-strong:text-[11px]
                prose-li:text-xs prose-li:opacity-60"
            >
              {/* 使用 dangerouslySetInnerHTML 來呈現 Shopify 後台編輯器的內容 */}
              <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            </motion.div>

            {/* 下方裝飾：第二張圖 (檔案感排列) */}
            {product.images[1] && (
              <div className="mt-24 relative">
                <div className="absolute -top-12 -left-4 font-mono text-[7px] opacity-20 rotate-90">
                  SUPPLEMENTARY_VISUAL
                </div>
                <img 
                  src={product.images[1].url} 
                  className="w-full grayscale border border-white/5"
                  alt="Detail"
                />
              </div>
            )}

            {/* 底部行動區域 */}
            <div className="mt-24 pt-12 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[8px] font-mono opacity-30 uppercase mb-2">Availability</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] tracking-widest">{product.availableForSale ? 'IN_STOCK' : 'ARCHIVED'}</span>
                </div>
              </div>
              
              <button className="px-12 py-4 bg-[#F2F0ED] text-black text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-colors">
                Add to Cart
              </button>
            </div>

          </div>
        </section>
      </main>

      {/* 背景裝飾：格線 (維持你的品牌一致性) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]"
        style={{ backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
      />
    </div>
  );
}
