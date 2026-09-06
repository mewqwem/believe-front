"use client";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useI18n } from "@/components/I18nProvider";
import { PlayerSeat } from "@/components/PlayerSeat";
import type { Player } from "@/types/game";

export const GameTable = () => {
  const { t } = useI18n();
  const { playerId, room } = useGameStore();
  const { players, currentTurnIndex, claimedRank, tablePileCount, finishOrder } = room;
  const [now, setNow] = useState(0);
  const hasDisconnected = players.some((player) => player.isDisconnected);
  useEffect(() => {
    if (!hasDisconnected) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [hasDisconnected]);
  const playing = room.status === 'PLAYING' || room.status === 'IN_PROGRESS';
  const finished = room.status === 'GAME_OVER' || room.status === 'FINISHED';
  const activePlayer = players[currentTurnIndex];
  // Rotate only visual seats, preserving the server's turn order.
  const selfIndex = players.findIndex((player) => player.id === playerId);
  const pivot = selfIndex < 0 ? 0 : selfIndex;
  const seats = [...players.slice(pivot), ...players.slice(0, pivot)];
  const bottom = seats[0];
  const others = seats.slice(1);
  const topIndex = Math.floor(others.length / 2);
  const top = others[topIndex];
  const left = others.slice(0, topIndex).reverse();
  const right = others.slice(topIndex + 1);
  const rows = Math.max(left.length, right.length, 1);
  const seat = (player: Player) => {
    const place = (finishOrder?.indexOf(player.id) ?? -1) + 1;
    const seconds = player.disconnectedAt ? Math.max(0, Math.ceil(((room.reconnectGraceMs || 30000) - (Math.max(now, player.disconnectedAt) - player.disconnectedAt)) / 1000)) : 0;
    return <PlayerSeat key={player.id} player={player} isSelf={player.id === playerId} isCurrent={playing && player.id === activePlayer?.id && !place} place={place} seconds={seconds} playing={playing || finished} />;
  };
  return <section aria-label={t('table.label')} className="rounded-3xl border border-gold/15 bg-panel/40 px-1 py-5 shadow-inner">
    <div className="relative isolate grid grid-cols-[minmax(0,1fr)_minmax(88px,1.2fr)_minmax(0,1fr)] items-center gap-x-1 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(160px,2fr)_minmax(0,1fr)]" style={{ gridTemplateRows: `auto repeat(${rows}, minmax(150px, auto)) auto` }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] inset-y-12 -z-10 rounded-[45%] border-[8px] border-gold/15 bg-felt bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07),transparent_75%)] shadow-[inset_0_0_35px_rgba(0,0,0,0.4),0_12px_30px_rgba(0,0,0,0.25)]" />
      <div className="col-start-2 row-start-1 min-w-0">{top && seat(top)}</div>
      {left.map((player, index) => <div key={player.id} className="col-start-1 min-w-0" style={{ gridRow: index + 2 }}>{seat(player)}</div>)}
      {right.map((player, index) => <div key={player.id} className="col-start-3 min-w-0" style={{ gridRow: index + 2 }}>{seat(player)}</div>)}
      <div className="col-start-2 flex min-w-0 flex-col items-center justify-center gap-3 text-center" style={{ gridRow: `2 / span ${rows}` }}>
        {tablePileCount > 0 ? <><div className="relative flex h-24 w-16 items-center justify-center rounded-lg border-2 border-gold/50 bg-panel shadow-[5px_4px_0_#d9c9a0,-4px_-3px_0_#ece3ce] sm:h-28 sm:w-20"><span className="font-display text-3xl text-gold">{tablePileCount}</span></div><span className="text-[10px] uppercase tracking-wide text-ivory/60 sm:text-xs">{t('table.cardsOnTable')}</span></> : <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-gold/20 px-2 text-xs text-ivory/50">{t(room.status === 'LOBBY' ? 'table.waitingPlayers' : 'table.empty')}</div>}
        {claimedRank && <div className="text-xs text-ivory/70"><span className="block">{t('table.claimedRank')}</span><strong className="font-display text-2xl text-gold">{claimedRank}</strong></div>}
      </div>
      <div className="col-start-2 min-w-0" style={{ gridRow: rows + 2 }}>{bottom && seat(bottom)}</div>
    </div>
    <p aria-live="polite" className="mx-auto mt-5 max-w-md px-3 text-center text-sm text-ivory/70">{room.status === 'LOBBY' ? t('table.lobbyHint') : finished ? t('table.gameFinished') : activePlayer?.id === playerId ? t('table.yourTurn') : t('table.waiting', { name: activePlayer?.name || '…' })}</p>
  </section>;
};
