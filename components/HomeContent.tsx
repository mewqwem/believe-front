"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Lobby } from "@/components/Lobby";
import type { AccountUser } from "@/lib/auth/session";

export function HomeContent({ user, unavailable }: { user: AccountUser | null; unavailable: boolean }) {
  const router = useRouter();
  const roomId = useGameStore((s) => s.room.roomId);
  const roomNotFound = useGameStore((s) => s.roomNotFound);
  const navigatingTo = useRef<string | null>(null);

  useEffect(() => {
    if (!roomId || roomNotFound) { navigatingTo.current = null; return; }
    if (navigatingTo.current === roomId) return;
    navigatingTo.current = roomId;
    router.replace(`/room/${roomId}`);
  }, [roomId, roomNotFound, router]);

  return <Lobby user={user} unavailable={unavailable} />;
}
