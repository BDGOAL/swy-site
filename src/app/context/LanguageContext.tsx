import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router";
import type { Bilingual, Locale } from "../lib/i18n";
import { localeFromSearchParams, withLangPath } from "../lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** Pick localized string from a bilingual pair */
  t: (pair: Bilingual) => string;
  /** Append/remove `lang=zh` while preserving path and hash */
  localizePath: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const locale = useMemo(
    () => localeFromSearchParams(searchParams.get("lang")),
    [searchParams]
  );

  const setLocale = useCallback(
    (next: Locale) => {
      const nextParams = new URLSearchParams(searchParams);
      if (next === "zh") nextParams.set("lang", "zh");
      else nextParams.delete("lang");
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const t = useCallback(
    (pair: Bilingual) => pair[locale],
    [locale]
  );

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
