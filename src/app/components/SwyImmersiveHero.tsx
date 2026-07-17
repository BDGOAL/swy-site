import { useState, type Ref } from "react";
import { useLanguage } from "../context/LanguageContext";
import { siteCopy } from "../content/siteCopy";
import { SECTION_IDS } from "../constants/landingSectionIds";
import {
  HERO_ASSETS,
  HERO_FRAGMENTS,
  HERO_COPY,
  type HeroAssetSlot,
} from "../data/heroScenes";
import type { Locale } from "../lib/i18n";

/**
 * SWY immersive Hero — Phase 1: STATIC SCENE PROTOTYPE.
 *
 * Five scenes in normal document flow (no pinning, no scroll interception,
 * no wheel handlers, no scrubbing). Structured so Phase 2 can add scroll
 * choreography without reordering the DOM: all copy is in semantic order,
 * decorative layers are aria-hidden, and reduced-motion users already see
 * the final static composition.
 *
 * Palette: #050607 / #0A0E14 / #5E6265 / #C7C9C8 / #B9A58E / #EDEAE3
 */

/* ---------------------------------------------------------------- helpers */

/** Multi-line bilingual copy: split on \n into balanced lines. */
function CopyLines({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className={className ? `${className} block` : "block"}>
          {line}
        </span>
      ))}
    </>
  );
}

/**
 * Asset slot renderer. ASSET SLOT — final artwork is dropped into
 * `public/hero/` (see heroScenes.ts for exact paths). While the file is
 * missing, the <img> hides itself onError and the branded gradient
 * placeholder behind it carries the composition — layout never shifts
 * because every slot lives in a fixed-ratio or absolutely-filled box.
 */
