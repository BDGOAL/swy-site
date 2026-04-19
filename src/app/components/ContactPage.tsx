import { useLanguage } from "../context/LanguageContext";
import { siteCopy } from "../content/siteCopy";
import { ArchiveFooter } from "./ArchiveFooter";

const CONTACT = {
  email: {
    href: "mailto:scentwithyou@gmail.com",
    display: "scentwithyou@gmail.com",
  },
  instagram: {
    href: "https://www.instagram.com/swy_parfums/",
    display: "@swy_parfums",
  },
  whatsapp: {
    href: "https://api.whatsapp.com/send?phone=85252337389",
    display: "+852 5233 7389",
  },
} as const;

function IconEmail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="6.5"
        y="11.5"
        width="27"
        height="19"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M7 13.5L19.2 22.35c.48.36 1.12.36 1.6 0L33 13.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 24.5h16"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="8.5"
        y="10.5"
        width="23"
        height="21"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <rect
        x="22"
        y="14"
        width="5.5"
        height="3.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <circle cx="20" cy="21.5" r="5.25" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="26.75" cy="15.25" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11.5 12.5h15.5a3 3 0 0 1 3 3v9.25a3 3 0 0 1-3 3h-6.75l-5.75 4.25v-4.25h-1a3 3 0 0 1-3-3v-9.25a3 3 0 0 1 3-3z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M17.75 17.25c.35-.35.9-.55 1.5-.55h1.5c1.1 0 2 .9 2 2v3.25c0 .55-.2 1.05-.55 1.4"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.75 17.25L16 15.5M22.75 24.75L21 26.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

const cardIconClass =
  "h-11 w-11 shrink-0 text-[#F2F0ED]/48 transition-colors duration-300 group-hover:text-[#F2F0ED]/72";

const cardShellClass =
  "group flex w-full items-start gap-5 border border-white/[0.1] bg-black/[0.22] px-5 py-5 transition-[border-color,background-color] duration-300 hover:border-white/[0.16] hover:bg-black/[0.32] sm:gap-6 sm:px-6 sm:py-6";

export function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full" style={{ backgroundColor: "#0A0E14" }}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              #0A0E14 0%,
              #090B10 52%,
              #080910 100%
            )`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background: `radial-gradient(ellipse 115% 65% at 50% -12%, rgba(20, 24, 32, 0.5) 18%, transparent 70%)`,
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-[1200px] px-4 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 md:px-12 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 lg:items-start">
          <header className="lg:col-span-5">
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[#F2F0ED]/42"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.contactPage.eyebrow)}
            </p>
            <h1
              className="mt-4 text-3xl font-normal leading-tight tracking-[0.04em] text-[#F2F0ED] sm:text-[2.15rem] md:text-[2.35rem]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.contactPage.title)}
            </h1>
            <p
              className="mt-5 max-w-md text-[0.9375rem] leading-[1.65] text-[#F2F0ED]/58"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.contactPage.subtitle)}
            </p>
            <p
              className="mt-8 max-w-md text-[0.875rem] leading-[1.72] text-[#F2F0ED]/48"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t(siteCopy.contactPage.intro)}
            </p>
            <p
              className="mt-8 text-[10px] uppercase tracking-[0.2em] text-[#F2F0ED]/36"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t(siteCopy.contactPage.responseNote)}
            </p>
          </header>

          <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-7">
            <a
              href={CONTACT.email.href}
              className={cardShellClass}
              aria-label={`${t(siteCopy.contactPage.emailLabel)}: ${CONTACT.email.display}`}
            >
              <IconEmail className={cardIconClass} />
              <span className="min-w-0 flex-1 text-left">
                <span
                  className="block text-[9px] uppercase tracking-[0.24em] text-[#F2F0ED]/40"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t(siteCopy.contactPage.emailLabel)}
                </span>
                <span
                  className="mt-2 block text-[0.9375rem] tracking-[0.02em] text-[#F2F0ED]/88 transition-colors duration-300 group-hover:text-[#F2F0ED]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {CONTACT.email.display}
                </span>
              </span>
            </a>

            <a
              href={CONTACT.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardShellClass}
              aria-label={`${t(siteCopy.contactPage.instagramLabel)}: ${CONTACT.instagram.display}`}
            >
              <IconInstagram className={cardIconClass} />
              <span className="min-w-0 flex-1 text-left">
                <span
                  className="block text-[9px] uppercase tracking-[0.24em] text-[#F2F0ED]/40"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t(siteCopy.contactPage.instagramLabel)}
                </span>
                <span
                  className="mt-2 block text-[0.9375rem] tracking-[0.02em] text-[#F2F0ED]/88 transition-colors duration-300 group-hover:text-[#F2F0ED]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {CONTACT.instagram.display}
                </span>
              </span>
            </a>

            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardShellClass}
              aria-label={`${t(siteCopy.contactPage.whatsappLabel)}: ${CONTACT.whatsapp.display}`}
            >
              <IconWhatsApp className={cardIconClass} />
              <span className="min-w-0 flex-1 text-left">
                <span
                  className="block text-[9px] uppercase tracking-[0.24em] text-[#F2F0ED]/40"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {t(siteCopy.contactPage.whatsappLabel)}
                </span>
                <span
                  className="mt-2 block text-[0.9375rem] tracking-[0.02em] text-[#F2F0ED]/88 transition-colors duration-300 group-hover:text-[#F2F0ED]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {CONTACT.whatsapp.display}
                </span>
              </span>
            </a>
          </div>
        </div>
      </main>

      <ArchiveFooter />
    </div>
  );
}
