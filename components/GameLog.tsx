// components/GameLog.tsx
"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";

export const GameLog: React.FC = () => {
  const { logs, latestToast, clearToast } = useGameStore();

  // Auto-dismiss notification toast after 4 seconds
  useEffect(() => {
    if (latestToast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [latestToast, clearToast]);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Banner / Toast Notification */}
      <AnimatePresence>
        {latestToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-6 top-6 z-50 rounded-xl border border-gold/50 bg-panel/95 px-5 py-3 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-ping rounded-full bg-gold" />
              <p className="text-base font-medium text-ivory">{latestToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Move History Box */}
      <div className="rounded-2xl border border-gold/20 bg-felt/50 p-4">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ivory/70">
          Game History
        </h4>
        <div className="max-h-36 space-y-1.5 overflow-y-auto pr-2 text-sm text-ivory">
          {logs.length === 0 ? (
            <span className="text-ivory/50">No events logged yet...</span>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className=" border-l-2 border-gold/40 py-0.5 pl-2.5 opacity-90"
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
