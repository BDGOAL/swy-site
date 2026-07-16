import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { ShoppingBag } from "lucide-react";
import { products } from "../data/products";
import { productPdpStoryBodyEn, productPdpStoryIntroEn } from "../data/productPdpStoryEn";
import { productPdpStoryBodyZh, productPdpStoryIntroZh } from "../data/productPdpStoryZh";
import {
  asProductImage,
  asProductImages,
  hideImageOnError,
  resolveFeaturedImage,
  resolveGalleryImages,
  resolveStoryCardImage,
  pdpImageAlt,
} from "../lib/productImages";
import { useShopify } from "../context/ShopifyContext";
import { shopifyConfig } from "../config/shopify";
import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";
import {
  productDescriptor,
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
  shopifyStorefrontLanguageCode,
  coalesceMetaText,
  coalesceMetaStringList,
  pdpLocaleString,
  productPairingSuggestion,
  textContainsHan,
} from "../lib/productLocale";
import type { Locale } from "../lib/i18n";
import { ROUTES } from "../constants/routes";
import { LocalizedLink } from "./LocalizedLink";
import {
  textureImagesFromLegacyGraphqlFields,
  textureImagesFromRawMetafields,
  type RawTextureMetafield,
} from "../lib/textureMetafield";
import { PdpTextureGallerySection, PdpTextureFigure } from "./PdpTextureGallerySection";

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

function normalizeShopifyHandle(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^product\//, "");
}

function stripLeadingThe(s: string): string {
  return s.replace(/^the-/, "");
}

