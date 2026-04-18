import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface WaterRippleProps {
  /** Enable ripple on click */
  enableClick?: boolean;
  /** Enable ripple on mouse move (throttled) */
  enableMove?: boolean;
  /** Ripple color */
  color?: string;
  /** Ripple intensity */
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function WaterRipple({ 
  enableClick = true, 
  enableMove = false,
  color = 'rgba(100, 200, 255, 0.5)',
  intensity = 'medium'
}: WaterRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [lastMoveTime, setLastMoveTime] = useState(0);

  const createRipple = useCallback((x: number, y: number) => {
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!enableClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createRipple(x, y);
  }, [enableClick, createRipple]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableMove) return;
    
    const now = Date.now();
    // Throttle to every 200ms to avoid too many ripples
    if (now - lastMoveTime < 200) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createRipple(x, y);
    setLastMoveTime(now);
  }, [enableMove, lastMoveTime, createRipple]);

  // Ripple size based on intensity
  const rippleScale = {
    subtle: 1.5,
    medium: 2.5,
    strong: 4,
  }[intensity];

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={{ 
        cursor: enableClick ? 'pointer' : 'default',
        zIndex: 100,
      }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          >
            {/* Main ripple ring - 更虛化 */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 150,
                height: 150,
                marginLeft: -75,
                marginTop: -75,
                border: `1.5px solid ${color}`,
                boxShadow: `
                  0 0 30px ${color},
                  inset 0 0 30px ${color}
                `,
                filter: 'blur(2px)',
              }}
              initial={{ 
                scale: 0, 
                opacity: 0.8,
              }}
              animate={{ 
                scale: rippleScale,
                opacity: 0,
              }}
              exit={{ 
                opacity: 0,
              }}
              transition={{ 
                duration: 2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
            
            {/* Secondary ripple (delayed) - 更虛化 */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 150,
                height: 150,
                marginLeft: -75,
                marginTop: -75,
                border: `1px solid ${color.replace('0.5', '0.2')}`,
                filter: 'blur(3px)',
              }}
              initial={{ 
                scale: 0, 
                opacity: 0.4,
              }}
              animate={{ 
                scale: rippleScale * 0.8,
                opacity: 0,
              }}
              exit={{ 
                opacity: 0,
              }}
              transition={{ 
                duration: 2,
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />

            {/* Water splash effect (center) - 更虛化 */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 30,
                height: 30,
                marginLeft: -15,
                marginTop: -15,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
              initial={{ 
                scale: 1,
                opacity: 0.5,
              }}
              animate={{ 
                scale: 0,
                opacity: 0,
              }}
              exit={{ 
                opacity: 0,
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Continuous ambient water ripples (subtle background effect) - 更虛化 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: 250,
              height: 250,
              marginLeft: -125,
              marginTop: -125,
              border: `1px solid ${color.replace('0.5', '0.15')}`,
              boxShadow: `0 0 40px ${color.replace('0.5', '0.1')}`,
              filter: 'blur(4px)',
            }}
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 2.5,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}