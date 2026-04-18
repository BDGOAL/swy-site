export type Locale = "en" | "zh";

export type Bilingual = { en: string; zh: string };

export function pickLocale(b: Bilingual, locale: Locale): string {
  return b[locale];
}

/**
 * Preserves hash and merges `lang` query for Traditional Chinese.
 * Example: withLangPath("/#story-continue", "zh") -> "/?lang=zh#story-continue"
 */
export function withLangPath(path: string, locale: Locale): string {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const qIndex = beforeHash.indexOf("?");
  const pathname = qIndex >= 0 ? beforeHash.slice(0, qIndex) : beforeHash;
  const query = qIndex >= 0 ? beforeHash.slice(qIndex + 1) : "";
  const params = new URLSearchParams(query);
  if (locale === "zh") params.set("lang", "zh");
  else params.delete("lang");
  const qs = params.toString();
  const base = qs ? `${pathname}?${qs}` : pathname;
  return `${base}${hash}`;
}

export function localeFromSearchParams(lang: string | null): Locale {
  if (lang === "zh" || lang === "zh-TW" || lang === "zh-HK") return "zh";
  return "en";
}
