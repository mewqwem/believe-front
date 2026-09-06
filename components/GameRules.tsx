"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, X, Users, Trophy } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { rules } from '@/lib/rules';

function RuleVisual({ step }: { step: number }) {
  const cards = step === 4 ? ['Q♥', 'Q♣', 'Q♦', 'Q♠'] : step === 1 ? ['Q♥', '7♣', '?'] : step === 2 ? ['?', '?', '?', '?'] : ['Q♥', 'Q♠'];
  return <div aria-hidden="true" className="flex h-32 shrink-0 items-center justify-center gap-2 rounded-2xl border border-gold/15 bg-felt sm:h-40 sm:gap-3">
    {step === 0 ? <><Users className="size-12 text-gold" /><span className="mx-3 text-2xl text-gold/50">→</span><span className="rounded-full border-2 border-gold/40 px-7 py-4 font-display text-gold">BLUFF</span></> : step === 5 ? <Trophy className="size-20 text-gold" strokeWidth={1.25} /> : step === 3 ? <><span className="rounded-full border border-gold/40 px-4 py-2 text-2xl text-gold">✓</span><span className="font-display text-4xl text-ivory">?</span><span className="rounded-full border border-bluff/60 px-4 py-2 text-2xl text-red-300">✕</span></> : cards.map((card, index) => <span key={index} className={`flex h-20 w-12 items-center justify-center rounded-lg border shadow-lg sm:h-24 sm:w-16 ${card === '?' ? 'border-gold/50 bg-panel text-gold' : 'border-ivory/40 bg-ivory text-ink'}`} style={{ transform: `rotate(${(index - (cards.length - 1) / 2) * 7}deg)` }}><span className="font-display text-xl">{card}</span></span>)}
  </div>;
}

export function GameRules() {
  const { locale } = useI18n();
  const copy = rules[locale];
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const current = copy.steps[step];
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const go = (next: number) => {
    setStep(Math.max(0, Math.min(copy.steps.length - 1, next)));
    content.current?.scrollTo({ top: 0 });
  };
  return <>
    <button ref={trigger} type="button" title={copy.open} aria-label={copy.open} aria-haspopup="dialog" onClick={() => { setStep(0); dialog.current?.showModal(); setOpen(true); }} className="flex size-9 items-center justify-center rounded-lg text-gold transition hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-gold"><Info size={19} /></button>
    <dialog ref={dialog} aria-labelledby="rules-title" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(step + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(step - 1); }
    }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-3xl border border-gold/30 bg-panel p-0 text-ivory shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm [--radius:0.75rem]">
      <div className="flex max-h-[90dvh] flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-gold/15 px-5 py-4">
          <h2 id="rules-title" className="font-display text-lg text-gold">{copy.title}</h2>
          <button type="button" aria-label={copy.close} onClick={() => dialog.current?.close()} className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-gold"><X size={20} /></button>
        </header>
        <div ref={content} className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7" onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={(event) => {
          const start = touchStart.current; touchStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0]; const dx = touch.clientX - start.x; const dy = touch.clientY - start.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(step + (dx < 0 ? 1 : -1));
        }}>
          <RuleVisual step={step} />
          <div aria-live="polite" aria-atomic="true">
            <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-gold/70">{copy.step} {step + 1} / {copy.steps.length}</p>
            <h3 className="font-display text-2xl leading-tight text-ivory">{current.title}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ivory/80">{current.body}</p>
            <p className="mt-4 rounded-xl border-l-2 border-gold bg-gold/5 p-3 text-sm leading-relaxed text-gold">{current.tip}</p>
          </div>
        </div>
        <footer className="shrink-0 border-t border-gold/15 px-5 py-4">
          <div className="mb-4 flex justify-center gap-2">{copy.steps.map((item, index) => <button key={index} type="button" aria-label={`${copy.step} ${index + 1}: ${item.title}`} aria-current={index === step ? 'step' : undefined} onClick={() => go(index)} className="flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-gold"><span className={`h-1.5 rounded-full ${index === step ? 'w-6 bg-gold' : 'w-1.5 bg-gold/30'}`} /></button>)}</div>
          <div className="flex items-center justify-between gap-3">
            <button type="button" disabled={step === 0} onClick={() => go(step - 1)} className="flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm text-ivory/80 hover:bg-gold/10 disabled:opacity-30"><ChevronLeft size={17} />{copy.back}</button>
            <button type="button" onClick={() => step === copy.steps.length - 1 ? dialog.current?.close() : go(step + 1)} className="flex items-center gap-1 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-ink">{step === copy.steps.length - 1 ? copy.done : copy.next}<ChevronRight size={17} /></button>
          </div>
        </footer>
      </div>
    </dialog>
  </>;
}
