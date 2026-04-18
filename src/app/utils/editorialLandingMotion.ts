import { useEffect, useState } from "react";
import type { Transition } from "motion/react";

/** Calm, premium — no bounce */
export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export function editorialTransition(duration: number, reduce: boolean): Transition {
  if (reduce) return { duration: 0 };
  return { duration, ease: EDITORIAL_EASE };
}

export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduce;
}

export function useEditorialIsMobile(breakpointPx = 768): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpointPx : true
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpointPx]);

  return mobile;
}
