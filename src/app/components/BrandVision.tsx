import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SECTION_IDS } from "../constants/landingSectionIds";
import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";
import { LANDING_EDITORIAL_IMAGES } from "../content/landingEditorialImages";
import {
  EDITORIAL_EASE,
  editorialTransition,
  useEditorialIsMobile,
  usePrefersReducedMotion,
} from "../utils/editorialLandingMotion";

export function BrandVision() {
  const reduce = usePrefersReducedMotion();
  const mobile = useEditorialIsMobile();
  const motionT = editorialTransition;
  const { t } = useLanguage();
  const primaryWrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: primaryWrapRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce || mobile ? [0, 0] : [10, -10]
  );

  const railText = (
    <>
      <p
        className="brand-vision__eyebrow mb-5 text-[10px] uppercase leading-[1.4] tracking-[0.3em] text-[#F2F0ED]/38 md:mb-6 md:tracking-[0.28em]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <span className="block text-[#F2F0ED]/44">{t(siteCopy.landing.brandVision.eyebrowLine1)}</span>
        <span className="mt-1.5 block pl-[0.08em] text-[#F2F0ED]/36 md:mt-2">
          {t(siteCopy.landing.brandVision.eyebrowLine2)}
        </span>
      </p>
      <h2
        className="brand-vision__title mb-0 max-w-[19.5rem] text-[1.5rem] font-normal leading-[1.3] tracking-[0.02em] text-[#F2F0ED] sm:max-w-[21rem] sm:text-[1.56rem] md:max-w-[15.75rem] md:text-[1.46rem] md:leading-[1.28] lg:max-w-[16.5rem] lg:text-[1.6rem]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {t(siteCopy.landing.brandVision.titleLine1)}
        <span className="mt-1.5 block text-[#F2F0ED]/86 md:mt-1.5">
          {t(siteCopy.landing.brandVision.titleLine2)}
        </span>
      </h2>
    </>
  );

  const railProse = (
    <div className="max-w-[18.5rem] md:max-w-[15rem] lg:max-w-[16.25rem]">
      <div
        className="brand-vision__body space-y-3 text-[0.9rem] leading-[1.78] text-[#F2F0ED]/54 md:space-y-[0.95rem] md:text-[0.875rem] md:leading-[1.74]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <p>{t(siteCopy.landing.brandVision.body1)}</p>
        <p>{t(siteCopy.landing.brandVision.body2)}</p>
        <p>{t(siteCopy.landing.brandVision.body3)}</p>
      </div>
      <p
        className="mt-4 max-w-[15.25rem] text-[0.8rem] italic leading-[1.68] text-[#F2F0ED]/38 text-balance md:mt-[1.15rem] md:max-w-[12.85rem] md:text-[0.8125rem] md:leading-[1.66]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {t(siteCopy.landing.brandVision.italic)}
      </p>
    </div>
  );

  return (
    <section
      id={SECTION_IDS.brandVision}
      className="brand-vision landing-scroll-target relative w-full overflow-hidden"
      style={{
        backgroundColor: "#080a0f",
        backgroundImage:
          "linear-gradient(to bottom, #080a0f 0%, #07080d 50%, #06070c 100%)",
      }}
    >
      <div className="brand-vision__inner mx-auto w-full max-w-[1440px] px-5 pb-[5.25rem] pt-[4.75rem] md:px-10 md:pb-[7.5rem] md:pt-[5.5rem] lg:px-12 lg:pb-[10rem] lg:pt-36">
        <div className="grid grid-cols-12 gap-x-6 gap-y-9 md:gap-x-8 md:gap-y-10 lg:gap-x-10 lg:gap-y-12">
          {/* Mobile 1 + Desktop rail top: eyebrow + title */}
          <motion.div
            className="order-1 col-span-12 md:col-span-4 md:col-start-9 md:row-start-1 md:self-start md:pt-14 lg:pt-20"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px -6% 0px", amount: 0.2 }}
            transition={{ ...motionT(0.75, reduce) }}
          >
            {railText}
          </motion.div>

          {/* Mobile 2 + Desktop: dominant image */}
          <motion.div
            ref={primaryWrapRef}
            className="brand-vision__primary-media group relative order-2 col-span-12 overflow-hidden rounded-[2px] ring-1 ring-white/[0.065] md:order-none md:col-span-8 md:row-span-2 md:row-start-1 md:col-start-1 md:min-h-[min(78vh,680px)] md:rounded-[3px]"
            initial={reduce ? false : { opacity: 0, clipPath: "inset(0 0 8% 0)" }}
            whileInView={{
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
            }}
            viewport={{ once: true, margin: "-8% 0px -6% 0px", amount: 0.15 }}
            transition={{
              ...motionT(1.05, reduce),
              clipPath: { duration: reduce ? 0 : 1.25, ease: EDITORIAL_EASE },
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#05070c]/10 via-transparent to-[#06080c]/40" />
            <motion.div style={{ y: parallaxY }} className="h-full min-h-[inherit] will-change-transform">
              <img
                src={LANDING_EDITORIAL_IMAGES.brandVisionPrimary}
                alt=""
                className="brand-vision__primary-image h-full min-h-[52vw] w-full object-cover object-[center_45%] [filter:saturate(0.93)_contrast(1.07)_brightness(0.87)] transition-[transform,filter] duration-[1100ms] ease-out sm:min-h-[48vw] md:min-h-full md:object-[center_48%] md:group-hover:scale-[1.018] md:group-hover:[filter:saturate(0.95)_contrast(1.08)_brightness(0.89)]"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Mobile 3: prose after hero */}
          <motion.div
            className="order-3 col-span-12 md:col-span-2 md:col-start-9 md:row-start-2 md:max-w-none md:self-start md:pt-4 lg:pt-6"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px -6% 0px", amount: 0.15 }}
            transition={{ ...motionT(0.65, reduce), delay: reduce ? 0 : 0.04 }}
          >
            {railProse}
          </motion.div>

          {/* Mobile 4 + Desktop: footnote image — not a second hero */}
          <motion.div
            className="order-4 col-span-12 md:col-span-2 md:col-start-11 md:row-start-2 md:max-w-[min(100%,11.5rem)] md:justify-self-end md:self-end md:translate-y-10 md:opacity-[0.88] lg:translate-y-14 lg:pr-0"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px -6% 0px", amount: 0.1 }}
            transition={{ ...motionT(0.85, reduce), delay: reduce || mobile ? 0 : 0.22 }}
          >
            <div className="md:opacity-[0.9]">
              <div className="brand-vision__detail-wrap group relative ml-auto max-w-[11rem] overflow-hidden rounded-[2px] ring-1 ring-white/[0.045] sm:max-w-[13rem] md:ml-0 md:max-w-full">
                <div
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#06080c]/38 to-transparent"
                  aria-hidden
                />
                <img
                  src={LANDING_EDITORIAL_IMAGES.brandVisionSecondary}
                  alt=""
                  className="brand-vision__detail-image relative z-0 aspect-[4/5] w-full object-cover object-center [filter:saturate(0.78)_contrast(1.02)_brightness(0.86)] transition-[transform,filter] duration-[1000ms] ease-out md:aspect-[3/4] md:group-hover:scale-[1.012] md:group-hover:[filter:saturate(0.8)_contrast(1.03)_brightness(0.88)]"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
