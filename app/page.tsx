import { Suspense } from "react";
import { getAccount } from "@/lib/auth/session";
import { HomeContent } from "@/components/HomeContent";
import { getServerI18n } from "@/lib/i18n-server";

async function AccountLobby() {
  const { user, unavailable } = await getAccount();
  return <HomeContent user={user} unavailable={unavailable} />;
}

export default async function HomePage() {
  const { t } = await getServerI18n();
  return (
    <Suspense fallback={<p role="status" className="flex min-h-screen items-center justify-center text-ivory/70">{t("common.loading")}</p>}>
      <AccountLobby />
    </Suspense>
  );
}
