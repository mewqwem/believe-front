// components/SocketProvider.tsx
"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const connectSocket = useGameStore((s) => s.connectSocket);

  useEffect(() => {
    // We purposefully do NOT disconnect the socket here.
    // The connection must stay alive while the tab is open,
    // persisting across page navigations.
    connectSocket();
  }, [connectSocket]);

  return <>{children}</>;
}
