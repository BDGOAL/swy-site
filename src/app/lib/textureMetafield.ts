/**
 * PDP texture images from Shopify product metafields (list/single file_reference, or raw URL strings).
 * URL priority per node matches product requirements:
 * MediaImage: image → previewImage
 * GenericFile: previewImage → url (direct image URLs still work in <img>)
 * Video: previewImage
 */

export type TextureImage = { url: string; altText?: string | null };

export type RawTextureMetafield = {
  namespace?: string | null;
  key?: string | null;
  type?: string | null;
  value?: string | null;
  reference?: unknown;
  references?: { nodes?: unknown[] } | null;
} | null;

/** Parse metafield `value` when references are empty (e.g. multi-line list of CDN URLs). */
export function parseTextureUrlsFromMetafieldValue(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  const t = value.trim();
  if (t.startsWith("[")) {
    try {
      const parsed = JSON.parse(t) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((x): x is string => typeof x === "string" && /^https?:\/\//i.test(x.trim()))
          .map((x) => x.trim());
      }
    } catch {
      // fall through
    }
  }
  if (/^https?:\/\//i.test(t)) return [t];
  return t
    .split(/[\n,，、]+/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}

function firstNonEmptyUrl(...candidates: (string | undefined | null)[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return undefined;
}

/**
 * Extract a usable image URL from a Storefront `references` / `reference` node.
 * Uses __typename when present; otherwise tries fields in safe priority order.
 */
export function extractTextureUrlFromReferenceNode(node: unknown): TextureImage | null {
  if (!node || typeof node !== "object") return null;
  const o = node as Record<string, unknown>;
  const tn = o.__typename as string | undefined;

  const image = o.image as { url?: string; altText?: string | null } | undefined;
  const previewImage = o.previewImage as { url?: string; altText?: string | null } | undefined;
  const directUrl = o.url;

  if (tn === "MediaImage") {
    const url = firstNonEmptyUrl(image?.url, previewImage?.url);
    if (!url) return null;
    const alt = image?.altText ?? previewImage?.altText;
    return { url, altText: alt };
  }

  if (tn === "GenericFile") {
    const url = firstNonEmptyUrl(previewImage?.url, typeof directUrl === "string" ? directUrl : null);
    if (!url) return null;
    return { url, altText: undefined };
  }

  if (tn === "Video") {
    const url = firstNonEmptyUrl(previewImage?.url);
    if (!url) return null;
    return { url, altText: previewImage?.altText };
  }

  // Unknown typename: still try ordered fields (no over-filtering)
  const fallback = firstNonEmptyUrl(
    image?.url,
    previewImage?.url,
    typeof directUrl === "string" ? directUrl : null
  );
  if (!fallback) return null;
  const alt = image?.altText ?? previewImage?.altText;
  return { url: fallback, altText: alt };
}

function dedupeByUrl(images: TextureImage[]): TextureImage[] {
  const seen = new Set<string>();
  const out: TextureImage[] = [];
  for (const img of images) {
    if (!img.url || seen.has(img.url)) continue;
    seen.add(img.url);
    out.push(img);
  }
  return out;
}

/**
 * Build texture image list from `product.metafields(identifiers: [...])` response.
 * Preserves identifier order: texture_images list → texture-images → texture_image single.
 */
export function textureImagesFromRawMetafields(metafields: RawTextureMetafield[] | null | undefined): TextureImage[] {
  /** Shopify returns `null` slots for unknown identifiers — skip those. */
  const list = (metafields ?? []).filter((m): m is NonNullable<typeof m> => m != null);
  const out: TextureImage[] = [];

  for (const m of list) {
    const nodes = m.references?.nodes ?? [];
    if (nodes.length > 0) {
      for (const n of nodes) {
        const img = extractTextureUrlFromReferenceNode(n);
        if (img) out.push(img);
      }
      continue;
    }

    if (m.reference) {
      const img = extractTextureUrlFromReferenceNode(m.reference);
      if (img) out.push(img);
      continue;
    }

    const fromValue = parseTextureUrlsFromMetafieldValue(m.value ?? undefined);
    for (const url of fromValue) {
      out.push({ url, altText: null });
    }
  }

  return dedupeByUrl(out);
}

/** Legacy path: older query shape with separate list + single metafields. */
export function textureImagesFromLegacyGraphqlFields(raw: {
  textureImages?: { references?: { nodes?: unknown[] } };
  textureImageSingle?: { reference?: unknown };
}): TextureImage[] {
  const nodes = raw.textureImages?.references?.nodes ?? [];
  const out: TextureImage[] = [];
  for (const n of nodes) {
    const img = extractTextureUrlFromReferenceNode(n);
    if (img) out.push(img);
  }
  if (out.length === 0 && raw.textureImageSingle?.reference) {
    const img = extractTextureUrlFromReferenceNode(raw.textureImageSingle.reference);
    if (img) out.push(img);
  }
  return dedupeByUrl(out);
}
