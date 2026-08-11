// types/game.ts

// Full card rank definitions from 2 to A
export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
}

export interface Player {
  id: string;
  name: string;
  cardCount: number;
  isDisconnected?: boolean;
  disconnectedAt: number | null;
}

export interface RoomState {
  roomId: string | null;
  status: "LOBBY" | "IN_PROGRESS" | "FINISHED";
  claimedRank: Rank | null;
  tablePileCount: number;
  currentTurnIndex: number;
  players: Player[];
  loserId?: string;
  finishOrder: string[];
  reconnectGraceMs: number;
}
