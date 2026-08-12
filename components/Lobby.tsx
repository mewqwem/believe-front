// components/Lobby.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Lobby: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Read query parameters from URL (e.g., domain.com/?code=X7Y9)
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("code") || "";

  // Local state for the room code input (initialized with URL parameter if present)
  const [roomCodeInput, setRoomCodeInput] = useState(inviteCode);

  const { playerName, setPlayerName, createRoom, joinRoom } = useGameStore();

  useEffect(() => {
    setIsMounted(true);
    // Auto-fill room code if passed via URL parameter
    if (inviteCode) {
      setRoomCodeInput(inviteCode.toUpperCase());
    }
  }, [inviteCode]);

  const handleConfirmCreate = (e: React.FormEvent) => {
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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-felt p-4 text-ivory">
      <Card
        className={`w-full ${isCreatingRoom || inviteCode ? "max-w-md" : "max-w-2xl"} border-gold/20 bg-panel shadow-2xl transition-all duration-300`}
      >
        <CardHeader className="text-center">
          <CardTitle className="font-display text-4xl font-bold tracking-wider text-gold">
            BLUFF
          </CardTitle>
          <p className="text-base text-ivory/70">
            {inviteCode
              ? `Тебе запрошено в кімнату ${inviteCode.toUpperCase()}`
              : isCreatingRoom
                ? "Налаштування нової кімнати"
                : "Введи своє ім`я для початку гри"}
          </p>
        </CardHeader>
        <CardContent>
          {/* 
            If the user opened a direct invite link, show a simplified single-column view 
          */}
          {inviteCode ? (
            <div className="space-y-6">
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

              <div className="space-y-2">
                <label className="text-sm font-medium uppercase text-ivory/70">
                  Код кімнати
                </label>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) =>
                    setRoomCodeInput(e.target.value.toUpperCase())
                  }
                  placeholder="КОД"
                  className="w-full rounded-lg border border-gold/30 bg-felt px-4 py-3 uppercase text-center font-mono text-xl tracking-widest text-gold focus:outline-none"
                />
              </div>

              <Button
                onClick={handleJoin}
                disabled={!playerName.trim() || !roomCodeInput.trim()}
                className="cursor-pointer w-full bg-gold py-6 text-lg font-bold text-ink transition-all hover:bg-gold hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Приєднатися до гри
              </Button>
            </div>
          ) : !isCreatingRoom ? (
            /* Main View (Split Screen) */
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-6">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase text-ivory/70">
                    Приєднатися до гри
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={roomCodeInput}
                      onChange={(e) =>
                        setRoomCodeInput(e.target.value.toUpperCase())
                      }
                      placeholder="КОД"
                      className="flex-1 rounded-lg border border-gold/30 bg-felt px-4 py-2 uppercase text-center font-mono tracking-widest text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
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
              </div>

              <div className="hidden md:block w-px bg-gold/20" />
              <div className="block md:hidden h-px w-full bg-gold/20" />

              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-ivory">
                    Створити свою гру
                  </h3>
                  <p className="text-sm text-ivory/70">
                    Стань хостом та запроси друзів
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreatingRoom(true)}
                  className="cursor-pointer w-full bg-gold py-6 text-lg font-bold text-ink transition-all hover:bg-gold hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Створити кімнату
                </Button>
              </div>
            </div>
          ) : (
            /* Settings View */
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase text-ivory/70">
                  Ім`я гравця (Хост)
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Наприклад, Олеже"
                  className="w-full rounded-lg border border-gold/30 bg-felt px-4 py-3 text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="space-y-2 p-4 border border-dashed border-gold/30 rounded-lg bg-felt/50 flex items-center justify-center min-h-[100px]">
                <p className="text-sm text-ivory/50 text-center">
                  Тут будуть налаштування гри
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setIsCreatingRoom(false)}
                  variant="secondary"
                  className="cursor-pointer flex-1 border border-gold/30 bg-felt text-ivory transition-colors hover:bg-gold/20"
                >
                  Назад
                </Button>
                <Button
                  onClick={handleConfirmCreate}
                  disabled={!playerName.trim()}
                  className="cursor-pointer flex-1 bg-gold py-6 text-lg font-bold text-ink transition-all hover:bg-gold hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Почати гру
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
