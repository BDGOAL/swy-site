import type { RefObject } from "react";
import { useScroll, useSpring, useTransform } from "motion/react";

export type UsePdpTextureStickyZoomOptions = {
  containerRef: RefObject<HTMLElement | null>;
  /** When false, scroll progress is ignored and transforms stay at rest (scale 1, y 0, opacity 1). */
  enabled: boolean;
};

/**
 * Scroll-linked transforms for a sticky PDP texture block.
 * Progress 0→1 as the container travels through the viewport (`start/end` window).
 * Late ramp: flat hold → subtle zoom peak → gentle release (no opacity wipe, no handoff).
 */
export function usePdpTextureStickyZoom({ containerRef, enabled }: UsePdpTextureStickyZoomOptions) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const gated = useTransform(scrollYProgress, (p) => (enabled ? p : 0));

  const smooth = useSpring(gated, {
    stiffness: 56,
    damping: 28,
    mass: 0.9,
    restDelta: 0.001,
  });

  const scale = useTransform(smooth, [0, 0.28, 0.5, 0.76, 1], [1, 1, 1.09, 1.05, 1]);
  const y = useTransform(smooth, [0, 0.28, 0.5, 0.76, 1], [0, 0, -6, -3, 0]);

  return { scale, y };
}
