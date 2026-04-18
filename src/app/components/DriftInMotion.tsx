/**
 * 🍾 Drift In Motion Component
 * 漂流瓶「漂進來」動畫效果
 * 
 * 模擬漂流瓶在水中的動態：
 * - 緩慢漂移 (Slow Drift)
 * - 水波搖晃 (Wave Sway)
 * - 輕微旋轉 (Gentle Rotation)
 * - 透明度漸變 (Fade In)
 * - 深度感 (Parallax Depth)
 */

import { motion } from "motion/react";
import { ReactNode } from "react";

interface DriftInMotionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  intensity?: 'subtle' | 'medium' | 'strong';
  duration?: number;
  className?: string;
}

export function DriftInMotion({
  children,
  delay = 0,
  direction = 'bottom',
  intensity = 'medium',
  duration = 2,
  className = '',
}: DriftInMotionProps) {
  
  // Intensity settings for drift distance
  const intensityMap = {
    subtle: 30,
    medium: 60,
    strong: 100,
  };
  const driftDistance = intensityMap[intensity];

  // Direction-based initial positions
  const directionMap = {
    left: { x: -driftDistance, y: 0 },
    right: { x: driftDistance, y: 0 },
    top: { x: 0, y: -driftDistance },
    bottom: { x: 0, y: driftDistance },
    center: { x: 0, y: 0 },
  };
  const initialPos = directionMap[direction];

  // Wave sway amplitude (horizontal oscillation)
  const swayAmplitude = intensity === 'subtle' ? 3 : intensity === 'medium' ? 6 : 10;

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: initialPos.x,
        y: initialPos.y,
        rotate: direction === 'left' ? -2 : direction === 'right' ? 2 : 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.22, 0.61, 0.36, 1], // Custom cubic-bezier for smooth drift
        opacity: {
          duration: duration * 0.6,
          delay: delay,
        },
      }}
    >
      {/* Water sway animation - continuous subtle oscillation */}
      <motion.div
        animate={{
          x: [0, swayAmplitude, 0, -swayAmplitude, 0],
          rotate: [0, 0.5, 0, -0.5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + duration,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * 🌊 Drift In Sequence - For staggered animations
 */
interface DriftInSequenceProps {
  children: ReactNode[];
  staggerDelay?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

export function DriftInSequence({
  children,
  staggerDelay = 0.15,
  direction = 'bottom',
  intensity = 'medium',
  className = '',
}: DriftInSequenceProps) {
  return (
    <>
      {children.map((child, index) => (
        <DriftInMotion
          key={index}
          delay={index * staggerDelay}
          direction={direction}
          intensity={intensity}
          className={className}
        >
          {child}
        </DriftInMotion>
      ))}
    </>
  );
}
