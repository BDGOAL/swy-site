/**
 * English PDP copy for `story_intro` and `story_body` when Shopify stores Chinese-only
 * or Storefront `@inContext(EN)` returns empty metafields.
 * Chinese PDP uses live Shopify `story_intro` / `story_body` (with shop-default-language fallback fetch).
 */

export const PDP_STORY_INTRO_EN: Record<string, string> = {
  "the-last-snow":
    "A quiet city, half a year of winter — the last snow fell on the day you closed one chapter and let the next begin.",
  "the-first-rose":
    "When all you owned was a single rose, sincerity was the whole of the gift — youth’s first blush, held in the hand.",
  "no-worries":
    "Borrowed light from a neighbour’s stairwell — lemon peel, herbs, and the warmth of a door left ajar.",
  "old-library":
    "Between oak shelves and dry paper, longing learned to read slowly — ink, dust, and light across spines that outlived the term.",
  "mens-garage":
    "When the day ends, the bench is yours: sawdust, leather, and the patience of hands that build what lasts.",
  "im-rich":
    "The first paycheck folded in your palm — wealth as a vow you make to yourself before the world agrees.",
  "morning-after-quit":
    "No alarm, only linen light across the sheets — the first morning that belongs to you again.",
  "night-was-mine":
    "Rum, tobacco, low light — a room that leans in when confidence needs no announcement.",
};

export const PDP_STORY_BODY_EN: Record<string, string> = {
  "the-last-snow":
    "In a city where winter lingers half the year, the last snow arrived with graduation — air needle-bright, streets washed quiet in white. This scent holds that soft ending: a farewell that does not bruise, and room for what opens next.",
  "the-first-rose":
    "Youth arrives with little ceremony but infinite conviction. All you could offer then was one rose — the whole of what you owned, without strategy, only sincerity. Velvet petals, a held breath: the warmth of a beginning you still feel in your hands.",
  "no-worries":
    "Some belonging is borrowed — citrus on the stairwell, supper warmth through an open door, laughter that asks nothing of you. Lemon, herbs, and the hush of a room that feels like home even when the lease is someone else’s.",
  "old-library":
    "You learned longing between stacks — paper, oak, the slow gold of afternoon on spines. Dry dust, ink at the cuff, sentences you were not ready to finish. A scholarly calm for minds that think slowly, with someone still in mind.",
  "mens-garage":
    "When duty clocks out, the garage becomes yours: grounded wood, peppered air, tools set down with care. Leather and sawdust — the comfort of a corner where ambition is worked into something real, and the world stays outside.",
  "im-rich":
    "The ledger is not the whole story. Sometimes richness is the first paycheck — metal-bright clarity, self-possession, the quiet knowledge that your worth began before the numbers caught up. Cool confidence without a speech.",
  "morning-after-quit":
    "The morning after you quit, silence was the alarm. Sunlight moved across the sheets in a language you had forgotten: unburdened, honest, yours. Linen air, pale florals — relief without drama, the first honest breath in weeks.",
  "night-was-mine":
    "The night you first tasted success, the room leaned in — rum and tobacco, smoke and low light. Dark sweetness, unspoken agreement: a smile you owe no one, a trail that lingers like a memory you choose to keep.",
};

export function productPdpStoryIntroEn(productId: string): string {
  return PDP_STORY_INTRO_EN[productId]?.trim() ?? "";
}

export function productPdpStoryBodyEn(productId: string): string {
  return PDP_STORY_BODY_EN[productId]?.trim() ?? "";
}
