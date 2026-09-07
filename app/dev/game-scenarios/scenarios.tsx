'use client';
import { useEffect, useState } from 'react';
import { GameTable } from '@/components/GameTable';
import { PlayerHand } from '@/components/PlayerHand';
import { ActionPanel } from '@/components/ActionPanel';
import { GameToasts } from '@/components/GameToasts';
import { useGameStore } from '@/store/useGameStore';
import type { Card, Rank, RoomState } from '@/types/game';

const names = ['Ти', 'Марія', 'Олександр', 'Anna', 'Тарас', 'Дуже довге ім’я гравця', 'Marta', 'Дмитро'];
const labels = ['Повний стіл', 'Твій хід', 'Викритий блеф', 'Гравець відключився', 'Перший переможець', 'Ти переміг', 'Ти програв'];
const ranks: Rank[] = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
function loadScenario(index: number) {
  const hand: Card[] = ranks.map((rank, i) => ({ id: `demo-${i}`, rank, suit: i % 2 ? 'spades' : 'hearts' }));
  const players = names.map((name, i) => ({ id: `demo-${i}`, name, cardCount: i === 0 ? 13 : 5, avatar: null, disconnectedAt: null as number | null, isDisconnected: false }));
  const room: RoomState = { roomId: 'DEMO', players, status: 'PLAYING', currentTurnIndex: 1, claimedRank: 'Q', tablePileCount: 4, finishOrder: [], reconnectGraceMs: 30000 };
  let latestToast: string | null = null;
  if (index === 1) { room.currentTurnIndex = 0; room.tablePileCount = 0; room.claimedRank = null; }
  if (index === 2) { players[1].cardCount += 4; room.tablePileCount = 0; room.claimedRank = null; room.currentTurnIndex = 0; latestToast = 'Марія блефувала! Вона забирає всі 4 карти зі столу.'; }
  if (index === 3) { players[2].isDisconnected = true; players[2].disconnectedAt = Date.now(); latestToast = 'Олександр втратив з’єднання. Чекаємо повернення…'; }
  if (index === 4) { players[1].cardCount = 0; room.finishOrder = [players[1].id]; room.currentTurnIndex = 2; latestToast = 'Марія завершила гру та посіла 1 місце!'; }
  if (index >= 5) {
    room.status = 'FINISHED'; room.tablePileCount = 0; room.claimedRank = null;
    room.finishOrder = (index === 5 ? players : [...players.slice(1), players[0]]).map(p => p.id);
    room.loserId = room.finishOrder[7];
    players.forEach(p => { if (p.id !== room.loserId) p.cardCount = 0; });
    latestToast = index === 5 ? 'Ти переміг! Перше місце.' : 'Гру завершено. Ти залишився з картами — 8 місце.';
  }
  useGameStore.setState({ playerId: 'demo-0', room, hand: index === 5 ? [] : hand, selectedCardIds: [], latestToast, roomNotFound: false, joining: false, joinError: null });
}
export function GameScenarios() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const original = useGameStore.getState();
    useGameStore.setState({ playCards: () => {}, respond: () => {}, discardSet: () => {} });
    return () => { useGameStore.setState(original); };
  }, []);
  useEffect(() => {
    loadScenario(step);
  }, [step]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setStep(value => (value + 1) % labels.length), 8000);
    return () => clearInterval(timer);
  }, [playing]);
  return <main className="mx-auto max-w-5xl p-4 pt-20">
    <h1 className="text-2xl text-gold">Сценарії гри</h1>
    <p className="my-3 text-sm">Демонстраційні стани інтерфейсу без сервера й акаунтів. Це не перевірка правил на бекенді.</p>
    <div className="mb-5 flex flex-wrap gap-2">{labels.map((label,index)=><button data-cy={`scenario-${index}`} key={label} aria-pressed={step===index} onClick={()=>{setPlaying(false);setStep(index);loadScenario(index);}} className="rounded border border-gold/30 px-3 py-2 text-sm aria-pressed:bg-gold aria-pressed:text-ink">{label}</button>)}<button onClick={()=>setPlaying(value=>!value)} className="rounded bg-gold px-3 py-2 text-sm text-ink">{playing ? 'Зупинити показ' : 'Автопоказ'}</button></div>
    <p data-cy="scenario-title" className="mb-3 text-gold">{labels[step]}</p>
    <GameToasts /><GameTable /><div className="mt-4 space-y-4"><ActionPanel /><PlayerHand /></div>
  </main>;
}
