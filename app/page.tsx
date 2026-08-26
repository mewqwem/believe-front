"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Lobby } from "@/components/Lobby";

function HomeContent() {
  const router = useRouter();
  const room = useGameStore((s) => s.room);

  useEffect(() => {
    if (room.roomId) {
      router.push(`/room/${room.roomId}`);
    }
  }, [room.roomId, router]);

  return <Lobby />;
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
