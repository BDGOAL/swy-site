import { products } from "../data/products";
import { shopifyConfig } from "../config/shopify";
import {
  asProductImage,
  resolveProductCardImage,
} from "./productImages";

/** Card data for /collection — resolved card image + variant price from Shopify. */
export type BrowseCollectionFeatured = {
  /** Resolved card image: featuredImage only (absent from map when unavailable). */
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  /** Shopify field supplying the card image. */
  imageSource: "featuredImage";
  price?: { amount: string; currencyCode: string };
};

/**
 * Fetches featuredImage per local catalog id via variant GIDs.
 * Returns partial map; callers render dark card background when id is missing.
 */
export async function fetchBrowseCollectionFeaturedImages(): Promise<
  Record<string, BrowseCollectionFeatured>
> {
  const variantMap = new Map<string, string>();
  const variantIds = products
    .map((p) => {
      if (!p.shopifyVariantId) return null;
      variantMap.set(p.shopifyVariantId, p.id);
      return p.shopifyVariantId;
    })
    .filter(Boolean) as string[];

  if (!variantIds.length) return {};

  const query = `
    query BrowseCollectionFeaturedByVariantIds($variantIds: [ID!]!) {
      nodes(ids: $variantIds) {
        ... on ProductVariant {
          id
          price {
            amount
            currencyCode
          }
          product {
            featuredImage { url altText width height }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": shopifyConfig.storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables: { variantIds } }),
      }
    );

    if (!response.ok) return {};
    const data = await response.json();
    const nodes = data?.data?.nodes || [];
    const out: Record<string, BrowseCollectionFeatured> = {};

    for (const node of nodes) {
      const localId = variantMap.get(node?.id || "");
      if (!localId) continue;
      const localProduct = products.find((p) => p.id === localId);
      if (!localProduct) continue;

      const featuredImage = asProductImage(node?.product?.featuredImage);
      if (!featuredImage) continue;

      const resolved = resolveProductCardImage({
        featuredImage,
        productName: localProduct.name,
      });
      if (!resolved) continue;

      const amount = node?.price?.amount as string | undefined;
      const currencyCode = node?.price?.currencyCode as string | undefined;
      out[localId] = {
        url: resolved.url,
        alt: resolved.alt || `SWY ${localProduct.name} perfume`,
        width: resolved.width,
        height: resolved.height,
        imageSource: "featuredImage",
        ...(amount && currencyCode
          ? { price: { amount, currencyCode } }
          : {}),
      };
    }
    return out;
  } catch {
    return {};
  }
}
