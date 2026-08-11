// app/room/[roomId]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { GameTable } from "@/components/GameTable";
import { PlayerHand } from "@/components/PlayerHand";
import { ActionPanel } from "@/components/ActionPanel";
import { GameLog } from "@/components/GameLog";
import { Button } from "@/components/ui/button";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const { room, playerId, rejoinRoom, leaveRoom, startGame, roomNotFound } =
    useGameStore();

  useEffect(() => {
    if (!playerId) return;
    if (room.roomId === params.roomId) return;

    rejoinRoom(params.roomId);
  }, [playerId, params.roomId, room.roomId, rejoinRoom]);

  useEffect(() => {
    if (roomNotFound) {
      router.push("/");
    }
  }, [roomNotFound, router]);

  const handleLeave = () => {
    leaveRoom();
    router.push("/");
  };

  if (room.roomId !== params.roomId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-felt text-lg font-medium text-gold animate-pulse">
        Підключення до столу...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-felt text-ivory">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between gap-6 p-4 md:p-8">
        <header className="flex items-center justify-between border-b border-gold/20 pb-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-gold">
              BLUFF ROOM
            </h1>
            <span className="text-sm text-ivory/70">Код: {room.roomId}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Start Game button - updated with pointer and disabled cursors */}
            {room.status === "LOBBY" && (
              <Button
                onClick={startGame}
                disabled={room.players.length < 2}
                className="cursor-pointer bg-gold font-bold text-ink transition-all hover:bg-gold hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Розпочати гру ({room.players.length}/4)
              </Button>
            )}

            {/* Leave Room Button - updated with pointer cursor */}
            <Button
              onClick={handleLeave}
              variant="outline"
              className="cursor-pointer border-gold/30 bg-panel font-medium text-ivory transition-colors hover:bg-gold/20"
            >
              Вийти з гри
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <GameTable />
          <ActionPanel />
          <PlayerHand />
          <GameLog />
        </section>
      </main>
    </div>
  );
}
