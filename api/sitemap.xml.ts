const BASE_URL = "https://www.scentwithyou.com";

const STATIC_PATHS = ["/", "/collection", "/hero", "/contact", "/landing"] as const;

/** Keep in sync with `id` fields in `src/app/data/products.ts`. */
const PRODUCT_IDS = [
  "the-last-snow",
  "the-first-rose",
  "no-worries",
  "old-library",
  "mens-garage",
  "im-rich",
  "morning-after-quit",
  "night-was-mine",
] as const;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Chinese is the site default (no `lang` query). Sitemap lists canonical Chinese URLs. */
function makeUrl(pathname: string): string {
  const url = new URL(BASE_URL);
  url.pathname = pathname;
  return url.toString();
}

export default function handler(
  _req: unknown,
  res: {
    status: (code: number) => {
      setHeader: (key: string, value: string) => { end: (body: string) => void };
    };
  }
) {
  const locs = new Set<string>();

  for (const p of STATIC_PATHS) {
    locs.add(makeUrl(p));
  }

  for (const id of PRODUCT_IDS) {
    locs.add(makeUrl(`/product/${id}`));
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
