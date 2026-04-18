/**
 * 🌊 Dual-Theme Hero Background
 * 專為 Hero Section 設計的雙主題特效背景
 * Ocean Mode: 陽光海面特效
 * Noir Mode: 深藍黑色調（接近黑但透藍）
 */

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface OceanSurfaceHeroProps {
  /** Enable floating light spots */
  enableLightSpots?: boolean;
  /** Enable caustic patterns */
  enableCaustics?: boolean;
  /** Must match ThemeContext.mode (single source of truth at call sites). */
  mode?: 'ocean' | 'noir';
}

export function OceanSurfaceHero({
  enableLightSpots = true,
  enableCaustics = true,
  mode = 'ocean',
}: OceanSurfaceHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Color schemes for different modes
  const colors = mode === 'ocean' 
    ? {
        // Ocean Mode - 海洋色調
        gradient1: 'rgba(135, 206, 235, 0.35)',
        gradient2: 'rgba(100, 180, 220, 0.45)',
        gradient3: 'rgba(80, 160, 200, 0.55)',
        gradient4: 'rgba(70, 150, 190, 0.5)',
        gradient5: 'rgba(60, 140, 180, 0.4)',
        sunbeam1: 'rgba(255, 250, 200, 0.4)',
        sunbeam2: 'rgba(255, 240, 180, 0.25)',
        sunbeam3: 'rgba(255, 230, 160, 0.15)',
        sideSun1: 'rgba(255, 200, 120, 0.25)',
        sideSun2: 'rgba(255, 180, 100, 0.12)',
        causticColor: 'rgba(150, 220, 255, 0.15)',
        waveColor1: 'rgba(150, 220, 255, 0.3)',
        waveColor2: 'rgba(180, 230, 255, 0.4)',
        lightSpot1: 'rgba(255, 255, 255, 0.2)',
        lightSpot2: 'rgba(200, 230, 255, 0.1)',
        topHighlight1: 'rgba(255, 255, 255, 0.25)',
        topHighlight2: 'rgba(240, 250, 255, 0.15)',
        bottomDepth1: 'rgba(50, 120, 160, 0.15)',
        bottomDepth2: 'rgba(40, 100, 140, 0.25)',
        halo: 'rgba(180, 220, 255, 0.08)',
      }
    : {
        // Noir Mode - 深藍黑色調（接近黑但透藍）
        gradient1: 'rgba(8, 12, 18, 0.45)',
        gradient2: 'rgba(12, 16, 22, 0.55)',
        gradient3: 'rgba(15, 20, 28, 0.65)',
        gradient4: 'rgba(18, 24, 32, 0.6)',
        gradient5: 'rgba(10, 14, 20, 0.5)',
        sunbeam1: 'rgba(160, 180, 200, 0.25)',
        sunbeam2: 'rgba(140, 160, 180, 0.15)',
        sunbeam3: 'rgba(120, 140, 160, 0.1)',
        sideSun1: 'rgba(180, 190, 210, 0.18)',
        sideSun2: 'rgba(160, 170, 190, 0.08)',
        causticColor: 'rgba(120, 140, 160, 0.1)',
        waveColor1: 'rgba(100, 120, 140, 0.2)',
        waveColor2: 'rgba(120, 140, 160, 0.28)',
        lightSpot1: 'rgba(160, 180, 200, 0.12)',
        lightSpot2: 'rgba(120, 140, 160, 0.06)',
        topHighlight1: 'rgba(140, 160, 180, 0.15)',
        topHighlight2: 'rgba(120, 140, 160, 0.1)',
        bottomDepth1: 'rgba(5, 8, 12, 0.2)',
        bottomDepth2: 'rgba(3, 5, 8, 0.3)',
        halo: 'rgba(100, 120, 140, 0.05)',
      };

  // Animated caustic light patterns (water surface refraction)
  useEffect(() => {
    if (!enableCaustics) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Caustic animation parameters
    let time = 0;
    const causticGradientColors = mode === 'ocean'
      ? ['rgba(150, 220, 255, 0.15)', 'rgba(120, 200, 240, 0.08)', 'rgba(100, 180, 220, 0)']
      : ['rgba(120, 140, 160, 0.1)', 'rgba(80, 100, 120, 0.05)', 'rgba(60, 80, 100, 0)'];
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.005;
      
      // Draw multiple layers of caustic patterns
      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(time + i * 0.5) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.7 + i * 0.3) * 0.5 + 0.5) * canvas.height;
        const size = 100 + Math.sin(time + i) * 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, causticGradientColors[0]);
        gradient.addColorStop(0.5, causticGradientColors[1]);
        gradient.addColorStop(1, causticGradientColors[2]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [enableCaustics, mode]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      
      {/* Layer 1: 海天一色大漸層 - 更鮮明的顏色 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              ${colors.gradient1} 0%,
              ${colors.gradient2} 20%,
              ${colors.gradient3} 50%,
              ${colors.gradient4} 80%,
              ${colors.gradient5} 100%
            )
          `,
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 2: 強烈的陽光光束 - 從頂部射入 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 100% at 50% -30%,
              ${colors.sunbeam1} 0%,
              ${colors.sunbeam2} 20%,
              ${colors.sunbeam3} 40%,
              transparent 70%
            )
          `,
          mixBlendMode: 'screen',
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 3: 側邊陽光 - 模擬黃昏/日出 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 80% at 85% 50%,
              ${colors.sideSun1} 0%,
              ${colors.sideSun2} 30%,
              transparent 60%
            )
          `,
          mixBlendMode: 'overlay',
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 4: Canvas 焦散紋理 - 水面光線折射 */}
      {enableCaustics && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            mixBlendMode: 'screen',
            opacity: 0.6,
          }}
        />
      )}

      {/* Layer 5: SVG 大型波浪紋理 - 更虛化的波浪 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.15, filter: 'blur(3px)' }}
      >
        <defs>
          <linearGradient id="waveGradientHero" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.waveColor1} />
            <stop offset="50%" stopColor={colors.waveColor2} />
            <stop offset="100%" stopColor={colors.waveColor1} />
          </linearGradient>
        </defs>
        
        {/* 3 層大型波浪 */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M -400 ${300 + i * 150} Q -200 ${250 + i * 150} 0 ${300 + i * 150} T 400 ${300 + i * 150} T 800 ${300 + i * 150} T 1200 ${300 + i * 150} T 1600 ${300 + i * 150} T 2000 ${300 + i * 150} T 2400 ${300 + i * 150}`}
            stroke="url(#waveGradientHero)"
            strokeWidth="2"
            fill="none"
            opacity={0.25 - i * 0.05}
            animate={{
              d: [
                `M -400 ${300 + i * 150} Q -200 ${250 + i * 150} 0 ${300 + i * 150} T 400 ${300 + i * 150} T 800 ${300 + i * 150} T 1200 ${300 + i * 150} T 1600 ${300 + i * 150} T 2000 ${300 + i * 150} T 2400 ${300 + i * 150}`,
                `M -400 ${300 + i * 150} Q -200 ${350 + i * 150} 0 ${300 + i * 150} T 400 ${300 + i * 150} T 800 ${300 + i * 150} T 1200 ${300 + i * 150} T 1600 ${300 + i * 150} T 2000 ${300 + i * 150} T 2400 ${300 + i * 150}`,
                `M -400 ${300 + i * 150} Q -200 ${250 + i * 150} 0 ${300 + i * 150} T 400 ${300 + i * 150} T 800 ${300 + i * 150} T 1200 ${300 + i * 150} T 1600 ${300 + i * 150} T 2000 ${300 + i * 150} T 2400 ${300 + i * 150}`,
              ],
            }}
            transition={{
              duration: 5 - i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Layer 6: 漂浮光斑 - 更虛化的陽光碎片 */}
      {enableLightSpots && (
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 5;
            const randomDuration = 3 + Math.random() * 4;
            const randomSize = 20 + Math.random() * 60;

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                  width: randomSize,
                  height: randomSize,
                  background: `
                    radial-gradient(circle,
                      ${colors.lightSpot1} 0%,
                      ${colors.lightSpot2} 50%,
                      transparent 100%
                    )
                  `,
                  filter: 'blur(15px)',
                  mixBlendMode: 'screen',
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [0.8, 1.2, 0.8],
                  x: [0, Math.random() * 30 - 15, 0],
                  y: [0, Math.random() * 30 - 15, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  delay: randomDelay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Layer 7: 頂部高光 - 天空反射 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              ${colors.topHighlight1} 0%,
              ${colors.topHighlight2} 10%,
              transparent 30%
            )
          `,
        }}
      />

      {/* Layer 8: 底部深度 - 海水深淺變化 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              transparent 60%,
              ${colors.bottomDepth1} 80%,
              ${colors.bottomDepth2} 100%
            )
          `,
        }}
      />

      {/* Layer 9: 動態光暈 - 更虛化的整體氛圍 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 40%,
              ${colors.halo} 0%,
              transparent 60%
            )
          `,
          mixBlendMode: 'screen',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}