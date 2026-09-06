import { NextRequest, NextResponse } from "next/server";
import { normalizeLocale, locales } from "@/lib/i18n";

export async function POST(request: NextRequest) {
  const expectedOrigin = process.env.APP_ORIGIN || `${request.nextUrl.protocol}//${request.headers.get("host")}`;
  if (request.headers.get("origin") !== expectedOrigin) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !locales.includes(body.locale)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("bluff_locale", normalizeLocale(body.locale), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
