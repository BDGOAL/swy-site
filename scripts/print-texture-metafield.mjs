#!/usr/bin/env node
/**
 * Fetch raw Shopify Storefront texture metafields for a variant (same query shape as PDP).
 *
 * Usage:
 *   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com \
 *   VITE_SHOPIFY_STOREFRONT_TOKEN=xxx \
 *   node scripts/print-texture-metafield.mjs gid://shopify/ProductVariant/123456789
 *
 * Or load from a local .env file (not committed) if you export vars in shell first.
 */

const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = process.env.VITE_SHOPIFY_API_VERSION || "2026-01";
const variantId = process.argv[2];

if (!domain || !token || !variantId) {
  console.error(
    "Missing env VITE_SHOPIFY_STORE_DOMAIN / VITE_SHOPIFY_STOREFRONT_TOKEN or variant GID argument."
  );
  process.exit(1);
}

const query = `
  query TextureDebug($variantId: ID!) {
    node(id: $variantId) {
      ... on ProductVariant {
        id
        product {
          id
          handle
          title
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
                image { url altText }
                previewImage { url altText }
              }
              ... on GenericFile {
                url
                previewImage { url }
              }
              ... on Video {
                previewImage { url altText }
              }
            }
            references(first: 20) {
              nodes {
                __typename
                ... on MediaImage {
                  image { url altText }
                  previewImage { url altText }
                }
                ... on GenericFile {
                  url
                  previewImage { url }
                }
                ... on Video {
                  previewImage { url altText }
                }
              }
            }
          }
          textureImages: metafield(namespace: "custom", key: "texture_images") {
            type
            value
            references(first: 20) {
              nodes {
                __typename
                ... on MediaImage {
                  image { url altText }
                  previewImage { url altText }
                }
                ... on GenericFile {
                  url
                  previewImage { url }
                }
              }
            }
          }
          textureImageSingle: metafield(namespace: "custom", key: "texture_image") {
            type
            value
            reference {
              __typename
              ... on MediaImage {
                image { url altText }
                previewImage { url altText }
              }
              ... on GenericFile {
                url
                previewImage { url }
              }
            }
          }
        }
      }
    }
  }
`;

const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  },
  body: JSON.stringify({ query, variables: { variantId } }),
});

const body = await res.json();
console.log(JSON.stringify(body, null, 2));
if (!res.ok) process.exit(1);
if (body.errors?.length) process.exit(2);
