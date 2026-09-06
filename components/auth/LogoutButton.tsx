'use client';
import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';

export function LogoutButton() {
  const { t } = useI18n();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return <div><button disabled={pending} className="rounded-xl border border-gold/30 px-5 py-3 text-sm text-ivory hover:bg-gold/10 disabled:opacity-50" onClick={async () => {
    setPending(true); setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!response.ok) { setError(t('account.logoutError')); return; }
      window.location.replace('/');
    } catch { setError(t('account.connectionError')); }
    finally { setPending(false); }
  }}>{pending ? t('account.loggingOut') : t('account.logout')}</button>{error && <p role="alert" className="mt-3 text-sm text-gold">{error}</p>}</div>;
}
