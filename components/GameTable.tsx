// components/GameTable.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Badge } from "@/components/ui/badge";

export const GameTable: React.FC = () => {
  const { playerId, room } = useGameStore();
  // Extracted finishOrder from the room object
  const {
    players,
    currentTurnIndex,
    claimedRank,
    tablePileCount,
    finishOrder,
  } = room;

  const activePlayer = players[currentTurnIndex];
  const isMyTurn = Boolean(playerId && activePlayer?.id === playerId);

  return (
    <div className="relative flex min-h-[340px] flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-inner">
      {/* Players panel */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {players.map((player, index) => {
          const isCurrent = index === currentTurnIndex;
          const isSelf = Boolean(playerId && player.id === playerId);

          // Apply dimming effect if the player is disconnected
          const offlineStyles = player.isDisconnected
            ? "opacity-50 grayscale"
            : "";

          return (
            <motion.div
              key={player.id}
              animate={{ scale: isCurrent ? 1.05 : 1 }}
              className={`flex flex-col items-center rounded-xl border px-4 py-3 transition-all duration-300 ${
                isCurrent
                  ? "border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-500/10"
                  : "border-zinc-800 bg-zinc-900/60"
              } ${offlineStyles}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-200">
                  {player.name} {isSelf && "(You)"}
                </span>

                {/* Current turn badge */}
                {isCurrent && !player.isDisconnected && (
                  <Badge className="bg-emerald-500 text-[10px] uppercase text-zinc-950">
                    Turn
                  </Badge>
                )}

                {/* Finish order badge (Rank) */}
                {finishOrder?.includes(player.id) && (
                  <Badge className="bg-amber-500 text-[10px] font-bold text-zinc-950">
                    {finishOrder.indexOf(player.id) + 1} місце
                  </Badge>
                )}

                {/* Offline status badge */}
                {player.isDisconnected && (
                  <Badge
                    variant="destructive"
                    className="border-none bg-rose-900/80 text-[10px] uppercase text-rose-200"
                  >
                    Офлайн
                  </Badge>
                )}
              </div>

              {/* Card count indicator */}
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(player.cardCount, 5) }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="h-6 w-4 rounded-sm border border-zinc-700 bg-gradient-to-br from-indigo-900 to-zinc-900"
                      />
                    ),
                  )}
                </div>
                <span className="text-xs font-medium text-zinc-400">
                  {player.cardCount} карт
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Central deck and claimed rank */}
      <div className="my-8 flex flex-col items-center justify-center">
        <div className="relative flex h-28 w-44 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40">
          {tablePileCount > 0 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute -rotate-6 transform rounded-lg border border-zinc-600 bg-zinc-800 px-6 py-8 shadow-md" />
                <div className="absolute rotate-3 transform rounded-lg border border-zinc-600 bg-zinc-800 px-6 py-8 shadow-md" />
                <div className="relative z-10 rounded-lg border border-zinc-500 bg-zinc-800 px-6 py-8 shadow-xl">
                  <span className="text-2xl font-bold text-zinc-100">
                    {tablePileCount}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-xs uppercase tracking-wider text-zinc-400">
                Карт на столі
              </span>
            </motion.div>
          ) : (
            <span className="text-sm text-zinc-500">Стіл порожній</span>
          )}
        </div>

        {/* Display the currently claimed rank if it exists */}
        {claimedRank && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-4 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5"
          >
            <span className="text-xs text-zinc-400">Заявлений ранг:</span>
            <span className="text-lg font-bold text-emerald-400">
              {claimedRank}
            </span>
          </motion.div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="text-center">
        <span
          className={`text-sm font-medium ${
            isMyTurn ? "animate-pulse text-emerald-400" : "text-zinc-500"
          }`}
        >
          {isMyTurn
            ? "Твій хід! Використовуй панель внизу для ходу."
            : `Очікуємо хід: ${activePlayer?.name || "..."}`}
        </span>
      </div>
    </div>
  );
};
