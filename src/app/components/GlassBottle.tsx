/**
 * 🍾 Glass Bottle Component
 * 海洋模式下的玻璃瓶身效果
 * 包含折射、透明度和水下光暈
 */

import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassBottleProps {
  children: ReactNode;
  /** Enable glass refraction effect */
  enableRefraction?: boolean;
  /** Glass transparency level */
  transparency?: 'subtle' | 'medium' | 'strong';
  /** Enable underwater glow */
  enableGlow?: boolean;
}

export function GlassBottle({
  children,
  enableRefraction = true,
  transparency = 'medium',
  enableGlow = true,
}: GlassBottleProps) {
  
  const transparencyMap = {
    subtle: 0.85,
    medium: 0.7,
    strong: 0.5,
  };

  return (
    <div className="relative">
      {/* Glass bottle container with refraction */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Main content */}
        <div
          style={{
            opacity: transparencyMap[transparency],
          }}
        >
          {children}
        </div>

        {/* Glass refraction overlay */}
        {enableRefraction && (
          <>
            {/* Rainbow spectrum edge (top-left) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(150, 100, 255, 0.15) 0%,
                    rgba(100, 150, 255, 0.12) 5%,
                    transparent 15%
                  )
                `,
                mixBlendMode: 'screen',
              }}
            />

            {/* Cyan/teal refraction (right edge) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{
                background: `
                  linear-gradient(225deg,
                    rgba(100, 220, 255, 0.18) 0%,
                    rgba(120, 200, 240, 0.10) 8%,
                    transparent 18%
                  )
                `,
                mixBlendMode: 'screen',
              }}
            />

            {/* Glass surface highlight (wet glass look) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{
                background: `
                  linear-gradient(180deg,
                    rgba(255, 255, 255, 0.12) 0%,
                    transparent 20%,
                    transparent 80%,
                    rgba(255, 255, 255, 0.08) 100%
                  )
                `,
                mixBlendMode: 'overlay',
              }}
            />
          </>
        )}

        {/* Underwater glow effect */}
        {enableGlow && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-sm"
            style={{
              boxShadow: `
                0 0 30px rgba(120, 220, 255, 0.3),
                0 0 60px rgba(100, 200, 240, 0.15),
                inset 0 0 40px rgba(150, 230, 255, 0.1)
              `,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Caustic light patterns (like underwater light) */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-sm overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 40% 50% at 30% 20%, rgba(150, 230, 255, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 35% 45% at 70% 60%, rgba(120, 210, 240, 0.06) 0%, transparent 50%)
            `,
            mixBlendMode: 'screen',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
}
