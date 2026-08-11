"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Lobby } from "@/components/Lobby";

export default function HomePage() {
  const router = useRouter();
  const room = useGameStore((s) => s.room);

  // Redirect to the dynamic room page when a room is created or successfully joined
  // Make sure this check runs whenever the roomId state gets updated
  useEffect(() => {
    if (room.roomId) {
      router.push(`/room/${room.roomId}`);
    }
  }, [room.roomId, router]);

  // The Lobby component should now utilize the new theme classes
  // (e.g., bg-panel instead of bg-zinc-900)
  return <Lobby />;
}