function HeroSlotImage({
  slot,
  locale,
  eager = false,
  className = "",
}: {
  slot: HeroAssetSlot;
  locale: Locale;
  /** Only the Scene 1 poster may be eager/high priority. */
  eager?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  const alt = slot.alt ? slot.alt[locale] : "";
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={slot.mobile} />
      <img
        src={slot.desktop}
        alt={alt}
        aria-hidden={slot.alt ? undefined : true}
        loading={eager ? undefined : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}

/** Shared eyebrow style — restrained sans, generous tracking. */
const EYEBROW_CLASS =
  "text-[10px] uppercase tracking-[0.34em] text-[#C7C9C8]/60 sm:text-[11px]";

/* ----------------------------------------------------------------- scenes */

export function SwyImmersiveHero({ rootRef }: { rootRef?: Ref<HTMLElement> }) {
  const { t, locale } = useLanguage();

  const scrollToCollection = () => {
    const el = document.getElementById(SECTION_IDS.archive);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-x-clip"
      style={{ backgroundColor: "#050607", fontFamily: "var(--font-sans)" }}
      aria-label="Scent With You"
    >
      {/* ============================== Scene 1 — The Surface ============ */}
      <div className="relative flex min-h-[92svh] w-full flex-col items-center justify-center md:min-h-[100svh]">
        {/* ASSET SLOT: /hero/hero-surface-(desktop|mobile).webp */}
        <div className="absolute inset-0" aria-hidden>
          <HeroSlotImage slot={HERO_ASSETS.surface} locale={locale} eager />
        </div>
        {/* Placeholder / tonal base: pale surface light dying into deep water. */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 120% 46% at 50% -8%, rgba(199, 201, 200, 0.14) 0%, rgba(94, 98, 101, 0.05) 42%, transparent 70%),
              linear-gradient(to bottom, #10141B 0%, #0A0E14 34%, #070A0F 68%, #050607 100%)
            `,
          }}
        />
        {/* Faint horizontal light bands — still water, CSS only. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[6%] h-[22%] opacity-[0.16]"
          aria-hidden
          style={{
            background:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 9px, rgba(199,201,200,0.09) 10px, transparent 12px, transparent 26px)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />

        <div className="relative z-[1] flex w-full max-w-3xl flex-col items-center px-6 text-center">
          <p className={EYEBROW_CLASS}>{HERO_COPY.eyebrow}</p>
          <h1
            className="mt-7 text-[clamp(1.9rem,7.4vw,2.6rem)] leading-[1.32] tracking-[0.04em] text-[#EDEAE3] md:text-[clamp(2.6rem,4.4vw,4rem)] md:leading-[1.26]"
            style={{
              fontFamily: "var(--font-serif)",
              textShadow: "0 2px 30px rgba(0,0,0,0.6)",
            }}
          >
            <CopyLines text={t(HERO_COPY.scene1Headline)} />
          </h1>
        </div>

        <p
          className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-[#EDEAE3]/30"
          style={{
            bottom: "max(2rem, calc(1.25rem + env(safe-area-inset-bottom, 0px)))",
          }}
        >
          {t(siteCopy.landing.hero.scrollCue)}
        </p>
      </div>

      {/* ============================== Scene 2 — The Descent ============ */}
      <div className="relative flex min-h-[85svh] w-full items-center justify-center md:min-h-[92svh]">
        {/* ASSET SLOT: /hero/hero-underwater-(desktop|mobile).webp */}
        <div className="absolute inset-0" aria-hidden>
          <HeroSlotImage slot={HERO_ASSETS.underwater} locale={locale} />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 90% 34% at 50% 0%, rgba(94, 98, 101, 0.08) 0%, transparent 62%),
              linear-gradient(to bottom, #050607 0%, #07090E 30%, #080B11 55%, #060809 100%)
            `,
          }}
        />
        {/* Suspended particles — pure CSS radial dots, no animation in Phase 1. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `
              radial-gradient(circle 1px at 18% 32%, rgba(199,201,200,0.34) 0%, transparent 100%),
              radial-gradient(circle 1px at 64% 18%, rgba(199,201,200,0.22) 0%, transparent 100%),
              radial-gradient(circle 1.5px at 41% 66%, rgba(199,201,200,0.18) 0%, transparent 100%),
              radial-gradient(circle 1px at 79% 54%, rgba(199,201,200,0.26) 0%, transparent 100%),
              radial-gradient(circle 1px at 30% 84%, rgba(199,201,200,0.16) 0%, transparent 100%),
              radial-gradient(circle 1.5px at 88% 80%, rgba(199,201,200,0.14) 0%, transparent 100%),
              radial-gradient(circle 1px at 8% 58%, rgba(199,201,200,0.2) 0%, transparent 100%)
            `,
          }}
        />

        <div className="relative z-[1] w-full max-w-2xl px-6 text-center">
          <p
            className="text-[clamp(1.5rem,5.8vw,2rem)] leading-[1.42] tracking-[0.05em] text-[#C7C9C8] md:text-[clamp(1.9rem,3.2vw,2.9rem)] md:leading-[1.36]"
            style={{
              fontFamily: "var(--font-serif)",
              textShadow: "0 2px 26px rgba(0,0,0,0.65)",
            }}
          >
            <CopyLines text={t(HERO_COPY.scene2Line)} />
          </p>
        </div>
      </div>

      {/* ============================== Scene 3 — The Bottle ============= */}
      <div className="relative flex min-h-[95svh] w-full items-center md:min-h-[100svh]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 62% 52% at 68% 46%, rgba(185, 165, 142, 0.055) 0%, transparent 66%),
              linear-gradient(to bottom, #060809 0%, #080A0F 40%, #070910 72%, #050708 100%)
            `,
          }}
        />

        <div className="relative z-[1] mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-24 md:grid md:grid-cols-[1fr_minmax(0,42%)] md:items-center md:gap-16 md:py-0">
          {/* Copy — left on desktop, above the bottle on mobile. */}
          <div className="order-1 w-full max-w-xl text-center md:text-left">
            <p
              className="text-[clamp(1.4rem,5.4vw,1.85rem)] leading-[1.5] tracking-[0.05em] text-[#EDEAE3] md:text-[clamp(1.8rem,2.9vw,2.7rem)] md:leading-[1.4]"
              style={{
                fontFamily: "var(--font-serif)",
                textShadow: "0 2px 24px rgba(0,0,0,0.6)",
              }}
            >
              <CopyLines text={t(HERO_COPY.scene3Line)} />
            </p>
          </div>

          {/* Bottle slot — right third on desktop; central 70% safe zone on mobile. */}
          <div className="order-2 flex w-full justify-center md:justify-end">
            <div
              className="relative aspect-[3/4] w-[min(70%,300px)] overflow-hidden md:w-full md:max-w-[380px]"
              style={{
                background: `
                  radial-gradient(ellipse 58% 44% at 50% 40%, rgba(199, 201, 200, 0.07) 0%, transparent 68%),
                  linear-gradient(to bottom, #0B0F16 0%, #090C12 55%, #07090D 100%)
                `,
              }}
            >
              {/* ASSET SLOT: /hero/hero-bottle-(desktop|mobile).webp */}
              <div className="absolute inset-0">
                <HeroSlotImage slot={HERO_ASSETS.bottle} locale={locale} />
              </div>
              {/* Placeholder silhouette hint — removed automatically once the asset loads above it. */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[26%] -translate-x-1/2 -translate-y-1/2 opacity-[0.5]"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(94,98,101,0.22) 0%, rgba(94,98,101,0.32) 12%, rgba(21,25,31,0.85) 13%, rgba(13,16,21,0.9) 100%)",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====================== Scene 4 — Fragments of Memory ============ */}
      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(to bottom, #050708 0%, #07090D 30%, #070A0E 70%, #050608 100%)",
          }}
        />

        <div className="relative z-[1] mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
          <p className={`${EYEBROW_CLASS} text-center`}>
            {t(HERO_COPY.scene4Eyebrow)}
          </p>

          {/* Editorial layered composition — not a card grid, no carousel.
              Desktop: alternating offsets + slight overlap for depth.
              Mobile: one clear frame per sub-block in DOM order. */}
          <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-0">
            {HERO_FRAGMENTS.map((fragment, i) => {
              const even = i % 2 === 0;
              return (
                <figure
                  key={fragment.id}
                  className={[
                    "relative m-0 w-full md:w-[46%]",
                    even ? "md:self-start" : "md:self-end",
                    i > 0 ? "md:-mt-16" : "",
                    even ? "" : "md:translate-y-10",
                  ].join(" ")}
                  style={{ zIndex: 10 + i }}
                >
                  <div
                    className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/2] md:aspect-[4/5]"
                    style={{
                      background: `
                        radial-gradient(ellipse 70% 46% at 50% ${even ? "30%" : "62%"}, rgba(185, 165, 142, 0.05) 0%, transparent 70%),
                        linear-gradient(${even ? "168deg" : "192deg"}, #0B0E15 0%, #090B10 52%, #06080B 100%)
                      `,
                    }}
                  >
                    {/* ASSET SLOT: /hero/story-*-(desktop|mobile).webp */}
                    <div className="absolute inset-0">
                      <HeroSlotImage slot={fragment.asset} locale={locale} />
                    </div>
                    {/* Filmic edge shade instead of borders. */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(to top, rgba(5,6,7,0.55) 0%, transparent 34%)",
                      }}
                    />
                  </div>
                  <figcaption className="mt-4 md:mt-5">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#5E6265]">
                      {fragment.name}
                    </p>
                    <p
                      className="mt-2 max-w-[34ch] text-[13.5px] leading-[1.8] tracking-[0.04em] text-[#C7C9C8]/78 md:text-[14px]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {fragment.caption[locale]}
                    </p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================== Scene 5 — SWY Reveal ============= */}
      <div className="relative flex min-h-[92svh] w-full flex-col items-center justify-center md:min-h-[100svh]">
        {/* ASSET SLOT: /hero/hero-final-(desktop|mobile).webp */}
        <div className="absolute inset-0" aria-hidden>
          <HeroSlotImage slot={HERO_ASSETS.final} locale={locale} />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 70% 40% at 50% 42%, rgba(199, 201, 200, 0.05) 0%, transparent 64%),
              linear-gradient(to bottom, #050608 0%, #050607 58%, #070A10 86%, #0A0E14 100%)
            `,
          }}
        />

        <div
          className="relative z-[1] flex w-full max-w-2xl flex-col items-center px-6 pt-24 text-center"
          style={{
            paddingBottom: "max(6rem, calc(4rem + env(safe-area-inset-bottom, 0px)))",
          }}
        >
          {/* Wordmark — type-only in Phase 1 (no extra image request). */}
          <p
            className="text-[2.6rem] leading-none tracking-[0.18em] text-[#EDEAE3] md:text-[3.4rem]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            SWY
          </p>
          <p className={`mt-4 ${EYEBROW_CLASS}`}>{HERO_COPY.eyebrow}</p>

          <p
            className="mt-12 text-[clamp(1.25rem,4.8vw,1.6rem)] leading-[1.6] tracking-[0.05em] text-[#EDEAE3]/92 md:text-[clamp(1.5rem,2.3vw,2.1rem)] md:leading-[1.52]"
            style={{
              fontFamily: "var(--font-serif)",
              textShadow: "0 2px 22px rgba(0,0,0,0.55)",
            }}
          >
            <CopyLines text={t(HERO_COPY.scene5Tagline)} />
          </p>

          <button
            type="button"
            onClick={scrollToCollection}
            className="mt-12 inline-flex min-h-[48px] items-center justify-center border border-[#C7C9C8]/30 px-10 py-3 text-[11px] uppercase tracking-[0.3em] text-[#EDEAE3] transition-colors duration-300 hover:border-[#C7C9C8]/60 hover:bg-[#C7C9C8]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C7C9C8]/70"
          >
            {t(HERO_COPY.scene5Cta)}
          </button>

          {/* Transition block into the collection section below. */}
          <div className="mt-20 md:mt-24">
            <p className="text-[13px] leading-[1.9] tracking-[0.12em] text-[#B9A58E]/75">
              {HERO_COPY.transitionZh}
            </p>
            <p className="mt-1.5 text-[11px] uppercase leading-[1.9] tracking-[0.22em] text-[#5E6265]">
              {HERO_COPY.transitionEn}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
