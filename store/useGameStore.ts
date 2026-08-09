// store/useGameStore.ts
import { create } from "zustand";
import { socket } from "@/lib/socket";
import { Card, Rank, RoomState } from "@/types/game";

interface GameStore {
  playerId: string | null;
  playerName: string;
  room: RoomState;
  hand: Card[];
  selectedCardIds: string[];
  selectedClaimRank: Rank;
  logs: string[];
  latestToast: string | null;
  roomNotFound: boolean;

  // Actions
  connectSocket: () => void;
  disconnectSocket: () => void;
  setPlayerName: (name: string) => void;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  rejoinRoom: (roomId: string) => void;
  leaveRoom: () => void; // Added leave action
  startGame: () => void;
  toggleCardSelection: (cardId: string) => void;
  setSelectedClaimRank: (rank: Rank) => void;
  playCards: () => void;
  respond: (action: "BELIEVE" | "DOUBT") => void;
  clearToast: () => void;
}

const initialRoomState: RoomState = {
  roomId: null,
  status: "LOBBY",
  claimedRank: null,
  tablePileCount: 0,
  currentTurnIndex: 0,
  players: [],
  finishOrder: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  playerId: null,
  playerName: "",
  room: initialRoomState,
  hand: [],
  selectedCardIds: [],
  selectedClaimRank: "6",
  logs: [],
  latestToast: null,
  roomNotFound: false,

  connectSocket: () => {
    let storedPlayerId = localStorage.getItem("blefPlayerId");
    if (!storedPlayerId) {
      storedPlayerId = crypto.randomUUID();
      localStorage.setItem("blefPlayerId", storedPlayerId);
    }
    set({ playerId: storedPlayerId });

    if (socket.connected) return;

    socket.removeAllListeners();

    socket.on("ROOM_CREATED", ({ roomId }) => {
      set((state) => ({ room: { ...state.room, roomId } }));
    });

    socket.on("REJOINED", ({ roomId, status }) => {
      set((state) => ({
        room: { ...state.room, roomId, status },
        roomNotFound: false,
      }));
    });

    socket.on("JOINED", () => {});

    socket.on("ROOM_UPDATED", (roomData) => {
      set({ room: roomData, roomNotFound: false });
    });

    socket.on("HAND_UPDATED", ({ hand }) => {
      set({ hand, selectedCardIds: [] });
    });

    socket.on("GAME_LOG", ({ message }) => {
      set((state) => ({
        logs: [message, ...state.logs],
        latestToast: message,
      }));
    });

    socket.on("GAME_OVER", ({ reason, loserId }) => {
      set((state) => ({
        room: { ...state.room, status: "FINISHED", loserId },
        latestToast: `Гра закінчена! Причина: ${reason}`,
      }));
    });

    socket.on("ERROR", ({ message }) => {
      set({ latestToast: `Помилка: ${message}` });
      if (message.includes("не знайдена") || message.includes("не знайдено")) {
        set({ roomNotFound: true });
      }
    });

    socket.connect();
  },

  rejoinRoom: (roomId) => {
    const { playerId } = get();
    if (!playerId) return;
    socket.emit("REJOIN_ROOM", { roomId, playerId });
  },

  leaveRoom: () => {
    const { room, playerId } = get();
    if (room.roomId && playerId) {
      socket.emit("LEAVE_ROOM", { roomId: room.roomId, playerId });
    }

    // Clear state synchronously
    set({
      room: initialRoomState,
      hand: [],
      selectedCardIds: [],
      logs: [],
      latestToast: null,
      roomNotFound: false,
    });
    // Also clear player identity to avoid immediate rejoin/redirect
    localStorage.removeItem("blefPlayerId");
    set({ playerId: null });
  },

  disconnectSocket: () => {
    if (socket.connected) {
      socket.disconnect();
    }
    socket.removeAllListeners();
  },

  setPlayerName: (name) => set({ playerName: name }),

  createRoom: () => {
    const { playerName } = get();
    let { playerId } = get();
    if (!playerId) {
      const storedPlayerId = crypto.randomUUID();
      localStorage.setItem("blefPlayerId", storedPlayerId);
      playerId = storedPlayerId;
      set({ playerId });
    }
    if (playerName.trim() && playerId) {
      socket.emit("CREATE_ROOM", { playerName, playerId });
    }
  },

  joinRoom: (roomId) => {
    const { playerName } = get();
    let { playerId } = get();
    if (!playerId) {
      const storedPlayerId = crypto.randomUUID();
      localStorage.setItem("blefPlayerId", storedPlayerId);
      playerId = storedPlayerId;
      set({ playerId });
    }
    if (playerName.trim() && roomId && playerId) {
      socket.emit("JOIN_ROOM", { roomId, playerName, playerId });
    }
  },

  startGame: () => {
    const { room } = get();
    if (room.roomId) {
      socket.emit("START_GAME", { roomId: room.roomId });
    }
  },

  toggleCardSelection: (cardId) => {
    set((state) => {
      const exists = state.selectedCardIds.includes(cardId);
      const updated = exists
        ? state.selectedCardIds.filter((id) => id !== cardId)
        : [...state.selectedCardIds, cardId];
      return { selectedCardIds: updated };
    });
  },

  setSelectedClaimRank: (rank) => set({ selectedClaimRank: rank }),

  playCards: () => {
    const { room, selectedCardIds, selectedClaimRank } = get();
    if (!room.roomId || selectedCardIds.length === 0) return;

    socket.emit("PLAY_CARDS", {
      roomId: room.roomId,
      cardIds: selectedCardIds,
      claimedRank: selectedClaimRank,
    });
    set({ selectedCardIds: [] });
  },

  respond: (action) => {
    const { room } = get();
    if (!room.roomId) return;

    socket.emit("RESPOND", {
      roomId: room.roomId,
      action,
    });
  },

  clearToast: () => set({ latestToast: null }),
}));
