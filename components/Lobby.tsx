// components/Lobby.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Lobby: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const { playerName, setPlayerName, createRoom, joinRoom } = useGameStore();

  // Prevent hydration errors by waiting for the component to mount on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Return null or a skeleton loader while rendering on the server
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-felt p-4 text-ivory">
      <Card className="w-full max-w-md border-gold/20 bg-panel shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-4xl font-bold tracking-wider text-gold">
            BLUFF
          </CardTitle>
          <p className="text-base text-ivory/70">
            Введи своє ім`я для початку гри
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase text-ivory/70">
              Ім`я гравця
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Наприклад, Олеже"
              className="w-full rounded-lg border border-gold/30 bg-felt px-4 py-3 text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="h-px w-full bg-gold/20" />

          <div className="space-y-4">
            <Button
              onClick={handleCreate}
              disabled={!playerName.trim()}
              className="cursor-pointer w-full bg-gold py-6 text-lg font-bold text-ink transition-all hover:bg-gold hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Створити кімнату
            </Button>

            <div className="flex gap-2">
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                placeholder="Код кімнати"
                className="flex-1 rounded-lg border border-gold/30 bg-felt px-4 py-2 uppercase text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <Button
                onClick={handleJoin}
                disabled={!playerName.trim() || !roomCodeInput.trim()}
                variant="secondary"
                className="cursor-pointer border border-gold/30 bg-felt text-ivory transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
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
