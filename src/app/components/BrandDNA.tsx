import { motion } from "motion/react";
import { SECTION_IDS } from "../constants/landingSectionIds";
import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";
import { CollectionLink } from "./CollectionLink";
import { LANDING_EDITORIAL_IMAGES } from "../content/landingEditorialImages";
import {
  editorialTransition,
  useEditorialIsMobile,
  usePrefersReducedMotion,
} from "../utils/editorialLandingMotion";

export function BrandDNA() {
  const reduce = usePrefersReducedMotion();
  const mobile = useEditorialIsMobile();
  const motionT = editorialTransition;
  const { t } = useLanguage();

  return (
    <section
      id={SECTION_IDS.brandDna}
      className="brand-dna landing-scroll-target relative w-full overflow-hidden"
      style={{
        backgroundColor: "#0A0E14",
        backgroundImage:
          "linear-gradient(to bottom, #0A0E14 0%, #090c11 52%, #080a0f 100%)",
      }}
    >
      <div className="brand-dna__inner mx-auto w-full max-w-[1440px] px-6 pb-28 pt-[4.75rem] md:px-10 md:pb-36 md:pt-32 lg:px-14 lg:pb-44 lg:pt-40">
        <div className="grid grid-cols-12 gap-x-8 gap-y-11 md:gap-x-10 md:gap-y-14 lg:gap-x-12">
          <motion.div
            className="brand-dna__content col-span-12 flex flex-col justify-start md:col-span-7 md:pt-8 lg:pt-12"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px -8% 0px", amount: 0.2 }}
            transition={{ ...motionT(0.95, reduce) }}
          >
            <p
              className="brand-dna__eyebrow mb-5 text-[10px] uppercase tracking-[0.28em] text-[#F2F0ED]/45 md:mb-7"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.landing.brandDna.eyebrow)}
            </p>
            <h2
              className="brand-dna__title mb-7 max-w-[22rem] text-[1.6rem] font-normal leading-[1.28] tracking-[0.02em] text-[#F2F0ED] sm:max-w-[26rem] sm:text-[1.7rem] md:mb-8 md:max-w-[32rem] md:text-[1.85rem] lg:max-w-[34rem] lg:text-[1.95rem]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.landing.brandDna.title)}
            </h2>
            <div
              className="brand-dna__body max-w-[34rem] space-y-6 text-[0.9375rem] leading-[1.75] text-[#F2F0ED]/66 md:max-w-[36rem]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <p>{t(siteCopy.landing.brandDna.body)}</p>
            </div>
            <ul
              className="brand-dna__principles mt-9 flex flex-wrap gap-x-7 gap-y-2.5 text-[11px] uppercase tracking-[0.2em] text-[#F2F0ED]/40 md:mt-11 md:gap-x-8 md:gap-y-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {siteCopy.landing.brandDna.principles.map((pair) => (
                <li key={pair.en}>{t(pair)}</li>
              ))}
            </ul>
            <p className="mt-10 max-w-[36rem] text-[0.8125rem] leading-relaxed text-[#F2F0ED]/48 md:mt-12">
              <CollectionLink
                className="border-b border-[#F2F0ED]/22 pb-0.5 transition-colors duration-500 hover:border-[#F2F0ED]/48 hover:text-[#F2F0ED]/85"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {t(siteCopy.landing.brandDna.linkCollection)}
              </CollectionLink>
            </p>
          </motion.div>

          <motion.div
            className="brand-dna__media col-span-12 md:col-span-5 md:pt-4"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -8% 0px", amount: 0.15 }}
            transition={{ ...motionT(1.05, reduce), delay: reduce || mobile ? 0 : 0.08 }}
          >
            <figure className="brand-dna__figure group m-0">
              <div className="brand-dna__image-wrap relative overflow-hidden rounded-[3px] ring-1 ring-white/[0.07]">
                <div
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-[#0a0d12]/25 via-transparent to-[#0a0d12]/20"
                  aria-hidden
                />
                <img
                  src={LANDING_EDITORIAL_IMAGES.brandDna}
                  alt=""
                  className="brand-dna__image aspect-[4/5] h-auto w-full object-cover object-center [filter:saturate(0.84)_contrast(1.03)_brightness(0.9)] transition-[transform,filter] duration-[900ms] ease-out md:group-hover:scale-[1.015] md:group-hover:[filter:saturate(0.86)_contrast(1.04)_brightness(0.92)]"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3.5 text-[10px] leading-relaxed tracking-[0.06em] text-[#F2F0ED]/32 transition-transform duration-500 ease-out md:mt-4 md:group-hover:translate-y-0.5">
                {t(siteCopy.landing.brandDna.figcaption)}
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
