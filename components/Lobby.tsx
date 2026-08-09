// components/Lobby.tsx
"use client";

import React, { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Lobby: React.FC = () => {
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const { playerName, setPlayerName, createRoom, joinRoom } = useGameStore();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      createRoom();
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && roomCodeInput.trim()) {
      joinRoom(roomCodeInput.trim().toUpperCase());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-zinc-100">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-wider text-emerald-400">
            BLUFF / CHEAT
          </CardTitle>
          <p className="text-sm text-zinc-400">
            Введи своє ім`я для початку гри
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-zinc-400">
              Ім`я гравця
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Наприклад, Олеже"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="h-px w-full bg-zinc-800" />

          <div className="space-y-4">
            <Button
              onClick={handleCreate}
              disabled={!playerName.trim()}
              className="w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
            >
              Створити кімнату
            </Button>

            <div className="flex gap-2">
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                placeholder="Код кімнати"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 uppercase text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              <Button
                onClick={handleJoin}
                disabled={!playerName.trim() || !roomCodeInput.trim()}
                variant="secondary"
                className="bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
              >
                Увійти
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
