// components/SocketProvider.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const preview = process.env.NODE_ENV === "development" && pathname === "/dev/game-scenarios";
  const connectSocket = useGameStore((s) => s.connectSocket);

  useEffect(() => {
    if (preview) { useGameStore.getState().disconnectSocket(); return; }
    // We purposefully do NOT disconnect the socket here.
    // The connection must stay alive while the tab is open,
    // persisting across page navigations.
    connectSocket();
  }, [connectSocket, preview]);

  return <>{children}</>;
}
