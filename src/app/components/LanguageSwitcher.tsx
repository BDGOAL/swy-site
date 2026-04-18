import { siteCopy } from "../content/siteCopy";
import { useLanguage } from "../context/LanguageContext";

/** Compact segmented control — reads as a header utility, not a nav destination. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  const segmentBase =
    "min-w-[3.35rem] rounded-full px-2.5 py-1 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2F0ED]/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0a0a]";

  return (
    <div
      role="group"
      aria-label={t(siteCopy.language.groupLabel)}
      className={`inline-flex shrink-0 items-center rounded-full border border-white/[0.14] bg-black/50 p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`${segmentBase} text-[9px] uppercase tracking-[0.14em] ${
          locale === "en"
            ? "bg-[#F2F0ED]/[0.15] text-[#F2F0ED] shadow-[0_0_0_1px_rgba(242,240,237,0.14)]"
            : "text-[#F2F0ED]/36 hover:text-[#F2F0ED]/55"
        }`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {t(siteCopy.language.english)}
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        aria-pressed={locale === "zh"}
        className={`${segmentBase} text-[10px] tracking-[0.12em] ${
          locale === "zh"
            ? "bg-[#F2F0ED]/[0.15] text-[#F2F0ED] shadow-[0_0_0_1px_rgba(242,240,237,0.14)]"
            : "text-[#F2F0ED]/36 hover:text-[#F2F0ED]/55"
        }`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {t(siteCopy.language.chinese)}
      </button>
    </div>
  );
}
