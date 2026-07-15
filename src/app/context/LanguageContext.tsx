import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router";
import type { Bilingual, Locale } from "../lib/i18n";
import {
  htmlLangForLocale,
  localeFromSearchParams,
  withLangPath,
} from "../lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** Pick localized string from a bilingual pair */
  t: (pair: Bilingual) => string;
  /** Apply current locale to a path (Chinese default omits `lang`; English uses `?lang=en`) */
  localizePath: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const locale = useMemo(
    () => localeFromSearchParams(searchParams.get("lang")),
    [searchParams]
  );

  useEffect(() => {
    document.documentElement.lang = htmlLangForLocale(locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      const nextParams = new URLSearchParams(searchParams);
      if (next === "en") nextParams.set("lang", "en");
      else nextParams.delete("lang");
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const t = useCallback((pair: Bilingual) => pair[locale], [locale]);

  const localizePath = useCallback(
    (path: string) => withLangPath(path, locale),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, localizePath }),
    [locale, setLocale, t, localizePath]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
