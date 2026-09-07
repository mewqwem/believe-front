"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";

export function GameToasts() {
  const latestToast = useGameStore((state) => state.latestToast);
  const clearToast = useGameStore((state) => state.clearToast);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!latestToast) return;
    const timer = setTimeout(clearToast, 6000);
    return () => clearTimeout(timer);
  }, [latestToast, clearToast]);

  return <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-3 top-24 z-50 mx-auto max-w-lg sm:left-auto sm:right-6 sm:mx-0">
    <AnimatePresence mode="wait">
      {latestToast && <motion.div
        key={latestToast}
        initial={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
        className="rounded-xl border border-gold/50 bg-panel/95 px-4 py-3 shadow-2xl backdrop-blur-md [--radius:0.75rem]"
      >
        <p className="break-words text-sm font-medium leading-relaxed text-ivory sm:text-base">{latestToast}</p>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
