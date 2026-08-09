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

  if (status === "LOBBY" || tablePileCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-lg">
      <div className="text-sm font-medium text-zinc-200">
        На столі{" "}
        <span className="font-bold text-emerald-400">{tablePileCount}</span>{" "}
        карт(и). Перевіряємо чи ходимо далі?
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => respond("BELIEVE")}
          disabled={!isMyTurn}
          variant="outline"
          className="border-emerald-500/60 bg-zinc-900 font-semibold text-emerald-400 hover:bg-emerald-950/60"
        >
          👍 Вірю (пропустити перевірку)
        </Button>

        <Button
          onClick={() => respond("DOUBT")}
          disabled={!isMyTurn}
          variant="destructive"
          className="bg-rose-600 font-bold text-white shadow-md hover:bg-rose-500"
        >
          💥 НЕ ВІРЮ! (відкрити карти)
        </Button>
      </div>
    </div>
  );
};
