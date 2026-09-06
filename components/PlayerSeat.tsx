"use client";
import Image from "next/image";
import { useState } from "react";
import { Crown, WifiOff } from "lucide-react";
import type { Player } from "@/types/game";
import { useI18n } from "@/components/I18nProvider";

export function PlayerSeat({ player, isSelf, isCurrent, place, seconds, playing }: {
  player: Player; isSelf: boolean; isCurrent: boolean; place: number; seconds: number; playing: boolean;
}) {
  const { t } = useI18n();
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  return <div className={`relative mx-auto flex w-full max-w-36 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-center ${player.isDisconnected ? 'opacity-60' : ''}`} aria-current={isCurrent ? 'true' : undefined}>
    <div className={`relative flex size-14 items-center justify-center rounded-full border-2 bg-panel text-xl font-semibold text-gold shadow-lg sm:size-16 ${isCurrent ? 'border-gold ring-4 ring-gold/20' : isSelf ? 'border-gold/50' : 'border-gold/15'}`}>
      {player.avatar && failedAvatar !== player.avatar ? <Image src={player.avatar} alt="" width={64} height={64} unoptimized onError={() => setFailedAvatar(player.avatar ?? null)} className="size-full rounded-full object-cover" /> : <span aria-hidden="true">{Array.from(player.name.trim())[0]?.toUpperCase() || '?'}</span>}
      {place === 1 && <span className="absolute -right-1 -top-2 rounded-full bg-gold p-1 text-ink"><Crown size={14} aria-label={t('table.winner')} /></span>}
    </div>
    <p className="w-full break-words text-xs font-semibold text-ivory sm:text-sm" title={player.name}>{player.name}</p>
    {isSelf && <span className="text-[10px] text-gold/80">{t('table.you')}</span>}
    <span className="text-[11px] text-ivory/70">{place > 0 ? t('table.place', { place }) : playing ? t('table.cards', { count: player.cardCount }) : t('table.ready')}</span>
    {player.isDisconnected ? <span className="flex items-center gap-1 rounded-full bg-bluff px-2 py-0.5 text-[10px] text-ivory"><WifiOff size={11} />{t('table.seconds', { count: seconds })}</span> : isCurrent ? <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">{t('table.turn')}</span> : null}
  </div>;
}
