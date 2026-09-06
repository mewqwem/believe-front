import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth/session";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { safeReturnTo } from "@/lib/auth/routes";

export const metadata: Metadata = { title: "Реєстрація — BLUFF" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const returnTo = safeReturnTo((await searchParams).next);
  const { user } = await getAccount();
  if (user) redirect(returnTo);
  return <AuthForm mode="register" returnTo={returnTo} />;
}
