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
  joining: boolean;
  joinError: string | null;
  restartGame: () => void;
  discardSet: () => void;

  // Actions
  connectSocket: () => void;
  disconnectSocket: () => void;
  setPlayerName: (name: string) => void;
  createRoom: (name?: string, avatar?: string | null, maxPlayers?: number) => void;
  joinRoom: (roomId: string, name?: string, avatar?: string | null) => void;
  rejoinRoom: (roomId: string) => void;
  leaveRoom: () => void; // Added leave action
  startGame: () => void;
  toggleCardSelection: (cardId: string) => void;
  setSelectedClaimRank: (rank: Rank) => void;
  playCards: () => void;
  respond: (action: "BELIEVE" | "DOUBT") => void;
  clearToast: () => void;
}

const errorTranslationKeys: Record<string, string> = {
  ROOM_FULL: "lobby.roomFull",
  GAME_ALREADY_STARTED: "lobby.gameAlreadyStarted",
  ROOM_NOT_FOUND: "lobby.roomNotFound",
  PLAYER_ALREADY_IN_ROOM: "lobby.playerAlreadyInRoom",
};

const initialRoomState: RoomState = {
  roomId: null,
  maxPlayers: 4,
  status: "LOBBY",
  claimedRank: null,
  tablePileCount: 0,
  currentTurnIndex: 0,
  players: [],
  finishOrder: [],
  reconnectGraceMs: 30000,
};

let joinTimer: ReturnType<typeof setTimeout> | undefined;
const clearJoinTimer = () => { clearTimeout(joinTimer); joinTimer = undefined; };

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
  joining: false,
  joinError: null,

  connectSocket: () => {
    let storedPlayerId = sessionStorage.getItem("blefPlayerId");
    if (!storedPlayerId) {
      storedPlayerId = crypto.randomUUID();
      sessionStorage.setItem("blefPlayerId", storedPlayerId);
    }
    const storedPlayerName = localStorage.getItem("blefPlayerName") || "";

    set({ playerId: storedPlayerId, playerName: storedPlayerName });

    if (socket.connected) return;

    socket.removeAllListeners();

    socket.on("ROOM_CREATED", ({ roomId }) => {
      clearJoinTimer();
      set((state) => ({ room: { ...state.room, roomId }, joining: false, joinError: null, roomNotFound: false }));
    });

    socket.on("REJOINED", ({ roomId, status }) => {
      set((state) => ({
        room: { ...state.room, roomId, status },
        roomNotFound: false,
      }));
    });

    socket.on("JOINED", () => { clearJoinTimer(); set({ joining: false, joinError: null }); });

    socket.on("ROOM_UPDATED", (roomData) => {
      // Ignore late updates from a room we have left.
      if (!roomData.players.some((player: { id: string }) => player.id === get().playerId)) return;
      set({
        room: {
          ...roomData,
          maxPlayers: roomData.maxPlayers ?? 4,
        },
        roomNotFound: false,
      });
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

    socket.on("connect_error", () => {
      clearJoinTimer();
      set({ joining: false, joinError: "account.connectionError" });
    });

    socket.on("ERROR", ({ code, message }: { code?: string; message?: string } = {}) => {
      clearJoinTimer();
      const errorKey = (code && errorTranslationKeys[code]) || message || "lobby.genericError";
      set({ latestToast: `Помилка: ${message || errorKey}`, joining: false, joinError: errorKey });
      if (code === "ROOM_NOT_FOUND" || message?.includes("не знайдена") || message?.includes("не знайдено")) {
        set({ roomNotFound: true, room: initialRoomState, hand: [], selectedCardIds: [] });
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

    clearJoinTimer();
    // Clear state synchronously
    set({
      joining: false,
      joinError: null,
      room: initialRoomState,
      hand: [],
      selectedCardIds: [],
      logs: [],
      latestToast: null,
      roomNotFound: false,
    });
    // Also clear player identity to avoid immediate rejoin/redirect
    sessionStorage.removeItem("blefPlayerId");
    set({ playerId: null });
  },

  disconnectSocket: () => {
    if (socket.connected) {
      socket.disconnect();
    }
    socket.removeAllListeners();
  },

  setPlayerName: (name) => {
    set({ playerName: name });
    localStorage.setItem("blefPlayerName", name);
  },

  createRoom: (name, avatar = null, maxPlayers = 4) => {
    if (get().joining) return;
    const playerName = name ?? get().playerName;
    let { playerId } = get();
    if (!playerId) {
      const storedPlayerId = crypto.randomUUID();
      sessionStorage.setItem("blefPlayerId", storedPlayerId);
      playerId = storedPlayerId;
      set({ playerId });
    }
    if (playerName.trim() && playerId) {
      if (!socket.connected) { set({ joinError: "account.connectionError", joining: false }); return; }
      set({ joining: true, joinError: null, roomNotFound: false });
      clearJoinTimer();
      joinTimer = setTimeout(() => set({ joining: false, joinError: "lobby.joinTimeout" }), 10000);
      socket.emit("CREATE_ROOM", { playerName, playerId, avatar, maxPlayers });
    }
  },

  joinRoom: (roomId, name, avatar = null) => {
    if (get().joining) return;
    const playerName = name ?? get().playerName;
    let { playerId } = get();
    if (!playerId) {
      const storedPlayerId = crypto.randomUUID();
      sessionStorage.setItem("blefPlayerId", storedPlayerId);
      playerId = storedPlayerId;
      set({ playerId });
    }
    if (playerName.trim() && roomId && playerId) {
      if (!socket.connected) { set({ joinError: "account.connectionError", joining: false }); return; }
      set({ joining: true, joinError: null, roomNotFound: false });
      clearJoinTimer();
      joinTimer = setTimeout(() => set({ joining: false, joinError: "lobby.joinTimeout" }), 10000);
      socket.emit("JOIN_ROOM", { roomId, playerName, playerId, avatar });
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

  discardSet: () => {
    const { room, selectedCardIds } = get();
    if (!room.roomId || selectedCardIds.length !== 4) return;

    socket.emit("DISCARD_SET", {
      roomId: room.roomId,
      cardIds: selectedCardIds,
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

  restartGame: () => {
    const { room } = get();
    if (room.roomId) {
      socket.emit("RESTART_GAME", { roomId: room.roomId });
    }
  },
}));
