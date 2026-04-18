/**
 * Lead texture image (metafield `texture_images` first): shared figure + desktop gallery strip.
 * Mobile: render `PdpTextureFigure` below narrative (`md:hidden`); desktop: `PdpTextureGallerySection` (`hidden md:block`).
 */

type TextureFigureProps = {
  url: string;
  alt: string;
  /** Tailwind classes for the <img> (size / max-height). */
  imgClassName?: string;
};

export function PdpTextureFigure({ url, alt, imgClassName }: TextureFigureProps) {
  return (
    <figure className="m-0 w-full">
      <div className="overflow-hidden border border-white/[0.14] bg-black/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <img
          src={url}
          alt={alt}
          className={
            imgClassName?.trim()
              ? imgClassName.trim()
              : "block w-full max-h-[min(78vh,44rem)] object-contain object-center sm:max-h-[min(82vh,48rem)]"
          }
          loading="lazy"
          decoding="async"
        />
      </div>
    </figure>
  );
}

type PdpTextureGallerySectionProps = {
  url: string;
  alt: string;
};

/** Desktop only: full-width gallery moment between Narrative and In the air. */
export function PdpTextureGallerySection({ url, alt }: PdpTextureGallerySectionProps) {
  return (
    <section
      className="hidden border-t border-white/10 bg-[#0A0A0A] px-4 py-16 sm:px-6 sm:py-20 md:block md:px-10 md:py-24 lg:px-14 lg:py-28"
      aria-label={alt}
    >
      <div className="mx-auto w-full max-w-6xl">
        <PdpTextureFigure
          url={url}
          alt={alt}
          imgClassName="block w-full max-h-[min(78vh,44rem)] object-contain object-center sm:max-h-[min(82vh,48rem)]"
        />
      </div>
    </section>
  );
}
