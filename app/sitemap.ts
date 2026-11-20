import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localeUrl as url } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: url(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((code) => [code, url(code)])),
    },
  }));
}
