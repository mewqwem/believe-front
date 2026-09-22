// components/PlayerHand.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Card as CardType, Rank } from "@/types/game";
import { useI18n } from "@/components/I18nProvider";

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
const CLAIMABLE_RANKS = RANKS.filter((rank) => rank !== "A");

export const PlayerHand: React.FC = () => {
  const { t } = useI18n();
  const {
    playerId,
    room,
    hand,
    selectedCardIds,
    toggleCardSelection,
    selectedClaimRank,
    setSelectedClaimRank,
    playCards,
    discardSet,
  } = useGameStore();

  const isNewClaim = room.tablePileCount === 0;
  const { players, currentTurnIndex } = room;
  const activePlayer = players[currentTurnIndex];
  const isMyTurn = Boolean((room.status === "PLAYING" || room.status === "IN_PROGRESS") && playerId && activePlayer?.id === playerId && !room.finishOrder.includes(playerId));
  const hasSelectedCards = selectedCardIds.length > 0;
  const showRankPicker = isMyTurn && isNewClaim;
  const selectedCards = hand.filter((card) =>
    selectedCardIds.includes(card.id),
  );
  const canDiscardSet =
    selectedCards.length === 4 &&
    selectedCards.every((card) => card.rank === selectedCards[0].rank) &&
    isMyTurn &&
    isNewClaim;

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
    <div className="flex flex-col gap-3 rounded-2xl border border-gold/20 bg-panel/90 p-3 sm:p-5 shadow-xl">
      {/* Controls */}
      <div className="flex flex-col items-center justify-between gap-4 border-b border-gold/20 pb-3 sm:flex-row">
        <div className="text-sm">
          {isMyTurn ? (
            <span className="animate-pulse font-semibold text-gold">
              {t("hand.yourTurn")}
            </span>
          ) : (
            <span className="text-ivory/80">
              {t("hand.currentTurn", { name: activePlayer?.name || "…" })}
            </span>
          )}
        </div>

        {/* Play cards button - updated with pointer and disabled cursors */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            onClick={playCards}
            disabled={!isMyTurn || !hasSelectedCards || selectedCardIds.length > 4}
            className="cursor-pointer w-full bg-gold px-5 py-5 text-base font-bold text-ink shadow-lg transition-all hover:-translate-y-1 hover:bg-gold hover:brightness-125 hover:shadow-gold/40 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:w-auto"
          >
            {hasSelectedCards
              ? t("hand.playCards", { count: selectedCardIds.length })
              : t("hand.selectCards")}
          </Button>
          {canDiscardSet && (
            <Button
              onClick={discardSet}
              variant="outline"
              className="cursor-pointer border-gold/60 px-6 py-6 text-gold transition-all hover:border-gold hover:bg-gold/30 hover:text-ivory hover:shadow-md hover:shadow-gold/15"
            >
              {t("hand.discardSet", { rank: selectedCards[0]?.rank || "" })}
            </Button>
          )}
        </div>
      </div>
      {/* Rank selection picker when starting a new pile */}
      {showRankPicker && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-ivory/80">
            {t("hand.claimRank")}
          </span>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {CLAIMABLE_RANKS.map((rank) => {
              const isSelected = selectedClaimRank === rank;
              return (
                <button
                  key={rank}
                  type="button"
                  onClick={() => setSelectedClaimRank(rank)}
                  className={`min-w-9 shrink-0 cursor-pointer rounded-lg border px-2 py-2 font-display text-base font-bold transition-all ${
                    isSelected
                      ? "border-gold bg-gold/20 text-gold shadow-sm shadow-gold/20"
                      : "border-gold/20 bg-felt text-ivory/70 transition-all hover:border-gold hover:bg-gold/25 hover:text-ivory hover:shadow-sm hover:shadow-gold/20"
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
          <span>{t("hand.yourHand", { count: hand.length })}</span>
          <span>{t("hand.selected", { count: selectedCardIds.length })}</span>
        </div>

        <div className="overflow-x-auto overscroll-x-contain" tabIndex={0} role="group" aria-label={t("hand.yourHand", { count: hand.length })}>
          <div className="relative mx-auto h-[205px]" style={{ width: Math.max(120, 100 + (sortedHand.length - 1) * 30) }}>
          {sortedHand.map((card, index) => {
            const isSelected = selectedCardIds.includes(card.id);
            const { symbol, color } = getSuitDisplay(card.suit);
            const position = sortedHand.length < 2 ? 0 : (index / (sortedHand.length - 1)) * 2 - 1;
            return <motion.button
              key={card.id}
              type="button"
              aria-label={`${card.rank}${symbol}`}
              aria-pressed={isSelected}
              onClick={() => toggleCardSelection(card.id)}
              whileHover={{ scale: 1.02 }}
              animate={{ rotate: position * 12, y: isSelected ? -24 : 0 }}
              style={{ left: 12 + index * 30, top: 50 + position * position * 18, zIndex: index, transformOrigin: "50% 100%" }}
              className={`absolute flex h-28 w-[76px] cursor-pointer select-none flex-col justify-between rounded-[10px] border-2 bg-ivory p-1.5 text-left shadow-[0_3px_10px_rgba(0,0,0,0.35)] focus-visible:!z-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${isSelected ? "border-gold shadow-gold/30" : "border-transparent"}`}
            >
              <span className={`flex flex-col font-display leading-none ${color}`}><span className="text-lg font-bold">{card.rank}</span><span className="text-base">{symbol}</span></span>
              <span aria-hidden="true" className={`self-end font-display text-2xl ${color}`}>{symbol}</span>
            </motion.button>;
          })}
          </div>
        </div>
      </div>


    </div>
  );
};
