/**
 * Product HTML snapshots for search crawlers and social link unfurlers.
 * Runs AFTER vite build; keeps the original app and assets unchanged.
 * Product words are sourced from the actual TS catalog via Vite SSR transform.
 */
import { createServer } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.scentwithyou.com";
const DIST = path.resolve("dist");
const FALLBACK_IMAGE = ORIGIN + "/seo/swy-parfums-hong-kong-fragrance.jpg";
const template = await readFile(path.join(DIST, "index.html"), "utf8");
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
let products;
try {
  ({ products } = await vite.ssrLoadModule("/src/app/data/products.ts"));
} finally {
  await vite.close();
}

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const safeJson = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const metaName = (name, content) => '<meta name="' + escapeHtml(name) + '" content="' + escapeHtml(content) + '" />';
const metaProperty = (name, content) => '<meta property="' + escapeHtml(name) + '" content="' + escapeHtml(content) + '" />';
const alternate = (hreflang, href) => '<link rel="alternate" hreflang="' + hreflang + '" href="' + escapeHtml(href) + '" />';
const productPath = (p) => "/product/" + encodeURIComponent(p.id);
const productImages = {};

// Shopify Storefront (public token) is optional at build time.
// Only the actual official Shopify featuredImage is eligible as a product share image.
const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const SWY_SHOP = "swy-scent-with-you.myshopify.com";
if (domain && domain.toLowerCase() !== SWY_SHOP) {
  throw new Error("[SEO] Wrong Shopify store configured. Refusing non-SWY product image data.");
}
console.log("[SEO] Store domain:", domain === SWY_SHOP ? "SWY verified" : "not configured",
  "| Storefront access:", token ? "configured" : "missing");
if (domain && token && !domain.startsWith("YOUR_STORE") && !token.startsWith("<")) {
  try {
    const query = "query FeaturedProductImages { " + products.map((p, i) => 'p' + i + ': product(handle: ' + JSON.stringify(p.shopifyHandle || p.id) + ') { featuredImage { url altText } }').join(" ") + " }";
    const response = await fetch("https://" + domain + "/api/2026-01/graphql.json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error("Shopify Storefront HTTP " + response.status);
    const json = await response.json();
    if (json.errors?.length) throw new Error("Shopify Storefront image query returned GraphQL errors: " + json.errors.map(e => e.message).join("; "));
    console.log("[SEO] Shopify product matches:", products.filter((p,i) => Boolean(json.data?.["p"+i])).length, "of", products.length);
    for (let i = 0; i < products.length; i++) {
      const url = json.data?.["p" + i]?.featuredImage?.url;
      if (typeof url === "string" && new URL(url).protocol === "https:" && new URL(url).hostname === "cdn.shopify.com") {
        productImages[products[i].id] = url;
      }
    }
  } catch (error) {
    console.warn("[SEO] Official Shopify images unavailable; keep branded social share image.", String(error));
  }
} else {
  console.warn("[SEO] Storefront build credentials unavailable; product social images use branded fallback.");
}

function renderProduct(p, locale) {
  const baseUrl = ORIGIN + productPath(p);
  const canonical = baseUrl + (locale === "en" ? "?lang=en" : "");
  const title = p.name + " | SWY Parfums";
  const summary = String(p.shortStory[locale] || p.descriptor[locale]).trim();
  const description = (summary + " — " + p.name + ", a fragrance by SWY Parfums.").slice(0, 220);
  const image = productImages[p.id] || FALLBACK_IMAGE;
  const localeCode = locale === "zh" ? "zh_HK" : "en_HK";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": canonical + "#product",
    name: p.name,
    description: summary,
    url: canonical,
    brand: { "@type": "Brand", name: "SWY Parfums" },
    category: "Perfume",
    inLanguage: locale === "zh" ? "zh-HK" : "en",
  };
  if (productImages[p.id]) schema.image = [productImages[p.id]];
  const head = [
    metaName("description", description),
    '<link rel="canonical" href="' + escapeHtml(canonical) + '" />',
    alternate("zh-HK", baseUrl),
    alternate("en", baseUrl + "?lang=en"),
    alternate("x-default", baseUrl),
    metaProperty("og:type", "product"),
    metaProperty("og:site_name", "SWY Parfums"),
    metaProperty("og:title", title),
    metaProperty("og:description", description),
    metaProperty("og:url", canonical),
    metaProperty("og:image", image),
    metaProperty("og:locale", localeCode),
    metaProperty("og:locale:alternate", locale === "zh" ? "en_HK" : "zh_HK"),
    metaName("twitter:card", "summary_large_image"),
    metaName("twitter:title", title),
    metaName("twitter:description", description),
    metaName("twitter:image", image),
    '<script type="application/ld+json" id="swy-route-jsonld">' + safeJson(schema) + '</script>',
  ].join("\n    ");

  // Only remove the single-page home metadata, preserving organization data and Vite module scripts.
  return template
    .replace(/<html lang="[^"]*">/, '<html lang="' + (locale === "zh" ? "zh-HK" : "en") + '">')
    .replace(/<title>[\s\S]*?<\/title>/, "<title>" + escapeHtml(title) + "</title>")
    .replace(/<meta\s+(?:name|property)="(?:description|robots|og:type|og:site_name|og:title|og:description|og:url|og:image|og:image:alt|og:image:width|og:image:height|og:locale|og:locale:alternate|twitter:card|twitter:title|twitter:description|twitter:image|twitter:image:alt)"[\s\S]*?\/?>/g, "")
    .replace(/<link rel="canonical"[^>]*\/>/g, "")
    .replace("</head>", "    " + head + "\n  </head>");
}

let pages = 0;
for (const p of products) {
  if (!/^[a-z0-9-]+$/.test(p.id)) throw new Error("Unsafe product SEO path: " + p.id);
  for (const locale of ["zh", "en"]) {
    const dir = path.join(DIST, "seo", locale, "product");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, p.id + ".html"), renderProduct(p, locale));
    pages++;
  }
}
await mkdir(path.join(DIST, "seo"), { recursive: true });
await writeFile(path.join(DIST, "seo", "product-images.json"), JSON.stringify(productImages));
console.log("[SEO] generated " + pages + " product HTML snapshots for " + products.length + " products; " + Object.keys(productImages).length + " official Shopify OG images.");
