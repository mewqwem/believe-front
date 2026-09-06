import { NextRequest, NextResponse } from 'next/server';
import { authBackendUrl, SESSION_COOKIE } from '@/lib/auth/session';

export const runtime = 'nodejs';
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

export async function POST(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (!['login', 'register', 'logout', 'profile'].includes(action)) return reply({ message: 'Не знайдено.' }, 404);
  // Browsers must originate mutations from this frontend, including login/logout.
  const expectedOrigin = process.env.APP_ORIGIN || `${request.nextUrl.protocol}//${request.headers.get('host')}`;
  if (request.headers.get('origin') !== expectedOrigin) return reply({ message: 'Недозволене джерело запиту.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ message: 'Очікується JSON.' }, 415);
  let body;
  try {
    // Bound the stream, not only Content-Length (which a caller can omit).
    const reader = request.body?.getReader();
    let size = 0;
    const parts: Uint8Array[] = [];
    if (reader) while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > (action === 'profile' ? 98304 : 16384)) { await reader.cancel(); return reply({ message: 'Завеликий запит.' }, 413); }
      parts.push(value);
    }
    body = JSON.parse(Buffer.concat(parts).toString('utf8'));
  } catch { return reply({ message: 'Некоректний запит.' }, 400); }
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const response = await fetch(authBackendUrl(action), {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...(/^[a-f0-9]{64}$/.test(token || '') ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    if (!response.ok) return reply({ message: data.message || 'Не вдалося виконати запит.' }, response.status);
    const result = reply(action === 'logout' ? { ok: true } : { user: data.user }, response.status);
    if (action === 'profile') return result;
    result.cookies.set(SESSION_COOKIE, action === 'logout' ? '' : data.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/',
      maxAge: action === 'logout' ? 0 : data.expiresIn,
    });
    return result;
  } catch { return reply({ message: 'Акаунти тимчасово недоступні. Спробуй пізніше або грай як гість.' }, 503); }
}
