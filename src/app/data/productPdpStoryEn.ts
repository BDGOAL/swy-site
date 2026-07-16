/**
 * English PDP copy for `story_intro` and `story_body` when Shopify stores Chinese-only
 * or Storefront `@inContext(EN)` returns empty metafields.
 */

export const PDP_STORY_INTRO_EN: Record<string, string> = {
  "the-last-snow": `The winter we left wore on, long and deliberately hollowed, as if to squander the very last of our youth. Dawn slices through the window grilles, pinning shadows to an empty desk, while the air holds the quiet, loamy chill of dissolving drifts and naked wood.

Before crossing the threshold, he pauses—one hand grounding the final button of his coat—and draws the room deep into his lungs.`,
  "the-first-rose": `At the twilight of shifting youth, with only a fading coal of warmth left in the pocket, a solitary rose is offered—a quiet currency for an untamed innocence.

It never broke into full opulence; it never learned to shout. Yet its architecture carries the briefest, unguardable tremor of bashful youth, like the wet skin of a bruised peach grazing against a tender petal, whispering of spring by a quiet window.

In that young palm, a single bud guards the raw gravity of an unsaid heart.`,
  "no-worries": `In childhood, happiness had narrow boundaries, small enough to fit into the sun-drenched corridor of an old building.

Names were etched crookedly into the wooden walls; the air hung heavy with the bitter, sun-baked rind of citrus drying on the roof, and the punctual, domestic smoke of evening meals leaking from wooden cracks at dusk.

The boy chasing shadows in worn sneakers back then never knew that these ordinary fragments would become his final fortress when the adult world began to demand its price.`,
  "old-library": `The formative green of youth was left behind in the chambers of that old library.

Slanted afternoon sunrays slice through heavy, weathered wooden shelves. The atmosphere is a dry tapestry woven of paper, ink, and ancient timber—the whispered confidences of our younger days. Tremors of the heart, quiet alliances, and towering ambitions ferment slowly in this study.`,
  "mens-garage": `There comes a year when you realize the soul does not hunger for the neon noise of the crowd, but for a sovereign pocket of space—a sanctuary under your own command.

It matters little if it is a midnight garage thick with oil, a dawn workshop under a single naked bulb, or a quiet kitchen at home.

You shut the doors against the world, leaving only a cold glow and the low, heavy rhythm of tools meeting iron.`,
  "im-rich": `Before the morning mirror, while the steam is still tracing its slow blur across the glass, the daily interrogation begins: Are you chasing numbers, or the version of yourself that cannot be erased?

This scent is a manifesto for the isolated and the unyielding—an understanding that before the world counts your wealth, the soul must already be as heavy as the sea.`,
  "morning-after-quit": `To wake for the first time into a morning that asks nothing of you.

No alarm to startle the pillow, no corporate buzz in the pocket, no fragments of the soul traded away for metrics. Sunlight cuts quietly through the screen, throwing golden geometry across the floor and warming the cool linen sheets.

The air contains only the total liberty to breathe and exist. Lying there, shed of titles and imposed armor, it feels like an overdue reconciliation with the self.`,
  "night-was-mine": `The neon ignites. Outside, the crowd moves in a frantic blur, each soul desperate to sell their identity to the city.

He sits undisturbed in the deep shadow of a dark leather chair, letting the dark swallow him whole. Dry tobacco and rum notes intersect with weightless precision. Looking back through this veil of spirits, past memories appear behind a sheet of frosted glass—completely cooled down.

“The tallest tree catches the wind; the wise guard their silence.”`,
};

export const PDP_STORY_BODY_EN: Record<string, string> = {
  "the-last-snow": `First, a sudden, near-sacrilegious flash of orange cuts the frost—the sharp laughter of eighteen running reckless down the hall. Then, the linen-white grace of freesia and lily of the valley settles into the chest, bearing the pale, necessary ache of growing up. Finally, it all descends into the immense, stone-quiet weight of patchouli, cashmere wood and white cedarwood.

The world outside the shelter is vast and feral, but looking down at this unwritten page in his palm, the boy’s stride is absolute.

This cold clarity refuses to look back.
This white belongs to the morning after.`,
  "the-first-rose": `Draw it in, and peach, bergamot and peony lift the curtain with wild, uncalculated life. Then, rose, jasmine and violet drift forward in slow, syncopated measures, charting the secret friction of velvet meeting velvet. Finally, cedarwood, patchouli and musk lock the memory in perpetual stillness.

Love moves too fast in the outer world, but here, one frame is frozen forever in that single, clumsy spring breeze.

This fragrance boasts for no one.
This rose is the origin.`,
  "no-worries": `One breath, and lemon, bergamot and cardamom strike a match in the dark. Sage, jasmine, lavender and clove weave through the air, like calloused hands rubbing warmth into weathered timber. Finally, labdanum, amber, moss, patchouli and frankincense solidify the architecture of evening.

The city shifts too fast to catch its sleeve, but whenever this scent rises, the soul is instantly home.`,
  "old-library": `Orange and rosemary dissolve into a crisp tang, like a breath of wind upon throwing open heavy doors. Then, oud and geranium rise from the turning pages, carrying the intellectual weight of rare volumes, freezing the resolutions of yesterday. Finally, amber and vetiver settle into an absolute hush.

Rather than drowning in the chaotic noise of adulthood, one returns to this suspended hour to reclaim the self.

The neon outside shifts constantly, but youth remains unaging here.
This stroke of ink belongs to growth.`,
  "mens-garage": `Basil and black pepper slice through the dark, setting a focused defensive perimeter. Then, leather, lavender and thyme unfold with warm, bitter weight—the heavy comfort of sinking into an old sofa after a brutal journey. Finally, vetiver and patchouli compress the night into something honest and unvarnished.

No grandeur, only grit. Here, ambitions and unspoken weights land peacefully.

This is the quiet romance of a mature man.`,
  "im-rich": `Cardamom and pepper strike a focused outline, piercing the mist with near-obsessive clarity. Then, metallic aldehydes and gold orange blossom expand with a cold, luminous flash—not hollow display, but the quiet, devastating confidence of a soul that knows it has already arrived. Finally, silver musk and cedarwood anchor the gravity into an unshakeable inner peace.

Long before the numbers change, the winning card has already been dealt in the quiet reflection of your eyes.

You are your own asset.
This ambition contains the infinite.`,
  "morning-after-quit": `A fresh wind of bergamot and lilac lifts the curtain. Clean white linen fills the room with the quiet relaxation of fresh soap. Finally, cedarwood and sandalwood secure the serene, lingering echo.

This silence, remaining after the noise fades, is where actual life begins.

This awakening belongs to freedom.`,
  "night-was-mine": `Black pepper and elemi slice through the initial dark with sharp focus. Then, amber, heliotrope, and rum unfold into a warm core. Finally, vetiver, musk, and tobacco compress the night into something profoundly low-key and unshakeable.

The moment you cease trying to prove anything to the world, you become untamable.

The chaos outside continues, but it no longer concerns him.
The night was mine.`,
};

export function productPdpStoryIntroEn(productId: string): string {
  return PDP_STORY_INTRO_EN[productId]?.trim() ?? "";
}

export function productPdpStoryBodyEn(productId: string): string {
  return PDP_STORY_BODY_EN[productId]?.trim() ?? "";
}
