import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { siteCopy } from "../content/siteCopy";
import { products, type Product } from "../data/products";
import { BOTTLE_IMAGE } from "../data/bottleImage";
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

type MoodFilter = "all" | Product["mood"];

export function CollectionBrowsePage() {
  const { t, locale, localizePath } = useLanguage();
  const navigate = useNavigate();
  const [mood, setMood] = useState<MoodFilter>("all");
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

  const filtered = useMemo(() => {
    return products.filter((p) => mood === "all" || p.mood === mood);
  }, [mood]);

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

        <div className="mt-12 flex flex-col gap-6 border-t border-white/[0.07] pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.22em] text-[#F2F0ED]/38"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.collectionPage.filterLabel)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["all", "light", "dark"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMood(key)}
                  aria-pressed={mood === key}
                  className={`rounded-sm border px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/35 ${
                    mood === key
                      ? "border-[#F2F0ED]/32 bg-[#F2F0ED]/[0.07] text-[#F2F0ED]"
                      : "border-white/10 bg-black/20 text-[#F2F0ED]/48 hover:border-white/16 hover:text-[#F2F0ED]/72"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {key === "all"
                    ? t(siteCopy.collectionPage.filterAll)
                    : key === "light"
                      ? t(siteCopy.collectionPage.filterLight)
                      : t(siteCopy.collectionPage.filterDark)}
                </button>
              ))}
            </div>
          </div>
          <p
            className="max-w-md text-[11px] leading-relaxed text-[#F2F0ED]/40 md:text-right"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {themes.join(" · ")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            const imageUrl = featured?.url || BOTTLE_IMAGE;
            const imageAlt = featured?.alt?.trim() || productName(p, locale);
            return (
              <motion.article
                key={p.id}
                className="group cursor-pointer overflow-hidden border border-white/10 bg-black/25 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:border-white/20"
                onClick={() => navigate(localizePath(ROUTES.product(p.id)))}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45 }}
              >
                <div className="aspect-[864/1184] w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
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
