// components/PlayerHand.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Card as CardType, Rank } from "@/types/game";

const RANKS: Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

export const PlayerHand: React.FC = () => {
  const {
    playerId,
    room,
    hand,
    selectedCardIds,
    toggleCardSelection,
    selectedClaimRank,
    setSelectedClaimRank,
    playCards,
  } = useGameStore();

  const isNewClaim = room.tablePileCount === 0;
  const { players, currentTurnIndex } = room;
  const activePlayer = players[currentTurnIndex];
  const isMyTurn = Boolean(playerId && activePlayer?.id === playerId);
  const hasSelectedCards = selectedCardIds.length > 0;
  const showRankPicker = isMyTurn && isNewClaim;

  const sortedHand = useMemo(() => {
    return [...hand].sort(
      (a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank),
    );
  }, [hand]);

  const getSuitDisplay = (suit: CardType["suit"]) => {
    switch (suit) {
      case "hearts":
        return { symbol: "♥", color: "text-rose-500" };
      case "diamonds":
        return { symbol: "♦", color: "text-rose-500" };
      case "clubs":
        return { symbol: "♣", color: "text-zinc-300" };
      case "spades":
        return { symbol: "♠", color: "text-zinc-300" };
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
      {showRankPicker && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Заявити ранг:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {RANKS.map((rank) => {
              const isSelected = selectedClaimRank === rank;
              return (
                <button
                  key={rank}
                  type="button"
                  onClick={() => setSelectedClaimRank(rank)}
                  className={`min-w-10 rounded-lg border px-3 py-1.5 text-sm font-bold transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/20"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {rank}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs font-semibold uppercase text-zinc-400">
          <span>Твоя рука ({hand.length})</span>
          <span>Вибрано: {selectedCardIds.length}</span>
        </div>

        <div className="flex min-h-[130px] flex-wrap items-end gap-2 overflow-x-auto pb-4 pt-6">
          {sortedHand.map((card) => {
            const isSelected = selectedCardIds.includes(card.id);
            const { symbol, color } = getSuitDisplay(card.suit);

            return (
              <motion.div
                key={card.id}
                onClick={() => toggleCardSelection(card.id)}
                whileHover={{ scale: 1.04 }}
                animate={{
                  y: isSelected ? -16 : 0,
                  borderColor: isSelected ? "#10b981" : "#3f3f46",
                }}
                className={`relative flex h-28 w-20 cursor-pointer select-none flex-col justify-between rounded-xl border-2 bg-zinc-950 p-2.5 shadow-lg transition-shadow ${
                  isSelected ? "shadow-emerald-500/20" : "hover:border-zinc-500"
                }`}
              >
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold text-zinc-100">
                    {card.rank}
                  </span>
                  <span className={`text-base ${color}`}>{symbol}</span>
                </div>
                <div className="flex flex-col items-end rotate-180 leading-none">
                  <span className="text-sm font-bold text-zinc-100">
                    {card.rank}
                  </span>
                  <span className={`text-base ${color}`}>{symbol}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-4 sm:flex-row">
        <div className="text-sm">
          {isMyTurn ? (
            <span className="font-semibold text-emerald-400 animate-pulse">
              ⚡ Твій хід! Вибери карти та натисни кнопку ходу.
            </span>
          ) : (
            <span className="text-zinc-400">
              Зараз хід:{" "}
              <strong className="text-zinc-200">
                {activePlayer?.name || "..."}
              </strong>
            </span>
          )}
        </div>

        <Button
          onClick={playCards}
          disabled={!isMyTurn || !hasSelectedCards}
          className="w-full bg-emerald-600 px-8 py-6 text-base font-bold text-white shadow-lg hover:bg-emerald-500 disabled:opacity-40 sm:w-auto"
        >
          {hasSelectedCards
            ? `Покласти карти (${selectedCardIds.length} шт)`
            : "Виберіть карти для ходу"}
        </Button>
      </div>
    </div>
  );
};
