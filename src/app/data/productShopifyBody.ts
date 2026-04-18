/**
 * English product-page body copy when Shopify `product.description` is maintained in Chinese only.
 * Chinese PDP uses the live HTML description from the Storefront API (stripped to plain text).
 */
const EN: Record<string, string> = {
  "the-last-snow":
    "In a city where winter lingers half the year, the last snow fell on the day I graduated. The air was needle-bright, the sky a thin wash of pale, and the streets held a quiet that felt like permission—to close one chapter and let the next begin. This is a fragrance of endings that do not bruise: snowlight, a soft farewell, and the promise of something quietly opening beneath.",
  "the-first-rose":
    "Youth arrives with little ceremony but infinite conviction. All I could offer then was a single rose—the whole of what I owned, offered without strategy, only sincerity. This scent is that first blush: velvet petals, a held breath, the warmth of a beginning you can still feel in your hands long after the moment has passed.",
  "no-worries":
    "Some homes are not built from deeds but from borrowed light—the neighbor’s stairwell, citrus peel drying in the air, supper warmth through a door left ajar. It means no worries is that gentle belonging: lemon and herbs, the hush of a room that holds you without asking for proof. Wear it when you want to carry that unhurried safety wherever you go.",
  "old-library":
    "I learned longing between stacks—paper, oak, and the slow gold of afternoon light across spines that outlived every semester. The Old Library is dry paper and soft dust, ink that clings to the cuff, and the quiet company of sentences you are not ready to finish. A scholarly calm for minds that think slowly, with someone still in mind.",
  "mens-garage":
    "When the day’s obligations end, something truer begins: sawdust and leather, tools set down with care, the patience of hands that build what will last. The Men’s Garage is a corner that belongs only to you—grounded wood, peppered air, and the deep comfort of a space where ambition is worked into something real.",
  "im-rich":
    "Wealth is not always what the ledger says. Sometimes it is the first paycheck folded in your palm—the vow you make before anyone else agrees. I’m Rich is metal-bright confidence without a speech: cool clarity, self-possession, and the quiet knowledge that your worth began long before the numbers caught up.",
  "morning-after-quit":
    "The morning after I quit, the alarm never came. Sunlight moved across the sheets in a language I had forgotten how to read: unburdened, honest, mine. This is linen air and pale florals, relief without drama—the first breath in weeks that does not ask permission.",
  "night-was-mine":
    "The night I first tasted success, the room leaned in—rum and tobacco, low light, confidence that did not need to announce itself. The Night Was Mine is dark sweetness and unspoken agreement: a smile you owe no one, a trail that lingers like memory you choose to keep.",
};

export function productShopifyBodyEnglish(productId: string): string {
  return EN[productId]?.trim() ?? "";
}
