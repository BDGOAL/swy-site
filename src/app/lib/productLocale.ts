import type { Product } from "../data/products";
import type { Bilingual, Locale } from "./i18n";

/** Han script — used to detect locale mismatch vs Shopify metafield strings. */
const HAN = /\p{Script=Han}/u;

/** True if the string contains Han characters (e.g. Chinese copy on an English PDP). */
export function textContainsHan(value: string | undefined | null): boolean {
  if (!value?.trim()) return false;
  return HAN.test(value);
}

/** Storefront API `LanguageCode` for `@inContext(language: …)`. */
export function shopifyStorefrontLanguageCode(
  locale: Locale
): "EN" | "ZH_TW" {
  return locale === "zh" ? "ZH_TW" : "EN";
}

/**
 * Prefer a Shopify metafield string when it plausibly matches the UI locale.
 * If Shopify returns only Chinese under English (or only English under Chinese with a Chinese fallback), use `fallback`.
 */
export function coalesceMetaText(
  metaValue: string | undefined | null,
  locale: Locale,
  fallback: string
): string {
  const m = metaValue?.trim() ?? "";
  if (!m) return fallback;
  const hasHan = HAN.test(m);
  const hasLatin = /[a-zA-Z]{2,}/.test(m);
  if (locale === "en") {
    if (hasHan && !hasLatin) return fallback;
    return m;
  }
  if (locale === "zh") {
    if (!hasHan && hasLatin && fallback && HAN.test(fallback)) return fallback;
    return m;
  }
  return m;
}

/** Same as `coalesceMetaText` but for a list (e.g. mood keywords, note lines). */
export function coalesceMetaStringList(
  metaList: string[] | undefined,
  locale: Locale,
  localFallback: string[]
): string[] {
  if (!metaList?.length) return localFallback;
  const joined = metaList.join(" ");
  const hasHan = HAN.test(joined);
  const hasLatin = /[a-zA-Z]{2,}/.test(joined);
  if (locale === "en" && hasHan && !hasLatin) return localFallback;
  if (
    locale === "zh" &&
    !hasHan &&
    hasLatin &&
    localFallback.length &&
    localFallback.some((s) => HAN.test(s))
  ) {
    return localFallback;
  }
  return metaList;
}

/**
 * Single-line PDP detail fields: English UI must not show CJK from Shopify (e.g. pairing with embedded Latin brand names).
 * Falls back to `fallback` when the metafield is empty or wrong script for the locale.
 */
export function pdpLocaleString(
  value: string | undefined | null,
  locale: Locale,
  fallback: string
): string {
  const m = value?.trim() ?? "";
  const fb = fallback.trim();
  if (!m) return fb;
  if (locale === "en") {
    if (HAN.test(m)) return fb;
    return m;
  }
  if (!HAN.test(m) && /[a-zA-Z]{2,}/.test(m) && fb && HAN.test(fb)) return fb;
  return m;
}

export function productPairingSuggestion(p: Product, locale: Locale): string {
  return pick(p.pairingSuggestion, locale);
}

function pick(b: Bilingual | undefined, locale: Locale): string {
  if (!b) return "";
  return b[locale];
}

/** English catalog name — same in every locale. */
export function productName(_p: Product, _locale?: Locale): string {
  return _p.name;
}

export function productDescriptor(p: Product, locale: Locale): string {
  return pick(p.descriptor, locale);
}

export function productShortStory(p: Product, locale: Locale): string {
  return pick(p.shortStory, locale);
}

export function productLongStory(p: Product, locale: Locale): string {
  return pick(p.longStory, locale);
}

export function productScentFamily(p: Product, locale: Locale): string {
  return pick(p.scentFamily, locale);
}

/** Normalize catalog mood tags to string[] — never throws; moodTags[locale] may be missing or wrong type. */
function normalizeMoodTagList(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : String(item)).trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    const t = value.trim();
    return t ? [t] : [];
  }
  return [];
}

export function productMoodTags(p: Product, locale: Locale): string[] {
  const raw = normalizeMoodTagList(p.moodTags?.[locale]);
  if (locale === "en") {
    return raw.filter((s) => !HAN.test(s));
  }
  return raw;
}

export function productAccords(p: Product, locale: Locale): string[] {
  return p.accords?.[locale] ?? [];
}

export function productImpression(p: Product, locale: Locale): string {
  return pick(p.impression, locale);
}

export function productWearMoment(p: Product, locale: Locale): string {
  return pick(p.wearMoment, locale);
}

export function productIntensity(p: Product, locale: Locale): string {
  return pick(p.intensity, locale);
}

export function productLasting(p: Product, locale: Locale): string {
  return pick(p.lasting, locale);
}

export function productNotesTop(p: Product, locale: Locale): string[] {
  return p.notes?.top?.[locale] ?? [];
}

export function productNotesHeart(p: Product, locale: Locale): string[] {
  return p.notes?.heart?.[locale] ?? [];
}

export function productNotesBase(p: Product, locale: Locale): string[] {
  return p.notes?.base?.[locale] ?? [];
}

/**
 * Format a Storefront API MoneyV2-style amount + ISO currency (e.g. HKD).
 * No currency conversion — uses Shopify values as-is. No USD default.
 */
export function formatShopifyMoney(
  amount: string | undefined,
  currencyCode: string | undefined,
  locale: Locale
): string {
  if (amount == null || currencyCode == null || currencyCode === "") return "";
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;
  try {
    return new Intl.NumberFormat(locale === "zh" ? "zh-Hant" : "en-HK", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode} ${amount}`;
  }
}

/** Static catalog fallback — requires both price and currency on the product row. */
export function productPriceDisplay(
  p: Product,
  locale: Locale,
  currencyCode?: string
): string {
  const cur = currencyCode ?? p.currency;
  if (p.price == null || cur == null || cur === "") return "";
  const value = Number(p.price);
  if (Number.isNaN(value)) return String(p.price);
  return new Intl.NumberFormat(locale === "zh" ? "zh-Hant" : "en-HK", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 2,
  }).format(value);
}

/** @deprecated Use productDescriptor */
export const productTagline = productDescriptor;

/** @deprecated Use productScentFamily */
export const productTheme = productScentFamily;

/** @deprecated Use productLongStory */
export const productStory = productLongStory;

/** Collapse Shopify HTML description to plain text for display. */
export function stripHtmlToText(html: string): string {
  if (!html?.trim()) return "";
  const withoutTags = html.replace(/<[^>]+>/g, " ");
  return withoutTags.replace(/\s+/g, " ").trim();
}
