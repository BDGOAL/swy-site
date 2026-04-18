import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ShoppingBag } from "lucide-react";
import { products } from "../data/products";
import { productImageFallbacks } from "../data/productImageFallbacks";
import { BOTTLE_IMAGE } from "../data/bottleImage";
import { useShopify } from "../context/ShopifyContext";
import { shopifyConfig } from "../config/shopify";
import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";
import {
  productDescriptor,
  productShortStory,
  productLongStory,
  productScentFamily,
  productMoodTags,
  productAccords,
  productImpression,
  productWearMoment,
  productIntensity,
  productLasting,
  productNotesTop,
  productNotesHeart,
  productNotesBase,
  productPriceDisplay,
  formatShopifyMoney,
} from "../lib/productLocale";
import type { Locale } from "../lib/i18n";
import { ROUTES } from "../constants/routes";
import { LocalizedLink } from "./LocalizedLink";

type ShopifyImage = { url: string; altText?: string | null };
type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};
type RelatedScent = {
  id: string;
  handle: string;
  title: string;
  image?: ShopifyImage | null;
  storyImage?: ShopifyImage | null;
  storyIntro?: string;
};
type ProductMetafields = {
  storyTitle?: string;
  storyIntro?: string;
  storyBody?: string;
  moodKeywords: string[];
  scentFamily?: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  wearWhen?: string;
  longevity?: string;
  sillage?: string;
  pairingNote?: string;
  storyImage?: ShopifyImage | null;
  textureImages: ShopifyImage[];
  relatedScents: RelatedScent[];
};
type ShopifyProductPayload = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: ShopifyImage | null;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  metafields: ProductMetafields;
};

