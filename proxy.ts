import { NextResponse, type NextRequest } from 'next/server';
import { authHref } from '@/lib/auth/routes';

export function proxy(request: NextRequest) {
  // Optimistic routing only. The account server layout validates against MongoDB.
  const token = request.cookies.get('bluff_session')?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) return NextResponse.next();
  const destination = authHref('login', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/account/:path*'] };
