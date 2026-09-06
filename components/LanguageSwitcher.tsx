"use client";

import { GameRules } from "@/components/GameRules";
import { useState } from "react";
import { Locale, locales } from "@/lib/i18n";
import { useI18n } from "@/components/I18nProvider";

const labels: Record<Locale, string> = { uk: "UA", pl: "PL", en: "EN" };

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const [pending, setPending] = useState(false);

  const changeLanguage = async (next: Locale) => {
    if (next === locale || pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      if (response.ok) window.location.reload();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed right-3 top-3 z-[100] flex rounded-xl border border-gold/25 bg-panel/95 p-1 text-xs shadow-lg backdrop-blur" aria-label={t("language.label")}>
      <GameRules />
      <span aria-hidden="true" className="mx-1 my-1 w-px bg-gold/20" />
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          disabled={pending}
          aria-pressed={item === locale}
          onClick={() => changeLanguage(item)}
          className={`rounded-lg px-2.5 py-1.5 font-semibold transition-colors disabled:opacity-60 ${item === locale ? "bg-gold text-ink" : "text-ivory/70 hover:bg-gold/15 hover:text-ivory"}`}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
