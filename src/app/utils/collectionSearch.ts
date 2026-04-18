import { products, type Product } from "../data/products";
import {
  getLocalizedElevatorPitch,
  getSearchBoostForProductId,
} from "../data/collectionElevatorPitches";
import { BOTTLE_IMAGE } from "../data/bottleImage";
import type { Locale } from "../lib/i18n";
import {
  productDescriptor,
  productMoodTags,
  productName,
  productScentFamily,
} from "../lib/productLocale";

/** Collection card fields used for onsite search (matches CollectionGrid card shape). */
export type SearchableCollectionItem = {
  id: string;
  title: string;
  storyIntro: string;
  elevatorPitch: string;
  scentFamily: string;
  moodKeywords: string[];
  imageUrl: string;
  imageAlt: string;
};

export function normalizeSearchQuery(q: string): string {
  return q.trim().toLowerCase();
}

function buildCollectionSearchHaystack(item: SearchableCollectionItem): string {
  const local = products.find((p) => p.id === item.id);
  const parts = [
    item.id,
    item.title,
    local?.name,
    local?.descriptor.en,
    local?.descriptor.zh,
    local?.shortStory.en,
    local?.shortStory.zh,
    local?.scentFamily.en,
    local?.scentFamily.zh,
    local?.moodTags.en.join(" "),
    local?.moodTags.zh.join(" "),
    getLocalizedElevatorPitch(item.id, "en"),
    getLocalizedElevatorPitch(item.id, "zh"),
    item.elevatorPitch,
    item.storyIntro,
    item.scentFamily,
    item.moodKeywords.join(" "),
    getSearchBoostForProductId(item.id),
  ];
  return normalizeSearchQuery(parts.filter(Boolean).join(" "));
}

export function collectionItemMatchesQuery(
  item: SearchableCollectionItem,
  rawQuery: string
): boolean {
  const q = normalizeSearchQuery(rawQuery);
  if (!q) return true;
  const haystack = buildCollectionSearchHaystack(item);
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) return haystack.includes(q);
  return tokens.every((t) => haystack.includes(t));
}

export function filterCollectionItemsByQuery(
  items: SearchableCollectionItem[],
  rawQuery: string
): SearchableCollectionItem[] {
  const q = normalizeSearchQuery(rawQuery);
  if (!q) return [];
  return items.filter((item) => collectionItemMatchesQuery(item, rawQuery));
}

/** Mood chips: always from `products.ts` bilingual `moodTags`; never Shopify `mood_keywords` for display. */
function cardMoodKeywordsForLocale(
  item: SearchableCollectionItem,
  locale: Locale
): string[] {
  const p = products.find((pr) => pr.id === item.id);
  if (p) return productMoodTags(p, locale);
  if (locale === "en") return [];
  return item.moodKeywords;
}

/** Re-apply local bilingual catalog fields onto a card row (Shopify titles stay as fallback when no local match). */
export function localizeSearchableItem(
  item: SearchableCollectionItem,
  locale: Locale
): SearchableCollectionItem {
  const p = products.find((pr) => pr.id === item.id);
  if (!p) {
    return {
      ...item,
      moodKeywords: cardMoodKeywordsForLocale(item, locale),
    };
  }
  return {
    ...item,
    title: productName(p, locale),
    storyIntro: productDescriptor(p, locale),
    elevatorPitch: getLocalizedElevatorPitch(p.id, locale),
    scentFamily: productScentFamily(p, locale),
    moodKeywords: productMoodTags(p, locale),
    imageAlt: productName(p, locale),
  };
}

/** Local fallback row for search panel when catalog has not hydrated yet. */
export function getStaticSearchableItem(
  productId: string,
  locale: Locale = "en"
): SearchableCollectionItem | null {
  const p: Product | undefined = products.find((pr) => pr.id === productId);
  if (!p) return null;
  return {
    id: p.id,
    title: productName(p, locale),
    storyIntro: productDescriptor(p, locale),
    elevatorPitch: getLocalizedElevatorPitch(p.id, locale),
    scentFamily: productScentFamily(p, locale),
    moodKeywords: productMoodTags(p, locale),
    imageUrl: BOTTLE_IMAGE,
    imageAlt: productName(p, locale),
  };
}

export const SEARCH_NO_RESULT_FALLBACK_IDS = [
  "the-last-snow",
  "the-first-rose",
  "night-was-mine",
] as const;
