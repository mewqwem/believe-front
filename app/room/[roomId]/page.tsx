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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-medium text-emerald-400 animate-pulse">
        Підключення до столу...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between gap-6 p-4 md:p-8">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400">
              BLUFF ROOM
            </h1>
            <span className="text-xs text-zinc-400">Код: {room.roomId}</span>
          </div>

          <div className="flex items-center gap-3">
            {room.status === "LOBBY" && (
              <Button
                onClick={startGame}
                disabled={room.players.length < 2}
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Розпочати гру ({room.players.length}/4)
              </Button>
            )}

            {/* Leave Room Button */}
            <Button
              onClick={handleLeave}
              variant="outline"
              className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
