import { useRef, useLayoutEffect } from "react";
import { useScroll, useSpring, useTransform, useMotionValue } from "motion/react";

const HANDOFF = 0.11;
const SPOT_END = 0.55;
const DOCK_START = 0.58;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export type TextureScrollSceneRefs = {
  trackRef: React.RefObject<HTMLElement | null>;
  originRef: React.RefObject<HTMLElement | null>;
  dockRef: React.RefObject<HTMLElement | null>;
};

export type UseTextureScrollSceneOptions = TextureScrollSceneRefs & {
  /** When false, progress stays 0 and motion values are inert (static narrative path). */
  enabled: boolean;
};

/**
 * Scroll-linked motion for PDP texture: narrative → viewport spotlight → dock in “In the air”.
 * Uses MotionValues only (no React setState on scroll). Track element should sit between hero and impression sections.
 *
 * Scroll range: `useScroll` on `trackRef` with offset `["start end", "end start"]` — progress 0→1 while the
 * track scrolls through the viewport (parent should give the track ~100–120vh height for a calm ramp).
 */
export function useTextureScrollScene({
  enabled,
  trackRef,
  originRef,
  dockRef,
}: UseTextureScrollSceneOptions) {
  const frozenOriginRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const aspectRef = useRef(0.75);

  const mvOne = useMotionValue(1);
  const mvZero = useMotionValue(0);
  const mvW = useMotionValue(320);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  const gatedProgress = useTransform(scrollYProgress, (v) => (enabled ? v : 0));

  const smoothProgress = useSpring(gatedProgress, {
    stiffness: 52,
    damping: 26,
    mass: 0.85,
    restDelta: 0.0008,
  });

  useLayoutEffect(() => {
    frozenOriginRef.current = null;
  }, [enabled]);

  const ensureFrozenOrigin = () => {
    if (frozenOriginRef.current) return;
    const el = originRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    frozenOriginRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    if (r.width > 0) aspectRef.current = r.height / r.width;
  };

  const narrativeOpacity = useTransform(smoothProgress, (p) => {
    if (!enabled) return 1;
    if (p < HANDOFF) return 1;
    if (p < HANDOFF + 0.05) return 1 - (p - HANDOFF) / 0.05;
    return 0;
  });

  const flyingOpacity = useTransform(smoothProgress, (p) => {
    if (!enabled) return 0;
    if (p < HANDOFF - 0.02) return 0;
    if (p < HANDOFF + 0.04) return clamp01((p - (HANDOFF - 0.02)) / 0.06);
    if (p > 0.93) return clamp01(1 - (p - 0.93) / 0.07);
    return 1;
  });

  const dockOpacity = useTransform(smoothProgress, (p) => {
    if (!enabled) return 0;
    if (p < 0.86) return 0;
    if (p < 0.96) return clamp01((p - 0.86) / 0.1);
    return 1;
  });

  const backdropOpacity = useTransform(smoothProgress, (p) => {
    if (!enabled) return 0;
    if (p < 0.14) return 0;
    if (p < 0.28) return clamp01((p - 0.14) / 0.14) * 0.48;
    if (p > 0.82) return clamp01(0.48 * (1 - (p - 0.82) / 0.14));
    return 0.48;
  });

  const flyingWidth = useTransform(smoothProgress, (p) => {
    if (!enabled) return 320;
    const vw = typeof window !== "undefined" ? window.innerWidth : 400;
    const vh = typeof window !== "undefined" ? window.innerHeight : 700;
    const spotW = Math.min(vw * 0.86, vh * 0.78);

    const liveOrigin = originRef.current?.getBoundingClientRect();
    if (p >= HANDOFF - 0.01) ensureFrozenOrigin();
    const fo = frozenOriginRef.current;
    const w0 = fo?.width ?? liveOrigin?.width ?? 320;

    const dock = dockRef.current?.getBoundingClientRect();
    const wDock = dock && dock.width > 8 ? dock.width : w0;

    if (p < HANDOFF + 0.01) return w0;

    if (p < 0.4) {
      const t = clamp01((p - HANDOFF) / 0.29);
      return w0 + (spotW - w0) * easeOutCubic(t);
    }
    if (p < DOCK_START) return spotW;
    const t2 = clamp01((p - DOCK_START) / 0.34);
    return spotW + (wDock - spotW) * easeOutCubic(t2);
  });

  const flyingLeft = useTransform([smoothProgress, flyingWidth], (p, fw) => {
    if (!enabled) return 0;
    const vw = typeof window !== "undefined" ? window.innerWidth : 400;
    const vh = typeof window !== "undefined" ? window.innerHeight : 700;
    const cX = vw * 0.5;
    const cY = vh * 0.42;
    const spotW = Math.min(vw * 0.86, vh * 0.78);

    const liveOrigin = originRef.current?.getBoundingClientRect();
    if ((p as number) >= HANDOFF - 0.01) ensureFrozenOrigin();
    const fo = frozenOriginRef.current;
    const oLeft = fo?.left ?? liveOrigin?.left ?? 24;
    const oW = fo?.width ?? liveOrigin?.width ?? 320;
    const oCx = oLeft + oW / 2;

    const dock = dockRef.current?.getBoundingClientRect();
    const dW = dock && dock.width > 8 ? dock.width : oW;
    const dCx = dock && dock.width > 8 ? dock.left + dW / 2 : oCx;

    const pp = p as number;
    let cx: number;
    if (pp < HANDOFF + 0.01) cx = oCx;
    else if (pp < SPOT_END) {
      const t = clamp01((pp - HANDOFF) / (SPOT_END - HANDOFF));
      cx = oCx + (cX - oCx) * easeOutCubic(t);
    } else if (pp < DOCK_START) cx = cX;
    else {
      const t = clamp01((pp - DOCK_START) / (0.92 - DOCK_START));
      cx = cX + (dCx - cX) * easeOutCubic(t);
    }

    const w = fw as number;
    return cx - w / 2;
  });

  const flyingTop = useTransform([smoothProgress, flyingWidth], (p, fw) => {
    if (!enabled) return 0;
    const vh = typeof window !== "undefined" ? window.innerHeight : 700;
    const cY = vh * 0.42;

    const liveOrigin = originRef.current?.getBoundingClientRect();
    if ((p as number) >= HANDOFF - 0.01) ensureFrozenOrigin();
    const fo = frozenOriginRef.current;
    const oTop = fo?.top ?? liveOrigin?.top ?? 120;
    const oLeft = fo?.left ?? liveOrigin?.left ?? 24;
    const oW = fo?.width ?? liveOrigin?.width ?? 320;
    const oH = fo?.height ?? liveOrigin?.height ?? oW * aspectRef.current;
    const oCx = oLeft + oW / 2;
    const oCy = oTop + oH / 2;

    const dock = dockRef.current?.getBoundingClientRect();
    const dW = dock && dock.width > 8 ? dock.width : oW;
    const dH = dock && dock.height > 8 ? dock.height : oH;
    const dCx = dock && dock.width > 8 ? dock.left + dW / 2 : oCx;
    const dCy = dock && dock.height > 8 ? dock.top + dH / 2 : oCy;

    const pp = p as number;
    let cy: number;
    if (pp < HANDOFF + 0.01) cy = oCy;
    else if (pp < SPOT_END) {
      const t = clamp01((pp - HANDOFF) / (SPOT_END - HANDOFF));
      cy = oCy + (cY - oCy) * easeOutCubic(t);
    } else if (pp < DOCK_START) cy = cY;
    else {
      const t = clamp01((pp - DOCK_START) / (0.92 - DOCK_START));
      cy = cY + (dCy - cY) * easeOutCubic(t);
    }

    const w = fw as number;
    const aspect = aspectRef.current;
    const h = w * aspect;

    return cy - h / 2;
  });

  return {
    smoothProgress,
    narrativeOpacity: enabled ? narrativeOpacity : mvOne,
    flyingOpacity: enabled ? flyingOpacity : mvZero,
    dockOpacity: enabled ? dockOpacity : mvZero,
    backdropOpacity: enabled ? backdropOpacity : mvZero,
    flyingWidth: enabled ? flyingWidth : mvW,
    flyingLeft: enabled ? flyingLeft : mvZero,
    flyingTop: enabled ? flyingTop : mvZero,
  };
}
