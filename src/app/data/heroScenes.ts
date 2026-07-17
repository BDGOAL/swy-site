import type { Bilingual } from "../lib/i18n";

/**
 * SWY immersive Hero — Phase 1 (static scene prototype).
 *
 * Asset slots only: final artwork is NOT generated in code. Drop production
 * images into `public/hero/` using the exact paths below. Until then the Hero
 * renders branded dark-gradient placeholders and hides the broken <img>.
 */

export type HeroAssetSlot = {
  /** Landscape composition, ~2560×1440 recommended. */
  desktop: string;
  /** Portrait composition, ~1170×2130 recommended. Subject inside central 70% safe zone. */
  mobile: string;
  /** Empty string = decorative (aria-hidden). */
  alt: Bilingual | null;
};

export const HERO_ASSETS = {
  surface: {
    desktop: "/hero/hero-surface-desktop.webp",
    mobile: "/hero/hero-surface-mobile.webp",
    alt: null,
  },
  underwater: {
    desktop: "/hero/hero-underwater-desktop.webp",
    mobile: "/hero/hero-underwater-mobile.webp",
    alt: null,
  },
  bottle: {
    desktop: "/hero/hero-bottle-desktop.webp",
    mobile: "/hero/hero-bottle-mobile.webp",
    alt: {
      en: "SWY eau de parfum bottle in deep water light",
      zh: "深水光影中的 SWY 淡香精瓶身",
    },
  },
  final: {
    desktop: "/hero/hero-final-desktop.webp",
    mobile: "/hero/hero-final-mobile.webp",
    alt: null,
  },
} satisfies Record<string, HeroAssetSlot>;

export type HeroFragment = {
  id: string;
  /** English catalog name (same in every locale). */
  name: string;
  caption: Bilingual;
  asset: HeroAssetSlot;
};

export const HERO_FRAGMENTS: HeroFragment[] = [
  {
    id: "the-last-snow",
    name: "The Last Snow",
    caption: {
      zh: "有些離開，正是下一段綻放的序章。",
      en: "Some departures are the beginning of what comes next.",
    },
    asset: {
      desktop: "/hero/story-last-snow-desktop.webp",
      mobile: "/hero/story-last-snow-mobile.webp",
      alt: { en: "The Last Snow — memory fragment", zh: "The Last Snow — 記憶片段" },
    },
  },
  {
    id: "the-first-rose",
    name: "The First Rose",
    caption: {
      zh: "有些心意，只在最初的一刻完整。",
      en: "Some feelings are whole only at the beginning.",
    },
    asset: {
      desktop: "/hero/story-first-rose-desktop.webp",
      mobile: "/hero/story-first-rose-mobile.webp",
      alt: { en: "The First Rose — memory fragment", zh: "The First Rose — 記憶片段" },
    },
  },
  {
    id: "no-worries",
    name: "It Means No Worries",
    caption: {
      zh: "有些地方，離開以後才叫做歸屬。",
      en: "Some places become home only after we leave.",
    },
    asset: {
      desktop: "/hero/story-no-worries-desktop.webp",
      mobile: "/hero/story-no-worries-mobile.webp",
      alt: { en: "It Means No Worries — memory fragment", zh: "It Means No Worries — 記憶片段" },
    },
  },
  {
    id: "night-was-mine",
    name: "The Night Was Mine",
    caption: {
      zh: "有些光芒，從來不需要高聲證明。",
      en: "Some light never needs to announce itself.",
    },
    asset: {
      desktop: "/hero/story-night-was-mine-desktop.webp",
      mobile: "/hero/story-night-was-mine-mobile.webp",
      alt: { en: "The Night Was Mine — memory fragment", zh: "The Night Was Mine — 記憶片段" },
    },
  },
];

export const HERO_COPY = {
  eyebrow: "SCENT WITH YOU",
  scene1Headline: {
    zh: "每一段記憶，\n都從氣味開始。",
    en: "Every memory\nbegins with a scent.",
  } satisfies Bilingual,
  scene2Line: {
    zh: "有些故事，\n沒有被說出口。",
    en: "Some stories\nwere never spoken.",
  } satisfies Bilingual,
  scene3Line: {
    zh: "我們把無處安放的故事，\n封存在每一滴香氣裡。",
    en: "We seal the stories\nthat had nowhere else to go.",
  } satisfies Bilingual,
  scene4Eyebrow: {
    zh: "記憶的碎片",
    en: "Fragments of Memory",
  } satisfies Bilingual,
  scene5Tagline: {
    zh: "用香氣記憶，以故事共鳴。\n讓你的氣味，開口說話。",
    en: "Tell Me Your Story.\nScent With You.",
  } satisfies Bilingual,
  scene5Cta: {
    zh: "探索香氣",
    en: "Explore the Collection",
  } satisfies Bilingual,
  transitionZh: "八段人生，八種與自己的對話。",
  transitionEn: "Eight scents. Eight conversations with the self.",
};