/** Map a Shopify product handle (or `product/<id>`) to our in-app `products.ts` id for routing. */
function resolveLocalProductIdForRelated(related: RelatedScent): string | null {
  const raw = related.handle;
  if (raw.startsWith("product/")) {
    const rest = normalizeShopifyHandle(raw.slice("product/".length));
    const byRest = products.find((p) => p.id === rest || p.slug === rest);
    if (byRest) return byRest.id;
  }
  const h = normalizeShopifyHandle(raw);
  const direct = products.find(
    (p) =>
      p.id.toLowerCase() === h ||
      p.slug.toLowerCase() === h ||
      (p.shopifyHandle && normalizeShopifyHandle(p.shopifyHandle) === h)
  );
  if (direct) return direct.id;
  const hStripped = stripLeadingThe(h);
  const fuzzy = products.find((p) => {
    const idN = normalizeShopifyHandle(p.id);
    const slugN = normalizeShopifyHandle(p.slug);
    const shopN = p.shopifyHandle ? normalizeShopifyHandle(p.shopifyHandle) : "";
    return (
      stripLeadingThe(idN) === hStripped ||
      stripLeadingThe(slugN) === hStripped ||
      (shopN && stripLeadingThe(shopN) === hStripped)
    );
  });
  if (fuzzy) return fuzzy.id;
  if (related.title?.trim()) {
    const tNorm = related.title.trim().toLowerCase();
    const byTitle = products.find((p) => p.name.trim().toLowerCase() === tNorm);
    if (byTitle) return byTitle.id;
  }
  return null;
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

/** Single-locale line from a note row (e.g. Shopify `EN / ZH` or `ZH / EN`). */
function noteLineForLocale(note: string, locale: Locale): string {
  const parsed = splitBilingualNote((note || "").trim());
  if (!parsed.primary) return "";
  if (!parsed.secondary) return parsed.primary;

  const a = parsed.primary.trim();
  const b = parsed.secondary.trim();
  const aHan = textContainsHan(a);
  const bHan = textContainsHan(b);
  const aLat = /[a-zA-Z]{2,}/.test(a);
  const bLat = /[a-zA-Z]{2,}/.test(b);

  if (locale === "zh") {
    if (bHan && !aHan) return b;
    if (aHan && !bHan) return a;
    if (aHan && bHan) return a;
    return bHan ? b : a;
  }

  if (aLat && !aHan) return a;
  if (bLat && !bHan) return b;
  if (aLat && bLat) return a;
  return aLat ? a : bLat ? b : a;
}

function truncateText(value: string, maxChars: number): string {
  const text = value.trim();
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trim()}...`;
}

function debugTextureLog(label: string, payload: unknown) {
  if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_TEXTURE === "1") {
    console.log(`[PDP texture] ${label}`, payload);
  }
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
  /** Shop-default-language story metafields (fills Chinese when @inContext omits them). */
  const [storyMetafieldsShopDefault, setStoryMetafieldsShopDefault] = useState<{
    intro?: string;
    body?: string;
  } | null>(null);
  const atcButtonRef = useRef<HTMLButtonElement>(null);
  const [showStickyAtc, setShowStickyAtc] = useState(false);

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
          query ProductByVariantId($variantId: ID!, $language: LanguageCode!)
            @inContext(language: $language) {
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
                    width
                    height
                  }
                  images(first: 12) {
                    nodes {
                      url
                      altText
                      width
                      height
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
                        image { url altText width height }
                      }
                    }
                  }
                  textureMetafields: metafields(
                    identifiers: [
                      { namespace: "custom", key: "texture_images" },
                      { namespace: "custom", key: "texture-images" },
                      { namespace: "custom", key: "texture_image" }
                    ]
                  ) {
                    namespace
                    key
                    type
                    value
                    reference {
                      __typename
                      ... on MediaImage {
                        image {
                          url
                          altText
                        }
                        previewImage {
                          url
                          altText
                        }
                      }
                      ... on GenericFile {
                        url
                        previewImage {
                          url
                        }
                      }
                      ... on Video {
                        previewImage {
                          url
                          altText
                        }
                      }
                    }
                    references(first: 20) {
                      nodes {
                        __typename
                        ... on MediaImage {
                          image {
                            url
                            altText
                          }
                          previewImage {
                            url
                            altText
                          }
                        }
                        ... on GenericFile {
                          url
                          previewImage {
                            url
                          }
                        }
                        ... on Video {
                          previewImage {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                  textureImages: metafield(namespace: "custom", key: "texture_images") {
                    references(first: 20) {
                      nodes {
                        __typename
                        ... on MediaImage {
                          image {
                            url
                            altText
                          }
                          previewImage {
                            url
                            altText
                          }
                        }
                        ... on GenericFile {
                          url
                          previewImage {
                            url
                          }
                        }
                        ... on Video {
                          previewImage {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                  textureImageSingle: metafield(namespace: "custom", key: "texture_image") {
                    reference {
                      __typename
                      ... on MediaImage {
                        image {
                          url
                          altText
                        }
                        previewImage {
                          url
                          altText
                        }
                      }
                      ... on GenericFile {
                        url
                        previewImage {
                          url
                        }
                      }
                      ... on Video {
                        previewImage {
                          url
                          altText
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
                          featuredImage { url altText width height }
                          storyImage: metafield(namespace: "custom", key: "story_image") {
                            reference {
                              ... on MediaImage {
                                image { url altText width height }
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
              variables: {
                variantId: product.shopifyVariantId,
                language: shopifyStorefrontLanguageCode(locale),
              },
            }),
          }
        );

        if (!response.ok) {
          debugTextureLog("HTTP not OK", { status: response.status, statusText: response.statusText });
          return;
        }
        const data = await response.json();
        if (data.errors?.length) {
          debugTextureLog("GraphQL errors (full response may be partial)", data.errors);
        }
        if (!data?.data?.node?.product) {
          debugTextureLog("No product on node", data);
          return;
        }

        const raw = data.data.node.product;
        const relatedNodes = raw.relatedScents?.references?.nodes || [];
        const textureMetafieldsRaw = raw.textureMetafields as RawTextureMetafield[] | undefined;
        let textureImagesParsed = textureImagesFromRawMetafields(textureMetafieldsRaw);
        if (textureImagesParsed.length === 0) {
          textureImagesParsed = textureImagesFromLegacyGraphqlFields({
            textureImages: raw.textureImages,
            textureImageSingle: raw.textureImageSingle,
          });
        }
        debugTextureLog("raw textureMetafields", textureMetafieldsRaw);
        debugTextureLog("parsed textureImages array", textureImagesParsed);
        debugTextureLog("lead texture URL", textureImagesParsed[0]?.url ?? "(none)");
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
            textureImages: textureImagesParsed,
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
      } catch (e) {
        debugTextureLog("Product fetch threw", e);
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
  }, [isConfigured, product?.shopifyVariantId, locale]);

  useEffect(() => {
    if (!isConfigured || !shopifyProduct?.id) {
      setStoryMetafieldsShopDefault(null);
      return;
    }
    let cancelled = false;
    const fetchStoryDefaults = async () => {
      try {
        const query = `
          query ProductStoryShopDefault($id: ID!) {
            node(id: $id) {
              ... on Product {
                storyIntro: metafield(namespace: "custom", key: "story_intro") { value }
                storyBody: metafield(namespace: "custom", key: "story_body") { value }
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
              "X-Shopify-Storefront-Access-Token": shopifyConfig.storefrontAccessToken,
            },
            body: JSON.stringify({
              query,
              variables: { id: shopifyProduct.id },
            }),
          }
        );
        if (!response.ok) return;
        const data = await response.json();
        const node = data?.data?.node;
        if (!node || cancelled) return;
        setStoryMetafieldsShopDefault({
          intro: node.storyIntro?.value ?? undefined,
          body: node.storyBody?.value ?? undefined,
        });
      } catch {
        if (!cancelled) setStoryMetafieldsShopDefault(null);
      }
    };
    fetchStoryDefaults();
    return () => {
      cancelled = true;
    };
  }, [isConfigured, shopifyProduct?.id]);

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
          query RelatedByVariantIds($variantIds: [ID!]!, $language: LanguageCode!)
            @inContext(language: $language) {
            nodes(ids: $variantIds) {
              ... on ProductVariant {
                product {
                  id
                  handle
                  title
                  featuredImage { url altText width height }
                  storyIntro: metafield(namespace: "custom", key: "story_intro") { value }
                  storyImage: metafield(namespace: "custom", key: "story_image") {
                    reference {
                      ... on MediaImage {
                        image { url altText width height }
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
              variables: {
                variantIds,
                language: shopifyStorefrontLanguageCode(locale),
              },
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
  }, [isConfigured, product?.id, locale]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-[11px] tracking-wider text-[#F2F0ED]" style={{ fontFamily: "var(--font-sans)" }}>
          {t(siteCopy.product.notFound)}
        </p>
      </div>
    );
  }

  const shopifyFeatured = asProductImage(shopifyProduct?.featuredImage);
  const shopifyGallery = asProductImages(shopifyProduct?.images);
  const allImages = resolveGalleryImages({
    featuredImage: shopifyFeatured,
    images: shopifyGallery,
    productName: product.name,
  });
  const primaryImage = resolveFeaturedImage({
    featuredImage: shopifyFeatured,
    galleryImages: allImages,
    productName: product.name,
  });
  const safeImageIndex =
    allImages.length > 0
      ? Math.min(Math.max(selectedImageIndex, 0), allImages.length - 1)
      : 0;
  const selectedImage =
    allImages[safeImageIndex] ?? primaryImage ?? null;
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

  /** Merged: in-context metafields + shop-default fetch (restores Chinese when EN context omits). */
  const storyIntroMerged = (
    (meta?.storyIntro ?? storyMetafieldsShopDefault?.intro ?? "") as string
  ).trim();
  const storyBodyMerged = (
    (meta?.storyBody ?? storyMetafieldsShopDefault?.body ?? "") as string
  ).trim();

  const localZhIntro = productPdpStoryIntroZh(product.id);
  const localZhBody = productPdpStoryBodyZh(product.id);
  const localEnIntro = productPdpStoryIntroEn(product.id);
  const localEnBody = productPdpStoryBodyEn(product.id);

  const pdpStoryIntroDisplay =
    locale === "zh"
      ? localZhIntro || storyIntroMerged
      : localEnIntro ||
        (storyIntroMerged && !textContainsHan(storyIntroMerged) ? storyIntroMerged : "");

  const pdpStoryBodyDisplay =
    locale === "zh"
      ? localZhBody || storyBodyMerged
      : localEnBody ||
        (storyBodyMerged && !textContainsHan(storyBodyMerged) ? storyBodyMerged : "");

  const textureImagesList = meta?.textureImages ?? [];
  const textureLeadImage = textureImagesList[0] ?? null;
  const textureImagesRemaining = textureImagesList.slice(1);

  /** PDP narrative/mood slot: dedicated custom.story_image (may share URL with Product Media). */
  const narrativeMoodImage = asProductImage(meta?.storyImage);
  const showNarrativeMoodImage = Boolean(narrativeMoodImage?.url);

  /** Local `products.ts` note pyramid is the approved source of truth. */
  const topNotes = productNotesTop(product, locale);
  const heartNotes = productNotesHeart(product, locale);
  const baseNotes = productNotesBase(product, locale);
  const hasNotes = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;

  const localAccords = productAccords(product, locale);
  const scentFamilyRaw = meta?.scentFamily?.trim() ?? "";
  const scentFamilyLocalized = scentFamilyRaw
    ? noteLineForLocale(scentFamilyRaw, locale)
    : "";
  const scentFamilyLabel = pdpLocaleString(
    scentFamilyLocalized || undefined,
    locale,
    productScentFamily(product, locale)
  );
  const moodTagsDisplay = meta?.moodKeywords?.length
    ? coalesceMetaStringList(meta.moodKeywords, locale, productMoodTags(product, locale))
    : productMoodTags(product, locale);
  const impressionText = productImpression(product, locale);
  const wearMomentText = pdpLocaleString(
    meta?.wearWhen,
    locale,
    productWearMoment(product, locale)
  );
  const localIntensity = productIntensity(product, locale);
  const localLasting = productLasting(product, locale);
  const longevityDisplay = pdpLocaleString(
    meta?.longevity,
    locale,
    productLasting(product, locale)
  );
  const sillageDisplay = pdpLocaleString(meta?.sillage, locale, "");
  const pairingForPdp = pdpLocaleString(
    meta?.pairingNote,
    locale,
    productPairingSuggestion(product, locale)
  );

  const showFragranceAtmosphereBlock = Boolean(
    impressionText ||
      wearMomentText ||
      moodTagsDisplay.length ||
      localIntensity ||
      localLasting ||
      longevityDisplay ||
      sillageDisplay
  );

  const showFragranceStructureBlock = Boolean(localAccords.length);
  const showFragranceStylingBlock = Boolean(pairingForPdp);

  const showPdpFragranceInfoSection =
    showFragranceAtmosphereBlock || showFragranceStructureBlock || showFragranceStylingBlock;

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

  const relatedScentsResolved = relatedScents
    .map((related) => ({
      related,
      localId: resolveLocalProductIdForRelated(related),
    }))
    .filter((x): x is { related: RelatedScent; localId: string } => Boolean(x.localId));

  const showTextureGallerySection = textureImagesRemaining.length > 0;

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

  useEffect(() => {
    const el = atcButtonRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShowStickyAtc(false);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyAtc(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "0px" }
    );

    // Defer observe until after layout so first paint does not flicker sticky.
    frame = window.requestAnimationFrame(() => {
      if (atcButtonRef.current) observer.observe(atcButtonRef.current);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [product?.id, selectedVariant?.id]);

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

  const fragranceNotesSummary = hasNotes ? (
    <>
      <div className="space-y-3 border border-white/10 bg-black/20 p-4 md:hidden">
        {topNotes.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.notesTop)}</p>
            <div className="space-y-1.5">
              {topNotes.map((note, idx) => {
                const line = noteLineForLocale(note, locale);
                if (!line) return null;
                return <p key={`m-top-${idx}-${line}`} className="text-[14px] leading-snug text-[#F2F0ED]/84">{line}</p>;
              })}
            </div>
          </div>
        )}
        {heartNotes.length > 0 && (
          <div className="border-t border-white/10 pt-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.notesHeart)}</p>
            <div className="space-y-1.5">
              {heartNotes.map((note, idx) => {
                const line = noteLineForLocale(note, locale);
                if (!line) return null;
                return <p key={`m-heart-${idx}-${line}`} className="text-[14px] leading-snug text-[#F2F0ED]/84">{line}</p>;
              })}
            </div>
          </div>
        )}
        {baseNotes.length > 0 && (
          <div className="border-t border-white/10 pt-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.notesBase)}</p>
            <div className="space-y-1.5">
              {baseNotes.map((note, idx) => {
                const line = noteLineForLocale(note, locale);
                if (!line) return null;
                return <p key={`m-base-${idx}-${line}`} className="text-[14px] leading-snug text-[#F2F0ED]/84">{line}</p>;
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
                const line = noteLineForLocale(note, locale);
                if (!line) return null;
                return (
                  <div key={`top-${idx}-${line}`} className="leading-snug">
                    <p className="text-[13px] text-[#F2F0ED]/84">{line}</p>
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
                const line = noteLineForLocale(note, locale);
                if (!line) return null;
                return (
                  <div key={`heart-${idx}-${line}`} className="leading-snug">
                    <p className="text-[13px] text-[#F2F0ED]/84">{line}</p>
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
                const line = noteLineForLocale(note, locale);
                if (!line) return null;
                return (
                  <div key={`base-${idx}-${line}`} className="leading-snug">
                    <p className="text-[13px] text-[#F2F0ED]/84">{line}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  ) : null;

  const dialogueTheme = productDescriptor(product, locale);
  const emotionalSummary = impressionText;
  const storyLeadingClass =
    locale === "zh" ? "leading-[1.85]" : "leading-[1.7]";

  return (
    <div
      className={`min-h-screen bg-[#0A0A0A] pt-20 text-[#F2F0ED] sm:pt-24 ${
        showStickyAtc ? "pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0" : ""
      }`}
    >
      {/* 1) Product hero — mobile purchase-first; desktop two-column editorial */}
      <section className="px-4 py-10 sm:px-10 sm:py-16 md:px-14 lg:px-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto] lg:items-start lg:gap-x-12 lg:gap-y-8">
          {/* Identity — name, theme, family, price (mobile order 1) */}
          <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 lg:pt-2">
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[#F2F0ED]/45"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.product.productType)}
            </p>
            <h1
              className="mt-3 text-[1.75rem] leading-tight sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {displayName}
            </h1>
            {dialogueTheme ? (
              <p
                className={`mt-4 max-w-2xl text-[15px] text-[#F2F0ED]/72 ${storyLeadingClass}`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {dialogueTheme}
              </p>
            ) : null}
            {scentFamilyLabel ? (
              <p
                className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#F2F0ED]/48"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {t(siteCopy.product.scentFamily)}
                <span className="text-[#F2F0ED]/28"> · </span>
                <span className="normal-case tracking-normal text-[13px] text-[#F2F0ED]/72">
                  {scentFamilyLabel}
                </span>
              </p>
            ) : null}
            {!!priceDisplay && (
              <p
                className="mt-5 text-2xl text-[#F2F0ED]/88"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {priceDisplay}
              </p>
            )}
            <p
              className="mt-2 max-w-xl text-[11px] tracking-[0.06em] text-[#F2F0ED]/52"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.product.volumeLabel)} · {t(siteCopy.product.capacityValue)}
            </p>
          </div>

          {/* Gallery — mobile order 2; desktop left column */}
          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-3">
            <div className="overflow-hidden border border-white/10 bg-black/30">
              <div className="aspect-[864/1184] w-full">
                {selectedImage ? (
                  <img
                    src={selectedImage.url}
                    alt={pdpImageAlt(displayName, selectedImage.alt)}
                    width={selectedImage.width || 864}
                    height={selectedImage.height || 1184}
                    className="h-full w-full object-cover object-center"
                    decoding="async"
                    {...(safeImageIndex === 0
                      ? { fetchPriority: "high" as const }
                      : { loading: "lazy" as const })}
                    onError={hideImageOnError}
                  />
                ) : (
                  <div className="h-full w-full bg-black/30" />
                )}
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-2 min-[390px]:grid-cols-4 min-[390px]:gap-3">
                {allImages.slice(0, 8).map((img, idx) => (
                  <button
                    key={`${img.url}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={pdpImageAlt(displayName, img.alt)}
                    aria-pressed={idx === safeImageIndex}
                    className={`min-h-[44px] overflow-hidden border ${
                      idx === safeImageIndex ? "border-white/45" : "border-white/10"
                    } bg-black/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/35`}
                  >
                    <div className="aspect-[864/1184] w-full">
                      <img
                        src={img.url}
                        alt=""
                        width={img.width || 864}
                        height={img.height || 1184}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                        onError={hideImageOnError}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase cluster — summary, notes, variant, ATC (mobile order 3) */}
          <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-3">
            {emotionalSummary ? (
              <p
                className={`max-w-2xl text-[15px] text-[#F2F0ED]/70 ${storyLeadingClass}`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {emotionalSummary}
              </p>
            ) : null}

            {fragranceNotesSummary ? (
              <div className={emotionalSummary ? "mt-6" : ""}>{fragranceNotesSummary}</div>
            ) : null}

            {variants.length > 1 && (
              <div className="mt-6">
                <p
                  className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#F2F0ED]/50"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t(siteCopy.product.selectVariant)}
                </p>
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="min-h-[44px] w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-[#F2F0ED]"
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
              ref={atcButtonRef}
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant || !selectedVariant.availableForSale}
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-3 border border-white/25 bg-white/10 px-6 py-4 text-[11px] uppercase tracking-[0.26em] text-[#F2F0ED] transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/40 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <ShoppingBag size={16} aria-hidden />
              {isAddingToCart
                ? t(siteCopy.product.adding)
                : selectedVariant?.availableForSale
                  ? t(siteCopy.product.addToCart)
                  : t(siteCopy.product.soldOut)}
            </button>

            {!isConfigured && (
              <p
                className="mt-3 text-[11px] text-[#F2F0ED]/45"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {t(siteCopy.product.demoMode)}
              </p>
            )}
          </div>

          {/* Long story + narrative image — after ATC on mobile; between identity & purchase on desktop */}
          <div className="order-4 lg:order-none lg:col-start-2 lg:row-start-2">
            <p
              className="text-[10px] uppercase tracking-[0.32em] text-[#F2F0ED]/50"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.product.scentNarrativeEyebrow)}
            </p>

            {pdpStoryIntroDisplay ? (
              <p
                className={`mt-4 max-w-2xl whitespace-pre-line text-[15px] text-[#F2F0ED]/78 ${storyLeadingClass}`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {pdpStoryIntroDisplay}
              </p>
            ) : null}

            {showNarrativeMoodImage && narrativeMoodImage ? (
              <div className="mt-6 max-w-2xl overflow-hidden border border-white/10 bg-black/30">
                <div className="aspect-[864/1184] w-full max-h-[min(36vh,18rem)] sm:max-h-[min(42vh,22rem)] lg:max-h-[min(48vh,26rem)]">
                  <img
                    src={narrativeMoodImage.url}
                    alt={
                      narrativeMoodImage.alt?.trim() ||
                      `SWY ${displayName} narrative scene`
                    }
                    width={narrativeMoodImage.width || 864}
                    height={narrativeMoodImage.height || 1184}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                    onError={hideImageOnError}
                  />
                </div>
              </div>
            ) : null}

            {pdpStoryBodyDisplay ? (
              <p
                className={`mt-5 max-w-2xl whitespace-pre-line text-[15px] text-[#F2F0ED]/68 ${storyLeadingClass}`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {pdpStoryBodyDisplay}
              </p>
            ) : null}
          </div>
        </div>

        {/* Mobile texture lead — after hero story, still before desktop texture section */}
        {textureLeadImage?.url ? (
          <div className="mx-auto mt-10 max-w-6xl md:hidden">
            <PdpTextureFigure
              url={textureLeadImage.url}
              alt={textureLeadImage.altText || t(siteCopy.product.textureAlt)}
              imgClassName="block w-full max-h-[min(48vh,20rem)] object-contain object-center sm:max-h-[min(52vh,24rem)]"
            />
          </div>
        ) : null}
      </section>

      {showStickyAtc ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0A0A0A]/95 px-4 pt-3 backdrop-blur-md md:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            {!!priceDisplay && (
              <p
                className="shrink-0 font-mono text-sm text-[#F2F0ED]/88"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {priceDisplay}
              </p>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant || !selectedVariant.availableForSale}
              aria-label={
                isAddingToCart
                  ? t(siteCopy.product.adding)
                  : selectedVariant?.availableForSale
                    ? t(siteCopy.product.addToCart)
                    : t(siteCopy.product.soldOut)
              }
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 border border-white/25 bg-white/10 px-4 text-[11px] uppercase tracking-[0.22em] text-[#F2F0ED] transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/40 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <ShoppingBag size={16} aria-hidden />
              {isAddingToCart
                ? t(siteCopy.product.adding)
                : selectedVariant?.availableForSale
                  ? t(siteCopy.product.addToCart)
                  : t(siteCopy.product.soldOut)}
            </button>
          </div>
        </div>
      ) : null}

      {textureLeadImage?.url ? (
        <PdpTextureGallerySection
          url={textureLeadImage.url}
          alt={textureLeadImage.altText || t(siteCopy.product.textureAlt)}
        />
      ) : null}

      {/* 2) Fragrance details — lg: 2-column editorial (atmosphere | structure), pairing full-width below */}
      {showPdpFragranceInfoSection && (
        <section className="border-t border-white/10 px-6 py-10 sm:px-10 sm:py-12 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <div
              className={
                showFragranceAtmosphereBlock && showFragranceStructureBlock
                  ? "grid gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0 lg:items-start"
                  : "flex flex-col gap-10"
              }
            >
              {showFragranceAtmosphereBlock && (
                <div className="min-w-0 border border-white/10 bg-black/[0.14] px-5 py-6 sm:px-6 sm:py-7">
                  <h2
                    className="text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {t(siteCopy.product.fragranceGroupAtmosphere)}
                  </h2>
                  <div className="mt-5 space-y-6 border-t border-white/[0.08] pt-5">
                    {(impressionText || wearMomentText) && (
                      <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-8">
                        {impressionText && (
                          <div
                            className={`hidden lg:block ${
                              wearMomentText
                                ? "border-b border-white/10 pb-5 sm:border-b-0 sm:pb-0 sm:border-r sm:border-white/10 sm:pr-8"
                                : ""
                            }`}
                          >
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                              {t(siteCopy.product.impression)}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-[#F2F0ED]/80">{impressionText}</p>
                          </div>
                        )}
                        {wearMomentText && (
                          <div className={impressionText ? "lg:pt-0 pt-0" : ""}>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                              {t(siteCopy.product.wearContext)}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-[#F2F0ED]/80">{wearMomentText}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {moodTagsDisplay.length > 0 && (
                      <div className="border-t border-white/[0.07] pt-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                          {t(siteCopy.product.moodKeywords)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {moodTagsDisplay.map((keyword) => (
                            <span
                              key={keyword}
                              className="border border-white/14 bg-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.08em] text-[#F2F0ED]/68"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(localIntensity || localLasting || longevityDisplay || sillageDisplay) && (
                      <div className="border-t border-white/[0.07] pt-5">
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          {localIntensity && (
                            <div className="border border-white/10 bg-black/25 px-3 py-2.5">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                                {t(siteCopy.product.presence)}
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed text-[#F2F0ED]/80">{localIntensity}</p>
                            </div>
                          )}
                          {localLasting && (
                            <div className="border border-white/10 bg-black/25 px-3 py-2.5">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                                {t(siteCopy.product.endurance)}
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed text-[#F2F0ED]/80">{localLasting}</p>
                            </div>
                          )}
                          {longevityDisplay ? (
                            <div className="border border-white/10 bg-black/25 px-3 py-2.5">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                                {t(siteCopy.product.longevity)}
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed text-[#F2F0ED]/80">{longevityDisplay}</p>
                            </div>
                          ) : null}
                          {sillageDisplay ? (
                            <div className="border border-white/10 bg-black/25 px-3 py-2.5">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                                {t(siteCopy.product.sillage)}
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed text-[#F2F0ED]/80">{sillageDisplay}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showFragranceStructureBlock && (
                <div className="min-w-0 border border-white/10 bg-black/[0.14] px-5 py-6 sm:px-6 sm:py-7">
                  <h2
                    className="text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {t(siteCopy.product.fragranceGroupStructure)}
                  </h2>
                  <div className="mt-5 space-y-6 border-t border-white/[0.08] pt-5">
                    {localAccords.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">
                          {t(siteCopy.product.accords)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {localAccords.map((accord) => (
                            <span
                              key={accord}
                              className="border border-white/14 bg-black/10 px-3 py-1 text-[11px] tracking-[0.06em] text-[#F2F0ED]/72"
                            >
                              {accord}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {showFragranceStylingBlock && (
              <div
                className={
                  showFragranceAtmosphereBlock || showFragranceStructureBlock
                    ? "mt-10 border-t border-white/10 pt-10 sm:mt-12 sm:pt-12"
                    : ""
                }
              >
                <h2
                  className="mb-5 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t(siteCopy.product.fragranceGroupStyling)}
                </h2>
                <div className="w-full border border-white/10 bg-black/[0.14] px-5 py-5 sm:px-6 sm:py-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/45">{t(siteCopy.product.pairing)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#F2F0ED]/78" style={{ fontFamily: "var(--font-sans)" }}>
                    {pairingForPdp}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4) Visual storytelling (textures) */}
      {showTextureGallerySection && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-10 sm:py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55 sm:mb-8" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.visualStorytelling)}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {textureImagesRemaining.map((image) => (
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

      {/* 5) Related scents / continuation section */}
      {!!relatedScentsResolved.length && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-10 sm:py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#F2F0ED]/55 sm:mb-8" style={{ fontFamily: "var(--font-sans)" }}>
              {t(siteCopy.product.continueScentStory)}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedScentsResolved.slice(0, 3).map(({ related, localId }) => {
                const lp = products.find((p) => p.id === localId);
                const localizedTitle = lp ? lp.name : related.title;
                const card = resolveStoryCardImage({
                  storyImage: asProductImage(related.storyImage),
                  featuredImage: asProductImage(related.image),
                  productName: localizedTitle,
                });

                if (import.meta.env.DEV) {
                  console.log("[ContinueTheScentStory] image", {
                    handle: related.handle,
                    title: related.title,
                    storyImage: related.storyImage?.url,
                    featuredImage: related.image?.url,
                    finalImage: card?.url ?? null,
                  });
                }

                const localizedIntro = coalesceMetaText(
                  related.storyIntro,
                  locale,
                  lp ? productDescriptor(lp, locale) : ""
                );
                const toPath = localizePath(ROUTES.product(localId));

                return (
                  <LocalizedLink
                    key={related.id}
                    to={toPath}
                    className="group border border-white/10 bg-black/20 transition hover:border-white/25"
                  >
                    <div className="aspect-[864/1184] w-full overflow-hidden bg-black/30">
                      {card ? (
                        <img
                          src={card.url}
                          alt={card.alt || `SWY ${localizedTitle} perfume`}
                          width={card.width || 864}
                          height={card.height || 1184}
                          className="h-full w-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          onError={hideImageOnError}
                        />
                      ) : null}
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