function parseList(value?: string | null): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) {
        return arr.map((v) => String(v).trim()).filter(Boolean);
      }
    } catch {
      // fall through to comma split
    }
  }
  return trimmed
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseMoodKeywords(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function relatedLocalId(related: RelatedScent): string | null {
  if (related.handle.startsWith("product/")) {
    return related.handle.slice("product/".length) || null;
  }
  const match = products.find(
    (p) => p.id === related.handle || p.slug === related.handle || p.shopifyHandle === related.handle
  );
  return match?.id ?? null;
}

function splitBilingualNote(note: string): { primary: string; secondary?: string } {
  const raw = (note || "").trim();
  if (!raw) return { primary: "" };
  const divider = raw.match(/\s[/-]\s|\/|｜|\|/);
  if (!divider) return { primary: raw };
  const [first, ...rest] = raw.split(/\/|｜|\|/).map((s) => s.trim()).filter(Boolean);
  if (!first || !rest.length) return { primary: raw };
  return { primary: first, secondary: rest.join(" / ") };
}

function joinBilingualInline(note: string): string {
  const parsed = splitBilingualNote(note);
  if (!parsed.primary) return "";
  return parsed.secondary ? `${parsed.primary} ${parsed.secondary}` : parsed.primary;
}

function truncateText(value: string, maxChars: number): string {
  const text = value.trim();
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trim()}...`;
}

export function UnboxingExperience() {
  const { id } = useParams<{ id: string }>();
  const { t, locale, localizePath } = useLanguage();
  const { addToCart, isConfigured } = useShopify();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProductPayload | null>(null);
  const [isLoadingShopifyProduct, setIsLoadingShopifyProduct] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fallbackRelatedScents, setFallbackRelatedScents] = useState<RelatedScent[]>([]);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!product?.shopifyVariantId || !isConfigured) {
      setShopifyProduct(null);
      return;
    }

    let cancelled = false;
    const fetchShopifyProduct = async () => {
      setIsLoadingShopifyProduct(true);
      try {
        const query = `
          query ProductByVariantId($variantId: ID!) {
            node(id: $variantId) {
              ... on ProductVariant {
                id
                product {
                  id
                  handle
                  title
                  description
                  featuredImage {
                    url
                    altText
                  }
                  images(first: 12) {
                    nodes {
                      url
                      altText
                    }
                  }
                  variants(first: 50) {
                    nodes {
                      id
                      title
                      availableForSale
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                  storyTitle: metafield(namespace: "custom", key: "story_title") { value }
                  storyIntro: metafield(namespace: "custom", key: "story_intro") { value }
                  storyBody: metafield(namespace: "custom", key: "story_body") { value }
                  moodKeywords: metafield(namespace: "custom", key: "mood_keywords") { value }
                  scentFamily: metafield(namespace: "custom", key: "scent_family") { value }
                  topNotes: metafield(namespace: "custom", key: "top_notes") { value }
                  heartNotes: metafield(namespace: "custom", key: "heart_notes") { value }
                  baseNotes: metafield(namespace: "custom", key: "base_notes") { value }
                  wearWhen: metafield(namespace: "custom", key: "wear_when") { value }
                  longevity: metafield(namespace: "custom", key: "longevity") { value }
                  sillage: metafield(namespace: "custom", key: "sillage") { value }
                  pairingNote: metafield(namespace: "custom", key: "pairing_note") { value }
                  storyImage: metafield(namespace: "custom", key: "story_image") {
                    reference {
                      ... on MediaImage {
                        image { url altText }
                      }
                    }
                  }
                  textureImages: metafield(namespace: "custom", key: "texture_images") {
                    references(first: 8) {
                      nodes {
                        ... on MediaImage {
                          image { url altText }
                        }
                      }
                    }
                  }
                  relatedScents: metafield(namespace: "custom", key: "related_scents") {
                    references(first: 8) {
                      nodes {
                        ... on Product {
                          id
                          handle
                          title
                          featuredImage { url altText }
                          storyImage: metafield(namespace: "custom", key: "story_image") {
                            reference {
                              ... on MediaImage {
                                image { url altText }
                              }
                            }
                          }
                          storyIntro: metafield(namespace: "custom", key: "story_intro") { value }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(
          `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token":
                shopifyConfig.storefrontAccessToken,
            },
            body: JSON.stringify({
              query,
              variables: { variantId: product.shopifyVariantId },
            }),
          }
        );

        if (!response.ok) return;
        const data = await response.json();
        if (!data?.data?.node?.product) return;

        const raw = data.data.node.product;
        const textureNodes = raw.textureImages?.references?.nodes || [];
        const relatedNodes = raw.relatedScents?.references?.nodes || [];
        const payload: ShopifyProductPayload = {
          id: raw.id,
          handle: raw.handle,
          title: raw.title,
          description: raw.description || "",
          featuredImage: raw.featuredImage || null,
          images: raw.images?.nodes || [],
          variants: raw.variants?.nodes || [],
          metafields: {
            storyTitle: raw.storyTitle?.value || undefined,
            storyIntro: raw.storyIntro?.value || undefined,
            storyBody: raw.storyBody?.value || undefined,
            moodKeywords: parseMoodKeywords(raw.moodKeywords?.value),
            scentFamily: raw.scentFamily?.value || undefined,
            topNotes: parseList(raw.topNotes?.value),
            heartNotes: parseList(raw.heartNotes?.value),
            baseNotes: parseList(raw.baseNotes?.value),
            wearWhen: raw.wearWhen?.value || undefined,
            longevity: raw.longevity?.value || undefined,
            sillage: raw.sillage?.value || undefined,
            pairingNote: raw.pairingNote?.value || undefined,
            storyImage: raw.storyImage?.reference?.image || null,
            textureImages: textureNodes
              .map((n: any) => n?.image)
              .filter(Boolean),
            relatedScents: relatedNodes.map((n: any) => ({
              id: n.id,
              handle: n.handle,
              title: n.title,
              image: n.featuredImage,
              storyImage: n.storyImage?.reference?.image || null,
              storyIntro: n.storyIntro?.value || "",
            })),
          },
        };

        if (!cancelled) {
          setShopifyProduct(payload);
        }
      } catch {
        // keep fallback data path
      } finally {
        if (!cancelled) {
          setIsLoadingShopifyProduct(false);
        }
      }
    };

    fetchShopifyProduct();
    return () => {
      cancelled = true;
    };
  }, [isConfigured, product?.shopifyVariantId]);

  useEffect(() => {
    const defaultVariantId =
      shopifyProduct?.variants?.[0]?.id || product?.shopifyVariantId || "";
    setSelectedVariantId(defaultVariantId);
    setSelectedImageIndex(0);
  }, [shopifyProduct?.id, product?.id, product?.shopifyVariantId]);

  useEffect(() => {
    if (!isConfigured || !product?.id) {
      setFallbackRelatedScents([]);
      return;
    }

    // Keep existing recommendation logic (same products), but hydrate with real Shopify product assets.
    const fallbackCandidates = products
      .filter((p) => p.id !== product.id && !!p.shopifyVariantId)
      .slice(0, 3);
    const variantIds = fallbackCandidates
      .map((p) => p.shopifyVariantId)
      .filter(Boolean) as string[];

    if (!variantIds.length) {
      setFallbackRelatedScents([]);
      return;
    }

    let cancelled = false;
    const fetchFallbackRelatedScents = async () => {
      try {
        const query = `
          query RelatedByVariantIds($variantIds: [ID!]!) {
            nodes(ids: $variantIds) {
              ... on ProductVariant {
                product {
                  id
                  handle
                  title
                  featuredImage { url altText }
                  storyIntro: metafield(namespace: "custom", key: "story_intro") { value }
                  storyImage: metafield(namespace: "custom", key: "story_image") {
                    reference {
                      ... on MediaImage {
                        image { url altText }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(
          `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token":
                shopifyConfig.storefrontAccessToken,
            },
            body: JSON.stringify({
              query,
              variables: { variantIds },
            }),
          }
        );

        if (!response.ok) return;
        const data = await response.json();
        const nodes = data?.data?.nodes || [];
        const mapped: RelatedScent[] = nodes
          .map((node: any) => {
            const rp = node?.product;
            if (!rp?.id || !rp?.handle || !rp?.title) return null;
            return {
              id: rp.id,
              handle: rp.handle,
              title: rp.title,
              image: rp.featuredImage || null,
              storyImage: rp.storyImage?.reference?.image || null,
              storyIntro: rp.storyIntro?.value || "",
            } as RelatedScent;
          })
          .filter(Boolean);

        if (!cancelled) {
          setFallbackRelatedScents(mapped);
        }
      } catch {
        if (!cancelled) {
          setFallbackRelatedScents([]);
        }
      }
    };

    fetchFallbackRelatedScents();
    return () => {
      cancelled = true;
    };
  }, [isConfigured, product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-[11px] tracking-wider text-[#F2F0ED]" style={{ fontFamily: "var(--font-sans)" }}>
          {t(siteCopy.product.notFound)}
        </p>
      </div>
    );
  }

  const fallbackImage = productImageFallbacks[product.id] || "";
  const galleryUrls = [
    ...(product.featuredImage ? [product.featuredImage] : []),
    ...(product.gallery ?? []),
  ].filter(Boolean);
  const allImages = shopifyProduct?.images?.length
    ? shopifyProduct.images
    : galleryUrls.length
      ? galleryUrls.map((url) => ({ url, altText: product.name }))
      : fallbackImage
        ? [{ url: fallbackImage, altText: product.name }]
        : [];
  const selectedImage = allImages[selectedImageIndex] || allImages[0] || null;
  const variants = shopifyProduct?.variants?.length
    ? shopifyProduct.variants
    : product.shopifyVariantId
      ? [
          {
            id: product.shopifyVariantId,
            title: t(siteCopy.product.defaultVariant),
            availableForSale: true,
            price: {
              amount:
                product.price != null && !Number.isNaN(Number(product.price))
                  ? String(product.price)
                  : "0",
              currencyCode: product.currency ?? "",
            },
          },
        ]
      : [];
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0] || null;

  const meta = shopifyProduct?.metafields;
  const displayName = product.name;
  const heroDescriptor = meta?.storyIntro || productDescriptor(product, locale);
  const shortStory = productShortStory(product, locale);
  const narrativeBody = meta?.storyBody || productLongStory(product, locale) || "";
  const descriptionBlurb =
    shopifyProduct?.description && locale === "en" && !shortStory.trim()
      ? shopifyProduct.description
      : "";

  const topNotes = meta?.topNotes?.length ? meta.topNotes : productNotesTop(product, locale);
  const heartNotes = meta?.heartNotes?.length ? meta.heartNotes : productNotesHeart(product, locale);
  const baseNotes = meta?.baseNotes?.length ? meta.baseNotes : productNotesBase(product, locale);
  const hasNotes = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;

  const localAccords = productAccords(product, locale);
  const scentFamilyLabel = meta?.scentFamily || productScentFamily(product, locale);
  const moodTagsDisplay =
    meta?.moodKeywords?.length ? meta.moodKeywords : productMoodTags(product, locale);
  const impressionText = productImpression(product, locale);
  const wearMomentText = meta?.wearWhen || productWearMoment(product, locale);
  const localIntensity = productIntensity(product, locale);
  const localLasting = productLasting(product, locale);

  const hasImpressionLayer = Boolean(
    impressionText ||
      wearMomentText ||
      moodTagsDisplay.length ||
      localIntensity ||
      localLasting ||
      meta?.longevity ||
      meta?.sillage
  );

  const hasAccordsNotesLayer = Boolean(
    localAccords.length || hasNotes || scentFamilyLabel || meta?.pairingNote
  );

  const relatedFromSlugs: RelatedScent[] = (product.relatedSlugs ?? [])
    .map((slug) => products.find((p) => p.slug === slug || p.id === slug))
    .filter((p): p is (typeof products)[number] => Boolean(p))
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      id: p.id,
      handle: `product/${p.id}`,
      title: p.name,
      storyIntro: productDescriptor(p, locale),
      image: null,
      storyImage: null,
    }));

  const relatedScents = meta?.relatedScents?.length
    ? meta.relatedScents
    : fallbackRelatedScents.length
      ? fallbackRelatedScents
      : relatedFromSlugs.length
        ? relatedFromSlugs
        : products
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((p) => ({
              id: p.id,
              handle: `product/${p.id}`,
              title: p.name,
              storyIntro: productDescriptor(p, locale),
              image: null,
              storyImage: null,
            }));

  const hasTextureGrid = Boolean(meta?.textureImages?.length);
  const hasNarrativeText = Boolean(narrativeBody.trim());
  const showVisualSection =
    hasTextureGrid || Boolean(meta?.storyImage?.url && !hasNarrativeText);

  const priceDisplay =
    selectedVariant?.price?.amount != null &&
    selectedVariant.price.amount !== "" &&
    selectedVariant.price.currencyCode
      ? formatShopifyMoney(
          selectedVariant.price.amount,
          selectedVariant.price.currencyCode,
          locale
        )
      : productPriceDisplay(product, locale);

  const handleAddToCart = async () => {
    const cartVariantId = selectedVariant?.id || product.shopifyVariantId;
    if (!cartVariantId) {
      alert(t(siteCopy.product.notAvailable));
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(cartVariantId, product.id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert(t(siteCopy.product.cartError));
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20 text-[#F2F0ED] sm:pt-24">
      {/* 1) Product hero — gallery, English name, localized story layer, commerce */}
      <section className="px-6 py-24 sm:px-10 md:px-14 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="overflow-hidden border border-white/10 bg-black/30">
              <div className="aspect-[864/1184] w-full">
                {selectedImage ? (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.altText || displayName}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full bg-black/30" />
                )}
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {allImages.slice(0, 8).map((img, idx) => (
                  <button
                    key={`${img.url}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`overflow-hidden border ${idx === selectedImageIndex ? "border-white/40" : "border-white/10"} bg-black/20`}
                  >
                    <div className="aspect-[864/1184] w-full">
                      <img
                        src={img.url}
                        alt={img.altText || displayName}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-[#F2F0ED]/50" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.scentNarrativeEyebrow)}
            </p>
            <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[#F2F0ED]/45" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.productType)}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ fontFamily: "var(--font-sans)" }}>
              {displayName}
            </h1>

            {!!priceDisplay && (
              <p className="mt-10 text-2xl text-[#F2F0ED]/88" style={{ fontFamily: "var(--font-mono)" }}>
                {priceDisplay}
              </p>
            )}
            <p
              className="mt-3 max-w-xl text-[11px] tracking-[0.06em] text-[#F2F0ED]/52"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.product.volumeLabel)} · {t(siteCopy.product.capacityValue)}
            </p>

            {variants.length > 1 && (
              <div className="mt-8">
                <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#F2F0ED]/50" style={{ fontFamily: "var(--font-sans)" }}>
                  {t(siteCopy.product.selectVariant)}
                </p>
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-[#F2F0ED]"
                >
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}{" "}
                      {variant.availableForSale ? "" : t(siteCopy.product.variantSoldOut)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant || !selectedVariant.availableForSale}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 border border-white/25 bg-white/10 px-6 py-4 text-[11px] uppercase tracking-[0.26em] text-[#F2F0ED] transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <ShoppingBag size={16} />
              {isAddingToCart
                ? t(siteCopy.product.adding)
                : selectedVariant?.availableForSale
                  ? t(siteCopy.product.addToCart)
                  : t(siteCopy.product.soldOut)}
            </button>

            {!isConfigured && (
              <p className="mt-3 text-[11px] text-[#F2F0ED]/45" style={{ fontFamily: "var(--font-sans)" }}>
                {t(siteCopy.product.demoMode)}
              </p>
            )}

            {(heroDescriptor.trim() || shortStory.trim()) && (
              <div className="mt-10 space-y-5 border-t border-white/10 pt-10">
                {heroDescriptor.trim() ? (
                  <p
                    className="max-w-2xl text-[13px] leading-relaxed text-[#F2F0ED]/72 sm:text-sm"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {heroDescriptor}
                  </p>
                ) : null}
                {shortStory.trim() ? (
                  <p
                    className="max-w-2xl text-[12px] leading-relaxed text-[#F2F0ED]/58 sm:text-[13px]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {shortStory}
                  </p>
                ) : null}
              </div>
            )}

            {!!descriptionBlurb && (
              <div className="mt-8 border-t border-white/10 pt-8">
                <p
                  className="max-w-[52ch] text-sm leading-relaxed text-[#F2F0ED]/68"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {descriptionBlurb}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2) Narrative (The narrative / 敘事) */}
      {hasNarrativeText && (
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.narrative)}
            </h2>
            {meta?.storyImage?.url && (
              <div className="mb-10 overflow-hidden border border-white/10 bg-black/20">
                <div className="aspect-[864/1184] w-full max-h-[min(520px,70vh)]">
                  <img
                    src={meta.storyImage.url}
                    alt={meta.storyImage.altText || displayName}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            <p
              className="max-w-3xl text-base leading-[1.75] text-[#F2F0ED]/72 sm:text-[17px]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {narrativeBody}
            </p>
          </div>
        </section>
      )}

      {/* 3) Scent impression (氣息之間) */}
      {hasImpressionLayer && (
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.scentCharacter)}
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {impressionText && (
                <div className="border border-white/10 bg-black/20 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.impression)}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#F2F0ED]/80">{impressionText}</p>
                </div>
              )}
              {wearMomentText && (
                <div className="border border-white/10 bg-black/20 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.wearContext)}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#F2F0ED]/80">{wearMomentText}</p>
                </div>
              )}
            </div>

            {moodTagsDisplay.length > 0 && (
              <div className="mt-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.moodKeywords)}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {moodTagsDisplay.map((keyword) => (
                    <span
                      key={keyword}
                      className="border border-white/14 bg-black/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.08em] text-[#F2F0ED]/68"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(localIntensity || localLasting || meta?.longevity || meta?.sillage) && (
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {localIntensity && (
                  <div className="border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.presence)}</p>
                    <p className="mt-2 text-sm text-[#F2F0ED]/80">{localIntensity}</p>
                  </div>
                )}
                {localLasting && (
                  <div className="border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.endurance)}</p>
                    <p className="mt-2 text-sm text-[#F2F0ED]/80">{localLasting}</p>
                  </div>
                )}
                {meta?.longevity && (
                  <div className="border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.longevity)}</p>
                    <p className="mt-2 text-sm text-[#F2F0ED]/80">{meta.longevity}</p>
                  </div>
                )}
                {meta?.sillage && (
                  <div className="border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.sillage)}</p>
                    <p className="mt-2 text-sm text-[#F2F0ED]/80">{meta.sillage}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4) Accords & structured notes */}
      {hasAccordsNotesLayer && (
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.fragranceProfile)}
            </h2>

            {!!scentFamilyLabel && (
              <div className="mb-10 border border-white/10 bg-black/15 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.scentFamily)}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#F2F0ED]/82">{scentFamilyLabel}</p>
              </div>
            )}

            {localAccords.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.accords)}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {localAccords.map((accord) => (
                    <span
                      key={accord}
                      className="border border-white/14 bg-black/10 px-3.5 py-1.5 text-[11px] tracking-[0.06em] text-[#F2F0ED]/72"
                    >
                      {accord}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasNotes && (
              <>
              <div className="space-y-3 border border-white/10 bg-black/20 p-4 md:hidden">
                {topNotes.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.notesTop)}</p>
                    <div className="space-y-1.5">
                      {topNotes.map((note, idx) => {
                        const inline = joinBilingualInline(note);
                        if (!inline) return null;
                        return <p key={`m-top-${idx}-${inline}`} className="text-[13px] text-[#F2F0ED]/82">{inline}</p>;
                      })}
                    </div>
                  </div>
                )}
                {heartNotes.length > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.notesHeart)}</p>
                    <div className="space-y-1.5">
                      {heartNotes.map((note, idx) => {
                        const inline = joinBilingualInline(note);
                        if (!inline) return null;
                        return <p key={`m-heart-${idx}-${inline}`} className="text-[13px] text-[#F2F0ED]/82">{inline}</p>;
                      })}
                    </div>
                  </div>
                )}
                {baseNotes.length > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.notesBase)}</p>
                    <div className="space-y-1.5">
                      {baseNotes.map((note, idx) => {
                        const inline = joinBilingualInline(note);
                        if (!inline) return null;
                        return <p key={`m-base-${idx}-${inline}`} className="text-[13px] text-[#F2F0ED]/82">{inline}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden gap-5 md:grid md:grid-cols-3">
                {topNotes.length > 0 && (
                  <div className="border border-white/10 bg-black/20 p-5">
                    <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-[#F2F0ED]/45">{t(siteCopy.product.notesTop)}</p>
                    <div className="space-y-3">
                      {topNotes.map((note, idx) => {
                        const parsed = splitBilingualNote(note);
                        if (!parsed.primary) return null;
                        return (
                          <div key={`top-${idx}-${parsed.primary}`} className="leading-snug">
                            <p className="text-[13px] text-[#F2F0ED]/84">{parsed.primary}</p>
                            {parsed.secondary && (
                              <p className="mt-1 text-[11px] tracking-[0.04em] text-[#F2F0ED]/46">{parsed.secondary}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {heartNotes.length > 0 && (
                  <div className="border border-white/10 bg-black/20 p-5">
                    <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-[#F2F0ED]/45">{t(siteCopy.product.notesHeart)}</p>
                    <div className="space-y-3">
                      {heartNotes.map((note, idx) => {
                        const parsed = splitBilingualNote(note);
                        if (!parsed.primary) return null;
                        return (
                          <div key={`heart-${idx}-${parsed.primary}`} className="leading-snug">
                            <p className="text-[13px] text-[#F2F0ED]/84">{parsed.primary}</p>
                            {parsed.secondary && (
                              <p className="mt-1 text-[11px] tracking-[0.04em] text-[#F2F0ED]/46">{parsed.secondary}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {baseNotes.length > 0 && (
                  <div className="border border-white/10 bg-black/20 p-5">
                    <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-[#F2F0ED]/45">{t(siteCopy.product.notesBase)}</p>
                    <div className="space-y-3">
                      {baseNotes.map((note, idx) => {
                        const parsed = splitBilingualNote(note);
                        if (!parsed.primary) return null;
                        return (
                          <div key={`base-${idx}-${parsed.primary}`} className="leading-snug">
                            <p className="text-[13px] text-[#F2F0ED]/84">{parsed.primary}</p>
                            {parsed.secondary && (
                              <p className="mt-1 text-[11px] tracking-[0.04em] text-[#F2F0ED]/46">{parsed.secondary}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              </>
            )}

            {meta?.pairingNote && (
              <div className="mt-10 border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.pairing)}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#F2F0ED]/76">{meta.pairingNote}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5) Visual storytelling (textures; orphaned story image when no long narrative) */}
      {showVisualSection && (
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.visualStorytelling)}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {meta?.storyImage?.url && !hasNarrativeText && (
                <div className="overflow-hidden border border-white/10 bg-black/20 md:col-span-3">
                  <div className="aspect-[864/1184] w-full max-h-[min(520px,75vh)]">
                    <img
                      src={meta.storyImage.url}
                      alt={meta.storyImage.altText || displayName}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
              {meta?.textureImages?.map((image) => (
                <div key={image.url} className="overflow-hidden border border-white/10 bg-black/20">
                  <div className="aspect-[864/1184] w-full">
                    <img
                      src={image.url}
                      alt={image.altText || t(siteCopy.product.textureAlt)}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6) Related scents / continuation section */}
      {!!relatedScents.length && (
        <section className="border-t border-white/10 px-6 py-16 sm:px-10 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-8 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.continueScentStory)}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedScents.slice(0, 3).map((related) => {
                const imageUrl =
                  related.storyImage?.url ??
                  related.image?.url ??
                  BOTTLE_IMAGE;

                if (import.meta.env.DEV) {
                  console.log("[ContinueTheScentStory] image", {
                    handle: related.handle,
                    title: related.title,
                    storyImage: related.storyImage?.url,
                    featuredImage: related.image?.url,
                    finalImage: imageUrl,
                  });
                }

                const localId = relatedLocalId(related);
                const lp = localId ? products.find((p) => p.id === localId) : undefined;
                const localizedTitle = lp ? lp.name : related.title;
                const localizedIntro = lp ? productDescriptor(lp, locale) : related.storyIntro;
                const toPath = localId
                  ? localizePath(ROUTES.product(localId))
                  : localizePath(
                      related.handle.startsWith("product/")
                        ? `/${related.handle}`
                        : `/product/${related.handle}`
                    );

                return (
                  <LocalizedLink
                    key={related.id}
                    to={toPath}
                    className="group border border-white/10 bg-black/20 transition hover:border-white/25"
                  >
                    <div className="aspect-[864/1184] w-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={related.storyImage?.altText || related.image?.altText || related.title}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#F2F0ED]/45">{t(siteCopy.product.relatedCard)}</p>
                      <h4 className="mt-2 text-lg text-[#F2F0ED]">{localizedTitle}</h4>
                      {localizedIntro && (
                        <p className="mt-2 text-sm leading-relaxed text-[#F2F0ED]/65">
                          {truncateText(localizedIntro, 100)}
                        </p>
                      )}
                      <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/55">
                        {t(siteCopy.product.discoverStory)}
                      </span>
                    </div>
                  </LocalizedLink>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {isLoadingShopifyProduct && (
        <div className="fixed bottom-4 right-4 border border-white/15 bg-black/70 px-3 py-2 text-[11px] text-[#F2F0ED]/70">
          {t(siteCopy.product.syncingShopify)}
        </div>
      )}
    </div>
  );
}