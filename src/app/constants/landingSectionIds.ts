/**
 * Single source of truth for in-page section anchors on the landing route (/).
 * Use these for `id` attributes and hash links so targets stay stable when copy or order changes.
 *
 * Scroll offset for these ids is centralized in `theme.css` via `.landing-scroll-target` and
 * `--landing-anchor-scroll-margin` (tuned to the fixed header in NavigationArchive).
 */
export const SECTION_IDS = {
  archive: "archive",
  brandDna: "brand-dna",
  brandVision: "brand-vision",
  acetateReveal: "acetate-reveal",
  /** Narrative block after the collection: brand definition + vision */
  storyContinue: "story-continue",
  conversion: "conversion",
  /** Footer / contact destination on the landing route */
  siteFooter: "contact",
} as const;

export type LandingSectionKey = keyof typeof SECTION_IDS;

/** React Router `to` value for a landing in-page target, e.g. `/#archive`. */
export function toLandingHash(key: LandingSectionKey): string {
  return `/#${SECTION_IDS[key]}`;
}
