import { motion, useAnimationFrame } from "motion/react";
import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export function FilmGrainOverlay() {
  const [offset, setOffset] = useState(0);
  const frameRef = useRef(0);
  const { mode } = useTheme();

  // Create dynamic film grain effect - simulating 16mm film
  useAnimationFrame((t) => {
    frameRef.current = t;
    // Update every 3 frames for authentic film grain flicker
    if (frameRef.current % 50 < 1) {
      setOffset(Math.random() * 200);
    }
  });

  // Different color tints for Noir vs Ocean mode (opacity from theme.css tokens)
  const colorTint = mode === 'noir' 
    ? {
        background: `
          radial-gradient(ellipse 120% 100% at 50% 50%, 
            rgba(42, 38, 35, 0.15) 0%, 
            rgba(25, 28, 32, 0.12) 50%, 
            rgba(18, 15, 20, 0.18) 100%
          )
        `,
        opacityVar: 'var(--swy-overlay-tint-opacity-noir)',
      }
    : {
        background: `
          radial-gradient(ellipse 120% 100% at 50% 50%, 
            rgba(15, 28, 38, 0.12) 0%, 
            rgba(20, 35, 45, 0.10) 50%, 
            rgba(12, 22, 32, 0.15) 100%
          )
        `,
        opacityVar: 'var(--swy-overlay-tint-opacity-ocean)',
      };

  // Light leak colors - warm/cool for Noir, aqua/teal for Ocean
  const lightLeak = mode === 'noir'
    ? {
        background: `
          radial-gradient(ellipse 40% 80% at 95% 20%, rgba(180, 150, 120, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 50% 70% at 5% 80%, rgba(120, 140, 160, 0.25) 0%, transparent 50%)
        `,
      }
    : {
        background: `
          radial-gradient(ellipse 45% 75% at 92% 18%, rgba(120, 200, 220, 0.15) 0%, transparent 55%),
          radial-gradient(ellipse 40% 70% at 8% 82%, rgba(100, 180, 200, 0.12) 0%, transparent 50%)
        `,
      };

  return (
    <>
      {/* Nostalgic/Ocean color tint layer */}
      <div
        className="pointer-events-none fixed inset-0 z-[101]"
        style={{
          background: colorTint.background,
          mixBlendMode: 'multiply',
          opacity: colorTint.opacityVar,
        }}
      />

      {/* Aged paper texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperTexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04,0.05' numOctaves='5' seed='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperTexture)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
          mixBlendMode: 'overlay',
          opacity: 'var(--swy-overlay-paper-opacity)',
        }}
      />

      {/* Primary film grain - higher frequency, enhanced */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          opacity: 'var(--swy-overlay-grain-primary-opacity)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          backgroundPosition: `${offset}px ${offset}px`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Secondary grain layer - lower frequency for depth */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          opacity: 'var(--swy-overlay-grain-secondary-opacity)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
          backgroundPosition: `${-offset * 0.5}px ${-offset * 0.5}px`,
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Optical vignetting - Enhanced darkening at edges like vintage lens */}
      <div
        className="pointer-events-none fixed inset-0 z-[99]"
        style={{
          background: 'var(--swy-overlay-vignette-gradient)',
        }}
      />

      {/* Faded edges — full-viewport layer; gradient from theme.css --swy-overlay-edge-fade-gradient (top band softened vs. heavy header-shadow read) */}
      <div
        className="pointer-events-none fixed inset-0 z-[99]"
        style={{
          background: 'var(--swy-overlay-edge-fade-gradient)',
        }}
      />

      {/* Subtle vertical scratches - aged film effect */}
      <div
        className="pointer-events-none fixed inset-0 z-[98]"
        style={{
          opacity: 'var(--swy-overlay-scratch-opacity)',
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent ${Math.random() * 100 + 50}px,
            rgba(255, 255, 255, 0.5) ${Math.random() * 100 + 50}px,
            rgba(255, 255, 255, 0.5) ${Math.random() * 100 + 52}px
          )`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Light leak effect - Vintage camera light bleed */}
      <div
        className="pointer-events-none fixed inset-0 z-[97]"
        style={{
          opacity: 'var(--swy-overlay-light-leak-opacity)',
          background: lightLeak.background,
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}