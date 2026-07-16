/** Canonical storefront image shape (mapped from Shopify GraphQL). */
export type ProductImage = {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

/** Raw Storefront `Image` / MediaImage.image field. */
export type ShopifyImageLike = {
  url?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
} | null | undefined;

export function asProductImage(raw: ShopifyImageLike): ProductImage | null {
  const url = typeof raw?.url === "string" ? raw.url.trim() : "";
  if (!url) return null;
  return {
    url,
    alt: raw?.altText ?? null,
    width: typeof raw?.width === "number" ? raw.width : null,
    height: typeof raw?.height === "number" ? raw.height : null,
  };
}

export function asProductImages(
  list: ShopifyImageLike[] | null | undefined
): ProductImage[] {
  if (!list?.length) return [];
  const out: ProductImage[] = [];
  for (const raw of list) {
    const img = asProductImage(raw);
    if (img) out.push(img);
  }
  return out;
}

export function cardImageAlt(
  productName: string,
  shopifyAlt?: string | null
): string {
  const a = shopifyAlt?.trim();
  return a || `SWY ${productName} perfume`;
}

export function pdpImageAlt(
  productName: string,
  shopifyAlt?: string | null
): string {
  const a = shopifyAlt?.trim();
  return a || `SWY ${productName} 100ml perfume bottle`;
}

/**
 * Collection / related card image:
 * custom.story_image → featuredImage → null (dark wrapper only)
 */
export function resolveStoryCardImage(opts: {
  storyImage?: ProductImage | null;
  featuredImage?: ProductImage | null;
  productName: string;
}): ProductImage | null {
  const pick = opts.storyImage ?? opts.featuredImage ?? null;
  if (!pick) return null;
  return { ...pick, alt: cardImageAlt(opts.productName, pick.alt) };
}

/**
 * PDP primary image:
 * featuredImage → first gallery → null (dark stage only)
 */
export function resolveFeaturedImage(opts: {
  featuredImage?: ProductImage | null;
  galleryImages?: ProductImage[];
  productName: string;
}): ProductImage | null {
  const pick = opts.featuredImage ?? opts.galleryImages?.[0] ?? null;
  if (!pick) return null;
  return { ...pick, alt: pdpImageAlt(opts.productName, pick.alt) };
}

/**
 * PDP gallery in Shopify Admin order.
 * - Deduplicate by URL
 * - Prepend featuredImage only when it is not already present
 * - Empty array when Shopify has no usable images (no local/stock fallback)
 */
export function resolveGalleryImages(opts: {
  featuredImage?: ProductImage | null;
  images?: ProductImage[];
  productName: string;
}): ProductImage[] {
  const seen = new Set<string>();
  const out: ProductImage[] = [];

  const push = (img: ProductImage | null | undefined) => {
    if (!img?.url || seen.has(img.url)) return;
    seen.add(img.url);
    out.push({ ...img, alt: pdpImageAlt(opts.productName, img.alt) });
  };

  const shopifyList = opts.images ?? [];
  const featured = opts.featuredImage;

  if (
    featured?.url &&
    !shopifyList.some((img) => img.url === featured.url)
  ) {
    push(featured);
  }
  for (const img of shopifyList) {
    push(img);
  }

  return out;
}

/**
 * Hide a broken Shopify image without swapping src or loading a fallback.
 * visibility:hidden keeps wrapper aspect ratio; no retry / no loop.
 */
export function hideImageOnError(
  event: { currentTarget: HTMLImageElement }
): void {
  const image = event.currentTarget;
  if (image.dataset.imageFailed === "1") return;
  image.dataset.imageFailed = "1";
  image.style.visibility = "hidden";
}
