/**
 * 🍾 Drift Bottle Background Component
 * 漂流瓶主題視覺特效系統
 * 
 * 包含 8 種海洋質感元素：
 * 1. 海洋色調漸層 (Ocean Gradient)
 * 2. 水波紋理動畫 (Water Ripples)
 * 3. 玻璃折射效果 (Glass Refraction)
 * 4. 鹽漬紋理 (Salt Crystallization)
 * 5. 漂浮粒子 (Floating Particles)
 * 6. 水漬暈染 (Water Stains)
 * 7. 深海暗角 (Deep Sea Vignette)
 * 8. 生物發光效果 (Bioluminescence)
 */

import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { WaterRipple } from "./WaterRipple";

// Custom hook for animation frame
function useAnimationFrame(callback: (time: number) => void) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        callback(time);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  });
}

interface DriftBottleBackgroundProps {
  intensity?: 'subtle' | 'medium' | 'strong';
  enableParticles?: boolean;
}

export function DriftBottleBackground({ 
  intensity = 'medium',
  enableParticles = false,
}: DriftBottleBackgroundProps) {
  const intensityMap = {
    subtle: 0.15,
    medium: 0.25,
    strong: 0.35,
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      
      {/* Layer 1: 海天一色漸層 - 淺藍綠色（Ocean Surface） */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(135, 206, 235, ${intensityMap[intensity] * 0.4}) 0%,
              rgba(100, 180, 220, ${intensityMap[intensity] * 0.5}) 30%,
              rgba(80, 160, 200, ${intensityMap[intensity] * 0.6}) 60%,
              rgba(70, 140, 180, ${intensityMap[intensity] * 0.5}) 100%
            )
          `,
        }}
      />

      {/* Layer 2: 陽光光束 - 從上方穿透海面 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 80% at 50% -20%,
              rgba(255, 250, 200, ${intensityMap[intensity] * 0.3}) 0%,
              rgba(255, 240, 180, ${intensityMap[intensity] * 0.15}) 30%,
              transparent 60%
            )
          `,
          mixBlendMode: 'screen',
        }}
      />

      {/* Layer 3: 海面波光粼粼 - SVG 動態波浪 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: intensityMap[intensity] * 1.2 }}
      >
        <defs>
          <linearGradient id="oceanSurfaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(150, 220, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(120, 200, 240, 0.3)" />
            <stop offset="100%" stopColor="rgba(100, 180, 220, 0.4)" />
          </linearGradient>
        </defs>
        
        {/* 海面波浪線條 - 更多層次 */}
        {[...Array(8)].map((_, i) => (
          <motion.path
            key={i}
            d={`M 0 ${200 + i * 80} Q 200 ${180 + i * 80} 400 ${200 + i * 80} T 800 ${200 + i * 80} T 1200 ${200 + i * 80} T 1600 ${200 + i * 80} T 2000 ${200 + i * 80}`}
            stroke="url(#oceanSurfaceGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity={0.3 - i * 0.03}
            animate={{
              d: [
                `M 0 ${200 + i * 80} Q 200 ${180 + i * 80} 400 ${200 + i * 80} T 800 ${200 + i * 80} T 1200 ${200 + i * 80} T 1600 ${200 + i * 80} T 2000 ${200 + i * 80}`,
                `M 0 ${200 + i * 80} Q 200 ${220 + i * 80} 400 ${200 + i * 80} T 800 ${200 + i * 80} T 1200 ${200 + i * 80} T 1600 ${200 + i * 80} T 2000 ${200 + i * 80}`,
                `M 0 ${200 + i * 80} Q 200 ${180 + i * 80} 400 ${200 + i * 80} T 800 ${200 + i * 80} T 1200 ${200 + i * 80} T 1600 ${200 + i * 80} T 2000 ${200 + i * 80}`,
              ],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Layer 4: 陽光折射 - 玻璃瓶的彩虹光譜 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 40%,
              rgba(255, 200, 150, ${intensityMap[intensity] * 0.15}) 0%,
              transparent 40%
            ),
            radial-gradient(circle at 70% 60%,
              rgba(150, 220, 255, ${intensityMap[intensity] * 0.12}) 0%,
              transparent 35%
            )
          `,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Layer 5: 海面亮邊 - 頂部更亮（天空反射） */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(255, 255, 255, ${intensityMap[intensity] * 0.2}) 0%,
              transparent 20%,
              transparent 80%,
              rgba(100, 150, 180, ${intensityMap[intensity] * 0.1}) 100%
            )
          `,
        }}
      />
    </div>
  );
}