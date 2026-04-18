/**
 * Nostalgic Background Component
 * Adds subtle vintage texture and color tint for memory-like quality
 */

interface NostalgicBackgroundProps {
  variant?: 'default' | 'warm' | 'cool' | 'neutral';
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function NostalgicBackground({ 
  variant = 'default', 
  intensity = 'subtle' 
}: NostalgicBackgroundProps) {
  
  // Color tint variations for different moods
  const colorTints = {
    default: {
      gradient: `
        radial-gradient(ellipse 120% 100% at 50% 50%, 
          rgba(12, 16, 22, 0.15) 0%, 
          rgba(8, 12, 18, 0.12) 50%, 
          rgba(5, 8, 12, 0.18) 100%
        )
      `,
    },
    warm: {
      gradient: `
        radial-gradient(ellipse 120% 100% at 50% 50%, 
          rgba(18, 16, 20, 0.15) 0%, 
          rgba(12, 10, 14, 0.12) 50%, 
          rgba(8, 6, 10, 0.18) 100%
        )
      `,
    },
    cool: {
      gradient: `
        radial-gradient(ellipse 120% 100% at 50% 50%, 
          rgba(10, 14, 20, 0.15) 0%, 
          rgba(6, 10, 16, 0.12) 50%, 
          rgba(4, 6, 12, 0.18) 100%
        )
      `,
    },
    neutral: {
      gradient: `
        radial-gradient(ellipse 120% 100% at 50% 50%, 
          rgba(12, 12, 15, 0.15) 0%, 
          rgba(8, 8, 12, 0.12) 50%, 
          rgba(5, 5, 8, 0.18) 100%
        )
      `,
    },
  };

  // Intensity multipliers
  const opacityMultiplier = {
    subtle: 0.5,
    medium: 0.75,
    strong: 1.0,
  };

  const selectedTint = colorTints[variant];
  const opacity = opacityMultiplier[intensity];

  return (
    <>
      {/* Base nostalgic color tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: selectedTint.gradient,
          mixBlendMode: 'multiply',
          opacity: opacity * 0.6,
          zIndex: 1,
        }}
      />

      {/* Aged paper/film texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperTexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035,0.04' numOctaves='6' seed='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperTexture)' opacity='0.35'/%3E%3C/svg%3E")`,
          backgroundSize: '450px 450px',
          mixBlendMode: 'overlay',
          opacity: opacity * 0.06,
          zIndex: 1,
        }}
      />

      {/* Additional subtle grain for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainTexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainTexture)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          mixBlendMode: 'soft-light',
          opacity: opacity * 0.04,
          zIndex: 1,
        }}
      />

      {/* Faded edges - memory vignette with softer blur */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 85% 75% at 50% 45%, 
              transparent 35%, 
              rgba(0,0,0,0.12) 70%, 
              rgba(0,0,0,0.25) 95%,
              rgba(0,0,0,0.35) 100%
            )
          `,
          opacity: opacity * 0.7,
          filter: 'blur(40px)',  // ✅ 增加模糊度讓圓圈更虛
          zIndex: 1,
        }}
      />

      {/* Subtle light leak - vintage photo feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: variant === 'warm'
            ? `radial-gradient(ellipse 45% 75% at 92% 18%, rgba(200, 160, 120, 0.08) 0%, transparent 55%)`
            : variant === 'cool'
            ? `radial-gradient(ellipse 45% 75% at 8% 82%, rgba(120, 150, 180, 0.08) 0%, transparent 55%)`
            : `
                radial-gradient(ellipse 40% 70% at 95% 15%, rgba(180, 150, 120, 0.06) 0%, transparent 50%),
                radial-gradient(ellipse 45% 65% at 5% 85%, rgba(120, 140, 160, 0.05) 0%, transparent 50%)
              `,
          mixBlendMode: 'screen',
          opacity: opacity * 0.5,
          zIndex: 1,
        }}
      />
    </>
  );
}