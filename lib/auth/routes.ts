export const ACCOUNT_PATH = "/account";

// Only known local destinations can survive an authentication round trip.
export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || /[\\\u0000-\u0020]/.test(value)) return ACCOUNT_PATH;
  try {
    const url = new URL(value, "https://bluff.local");
    if (url.origin !== "https://bluff.local") return ACCOUNT_PATH;
    if (url.pathname !== "/" && url.pathname !== ACCOUNT_PATH && !url.pathname.startsWith("/account/") && !/^\/room\/[A-Za-z0-9]+$/.test(url.pathname)) return ACCOUNT_PATH;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return ACCOUNT_PATH;
  }
}

export function authHref(mode: "login" | "register", returnTo: unknown) {
  return `/${mode}?${new URLSearchParams({ next: safeReturnTo(returnTo) })}`;
}

export function guestHref(returnTo: unknown): string {
  const target = safeReturnTo(returnTo);
  return target === "/" || target.startsWith("/?") || target.startsWith("/#") || target.startsWith("/room/") ? target : "/";
}
