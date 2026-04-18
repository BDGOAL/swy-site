import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { CollectionGrid } from "./CollectionGrid";
import { BrandDNA } from "./BrandDNA";
import { BrandVision } from "./BrandVision";
import { AcetateReveal } from "./AcetateReveal";
import { ConversionSection } from "./ConversionSection";
import { ArchiveFooter } from "./ArchiveFooter";
import { OceanSurfaceHero } from "./OceanSurfaceHero";
import { WaterRipple } from "./WaterRipple";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { siteCopy } from "../content/siteCopy";
import { SECTION_IDS } from "../constants/landingSectionIds";

const LANDING_HASH_IDS = new Set<string>(Object.values(SECTION_IDS));

/** SPA + deep links: ensure hash targets honor scroll-margin after layout (esp. motion sections). */
function useLandingHashAlign() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (pathname !== "/" && pathname !== "/landing") return;
    const id = hash.replace(/^#/, "");
    if (!id || !LANDING_HASH_IDS.has(id)) return;

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) return;
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      const top = el.getBoundingClientRect().top;
      if (top >= margin - 10 && top <= margin + 28) return;

      el.scrollIntoView({ block: "start", behavior: "auto" });
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [pathname, hash]);
}

export function LandingPage() {
  const { mode } = useTheme();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const heroSceneRef = useRef<HTMLElement | null>(null);
  useLandingHashAlign();

  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false
  );

  const [largeEnoughForRipple, setLargeEnoughForRipple] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  const [reduceMotion, setReduceMotion] = useState(false);
  /** lg+ — typography & quote motion V3; mobile / tablet unchanged. */
  const [desktopHero, setDesktopHero] = useState(false);

  /**
   * Integer progress 0–100 through the hero scroll range. Updates on every crossed percent so React
   * always re-renders (no “stuck at 0” from float epsilon). Threshold reveal is derived from this.
   */
  const [heroP100, setHeroP100] = useState(0);
  const lastHeroP100Ref = useRef(-1);
  /** Second hero “frame”: quote lives in document flow below the logo sticky so scroll brings it into view. */
  const quoteFrameRef = useRef<HTMLDivElement | null>(null);
  const [quoteFrameVisible, setQuoteFrameVisible] = useState(false);

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onNarrow = () => setNarrow(mqNarrow.matches);
    const onLg = () => {
      setLargeEnoughForRipple(mqLg.matches);
      setDesktopHero(mqLg.matches);
    };
    const onReduce = () => setReduceMotion(mqReduce.matches);
    onNarrow();
    onLg();
    onReduce();
    mqNarrow.addEventListener("change", onNarrow);
    mqLg.addEventListener("change", onLg);
    mqReduce.addEventListener("change", onReduce);
    return () => {
      mqNarrow.removeEventListener("change", onNarrow);
      mqLg.removeEventListener("change", onLg);
      mqReduce.removeEventListener("change", onReduce);
    };
  }, []);

  useLayoutEffect(() => {
    const el = heroSceneRef.current;
    if (!el) return;

    let raf = 0;

    const tick = () => {
      raf = 0;
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      const range = Math.max(1, h - vh);
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop ?? 0;
      const rect = el.getBoundingClientRect();
      const top = rect.top;
      const pFromRect = Math.min(1, Math.max(0, -top / range));
      const heroDocTop = scrollTop + top;
      const pFromScroll = Math.min(
        1,
        Math.max(0, (scrollTop - heroDocTop) / range)
      );
      const p = Math.max(pFromRect, pFromScroll);

      const pn = Math.min(100, Math.max(0, Math.round(p * 100)));
      if (pn !== lastHeroP100Ref.current) {
        lastHeroP100Ref.current = pn;
        setHeroP100(pn);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("scroll", schedule);
      vv.addEventListener("resize", schedule);
    }
    window.addEventListener("pageshow", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      if (vv) {
        vv.removeEventListener("scroll", schedule);
        vv.removeEventListener("resize", schedule);
      }
      window.removeEventListener("pageshow", schedule);
    };
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const el = quoteFrameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const ok =
          e.isIntersecting &&
          e.intersectionRatio >= (reduceMotion ? 0.2 : 0.28);
        setQuoteFrameVisible((prev) => (prev === ok ? prev : ok));
      },
      { root: null, threshold: [0, 0.12, 0.2, 0.28, 0.35, 0.5, 0.65] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  const reduce = reduceMotion;
  const showQuote = quoteFrameVisible;
  const showSupporting =
    quoteFrameVisible &&
    heroP100 >= (reduce ? 22 : desktopHero ? 27 : 30);
  const showLogo =
    heroP100 < (reduce ? 12 : desktopHero ? 19 : 16);
  const veilO = Math.min(0.18, (heroP100 / 100) * 0.22);
  const cueO = showQuote ? 0.22 : Math.max(0.18, 1 - (heroP100 / 100) * 0.78);
  const fadeMs = reduce ? 0 : 380;

  const nextSectionY = useTransform(
    scrollY,
    desktopHero ? [380, 1280] : [520, 980],
    desktopHero ? [36, 0] : [64, 0]
  );
  const nextSectionOpacity = useTransform(
    scrollY,
    desktopHero ? [340, 1180] : [480, 900],
    [0, 1]
  );
  const mobileOverlayLiftVh = 0;
  const v3 = desktopHero && !reduce;

  return (
    <div className="relative w-full">
      <section
        ref={heroSceneRef}
        className="relative flex w-full flex-col"
        style={{ backgroundColor: "#0A0E14" }}
      >
        {/* Full-height scene background (covers both hero frames). */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.9] sm:opacity-[0.92]">
            <OceanSurfaceHero
              mode={mode}
              enableLightSpots={true}
              enableCaustics={true}
            />
          </div>
          {!narrow && largeEnoughForRipple && (
            <WaterRipple
              enableClick={false}
              enableMove={false}
              intensity="subtle"
              color="rgba(72, 82, 92, 0.07)"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(10, 14, 20, 0.07) 0%,
                rgba(10, 14, 20, 0.02) 14%,
                transparent 32%,
                transparent 48%,
                rgba(10, 12, 17, 0.015) 56%,
                rgba(10, 11, 15, 0.04) 68%,
                rgba(9, 10, 14, 0.1) 78%,
                rgba(8, 9, 13, 0.2) 88%,
                rgba(7, 8, 12, 0.32) 95%,
                rgba(7, 8, 11, 0.4) 100%
              )`,
            }}
            aria-hidden
          />
          {/* Ultra-subtle grain to mask banding between hero frames — stays atmospheric, not textured UI. */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light opacity-[0.022] sm:opacity-[0.028]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23h)' opacity='0.55'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />
        </div>

        {/* Frame 1: logo + scroll cue (sticky viewport). */}
        <div className="relative z-[1] min-h-[100svh] w-full">
          <div className="sticky top-0 z-10 h-[100svh] min-h-[100dvh] w-full overflow-x-hidden overflow-y-visible">
            <div
              className="pointer-events-none absolute inset-0 z-[5]"
              style={{ opacity: veilO }}
              aria-hidden
            >
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(
                  to bottom,
                  transparent 0%,
                  transparent calc(62% + 12vh - ${mobileOverlayLiftVh}vh),
                  rgba(10, 11, 15, 0.035) 88%,
                  rgba(9, 10, 13, 0.08) 100%
                )`,
                }}
              />
            </div>

            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-2 sm:px-4">
              <div
                className="pointer-events-none flex flex-col items-center justify-center"
                style={{
                  opacity: showLogo ? 1 : 0,
                  transition: fadeMs ? `opacity ${fadeMs}ms ease-out` : undefined,
                }}
              >
                <motion.div
                  initial={{ opacity: 0.2, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: narrow ? 2.1 : 2.45,
                    delay: 0.08,
                    ease: [0.14, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className="flex flex-col items-center"
                    animate={
                      narrow
                        ? { y: 0, x: 0, rotate: 0 }
                        : {
                            y: [0, -9.5, 2.5, 8, -3, 0],
                            x: [0, 5.2, -4, 3.5, -5.5, 0],
                            rotate: [0, -0.72, 0.28, -0.42, 0.55, 0],
                          }
                    }
                    transition={
                      narrow
                        ? { duration: 0 }
                        : {
                            duration: 10.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.18, 0.38, 0.58, 0.82, 1],
                          }
                    }
                  >
                    <img
                      src="/swy-logo.png"
                      alt={t(siteCopy.brand.logoAlt)}
                      className="h-auto max-w-none origin-center scale-[1.79] sm:scale-[1.87] md:scale-[0.98] lg:scale-[1.52] xl:scale-[1.58] w-[min(98vw,820px)] sm:w-[min(97vw,980px)] md:w-[min(95vw,560px)] lg:w-[min(92vw,960px)] xl:w-[min(88vw,1060px)]"
                      style={{
                        filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.48))",
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <p
              className="pointer-events-none absolute bottom-8 left-1/2 z-[45] -translate-x-1/2 text-[9px] uppercase tracking-[0.32em] text-[#F2F0ED]/28 sm:bottom-12"
              style={{
                opacity: cueO,
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              {t(siteCopy.landing.hero.scrollCue)}
            </p>
          </div>
        </div>

        {/* Frame 2: quote in scrollable region (centers in viewport as user enters this band). */}
        <div
          ref={quoteFrameRef}
          className="relative z-[2] flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-24 pointer-events-none"
          aria-hidden={!showQuote && !showSupporting}
        >
          {/* Long, soft tonal ramp at bottom of frame 2 — weight sits low; no hard step at frame boundary. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 min-h-[280px] h-[min(72%,520px)] sm:h-[min(68%,560px)]"
            style={{
              background: `linear-gradient(
                to bottom,
                transparent 0%,
                transparent 22%,
                rgba(8, 10, 14, 0.02) 38%,
                rgba(7, 9, 13, 0.08) 55%,
                rgba(6, 8, 12, 0.2) 72%,
                rgba(6, 7, 11, 0.38) 86%,
                rgba(5, 6, 10, 0.52) 100%
              )`,
            }}
            aria-hidden
          />
          {/* Slow breathing glow behind quote — depth only, no readability cost. */}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-[40%] z-[0] h-[min(48vh,380px)] w-[min(130vw,820px)] -translate-x-1/2 -translate-y-1/2 lg:top-[38%] lg:h-[min(54vh,520px)] lg:w-[min(135vw,960px)]"
              style={{
                background:
                  "radial-gradient(ellipse 52% 48% at 50% 48%, rgba(210, 218, 228, 0.09) 0%, rgba(120, 130, 145, 0.03) 38%, transparent 68%)",
                filter: "blur(48px)",
              }}
              animate={{ opacity: [0.42, 0.72, 0.42] }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              aria-hidden
            />
          )}
          <div className="relative z-[1] flex w-full flex-col items-center justify-center">
            <div
              className="w-full max-w-[min(94vw,36rem)] text-center lg:max-w-[min(92vw,48rem)]"
              style={{
                fontFamily: "var(--font-serif)",
                visibility: showQuote ? "visible" : "hidden",
              }}
            >
              <motion.p
                className="text-[1.22rem] font-normal leading-[1.34] tracking-[0.032em] text-[#F2F0ED] sm:text-[1.36rem] md:text-[1.5rem] md:leading-[1.3] lg:text-[clamp(2.2rem,3.9vw,3.85rem)] lg:leading-[1.22] xl:text-[clamp(2.45rem,4.1vw,4.1rem)]"
                initial={false}
                animate={
                  reduce
                    ? { opacity: showQuote ? 1 : 0, y: 0 }
                    : v3 && showQuote
                      ? { opacity: [0.02, 0.05, 0.16, 1], y: [34, 28, 12, 0] }
                      : v3
                        ? { opacity: 0, y: 34 }
                        : {
                            opacity: showQuote ? 1 : 0,
                            y: showQuote ? 0 : 28,
                          }
                }
                transition={
                  reduce
                    ? { duration: 0.22, ease: "easeOut" }
                    : v3 && showQuote
                      ? {
                          duration: 1.85,
                          times: [0, 0.26, 0.55, 1],
                          ease: [0.14, 0.62, 0.18, 1],
                          delay: 0.06,
                        }
                      : v3
                        ? { duration: 0.3, ease: "easeIn" }
                        : {
                            duration: 1.38,
                            delay: showQuote ? 0.06 : 0,
                            ease: [0.13, 0.9, 0.22, 1],
                          }
                }
                style={{
                  textShadow:
                    "0 2px 28px rgba(0,0,0,0.72), 0 1px 0 rgba(0,0,0,0.15)",
                }}
              >
                {t(siteCopy.landing.hero.statementLine1)}
              </motion.p>
              <motion.p
                className="mt-5 text-[1.06rem] font-normal leading-[1.44] tracking-[0.028em] text-[#F2F0ED] sm:mt-6 sm:text-[1.18rem] md:pl-6 md:text-[1.24rem] md:leading-[1.3] lg:mt-7 lg:pl-8 lg:text-[clamp(1.85rem,3.15vw,3.2rem)] lg:leading-[1.26] xl:text-[clamp(2rem,3.35vw,3.45rem)]"
                initial={false}
                animate={
                  reduce
                    ? { opacity: showQuote ? 1 : 0, y: 0 }
                    : v3 && showQuote
                      ? { opacity: [0.02, 0.05, 0.14, 1], y: [30, 24, 10, 0] }
                      : v3
                        ? { opacity: 0, y: 30 }
                        : {
                            opacity: showQuote ? 1 : 0,
                            y: showQuote ? 0 : 24,
                          }
                }
                transition={
                  reduce
                    ? { duration: 0.22, ease: "easeOut", delay: 0.04 }
                    : v3 && showQuote
                      ? {
                          duration: 2.05,
                          times: [0, 0.24, 0.54, 1],
                          ease: [0.14, 0.62, 0.18, 1],
                          delay: 0.22,
                        }
                      : v3
                        ? { duration: 0.3, ease: "easeIn" }
                        : {
                            duration: 1.38,
                            delay: showQuote ? 0.22 : 0,
                            ease: [0.13, 0.9, 0.22, 1],
                          }
                }
                style={{
                  textShadow:
                    "0 2px 24px rgba(0,0,0,0.68), 0 1px 0 rgba(0,0,0,0.12)",
                }}
              >
                {t(siteCopy.landing.hero.statementLine2)}
              </motion.p>
            </div>
            <motion.p
              className="mt-12 max-w-[30ch] text-center text-[11px] font-normal leading-[1.75] tracking-[0.13em] text-[#F2F0ED] sm:mt-14 sm:max-w-[32ch] sm:text-[12px] md:mt-16 md:tracking-[0.14em] lg:mt-16 lg:max-w-[36ch] lg:text-[13px]"
              initial={false}
              animate={
                reduce
                  ? { opacity: showSupporting ? 0.62 : 0, y: 0 }
                  : v3
                    ? {
                        opacity: showSupporting ? 0.54 : 0,
                        y: showSupporting ? 0 : 20,
                      }
                    : {
                        opacity: showSupporting ? 0.58 : 0,
                        y: showSupporting ? 0 : 16,
                      }
              }
              transition={
                reduce
                  ? { duration: 0.24, ease: "easeOut" }
                  : v3
                    ? {
                        delay: 0.92,
                        duration: 1.75,
                        ease: [0.18, 0.72, 0.22, 1],
                      }
                    : {
                        delay: 0.62,
                        duration: 1.52,
                        ease: [0.2, 1, 0.35, 1],
                      }
              }
              style={{
                fontFamily: "var(--font-sans)",
                textShadow: "0 1px 18px rgba(0,0,0,0.55)",
                visibility: showSupporting ? "visible" : "hidden",
              }}
            >
              {t(siteCopy.landing.hero.supporting)}
            </motion.p>
          </div>
        </div>
      </section>

      <motion.div
        id={SECTION_IDS.archive}
        className="landing-scroll-target relative z-0"
        style={{
          y: nextSectionY,
          opacity: nextSectionOpacity,
        }}
      >
        <CollectionGrid />
      </motion.div>

      <div id={SECTION_IDS.storyContinue} className="landing-scroll-target relative z-0">
        <BrandDNA />
        <BrandVision />
      </div>
      <AcetateReveal />
      <ConversionSection />
      <ArchiveFooter />
    </div>
  );
}
