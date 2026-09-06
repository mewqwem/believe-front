"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Spade } from "lucide-react";
import { authHref, guestHref } from "@/lib/auth/routes";
import { useI18n } from "@/components/I18nProvider";

const inputClass = "mt-2 w-full rounded-xl border border-gold/25 bg-felt/60 px-4 py-3 text-base text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25";

export function AuthForm({ mode, returnTo }: { mode: "login" | "register"; returnTo: string }) {
  const { t } = useI18n();
  const registering = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <main className="flex min-h-svh items-center justify-center bg-felt px-4 py-10 text-ivory [--radius:0.75rem]">
      <div className="w-full max-w-md">
        <Link href={guestHref(returnTo)} className="mb-8 inline-flex items-center gap-2 text-sm text-ivory/70 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold">
          <ArrowLeft size={16} /> {t("common.backToGame")}
        </Link>
        <section className="rounded-3xl border border-gold/20 bg-panel p-6 shadow-2xl sm:p-9" aria-labelledby="auth-title">
          <div className="mb-7 flex items-center gap-2 text-gold"><Spade size={22} aria-hidden="true" /><span className="font-display text-xl tracking-[0.2em]">BLUFF</span></div>
          <h1 id="auth-title" className="font-display text-3xl font-bold text-ivory">{t(registering ? "auth.registerTitle" : "auth.loginTitle")}</h1>
          <p className="mt-3 text-sm leading-6 text-ivory/65">{t(registering ? "auth.registerIntro" : "auth.loginIntro")}</p>
          <nav aria-label={t("lobby.accountNav")} className="my-7 grid grid-cols-2 rounded-xl bg-felt/70 p-1 text-sm">
            {(["login", "register"] as const).map((item) => (
              <Link key={item} href={authHref(item, returnTo)} aria-current={mode === item ? "page" : undefined} className={`rounded-lg px-3 py-2.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-gold ${mode === item ? "bg-gold/15 text-gold" : "text-ivory/60 hover:text-ivory"}`}>
                {t(item === "login" ? "auth.login" : "auth.register")}
              </Link>
            ))}
          </nav>
          <form method="post" className="space-y-5" onSubmit={async (event) => {
            event.preventDefault();
            if (pending) return;
            setMessage("");
            const values = new FormData(event.currentTarget);
            if (registering && values.get("password") !== values.get("confirmPassword")) {
              setMessage(t("auth.passwordMismatch"));
              return;
            }
            setPending(true);
            try {
              const response = await fetch(`/api/auth/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(values)),
              });
              const data = await response.json();
              if (!response.ok) {
                setMessage(data.message || t("auth.requestError"));
                return;
              }
              window.location.replace(returnTo);
            } catch {
              setMessage(t("account.connectionError"));
            } finally {
              setPending(false);
            }
          }}>
            {registering && <label className="block text-sm font-medium" htmlFor="name">{t("auth.name")}<input className={inputClass} id="name" name="name" autoComplete="nickname" placeholder={t("auth.namePlaceholder")} required minLength={2} maxLength={32} /></label>}
            <label className="block text-sm font-medium" htmlFor="email">{t("auth.email")}<input className={inputClass} id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
            <div>
              <label className="block text-sm font-medium" htmlFor="password">{t("auth.password")}</label>
              <div className="relative">
                <input className={`${inputClass} pr-14`} id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} placeholder={t(registering ? "auth.newPasswordPlaceholder" : "auth.passwordPlaceholder")} required minLength={registering ? 15 : 1} maxLength={128} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={t(showPassword ? "auth.hidePassword" : "auth.showPassword")} aria-pressed={showPassword} className="absolute inset-y-0 right-0 mt-2 px-4 text-ivory/60 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            {registering && <label className="block text-sm font-medium" htmlFor="confirm-password">{t("auth.confirmPassword")}<input className={inputClass} id="confirm-password" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={15} maxLength={128} placeholder={t("auth.confirmPasswordPlaceholder")} /></label>}
            {message && <p role="status" className="text-sm leading-6 text-gold">{message}</p>}
            <button type="submit" disabled={pending} aria-busy={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-base font-semibold text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
              {pending ? t("auth.wait") : t(registering ? "auth.create" : "auth.signIn")}<ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
          <div className="my-6 flex items-center gap-4 text-xs text-ivory/40"><span className="h-px flex-1 bg-gold/15" />{t("auth.or")}<span className="h-px flex-1 bg-gold/15" /></div>
          <Link href={guestHref(returnTo)} className="block rounded-xl border border-gold/30 px-4 py-3 text-center text-sm font-medium text-ivory transition hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-gold">{t("auth.guest")}</Link>
        </section>
        <p className="mt-6 text-center text-xs leading-5 text-ivory/45">{t("auth.tagline")}</p>
      </div>
    </main>
  );
}
