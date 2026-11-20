"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <nav
      aria-label={t("label")}
      className="fixed right-4 top-4 z-50 flex items-center gap-0.5 rounded-full border border-neutral-800/80 bg-neutral-950/70 p-1 font-mono text-[11px] uppercase tracking-widest backdrop-blur-md md:right-8 md:top-6"
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={t(`names.${code}`)}
            aria-pressed={active}
            disabled={pending}
            onClick={() => {
              if (active) return;
              startTransition(() => {
                router.replace(pathname, { locale: code, scroll: false });
              });
            }}
            className={cn(
              "relative rounded-full px-3 py-1.5 transition-colors duration-300",
              active
                ? "text-neutral-950"
                : "text-neutral-400 hover:text-neutral-100",
            )}
          >
            {active && (
              <motion.span
                layoutId="language-pill"
                className="absolute inset-0 rounded-full bg-neutral-100"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{t(`short.${code}`)}</span>
          </button>
        );
      })}
    </nav>
  );
}
