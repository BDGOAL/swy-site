import type { Product } from "../data/products";
import type { Locale } from "../lib/i18n";

/**
 * SWY editorial discovery taxonomy.
 * Lives in the website: no new Shopify metafields or admin maintenance.
 * Each fragrance may belong to several story moods and scent families.
 */
export const STORY_MOODS = [
  { id: "first-love", en: "First Love", zh: "心動" },
  { id: "new-beginnings", en: "New Beginnings", zh: "重啟" },
  { id: "stillness", en: "Stillness", zh: "靜謐" },
  { id: "belonging", en: "Belonging", zh: "歸屬" },
  { id: "self-belief", en: "Self-Belief", zh: "自持" },
  { id: "after-dark", en: "After Dark", zh: "夜色" },
] as const;

export const SCENT_FAMILIES = [
  { id: "floral", en: "Floral", zh: "花香" },
  { id: "woody", en: "Woody", zh: "木質" },
  { id: "citrus", en: "Citrus", zh: "柑橘" },
  { id: "aromatic", en: "Aromatic", zh: "草本" },
  { id: "spicy", en: "Spicy", zh: "辛香" },
  { id: "amber-resin", en: "Amber & Resin", zh: "琥珀樹脂" },
  { id: "musk", en: "Musk", zh: "麝香" },
  { id: "leather", en: "Leather", zh: "皮革" },
] as const;

export type StoryMoodId = typeof STORY_MOODS[number]["id"];
export type ScentFamilyId = typeof SCENT_FAMILIES[number]["id"];
export type NoteLayer = "top" | "heart" | "base";

/** Curated category memberships based on the eight approved product stories and note pyramids. */
export const DISCOVERY_MEMBERSHIP: Record<string, {
  story: StoryMoodId[];
  families: ScentFamilyId[];
}> = {
  "the-last-snow": { story: ["new-beginnings", "stillness"], families: ["floral", "woody", "citrus"] },
  "the-first-rose": { story: ["first-love"], families: ["floral", "woody", "musk", "citrus"] },
  "no-worries": { story: ["belonging"], families: ["citrus", "aromatic", "spicy", "amber-resin"] },
  "old-library": { story: ["stillness"], families: ["woody", "aromatic", "amber-resin", "citrus"] },
  "mens-garage": { story: ["self-belief", "after-dark"], families: ["woody", "leather", "aromatic", "spicy"] },
  "im-rich": { story: ["self-belief"], families: ["spicy", "floral", "musk", "woody"] },
  "morning-after-quit": { story: ["new-beginnings", "stillness"], families: ["floral", "woody", "citrus"] },
  "night-was-mine": { story: ["after-dark"], families: ["spicy", "amber-resin", "woody", "musk"] },
};

export interface DiscoveryNote {
  id: string;
  en: string;
  zh: string;
}

/** Use the exact existing bilingual pyramid; no duplicate notes/ingredient copy. */
export function productDiscoveryNotes(product: Product, layer: NoteLayer): DiscoveryNote[] {
  const notes = product.notes?.[layer];
  if (!notes) return [];
  const english = notes.en ?? [];
  const chinese = notes.zh ?? [];
  return english.map((label, i) => ({
    id: label.trim().toLocaleLowerCase("en"),
    en: label,
    zh: chinese[i] || label,
  })).filter(note => Boolean(note.id));
}

export function discoveryNoteOptions(products: Product[], layer: NoteLayer, locale: Locale) {
  const available = new Map<string, DiscoveryNote & { count: number }>();
  for (const product of products) {
    const unique = new Set<string>();
    for (const note of productDiscoveryNotes(product, layer)) {
      if (unique.has(note.id)) continue;
      unique.add(note.id);
      const existing = available.get(note.id);
      if (existing) existing.count++;
      else available.set(note.id, { ...note, count: 1 });
    }
  }
  return [...available.values()].sort((a, b) =>
    (locale === "zh" ? a.zh.localeCompare(b.zh, "zh-Hant") : a.en.localeCompare(b.en, "en"))
  );
}
