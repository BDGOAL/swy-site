/**
 * Static full-width “gallery moment” for the lead texture image (metafield `texture_images` first).
 * No motion, no labels — editorial framing only.
 */
type PdpTextureGallerySectionProps = {
  url: string;
  alt: string;
};

export function PdpTextureGallerySection({ url, alt }: PdpTextureGallerySectionProps) {
  return (
    <section
      className="border-t border-white/10 bg-[#0A0A0A] px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-14 lg:py-28"
      aria-label={alt}
    >
      <div className="mx-auto w-full max-w-6xl">
        <figure className="m-0">
          <div className="overflow-hidden border border-white/[0.14] bg-black/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <img
              src={url}
              alt={alt}
              className="block w-full max-h-[min(78vh,44rem)] object-contain object-center sm:max-h-[min(82vh,48rem)]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
