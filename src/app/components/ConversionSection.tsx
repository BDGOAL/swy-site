import { motion } from "motion/react";
import { SECTION_IDS, toLandingHash } from "../constants/landingSectionIds";
import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";
import { editorialTransition, usePrefersReducedMotion } from "../utils/editorialLandingMotion";
import { CollectionLink } from "./CollectionLink";
import { LocalizedLink } from "./LocalizedLink";

export function ConversionSection() {
  const reduce = usePrefersReducedMotion();
  const motionT = editorialTransition;
  const { t } = useLanguage();

  return (
    <section
      id={SECTION_IDS.conversion}
      className="conversion-section landing-scroll-target relative z-20 w-full overflow-hidden"
      style={{
        backgroundColor: "#050509",
        backgroundImage: `
          linear-gradient(180deg, rgba(8, 10, 16, 0.42) 0%, rgba(5, 5, 9, 0) 34%),
          linear-gradient(to bottom, #050509 0%, #040408 100%)
        `,
      }}
    >
      <motion.div
        className="conversion-section__inner mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5% 0px -5% 0px", amount: 0.3 }}
        transition={motionT(0.8, reduce)}
      >
        <div className="mx-auto max-w-[34rem] text-center md:mx-0 md:max-w-[38rem] md:pl-[6%] md:text-left lg:pl-[8%]">
          <p
            className="conversion-section__eyebrow mb-4 text-[10px] uppercase tracking-[0.28em] text-[#F2F0ED]/36 md:mb-5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t(siteCopy.landing.conversion.eyebrow)}
          </p>
          <h2
            className="conversion-section__title mb-4 max-w-[19.5rem] text-[1.46rem] font-normal leading-[1.34] tracking-[0.02em] text-[#F2F0ED] sm:mx-auto sm:max-w-[20.5rem] sm:text-[1.54rem] md:mx-0 md:mb-5 md:max-w-[21.5rem] md:text-[1.58rem] md:leading-[1.32] lg:max-w-[22rem]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t(siteCopy.landing.conversion.titleLine1)}
            <span className="block pt-0.5 text-[#F2F0ED]/94 sm:pt-1">
              {t(siteCopy.landing.conversion.titleLine2)}
            </span>
          </h2>
          <p
            className="conversion-section__body mb-9 max-w-[30rem] text-[0.9375rem] leading-[1.72] text-[#F2F0ED]/54 sm:mx-auto md:mx-0 md:mb-10 md:max-w-[28rem]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t(siteCopy.landing.conversion.supporting)}
          </p>

          <div className="conversion-section__actions relative z-30 flex flex-col items-stretch gap-3 pointer-events-auto sm:mx-auto sm:max-w-md sm:flex-row sm:items-center sm:justify-center sm:gap-5 md:mx-0 md:max-w-none md:justify-start">
            <CollectionLink
              className="conversion-section__action conversion-section__action--primary relative z-10 inline-flex min-h-[48px] items-center justify-center border border-[#F2F0ED]/32 bg-[#F2F0ED]/[0.09] px-7 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#F2F0ED] shadow-[0_1px_0_rgba(242,240,237,0.06)] transition-[background-color,border-color,transform,box-shadow] duration-500 ease-out hover:border-[#F2F0ED]/44 hover:bg-[#F2F0ED]/14 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050509] active:translate-y-px md:min-h-[46px] md:px-8"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.landing.conversion.ctaPrimary)}
            </CollectionLink>
            {/*
              Temporary: in-page narrative anchor on the landing route until a dedicated long-form story URL exists.
            */}
            <LocalizedLink
              to={toLandingHash("storyContinue")}
              className="conversion-section__action conversion-section__action--secondary inline-flex min-h-[48px] items-center justify-center rounded-[2px] border border-[#F2F0ED]/12 bg-transparent px-6 py-3.5 text-[10.5px] uppercase tracking-[0.2em] text-[#F2F0ED]/50 underline decoration-[#F2F0ED]/22 underline-offset-[6px] transition-[color,background-color,border-color,text-decoration-color] duration-500 ease-out hover:border-[#F2F0ED]/18 hover:bg-[#F2F0ED]/[0.04] hover:text-[#F2F0ED]/72 hover:decoration-[#F2F0ED]/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/28 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050509] active:translate-y-px md:min-h-[46px]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.landing.conversion.ctaSecondary)}
            </LocalizedLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
