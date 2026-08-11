// components/GameTable.tsx
"use client";

import React, { useEffect, useReducer } from "react";
import { motion } from "framer-motion";
import { Crown, Clock } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { Badge } from "@/components/ui/badge";

// Helper function to calculate remaining seconds for offline players
function secondsLeft(disconnectedAt?: number | null, graceMs?: number) {
  if (!disconnectedAt) return 0;
  // Fallback to 30s (30000ms) if graceMs is undefined in the state yet
  const grace = graceMs || 30000;
  return Math.max(0, Math.ceil((grace - (Date.now() - disconnectedAt)) / 1000));
}

export const GameTable: React.FC = () => {
  const { playerId, room } = useGameStore();
  const {
    players,
    currentTurnIndex,
    claimedRank,
    tablePileCount,
    finishOrder,
  } = room;

  // Force re-render every second to update the disconnection countdown timers
  const [, forceTick] = useReducer((c) => c + 1, 0);
  useEffect(() => {
    const interval = setInterval(forceTick, 1000);
    return () => clearInterval(interval);
  }, []);

  const activePlayer = players[currentTurnIndex];
  const isMyTurn = Boolean(playerId && activePlayer?.id === playerId);

  return (
    // Radial gradient adds a subtle spotlight effect over the green felt
    <div className="relative flex min-h-[340px] flex-col justify-between rounded-2xl border border-gold/20 bg-felt bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_70%)] p-6 shadow-inner">
      {/* Players panel */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {players.map((player, index) => {
          const isCurrent = index === currentTurnIndex;
          const isSelf = Boolean(playerId && player.id === playerId);
          const offlineStyles = player.isDisconnected
            ? "opacity-50 grayscale"
            : "";

          // Determine finish state based on the finishOrder array
          const finishPosition = finishOrder?.indexOf(player.id) ?? -1;
          const hasFinished = finishPosition !== -1;
          const isWinner = finishPosition === 0;

          return (
            <motion.div
              key={player.id}
              animate={{ scale: isCurrent ? 1.05 : 1 }}
              className={`flex flex-col items-center rounded-xl border px-4 py-3 transition-all duration-300 ${
                isWinner
                  ? "border-gold bg-gold/10 shadow-lg shadow-gold/20"
                  : hasFinished
                    ? "border-gold/10 bg-panel/40 opacity-60"
                    : isCurrent
                      ? "border-gold/80 bg-gold/5 shadow-lg shadow-gold/10"
                      : "border-gold/20 bg-panel"
              } ${offlineStyles}`}
            >
              <div className="flex items-center gap-2">
                {/* Crown for the first player to finish */}
                {isWinner && <Crown className="h-4 w-4 text-gold" />}

                <span className="font-semibold text-ivory">
                  {player.name} {isSelf && "(Ви)"}
                </span>

                {/* Current turn badge (hidden if finished) */}
                {isCurrent && !hasFinished && !player.isDisconnected && (
                  <Badge className="bg-gold text-[10px] uppercase text-ink">
                    Хід
                  </Badge>
                )}

                {/* Show generic placement badge for other players who finished */}
                {hasFinished && !isWinner && (
                  <Badge
                    variant="outline"
                    className="border-gold/30 text-[10px] uppercase text-ivory/60"
                  >
                    {finishPosition + 1} місце
                  </Badge>
                )}

                {/* Live offline countdown badge */}
                {player.isDisconnected && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1 border-none bg-bluff text-[10px] uppercase text-ivory"
                  >
                    <Clock className="h-3 w-3" />
                    {/* Access reconnectGraceMs from room state */}
                    {secondsLeft(player.disconnectedAt, room.reconnectGraceMs)}с
                  </Badge>
                )}
              </div>

              {/* Card count indicator */}
              <div className="mt-2 flex items-center gap-1.5">
                {hasFinished ? (
                  // Hide the card backs completely when the player has finished
                  <span className="text-xs font-medium text-ivory/40">
                    Вибув — карт немає
                  </span>
                ) : (
                  <>
                    <div className="flex -space-x-1">
                      {Array.from({
                        length: Math.min(player.cardCount, 5),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-4 rounded-sm border border-ink/20 bg-ivory shadow-sm"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-ivory/80">
                      {player.cardCount} карт
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Central deck and claimed rank */}
      <div className="my-8 flex flex-col items-center justify-center">
        <div className="relative flex h-28 w-44 items-center justify-center rounded-xl border border-dashed border-gold/30 bg-panel/50">
          {tablePileCount > 0 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative flex items-center justify-center">
                {/* Visual stacked cards in the center */}
                <div className="absolute -rotate-6 transform rounded-lg border border-ink/10 bg-ivory px-6 py-8 shadow-md" />
                <div className="absolute rotate-3 transform rounded-lg border border-ink/10 bg-ivory px-6 py-8 shadow-md" />
                <div className="relative z-10 rounded-lg border border-ink/20 bg-ivory px-6 py-8 shadow-xl">
                  <span className="font-display text-3xl font-bold text-ink">
                    {tablePileCount}
                  </span>
                </div>
              </div>
              <span className="mt-4 text-xs uppercase tracking-wider text-ivory/80">
                Карт на столі
              </span>
            </motion.div>
          ) : (
            <span className="text-base text-ivory/60">Стіл порожній</span>
          )}
        </div>

        {/* Display the currently claimed rank */}
        {claimedRank && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-4 flex items-center gap-2 rounded-full border border-gold/40 bg-panel px-4 py-1.5 shadow-md"
          >
            <span className="text-sm text-ivory/80">Заявлений ранг:</span>
            <span className="font-display text-xl font-bold text-gold">
              {claimedRank}
            </span>
          </motion.div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="text-center">
        <span
          className={`text-base font-medium ${
            isMyTurn ? "animate-pulse text-gold" : "text-ivory/60"
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
