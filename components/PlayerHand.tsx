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

  // Sort cards logically by rank
  const sortedHand = useMemo(() => {
    return [...hand].sort(
      (a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank),
    );
  }, [hand]);

  // Use the new thematic colors for suits
  const getSuitDisplay = (suit: CardType["suit"]) => {
    switch (suit) {
      case "hearts":
        return { symbol: "♥", color: "text-bluff" };
      case "diamonds":
        return { symbol: "♦", color: "text-bluff" };
      case "clubs":
        return { symbol: "♣", color: "text-ink" };
      case "spades":
        return { symbol: "♠", color: "text-ink" };
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gold/20 bg-panel/90 p-6 shadow-xl">
      {/* Rank selection picker when starting a new pile */}
      {showRankPicker && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-ivory/80">
            Заявити ранг:
          </span>
          <div className="flex flex-wrap gap-2">
            {RANKS.map((rank) => {
              const isSelected = selectedClaimRank === rank;
              return (
                <button
                  key={rank}
                  type="button"
                  onClick={() => setSelectedClaimRank(rank)}
                  className={`min-w-10 cursor-pointer rounded-lg border px-3 py-2 font-display text-base font-bold transition-all ${
                    isSelected
                      ? "border-gold bg-gold/20 text-gold shadow-sm shadow-gold/20"
                      : "border-gold/20 bg-felt text-ivory/70 hover:border-gold/80 hover:bg-gold/10 hover:text-ivory"
                  }`}
                >
                  {rank}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cards container */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm font-semibold uppercase text-ivory/80">
          <span>Твоя рука ({hand.length})</span>
          <span>Вибрано: {selectedCardIds.length}</span>
        </div>

        <div className="flex min-h-[140px] flex-wrap items-end gap-2 overflow-x-auto pb-4 pt-6">
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
                  borderColor: isSelected ? "#C9A96A" : "transparent",
                }}
                // Added cursor-pointer for intuitive card selection
                className={`relative flex h-32 w-24 cursor-pointer select-none flex-col justify-between rounded-xl bg-ivory p-2.5 shadow-lg shadow-black/40 ring-1 ring-black/10 transition-shadow ${
                  isSelected
                    ? "shadow-gold/40 border-2"
                    : "border-2 border-transparent hover:ring-black/30"
                }`}
              >
                {/* Top-left rank and suit */}
                <div
                  className={`flex flex-col font-display leading-none ${color}`}
                >
                  <span className="text-xl font-bold">{card.rank}</span>
                  <span className="text-lg">{symbol}</span>
                </div>

                {/* Bottom-right inverted rank and suit */}
                <div
                  className={`flex flex-col items-end rotate-180 font-display leading-none ${color}`}
                >
                  <span className="text-xl font-bold">{card.rank}</span>
                  <span className="text-lg">{symbol}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gold/20 pt-4 sm:flex-row">
        <div className="text-base">
          {isMyTurn ? (
            <span className="animate-pulse font-semibold text-gold">
              ⚡ Твій хід! Вибери карти та натисни кнопку ходу.
            </span>
          ) : (
            <span className="text-ivory/80">
              Зараз хід:{" "}
              <strong className="text-ivory">
                {activePlayer?.name || "..."}
              </strong>
            </span>
          )}
        </div>

        {/* Play cards button - updated with pointer and disabled cursors */}
        <Button
          onClick={playCards}
          disabled={!isMyTurn || !hasSelectedCards}
          className="cursor-pointer w-full bg-gold px-8 py-6 text-lg font-bold text-ink shadow-lg transition-all hover:-translate-y-1 hover:bg-gold hover:brightness-110 hover:shadow-gold/30 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:w-auto"
        >
          {hasSelectedCards
            ? `Покласти карти (${selectedCardIds.length} шт)`
            : "Виберіть карти для ходу"}
        </Button>
      </div>
    </div>
  );
};
