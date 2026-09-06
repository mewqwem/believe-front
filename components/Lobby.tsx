// components/Lobby.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { AccountUser } from "@/lib/auth/session";
import { authHref } from "@/lib/auth/routes";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/I18nProvider";

type LobbyProps = { user: AccountUser | null; unavailable: boolean };

export const Lobby: React.FC<LobbyProps> = ({ user, unavailable }) => {
  const searchParams = useSearchParams();
  const inviteCode = (searchParams.get("code") || "").toUpperCase();

  // A new invitation starts a fresh form without synchronizing state in an effect.
  return <LobbyForm key={`${inviteCode}:${user?.id ?? "guest"}`} inviteCode={inviteCode} user={user} unavailable={unavailable} />;
};

const LobbyForm: React.FC<LobbyProps & { inviteCode: string }> = ({ inviteCode, user, unavailable }) => {
  const { t } = useI18n();
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Local state for the room code input (initialized with URL parameter if present)
  const [roomCodeInput, setRoomCodeInput] = useState(inviteCode);

  const { playerName: guestName, setPlayerName, createRoom, joinRoom, joining, joinError } = useGameStore();
  const playerName = user?.name ?? guestName;

  const handleConfirmCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      createRoom(playerName, user?.avatar);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && roomCodeInput.trim()) {
      joinRoom(roomCodeInput.trim().toUpperCase(), playerName, user?.avatar);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-felt p-4 text-ivory">
      <Card
        className={`w-full ${isCreatingRoom || inviteCode ? "max-w-md" : "max-w-2xl"} border-gold/20 bg-panel shadow-2xl transition-all duration-300`}
      >
        <CardHeader className="text-center">
          <CardTitle className="font-display text-4xl font-bold tracking-wider text-gold">
            BLUFF
          </CardTitle>
          <p className="text-base text-ivory/70">
            {inviteCode
              ? t("lobby.invited", { code: inviteCode })
              : isCreatingRoom
                ? t("lobby.settings")
                : user ? t("lobby.accountLead") : t("lobby.guestLead")}
          </p>
        </CardHeader>
        <CardContent>
          {joinError && <p role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{t(joinError)}</p>}
          {joining && <p role="status" className="mb-4 text-sm text-gold">{t("room.connecting")}</p>}
          {unavailable && <p role="status" className="mb-4 text-sm text-ivory/70">{t("lobby.accountUnavailable")}</p>}
          {user ? (
            <Link href="/account" className="mb-6 flex min-w-0 items-center gap-4 rounded-2xl border border-gold/30 bg-felt p-4 transition-colors hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-gold">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold/15 font-display text-2xl text-gold">
                {user.avatar && failedAvatar !== user.avatar ? <Image src={user.avatar} alt="" width={56} height={56} unoptimized onError={() => setFailedAvatar(user.avatar)} className="size-14 object-cover" /> : Array.from(user.name)[0]?.toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-ivory/60">{t("lobby.yourAccount")}</span>
                <span className="block break-words text-lg font-semibold text-ivory">{user.name}</span>
              </span>
              <span className="shrink-0 text-sm text-gold">{t("lobby.profile")}</span>
            </Link>
          ) : <nav aria-label={t("lobby.accountNav")} className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-gold/15 pb-5 text-sm">
            <Link href="/account" className="text-gold hover:underline">{t("lobby.myAccount")}</Link>
            <span className="text-ivory/50">{t("lobby.guestOr")}</span>
            <Link href={authHref("login", inviteCode ? `/?${new URLSearchParams({ code: inviteCode })}` : "/")} className="text-gold hover:underline focus-visible:outline-2 focus-visible:outline-gold">{t("lobby.signIn")}</Link>
            <Link href={authHref("register", inviteCode ? `/?${new URLSearchParams({ code: inviteCode })}` : "/")} className="text-gold hover:underline focus-visible:outline-2 focus-visible:outline-gold">{t("lobby.signUp")}</Link>
          </nav>}
          {/* 
            If the user opened a direct invite link, show a simplified single-column view 
          */}
          {inviteCode ? (
            <div className="space-y-6">
              {!user && (<div className="space-y-2">
                <label className="text-sm font-medium uppercase text-ivory/70">
                  {t("lobby.playerName")}
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t("lobby.namePlaceholder")}
                  className="w-full rounded-lg border border-gold/30 bg-felt px-4 py-3 text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>)}

              <div className="space-y-2">
                <label className="text-sm font-medium uppercase text-ivory/70">
                  {t("lobby.roomCode")}
                </label>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) =>
                    setRoomCodeInput(e.target.value.toUpperCase())
                  }
                  placeholder={t("lobby.codePlaceholder")}
                  className="w-full rounded-lg border border-gold/30 bg-felt px-4 py-3 uppercase text-center font-mono text-xl tracking-widest text-gold focus:outline-none"
                />
              </div>

              <Button
                onClick={handleJoin}
                disabled={joining || !playerName.trim() || !roomCodeInput.trim()}
                className="cursor-pointer w-full bg-gold py-6 text-lg font-bold text-ink transition-all hover:bg-gold hover:brightness-125 hover:shadow-lg hover:shadow-gold/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("lobby.joinGame")}
              </Button>
            </div>
          ) : !isCreatingRoom ? (
            /* Main View (Split Screen) */
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-6">
                {!user && (<div className="space-y-2">
                  <label className="text-sm font-medium uppercase text-ivory/70">
                    {t("lobby.playerName")}
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder={t("lobby.namePlaceholder")}
                    className="w-full rounded-lg border border-gold/30 bg-felt px-4 py-3 text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>)}

                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase text-ivory/70">
                    {t("lobby.joinHeading")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={roomCodeInput}
                      onChange={(e) =>
                        setRoomCodeInput(e.target.value.toUpperCase())
                      }
                      placeholder={t("lobby.codePlaceholder")}
                      className="flex-1 rounded-lg border border-gold/30 bg-felt px-4 py-2 uppercase text-center font-mono tracking-widest text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                    <Button
                      onClick={handleJoin}
                      disabled={joining || !playerName.trim() || !roomCodeInput.trim()}
                      variant="secondary"
                      className="cursor-pointer border border-gold/50 bg-felt text-ivory transition-all hover:border-gold hover:bg-gold/30 hover:text-ivory hover:shadow-md hover:shadow-gold/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("lobby.join")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px bg-gold/20" />
              <div className="block md:hidden h-px w-full bg-gold/20" />

              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-ivory">
                    {t("lobby.createHeading")}
                  </h3>
                  <p className="text-sm text-ivory/70">
                    {t("lobby.createIntro")}
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreatingRoom(true)}
                  className="cursor-pointer w-full bg-gold py-6 text-lg font-bold text-ink transition-all hover:bg-gold hover:brightness-125 hover:shadow-lg hover:shadow-gold/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("lobby.createRoom")}
                </Button>
              </div>
            </div>
          ) : (
            /* Settings View */
            <div className="space-y-6">
              {!user && (<div className="space-y-2">
                <label className="text-sm font-medium uppercase text-ivory/70">
                  {t("lobby.hostName")}
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t("lobby.namePlaceholder")}
                  className="w-full rounded-lg border border-gold/30 bg-felt px-4 py-3 text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>)}

              <div className="space-y-2 p-4 border border-dashed border-gold/30 rounded-lg bg-felt/50 flex items-center justify-center min-h-[100px]">
                <p className="text-sm text-ivory/50 text-center">
                  {t("lobby.settingsPlaceholder")}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setIsCreatingRoom(false)}
                  variant="secondary"
                  className="cursor-pointer flex-1 border border-gold/50 bg-felt text-ivory transition-all hover:border-gold hover:bg-gold/30 hover:text-ivory hover:shadow-md hover:shadow-gold/15"
                >
                  {t("common.back")}
                </Button>
                <Button
                  onClick={handleConfirmCreate}
                  disabled={joining || !playerName.trim()}
                  className="cursor-pointer flex-1 bg-gold py-6 text-lg font-bold text-ink transition-all hover:bg-gold hover:brightness-125 hover:shadow-lg hover:shadow-gold/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("lobby.start")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
