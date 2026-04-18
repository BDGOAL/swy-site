import { useRef } from "react";
import { motion } from "motion/react";
import { usePdpTextureStickyZoom } from "../hooks/usePdpTextureStickyZoom";
import { usePrefersReducedMotion } from "../utils/editorialLandingMotion";

type PdpTextureStickyZoomProps = {
  url: string;
  alt: string;
  /** Tailwind spacing above block (e.g. narrative rhythm). */
  className?: string;
};

/**
 * Single in-flow texture image in a contained sticky “scene”: subtle scale / translate only.
 * No fixed overlay, no duplicate images, no spacer track outside this section.
 */
export function PdpTextureStickyZoom({ url, alt, className = "" }: PdpTextureStickyZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scale, y } = usePdpTextureStickyZoom({
    containerRef,
    enabled: !reduceMotion,
  });

  return (
    <section
      className={`border-t border-white/10 px-6 sm:px-10 md:px-14 lg:px-20 ${className}`.trim()}
      aria-label={alt}
    >
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-6xl min-h-[min(52vh,32rem)] md:min-h-[min(64vh,38rem)]"
      >
        <div className="sticky top-[max(4.5rem,10svh)] z-10 flex justify-center py-8 md:py-10">
          <motion.div
            className="w-full max-w-md origin-center will-change-transform"
            style={{ scale, y }}
          >
            <div className="overflow-hidden border border-white/12 bg-black/25">
              <img
                src={url}
                alt={alt}
                className="max-h-[min(18rem,36vh)] w-full object-cover object-center md:max-h-[min(20rem,38vh)]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
