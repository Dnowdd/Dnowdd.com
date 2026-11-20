import { getPathname } from "@/i18n/navigation";
import type { routing } from "@/i18n/routing";

export const SITE_URL = "https://dnowdd.com";

export const localeUrl = (locale: (typeof routing.locales)[number]) => {
  const path = getPathname({ href: "/", locale });
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
};
