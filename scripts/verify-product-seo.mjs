import { readFile, access } from "node:fs/promises";
import path from "node:path";

/** Build gate for 8 product pages in both languages. */
const base = "https://www.scentwithyou.com";
const dist = path.resolve("dist");
// Read known catalog identifiers without starting a second Vite server, which can
// race against dependency scanning when a Vite SSR server closes after prerender.
const productSource = await readFile(path.resolve("src/app/data/products.ts"), "utf8");
const products = [...productSource.matchAll(/^\s+id:\s*"([a-z0-9-]+)",\s*\n\s+slug:\s*"[a-z0-9-]+",\s*\n\s+name:\s*"([^"]+)",/gm)]
  .map(match => ({ id: match[1], name: match[2] }));
if (products.length !== 8) throw new Error("Expected eight products in static catalog");
// Validate Vercel routing invariants in the same build that creates the snapshots.
// This verifies configuration and generated files, not the live HTTP response.
const vercel = JSON.parse(await readFile(path.resolve("vercel.json"), "utf8"));
const routes = vercel.rewrites || [];
const en = routes.findIndex(route => route.source === "/product/:id" && route.has?.some(c => c.type === "query" && c.key === "lang" && c.value === "en"));
const zh = routes.findIndex(route => route.source === "/product/:id" && !route.has?.length);
const fallback = routes.findIndex(route => route.source === "/(.*)");
const routeFailures = [];
if (en < 0 || zh < 0 || fallback < 0 || !(en < zh && zh < fallback)) {
  routeFailures.push("Product English route must precede Chinese default and SPA fallback");
}
if (routes[en]?.destination !== "/seo/en/product/:id.html") {
  routeFailures.push("English product route has the wrong prerender target");
}
if (routes[zh]?.destination !== "/seo/zh/product/:id.html") {
  routeFailures.push("Chinese product route has the wrong prerender target");
}
if (routes[fallback]?.destination !== "/index.html") {
  routeFailures.push("SPA fallback target changed unexpectedly");
}
const failures = [...routeFailures];
let verified = 0;
const check = (ok, msg) => { if (!ok) failures.push(msg); };
const attribute = (html, property) =>
  html.match(new RegExp('<meta property="' + property + '" content="([^"]*)"', 'i'))?.[1] || "";

for (const product of products) {
  for (const locale of ["zh", "en"]) {
    const file = path.join(dist, "seo", locale, "product", product.id + ".html");
    let html;
    try { html = await readFile(file, "utf8"); }
    catch { failures.push("Missing snapshot: " + file); continue; }
    verified++;
    const root = base + "/product/" + product.id;
    const canonical = root + (locale === "en" ? "?lang=en" : "");
    const title = product.name + " | SWY Parfums";
    const escapedTitle = title.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
    check(html.includes("<title>" + escapedTitle + "</title>"), file + ": title");
    check(html.includes('rel="canonical" href="' + canonical + '"'), file + ": canonical");
    check(html.includes('hreflang="zh-HK" href="' + root + '"'), file + ": Chinese alternate");
    check(html.includes('hreflang="en" href="' + root + '?lang=en"'), file + ": English alternate");
    check(html.includes('<html lang="' + (locale === "zh" ? "zh-HK" : "en") + '">'), file + ": html lang");
    check(attribute(html, "og:url") === canonical, file + ": og:url");
    check(attribute(html, "og:type") === "product", file + ": og:type");
    check(attribute(html, "og:title") === escapedTitle, file + ": og:title");
    check(Boolean(attribute(html, "og:description")), file + ": og:description");
    check(Boolean(attribute(html, "og:image")), file + ": og:image");
    const tag = html.match(/<script type="application\/ld\+json" id="swy-route-jsonld">([\s\S]*?)<\/script>/);
    try {
      const schema = JSON.parse(tag?.[1] || "");
      check(schema["@type"] === "Product" && schema.name === product.name && schema.url === canonical, file + ": JSON-LD schema");
    } catch { failures.push(file + ": invalid Product JSON-LD"); }
    check(html.includes('/assets/'), file + ": Vite assets");
  }
}
try { await access(path.join(dist, "seo", "product-images.json")); }
catch { failures.push("Missing official product-image manifest"); }
if (failures.length) {
  console.error("[SEO] FAIL " + failures.length + "\n" + failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("[SEO] PASS: " + verified + " bilingual product HTML snapshots verified.");
}
