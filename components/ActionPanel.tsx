// components/ActionPanel.tsx
"use client";

import React from "react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";

export const ActionPanel: React.FC = () => {
  const { playerId, room, respond } = useGameStore();
  const { players, currentTurnIndex, tablePileCount, status } = room;

  const activePlayer = players[currentTurnIndex];
  const isMyTurn = Boolean(playerId && activePlayer?.id === playerId);

  // Hide panel if the game hasn't started or there are no cards to doubt
  if (status === "LOBBY" || tablePileCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-panel p-4 shadow-lg">
      <div className="text-base font-medium text-ivory">
        На столі{" "}
        <span className="font-display text-xl font-bold text-gold">
          {tablePileCount}
        </span>{" "}
        карт(и). Перевіряємо чи ходимо далі?
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Believe / Pass button - updated with pointer and disabled cursors */}
        <Button
          onClick={() => respond("BELIEVE")}
          disabled={!isMyTurn}
          variant="outline"
          className="cursor-pointer border-gold/60 bg-panel font-semibold text-gold transition-all hover:border-gold hover:bg-gold/30 hover:text-ivory hover:shadow-md hover:shadow-gold/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          👍 Вірю (пропустити перевірку)
        </Button>

        {/* Doubt / Call bluff button - updated with pointer and disabled cursors */}
        <Button
          onClick={() => respond("DOUBT")}
          disabled={!isMyTurn}
          variant="destructive"
          className="cursor-pointer bg-bluff font-bold text-ivory shadow-md transition-all hover:bg-bluff hover:brightness-110 hover:shadow-lg hover:shadow-bluff/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          💥 НЕ ВІРЮ! (відкрити карти)
        </Button>
      </div>
    </div>
  );
};
