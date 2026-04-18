import { motion } from "motion/react";
import type { useTextureScrollScene } from "../hooks/useTextureScrollScene";

type TextureScene = ReturnType<typeof useTextureScrollScene>;

type PdpTextureScrollSceneProps = {
  url: string;
  alt: string;
  narrativeClassName?: string;
  originRef: React.RefObject<HTMLDivElement | null>;
  scene: TextureScene;
  enabled: boolean;
};

/**
 * Narrative-slot image + full-screen flying layer driven by `useTextureScrollScene`.
 * Parent owns scroll track + dock refs and inserts the dock `<img>` in the impression section.
 */
export function PdpTextureScrollScene({
  url,
  alt,
  narrativeClassName = "",
  originRef,
  scene,
  enabled,
}: PdpTextureScrollSceneProps) {
  if (!enabled) return null;

  return (
    <>
      <motion.div
        ref={originRef}
        style={{ opacity: scene.narrativeOpacity }}
        className={`max-w-md ${narrativeClassName}`.trim()}
      >
        <div className="overflow-hidden border border-white/12 bg-black/25">
          <img
            src={url}
            alt={alt}
            className="max-h-[min(18rem,36vh)] w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none fixed inset-0 z-[35]"
        style={{ opacity: scene.backdropOpacity }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[#0A0A0A]/82" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed z-[40] will-change-[transform,width,opacity]"
        style={{
          left: scene.flyingLeft,
          top: scene.flyingTop,
          width: scene.flyingWidth,
          opacity: scene.flyingOpacity,
        }}
      >
        <div
          className="overflow-hidden border border-white/16 bg-black/35 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          style={{ aspectRatio: "3 / 4" }}
        >
          <img
            src={url}
            alt={alt}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
      </motion.div>
    </>
  );
}
