// app/room/[roomId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { GameTable } from "@/components/GameTable";
import { PlayerHand } from "@/components/PlayerHand";
import { ActionPanel } from "@/components/ActionPanel";
import { GameLog } from "@/components/GameLog";
import { Button } from "@/components/ui/button";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const restartGame = useGameStore((s) => s.restartGame);
  const router = useRouter();
  const { room, playerId, rejoinRoom, leaveRoom, startGame, roomNotFound } =
    useGameStore();

  // State to track status for link copy vs code copy
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

  // Function to copy full invite URL
  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/?code=${params.roomId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Function to copy ONLY the room code
  const handleCopyOnlyCode = () => {
    navigator.clipboard.writeText(params.roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
        <header className="flex flex-col gap-4 border-b border-gold/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between sm:block">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-gold">
                BLUFF ROOM
              </h1>

              {/* Clickable element to copy ONLY the code */}
              <button
                type="button"
                onClick={handleCopyOnlyCode}
                className="group flex cursor-pointer items-center gap-1.5 text-xs md:text-sm text-ivory/70 transition-colors hover:text-gold focus:outline-none"
              >
                <span>
                  Код:{" "}
                  <strong className="font-mono text-gold underline decoration-gold/30 underline-offset-2">
                    {room.roomId}
                  </strong>
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {copiedCode ? "✓ код скопійовано" : "(копіювати код)"}
                </span>
              </button>
            </div>

            {/* Mobile invite link button */}
            <Button
              onClick={handleCopyInviteLink}
              variant="outline"
              size="sm"
              className="sm:hidden cursor-pointer border-gold/30 bg-panel text-xs text-gold transition-colors hover:bg-gold/20"
            >
              {copiedLink ? "Скопійовано!" : "Запросити"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Desktop invite link button */}
            <Button
              onClick={handleCopyInviteLink}
              variant="outline"
              className="hidden sm:inline-flex cursor-pointer border-gold/30 bg-panel font-medium text-gold transition-colors hover:bg-gold/20"
            >
              {copiedLink ? "Посилання скопійовано!" : "Запросити друга"}
            </Button>

            {room.status === "LOBBY" && (
              <Button
                onClick={startGame}
                disabled={room.players.length < 2}
                className="flex-1 sm:flex-initial cursor-pointer bg-gold font-bold text-ink transition-all hover:bg-gold hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Розпочати ({room.players.length}/4)
              </Button>
            )}

            {room.status === "FINISHED" && (
              <Button
                onClick={restartGame}
                className="flex-1 sm:flex-initial cursor-pointer bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              >
                Нове коло
              </Button>
            )}

            <Button
              onClick={handleLeave}
              variant="outline"
              className="cursor-pointer border-gold/30 bg-panel font-medium text-ivory transition-colors hover:bg-gold/20"
            >
              Вийти
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
