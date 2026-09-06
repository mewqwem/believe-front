import "server-only";
import { cookies } from "next/headers";
import { normalizeLocale, translate } from "@/lib/i18n";

export async function getServerI18n() {
  const locale = normalizeLocale((await cookies()).get("bluff_locale")?.value);
  return {
    locale,
    t: (key: string, values?: Record<string, string | number>) => translate(locale, key, values),
  };
}
