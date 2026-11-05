import { useEffect } from "react";
import { useLocation } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { products } from "../data/products";

const ORIGIN = "https://www.scentwithyou.com";
const DEFAULT_OG = ORIGIN + "/seo/swy-parfums-hong-kong-fragrance.jpg";
const BRAND = "SWY Parfums | Scent With You";
const ROOT_DESCRIPTION = "SWY Parfums is a Hong Kong fragrance house where scent preserves memory and every perfume begins with a story.";

function setMeta(attribute: "name" | "property", key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = value;
}

/** Keep URL metadata in one place instead of inheriting the homepage canonical across PDP routes. */
export function SiteSeo() {
  const location = useLocation();
  const { locale } = useLanguage();

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    const id = path.startsWith("/product/") ? decodeURIComponent(path.slice("/product/".length)) : "";
    const product = products.find(p => p.id === id);
    const isProduct = Boolean(product);
    const title = product ? `${product.name} | SWY Parfums` :
      path === "/collection" ? (locale === "zh" ? "香氣選集 | SWY Parfums" : "Fragrance Collection | SWY Parfums") :
      path === "/contact" ? (locale === "zh" ? "聯絡我們 | SWY Parfums" : "Contact | SWY Parfums") : BRAND;
    const description = product
      ? `${product.shortStory[locale]} — ${product.name}, a fragrance by SWY Parfums.`.slice(0, 220)
      : path === "/collection"
        ? (locale === "zh" ? "從情緒、回憶和人生片段出發，探索 SWY 香氣選集。每支香水，都有一段值得被聽見的故事。" : "Explore fragrances inspired by memories, emotions and lived stories. Discover the SWY Parfums collection.")
        : ROOT_DESCRIPTION;

    // Internal /hero and /landing are alternate homepage entry points, not canonical landing pages.
    const canonicalPath = path === "/hero" || path === "/landing" ? "/" : path;
    const baseUrl = ORIGIN + canonicalPath;
    const canonical = baseUrl + (locale === "en" ? "?lang=en" : "");
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", isProduct ? "product" : "website");
    setMeta("property", "og:locale", locale === "zh" ? "zh_HK" : "en_HK");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:card", "summary_large_image");
    // Preserve verified official Shopify share imagery from server-rendered HTML.
    // The manifest also keeps image data in sync when navigating between PDP routes.
    const applyImage = (url: string) => {
      setMeta("property", "og:image", url);
      setMeta("name", "twitter:image", url);
    };
    let verifiedImage: string | undefined;
    try {
      const initialSchema = document.getElementById("swy-route-jsonld")?.textContent;
      const snapshot = initialSchema ? JSON.parse(initialSchema) as { "@id"?: string; image?: string[] } : null;
      if (snapshot?.["@id"] === canonical + "#product" && Array.isArray(snapshot.image)) {
        verifiedImage = snapshot.image[0];
      }
    } catch { /* No server snapshot available for this navigation. */ }
    applyImage(verifiedImage || DEFAULT_OG);
    let cancelled = false;
    if (product) {
      fetch("/seo/product-images.json")
        .then(response => response.ok ? response.json() : {})
        .then((images: Record<string, unknown>) => {
          if (cancelled) return;
          const image = images[product.id];
          if (typeof image !== "string" || !image.startsWith("https://")) return;
          applyImage(image);
          const script = document.getElementById("swy-route-jsonld");
          if (script?.textContent) {
            const data = JSON.parse(script.textContent) as Record<string, unknown>;
            if (data["@id"] === canonical + "#product") {
              data.image = [image];
              script.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
            }
          }
        })
        .catch(() => { /* Branded preview is a safe fallback. */ });
    }

    const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = canonical;

    for (const lang of ["zh-HK", "en"] as const) {
      let alternate = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!alternate) {
        alternate = document.createElement("link");
        alternate.rel = "alternate";
        alternate.hreflang = lang;
        document.head.appendChild(alternate);
      }
      alternate.href = baseUrl + (lang === "en" ? "?lang=en" : "");
    }
    let defaultAlternate = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]');
    if (!defaultAlternate) {
      defaultAlternate = document.createElement("link");
      defaultAlternate.rel = "alternate";
      defaultAlternate.hreflang = "x-default";
      document.head.appendChild(defaultAlternate);
    }
    defaultAlternate.href = baseUrl;

    const seoScriptId = "swy-route-jsonld";
    let script = document.getElementById(seoScriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = seoScriptId;
      document.head.appendChild(script);
    }
    if (product) {
      // No fabricated stock/availability/rating claims; Shopify remains the source of truth.
      const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": canonical + "#product",
        name: product.name,
        description: product.shortStory[locale],
        url: canonical,
        brand: { "@type": "Brand", name: "SWY Parfums" },
        category: "Perfume",
        inLanguage: locale === "zh" ? "zh-HK" : "en",
      };
      script.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
    } else {
      script.textContent = "";
    }
    return () => { cancelled = true; };
  }, [location.pathname, locale]);

  return null;
}
