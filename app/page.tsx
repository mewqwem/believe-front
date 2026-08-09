// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Lobby } from "@/components/Lobby";

export default function HomePage() {
  const router = useRouter();
  const room = useGameStore((s) => s.room);

  // Redirect to the dynamic room page when a room is created or joined
  useEffect(() => {
    if (room.roomId) {
      router.push(`/room/${room.roomId}`);
    }
  }, [room.roomId, router]);

  return <Lobby />;
}
