import { products } from "../data/products";
import { shopifyConfig } from "../config/shopify";

/** Card data for /collection — featured image + variant price from Shopify (store currency, e.g. HKD). */
export type BrowseCollectionFeatured = {
  url: string;
  alt: string;
  price?: { amount: string; currencyCode: string };
};

/**
 * Fetches featuredImage per local catalog id via variant GIDs.
 * Returns partial map; callers should fall back to a placeholder when id is missing.
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
            featuredImage { url altText }
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
      const url = node?.product?.featuredImage?.url as string | undefined;
      if (!localId || !url) continue;
      const amount = node?.price?.amount as string | undefined;
      const currencyCode = node?.price?.currencyCode as string | undefined;
      out[localId] = {
        url,
        alt: (node?.product?.featuredImage?.altText as string | undefined) || "",
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
