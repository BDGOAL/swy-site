import { motion } from "motion/react";
import { SECTION_IDS } from "../constants/landingSectionIds";
import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";
import { LANDING_EDITORIAL_IMAGES } from "../content/landingEditorialImages";
import { EDITORIAL_EASE, editorialTransition, usePrefersReducedMotion } from "../utils/editorialLandingMotion";

export function AcetateReveal() {
  const reduce = usePrefersReducedMotion();
  const motionT = editorialTransition;
  const { t } = useLanguage();

  return (
    <section
      id={SECTION_IDS.acetateReveal}
      className="acetate-reveal landing-scroll-target relative w-full overflow-hidden"
      style={{
        backgroundColor: "#05060a",
        backgroundImage:
          "linear-gradient(125deg, #06070c 0%, #05060a 38%, #040509 72%, #050608 100%)",
      }}
    >
      <div className="acetate-reveal__inner relative mx-auto w-full max-w-[1440px] px-5 pb-16 pt-14 md:min-h-[min(88vh,820px)] md:px-10 md:pb-28 md:pt-20 lg:px-12 lg:pb-36 lg:pt-24">
        {/* Exhibition plate: off-center; mobile stacks image → typographic anchor */}
        <motion.div
          className="acetate-reveal__plate relative z-0 w-full md:ml-[10%] md:w-[min(76%,780px)] lg:ml-[12%] lg:w-[min(72%,840px)]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -8% 0px", amount: 0.18 }}
          transition={{ ...motionT(1.05, reduce), ease: EDITORIAL_EASE }}
        >
          <div className="border border-white/[0.08] bg-[#040508]/90 p-2 shadow-[inset_0_0_0_1px_rgba(242,240,237,0.04),0_24px_48px_rgba(0,0,0,0.35)] md:p-4 lg:p-5">
            <div className="acetate-reveal__image-wrap group relative overflow-hidden">
              <div
                className="editorial-acetate-light-drift pointer-events-none absolute -inset-[20%] z-[2] hidden bg-[radial-gradient(ellipse_65%_50%_at_58%_45%,rgba(242,240,237,0.09),transparent_70%)] mix-blend-soft-light md:block"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-[#06080c]/25 via-transparent to-[#030407]/50"
                aria-hidden
              />
              <img
                src={LANDING_EDITORIAL_IMAGES.acetateReveal}
                alt=""
                className="acetate-reveal__image relative z-0 w-full object-cover object-center [aspect-ratio:5/6] [filter:saturate(0.84)_contrast(1.05)_brightness(0.9)] transition-[transform,filter] duration-[1200ms] ease-out max-md:max-h-[min(88vh,720px)] md:aspect-[16/9] md:max-h-[min(58vh,520px)] md:object-[center_48%] md:group-hover:scale-[1.008] md:group-hover:[filter:saturate(0.86)_contrast(1.06)_brightness(0.92)]"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        <p
          className="acetate-reveal__caption relative z-[1] mt-8 max-w-[21rem] text-[0.9375rem] leading-[1.72] tracking-[0.012em] text-[#F2F0ED]/46 text-balance sm:max-w-[24rem] md:absolute md:bottom-[16%] md:right-[7%] md:mt-0 md:max-w-[14.25rem] md:text-right md:leading-[1.68] md:tracking-[0.01em] lg:bottom-[18%] lg:right-[8%] lg:max-w-[14.75rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="block">{t(siteCopy.landing.acetate.captionLine1)}</span>
          <span className="mt-1.5 block md:mt-1">{t(siteCopy.landing.acetate.captionLine2)}</span>
        </p>

        <p
          className="acetate-reveal__label relative z-[1] mt-5 max-w-[10rem] text-[10px] uppercase leading-[1.5] tracking-[0.36em] text-[#F2F0ED]/28 md:absolute md:left-[5%] md:top-[32%] md:mt-0 md:max-w-[9rem] lg:left-[6%] lg:top-[34%]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {t(siteCopy.landing.acetate.label)}
        </p>
      </div>
    </section>
  );
}
