export type Locale = "en" | "zh";

export type Bilingual = { en: string; zh: string };

export function pickLocale(b: Bilingual, locale: Locale): string {
  return b[locale];
}

/**
 * Preserves hash and merges `lang` for English.
 * Traditional Chinese is the site default (no `lang` query).
 * Example: withLangPath("/#story-continue", "zh") -> "/#story-continue"
 * Example: withLangPath("/collection", "en") -> "/collection?lang=en"
 */
export function withLangPath(path: string, locale: Locale): string {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const qIndex = beforeHash.indexOf("?");
  const pathname = qIndex >= 0 ? beforeHash.slice(0, qIndex) : beforeHash;
  const query = qIndex >= 0 ? beforeHash.slice(qIndex + 1) : "";
  const params = new URLSearchParams(query);
  if (locale === "en") params.set("lang", "en");
  else params.delete("lang");
  const qs = params.toString();
  const base = qs ? `${pathname}?${qs}` : pathname;
  return `${base}${hash}`;
}

/**
 * Resolve UI locale from `?lang=`.
 * - missing / unknown => zh (Traditional Chinese default)
 * - en => en
 * - zh / zh-HK / zh-TW => zh
 */
export function localeFromSearchParams(lang: string | null): Locale {
  if (!lang) return "zh";
  const normalized = lang.trim().toLowerCase().replace(/_/g, "-");
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  if (
    normalized === "zh" ||
    normalized === "zh-hk" ||
    normalized === "zh-tw" ||
    normalized.startsWith("zh-")
  ) {
    return "zh";
  }
  return "zh";
}

/** HTML `lang` attribute values for the active UI locale. */
export function htmlLangForLocale(locale: Locale): string {
  return locale === "zh" ? "zh-HK" : "en";
}
