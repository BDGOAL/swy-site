import { SECTION_IDS, toLandingHash } from "../constants/landingSectionIds";
import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";
import { CollectionLink } from "./CollectionLink";
import { LocalizedLink } from "./LocalizedLink";

const footerLinkClass =
  "border-b border-transparent pb-px transition-[color,border-color,opacity] duration-500 ease-out hover:border-[#F2F0ED]/25 hover:text-[#F2F0ED]/78";

export function ArchiveFooter() {
  const { t } = useLanguage();
  return (
    <footer
      id={SECTION_IDS.siteFooter}
      className="site-footer landing-scroll-target border-t border-white/[0.06]"
      style={{ backgroundColor: "#040408", color: "#F2F0ED" }}
    >
      <div className="site-footer__inner mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
        <div className="site-footer__brand">
          <LocalizedLink
            to="/"
            className="site-footer__mark inline-block opacity-90 transition-opacity duration-500 hover:opacity-100"
          >
            <img src="/swy-logo.png" alt={t(siteCopy.brand.logoAlt)} className="h-8 w-auto" />
          </LocalizedLink>
          <p
            className="mt-3 max-w-[17rem] text-[0.6875rem] leading-[1.55] tracking-[0.04em] text-[#F2F0ED]/34 md:mt-2.5 md:max-w-[15.5rem] md:text-[11px] md:tracking-[0.035em]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {t(siteCopy.landing.footer.microcopy)}
          </p>
        </div>

        <nav
          className="site-footer__links flex flex-wrap gap-x-7 gap-y-2.5 text-[11px] uppercase tracking-[0.18em] text-[#F2F0ED]/42"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <CollectionLink className={footerLinkClass}>
            {t(siteCopy.nav.collection)}
          </CollectionLink>
          <LocalizedLink to={toLandingHash("brandDna")} className={footerLinkClass}>
            {t(siteCopy.nav.story)}
          </LocalizedLink>
          <LocalizedLink to={toLandingHash("brandVision")} className={footerLinkClass}>
            {t(siteCopy.nav.about)}
          </LocalizedLink>
          <LocalizedLink to={toLandingHash("siteFooter")} className={footerLinkClass}>
            {t(siteCopy.nav.contact)}
          </LocalizedLink>
        </nav>

        <div className="site-footer__meta text-[10px] tracking-[0.12em] text-[#F2F0ED]/28">
          <p style={{ fontFamily: "var(--font-sans)" }}>
            {t(siteCopy.landing.footer.copyrightPrefix)} {new Date().getFullYear()} {t(siteCopy.brand.shortName)}
          </p>
        </div>
      </div>
    </footer>
  );
}
