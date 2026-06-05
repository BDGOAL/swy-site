import { products } from "../src/app/data/products";

const BASE_URL = "https://www.scentwithyou.com";

const STATIC_PATHS = ["/", "/collection", "/hero", "/contact", "/landing"] as const;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function makeUrl(pathname: string): string {
  const url = new URL(BASE_URL);
  url.pathname = pathname;
  url.searchParams.set("lang", "zh");
  return url.toString();
}

export default function handler(req: { method?: string }, res: {
  status: (code: number) => { setHeader: (k: string, v: string) => { end: (body: string) => void } };
}) {
  const locs = new Set<string>();

  for (const p of STATIC_PATHS) {
    locs.add(makeUrl(p));
  }

  for (const p of products) {
    locs.add(makeUrl(`/product/${p.id}`));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(locs)
  .sort()
  .map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`)
  .join("\n")}
</urlset>`;

  res.status(200).setHeader("Content-Type", "application/xml; charset=utf-8").end(xml);
}
