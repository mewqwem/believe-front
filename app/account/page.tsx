import Link from 'next/link';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/auth/session';
import { authHref } from '@/lib/auth/routes';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { getServerI18n } from '@/lib/i18n-server';

export default async function AccountPage() {
  const { locale, t } = await getServerI18n();
  const { user, unavailable } = await getAccount();
  if (unavailable) return null;
  if (!user) redirect(authHref('login', '/account'));
  return <main className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-4 py-12 [--radius:0.75rem]">
    <Link href="/" className="mb-6 text-sm text-gold">← {t('common.backToGame')}</Link>
    <section className="rounded-3xl border border-gold/20 bg-panel p-8 shadow-xl">
      <ProfileForm user={user} />
      <p className="my-6 text-sm text-ivory/60">{t('account.memberSince', { date: new Date(user.createdAt).toLocaleDateString(locale === 'uk' ? 'uk-UA' : locale === 'pl' ? 'pl-PL' : 'en-US', { timeZone: 'UTC' }) })}</p>
      <LogoutButton />
    </section>
  </main>;
}
