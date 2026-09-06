"use client";

import { createContext, useContext, useMemo } from "react";
import { Locale, translate, TranslationValues } from "@/lib/i18n";

type I18nValue = {
  locale: Locale;
  t: (key: string, values?: TranslationValues) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = useMemo<I18nValue>(() => ({
    locale,
    t: (key, values) => translate(locale, key, values),
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
