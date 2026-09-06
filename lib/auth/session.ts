import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'bluff_session';
export type AccountUser = { id: string; email: string; name: string; avatar: string | null; createdAt: string };
export function authBackendUrl(action: string) {
  const base = process.env.AUTH_BACKEND_URL || 'http://127.0.0.1:3000';
  return `${base.replace(/\/$/, '')}/auth/${action}`;
}
export const getAccount = cache(async (): Promise<{ user: AccountUser | null; unavailable: boolean }> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return { user: null, unavailable: false };
  try {
    const response = await fetch(authBackendUrl('me'), {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(12000),
    });
    if (response.status === 401) return { user: null, unavailable: false };
    if (!response.ok) return { user: null, unavailable: true };
    return { user: (await response.json()).user, unavailable: false };
  } catch { return { user: null, unavailable: true }; }
});
