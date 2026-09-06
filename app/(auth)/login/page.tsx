import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth/session";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { safeReturnTo } from "@/lib/auth/routes";

export const metadata: Metadata = { title: "Вхід — BLUFF" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const returnTo = safeReturnTo((await searchParams).next);
  const { user } = await getAccount();
  if (user) redirect(returnTo);
  return <AuthForm mode="login" returnTo={returnTo} />;
}
