import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/auth/session';
import { authHref } from '@/lib/auth/routes';
import { getServerI18n } from '@/lib/i18n-server';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getServerI18n();
  const { user, unavailable } = await getAccount();
  if (unavailable) return <main className="mx-auto max-w-md px-4 py-20 text-center"><h1 className="font-display text-2xl text-gold">{t('account.unavailableTitle')}</h1><p className="my-6">{t('account.unavailableBody')}</p><Link href="/" className="text-gold underline">{t('common.backToGame')}</Link></main>;
  if (!user) redirect(authHref('login', '/account'));
  return children;
}
