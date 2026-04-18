import { motion, useTransform, type MotionValue } from "motion/react";
import { BOTTLE_IMAGE } from "../data/bottleImage";
import type { Product } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { productLongStory, productShortStory } from "../lib/productLocale";

interface DriftBottleScrollItemProps {
  product: Product;
  index: number;
  scrollYProgress: MotionValue<number>;
  bottleRotate: MotionValue<number>;
  bottleFloat: MotionValue<number>;
}

export function DriftBottleScrollItem({ 
  product, 
  index, 
  scrollYProgress, 
  bottleRotate, 
  bottleFloat 
}: DriftBottleScrollItemProps) {
  const { locale } = useLanguage();
  const storyBody =
    productLongStory(product, locale) || productShortStory(product, locale);

  // Create parallax transform for this specific item
  const parallaxX = useTransform(
    scrollYProgress, 
    [0, 1], 
    [index * 200, index * -200]
  );
  
  // Fade in/out based on visibility
  const opacity = useTransform(
    scrollYProgress,
    [
      (index - 0.5) / 8, // Start fading in
      index / 8,         // Fully visible
      (index + 0.5) / 8, // Start fading out
      (index + 1) / 8    // Fully faded
    ],
    [0, 1, 1, 0]
  );

  return (
    <div className="flex-shrink-0 w-screen h-screen relative flex items-center">
      {/* Container with proper left margin - increased to ensure counter visibility */}
      <div className="w-full h-full flex items-center" style={{ paddingLeft: 'max(8vw, 100px)' }}>
        {/* Background story text - parallax floating with white ink - Responsive */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity,
          }}
        >
          <p
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] leading-[0.9] opacity-[0.05] select-none uppercase text-center px-4"
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 200,
              letterSpacing: '0.2em',
              color: '#F2F0ED',
              maxWidth: '95vw',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            {product.name}
          </p>
        </motion.div>

        {/* Bottle container with refraction effect - positioned with safe left margin */}
        <div className="relative z-10" style={{ marginLeft: '80px' }}>
          {/* Refraction layer - distorts background text */}
          <motion.div
            style={{
              rotate: bottleRotate,
              y: bottleFloat,
            }}
            className="relative"
          >
            {/* Glass bottle with enhanced distortion effect */}
            <div 
              className="w-[240px] h-[380px] bg-contain bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url(${BOTTLE_IMAGE})`,
                filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5)) brightness(1.1)',
              }}
            >
              {/* Enhanced refraction effect - 15% distortion */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backdropFilter: 'blur(1.5px)',
                  WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at center, black 40%, transparent 70%)',
                  maskImage: 'radial-gradient(ellipse 60% 80% at center, black 40%, transparent 70%)',
                  transform: 'scale(1.15)',
                }}
              />
              
              {/* 40mm x 60mm Label - adapted for Noir */}
              <div
                className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-between p-4"
                style={{
                  width: '100px',
                  height: '150px',
                  backgroundColor: '#0A0A0A',
                  color: '#F2F0ED',
                  border: `0.5px solid rgba(242,240,237,0.3)`,
                  borderRadius: '1px',
                  boxShadow: '1px 1px 0px rgba(242,240,237,0.1)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                <div className="text-center w-full">
                  <h3 
                    className="text-[9px] tracking-[0.2em] mb-2 uppercase leading-tight px-1"
                    style={{ 
                      fontFamily: 'var(--font-sans)',
                      wordWrap: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    {product.name}
                  </h3>
                </div>
                
                <div className="text-center pt-2" style={{ borderTop: '0.5px solid currentColor', opacity: 0.1 }}>
                  <p className="text-[7px] opacity-30 tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>
                    SWY
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Story text below bottle - white ink with glow */}
          <motion.div
            className="text-left mt-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p
              className="text-base leading-relaxed mb-4"
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,  // ✅ Changed from 300 to 400 (Avenir Regular)
                fontStyle: 'normal',  // ✅ Changed from 'italic' to 'normal'
                letterSpacing: '0.05em',
                color: '#F2F0ED',
                textShadow: '0 0 3px rgba(242,240,237,0.4)',
              }}
            >
              {storyBody}
            </p>
            <div className="w-16 h-[0.5px] bg-white/20 mb-3" />
            <p
              className="text-[9px] opacity-30 tracking-[0.4em] uppercase"
              style={{ fontFamily: 'var(--font-sans)', color: '#F2F0ED' }}
            >
              {product.name}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}