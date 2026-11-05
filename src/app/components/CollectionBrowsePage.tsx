import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { siteCopy } from "../content/siteCopy";
import { products, type Product } from "../data/products";
import { hideImageOnError } from "../lib/productImages";
import { useLanguage } from "../context/LanguageContext";
import { ROUTES } from "../constants/routes";
import { getLocalizedElevatorPitch } from "../data/collectionElevatorPitches";
import {
  formatShopifyMoney,
  productName,
  productPriceDisplay,
  productTagline,
  productTheme,
} from "../lib/productLocale";
import {
  fetchBrowseCollectionFeaturedImages,
  type BrowseCollectionFeatured,
} from "../lib/shopifyBrowseCollectionImages";
import { ArchiveFooter } from "./ArchiveFooter";
import {
  STORY_MOODS, SCENT_FAMILIES, DISCOVERY_MEMBERSHIP,
  discoveryNoteOptions, productDiscoveryNotes,
  type StoryMoodId, type ScentFamilyId, type NoteLayer,
} from "../data/scentDiscovery";

type DiscoveryMode = "story" | "family" | "notes";

export function CollectionBrowsePage() {
  const { t, locale, localizePath } = useLanguage();
  const [mode, setMode] = useState<DiscoveryMode>("story");
  const [storyMood, setStoryMood] = useState<StoryMoodId | "all">("all");
  const [scentFamily, setScentFamily] = useState<ScentFamilyId | "all">("all");
  const [noteLayer, setNoteLayer] = useState<NoteLayer>("top");
  const [noteId, setNoteId] = useState("all");
  const [featuredById, setFeaturedById] = useState<Record<string, BrowseCollectionFeatured>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = await fetchBrowseCollectionFeaturedImages();
      if (!cancelled) setFeaturedById(map);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const themes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(productTheme(p, locale)));
    return Array.from(set).sort();
  }, [locale]);

  const noteOptions = useMemo(
    () => discoveryNoteOptions(products, noteLayer, locale),
    [noteLayer, locale]
  );

  const filtered = useMemo(() => products.filter((p) => {
    if (mode === "story") {
      return storyMood === "all" || (DISCOVERY_MEMBERSHIP[p.id]?.story.includes(storyMood) ?? false);
    }
    if (mode === "family") {
      return scentFamily === "all" || (DISCOVERY_MEMBERSHIP[p.id]?.families.includes(scentFamily) ?? false);
    }
    return noteId === "all" || productDiscoveryNotes(p, noteLayer).some(note => note.id === noteId);
  }), [mode, storyMood, scentFamily, noteLayer, noteId]);

  const storyCount = (id: StoryMoodId) =>
    products.filter(p => DISCOVERY_MEMBERSHIP[p.id]?.story.includes(id)).length;
  const familyCount = (id: ScentFamilyId) =>
    products.filter(p => DISCOVERY_MEMBERSHIP[p.id]?.families.includes(id)).length;
  const optionClass = (active: boolean) =>
    `inline-flex min-h-[44px] items-center gap-2 border px-3.5 py-2 text-[11px] tracking-[0.1em] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/45 ${active
      ? "border-[#F2F0ED]/45 bg-white/[0.08] text-[#F2F0ED]"
      : "border-white/10 bg-black/20 text-[#F2F0ED]/55 hover:border-white/25 hover:text-[#F2F0ED]/85"}`;
  const selectedNote = noteOptions.find(note => note.id === noteId);

  return (
    <div className="relative w-full" style={{ backgroundColor: "#0A0E14" }}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              #0A0E14 0%,
              #090B10 45%,
              #080910 100%
            )`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background: `radial-gradient(ellipse 120% 70% at 50% -15%, rgba(18, 22, 30, 0.55) 20%, transparent 72%)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-16 pt-28 sm:px-8 md:px-14 md:pb-24 md:pt-32">
        <header className="max-w-2xl">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-[#F2F0ED]/42"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t(siteCopy.collectionPage.introEyebrow)}
          </p>
          <h1
            className="mt-4 text-3xl font-normal leading-tight tracking-[0.02em] text-[#F2F0ED] sm:text-4xl md:text-[2.35rem]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t(siteCopy.collectionPage.introTitle)}
          </h1>
          <p
            className="mt-6 max-w-xl text-[0.9375rem] leading-[1.75] text-[#F2F0ED]/62"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t(siteCopy.collectionPage.introBody)}
          </p>
        </header>

        <section aria-label={locale === "zh" ? "香氣探索篩選" : "Scent discovery filters"}
          className="mt-12 border-t border-white/[0.07] pt-9">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#F2F0ED]/40">
            SCENT DISCOVERY / {locale === "zh" ? "探索香氣" : "EXPLORE"}
          </p>
          <div role="tablist" aria-label={locale === "zh" ? "選香方式" : "Discovery method"}
            className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-b border-white/[0.08]">
            {([
              { id: "story", zh: "故事氛圍", en: "By Story" },
              { id: "family", zh: "香氣家族", en: "By Family" },
              { id: "notes", zh: "香調金字塔", en: "By Notes" },
            ] as const).map(tab => (
              <button key={tab.id} type="button" role="tab" id={`swy-discovery-${tab.id}`}
                aria-selected={mode === tab.id} aria-controls="swy-discovery-panel"
                onClick={() => setMode(tab.id)}
                className={`min-h-[44px] border-b px-1 pb-3 pt-2 text-[12px] tracking-[0.06em] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${mode === tab.id
                  ? "border-[#F2F0ED]/75 text-[#F2F0ED]"
                  : "border-transparent text-[#F2F0ED]/45 hover:text-[#F2F0ED]/80"}`}>
                {locale === "zh" ? tab.zh : tab.en}
              </button>
            ))}
          </div>

          <div id="swy-discovery-panel" role="tabpanel" aria-labelledby={`swy-discovery-${mode}`} className="pt-6">
            {mode === "story" && (
              <>
                <p className="mb-4 max-w-xl text-[12px] leading-relaxed text-[#F2F0ED]/55">
                  {locale === "zh" ? "由人生片段出發，尋找與此刻心情共鳴的香氣。" : "Find a fragrance through the feelings and moments you remember."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={optionClass(storyMood === "all")}
                    aria-pressed={storyMood === "all"} onClick={() => setStoryMood("all")}>
                    {locale === "zh" ? "全部" : "All"}
                    <span className="text-[10px] tabular-nums opacity-60">{products.length}</span>
                  </button>
                  {STORY_MOODS.map(item => (
                    <button key={item.id} type="button" aria-pressed={storyMood === item.id}
                      className={optionClass(storyMood === item.id)} onClick={() => setStoryMood(item.id)}>
                      {item[locale]}
                      <span className="text-[10px] tabular-nums opacity-60">{storyCount(item.id)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {mode === "family" && (
              <>
                <p className="mb-4 max-w-xl text-[12px] leading-relaxed text-[#F2F0ED]/55">
                  {locale === "zh" ? "按香氣家族，探索你熟悉或尚未遇見的氣味。" : "Explore familiar notes and discover new scent families."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={optionClass(scentFamily === "all")}
                    aria-pressed={scentFamily === "all"} onClick={() => setScentFamily("all")}>
                    {locale === "zh" ? "全部" : "All"}
                    <span className="text-[10px] tabular-nums opacity-60">{products.length}</span>
                  </button>
                  {SCENT_FAMILIES.map(item => (
                    <button key={item.id} type="button" aria-pressed={scentFamily === item.id}
                      className={optionClass(scentFamily === item.id)} onClick={() => setScentFamily(item.id)}>
                      {item[locale]}
                      <span className="text-[10px] tabular-nums opacity-60">{familyCount(item.id)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {mode === "notes" && (
              <>
                <p className="mb-4 max-w-xl text-[12px] leading-relaxed text-[#F2F0ED]/55">
                  {locale === "zh" ? "從前調、心調到後調，按實際香材尋找故事。" : "Browse the actual top, heart and base notes in every scent."}
                </p>
                <div role="group" aria-label={locale === "zh" ? "香調層次" : "Note pyramid layer"} className="flex flex-wrap gap-2">
                  {([
                    { id: "top", zh: "前調", en: "Top Notes" },
                    { id: "heart", zh: "心調", en: "Heart Notes" },
                    { id: "base", zh: "後調", en: "Base Notes" },
                  ] as const).map(layer => (
                    <button key={layer.id} type="button" className={optionClass(noteLayer === layer.id)}
                      aria-pressed={noteLayer === layer.id} onClick={() => { setNoteLayer(layer.id); setNoteId("all"); }}>
                      {locale === "zh" ? layer.zh : layer.en}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex max-w-lg flex-col gap-2">
                  <label htmlFor="swy-note-select" className="text-[10px] uppercase tracking-[0.18em] text-[#F2F0ED]/52">
                    {locale === "zh" ? "選擇香材" : "Select a note"}
                  </label>
                  <select id="swy-note-select" value={noteId} onChange={event => setNoteId(event.target.value)}
                    className="min-h-[48px] w-full border border-white/20 bg-[#121820] px-3 py-2 text-[13px] text-[#F2F0ED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50">
                    <option value="all">{locale === "zh" ? "全部香材" : "All Notes"}</option>
                    {noteOptions.map(note => (
                      <option key={note.id} value={note.id}>
                        {note[locale]} ({note.count})
                      </option>
                    ))}
                  </select>
                  {selectedNote && (
                    <p className="text-[11px] leading-relaxed text-[#F2F0ED]/50">
                      {locale === "zh" ? "目前香材" : "Selected note"} · {selectedNote[locale]}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <p className="mt-7 max-w-[750px] text-[10px] leading-[1.7] text-[#F2F0ED]/32">
            {themes.join(" · ")}
          </p>
        </section>

        <p role="status" aria-live="polite" className="mt-8 text-[11px] tracking-[0.12em] text-[#F2F0ED]/48">
          {locale === "zh" ? `顯示 ${filtered.length} 支香氣` : `Showing ${filtered.length} ${filtered.length === 1 ? "scent" : "scents"}`}
        </p>
        <div id="swy-collection-results" className="mt-4 grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => {
            const pitch = getLocalizedElevatorPitch(p.id, locale);
            const teaser = pitch.trim() || productTagline(p, locale);
            const featured = featuredById[p.id];
            const price =
              featured?.price?.amount && featured?.price?.currencyCode
                ? formatShopifyMoney(
                    featured.price.amount,
                    featured.price.currencyCode,
                    locale
                  )
                : productPriceDisplay(p, locale);
            const imageUrl = featured?.url ?? null;
            const imageAlt =
              featured?.alt?.trim() || `SWY ${productName(p, locale)} perfume`;
            return (
              <motion.article
                key={p.id}
                className="group overflow-hidden border border-white/10 bg-black/25 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45 }}
              >
                <Link
                  to={localizePath(ROUTES.product(p.id))}
                  className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E14]"
                >
                <div className="aspect-[864/1184] w-full overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={imageAlt}
                      width={featured?.width || 864}
                      height={featured?.height || 1184}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                      onError={hideImageOnError}
                    />
                  ) : null}
                </div>
                <div className="space-y-3 p-4 sm:p-5">
                  <div>
                    <h2
                      className="text-base leading-snug text-[#F2F0ED] sm:text-lg"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {productName(p, locale)}
                    </h2>
                    <p
                      className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#F2F0ED]/65"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {teaser}
                    </p>
                    <p
                      className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#F2F0ED]/38"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {t(siteCopy.collectionPage.viewPiece)}
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p
                      className="text-[9px] uppercase tracking-[0.2em] text-[#F2F0ED]/48"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {t(siteCopy.collectionPage.card.familyLabel)}
                      <span className="text-[#F2F0ED]/28"> · </span>
                      {productTheme(p, locale)}
                    </p>
                    {price ? (
                      <p
                        className="mt-2 font-mono text-sm text-[#F2F0ED]/78"
                      >
                        <span
                          className="mr-2 font-sans text-[9px] uppercase tracking-[0.2em] text-[#F2F0ED]/48"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {t(siteCopy.collectionPage.card.priceLabel)}
                        </span>
                        {price}
                      </p>
                    ) : null}
                  </div>
                </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <p
          className="mt-16 max-w-lg text-[0.8125rem] leading-[1.7] text-[#F2F0ED]/45"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {t(siteCopy.collectionPage.browseCue)}
        </p>
        <p
          className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#F2F0ED]/32"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {t(siteCopy.collectionPage.currencyNote)}
        </p>
      </div>

      <ArchiveFooter />
    </div>
  );
}
