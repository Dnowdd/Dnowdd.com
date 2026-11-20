import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  const t = await getTranslations("notFound");
  return { title: t("title"), robots: { index: false } };
}

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="min-h-dvh bg-neutral-950 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-neutral-500 font-mono text-sm tracking-widest">
        {t("code")}
      </p>
      <h1 className="text-5xl md:text-7xl font-bold text-neutral-100">
        {t("title")}
      </h1>
      <p className="text-neutral-400 font-light max-w-md">{t("description")}</p>
      <Link
        href="/"
        className="mt-2 rounded-md border border-neutral-800 bg-neutral-900 px-6 py-3 text-neutral-200 transition-colors hover:border-purple-500/50 hover:bg-purple-950/20"
      >
        {t("back")}
      </Link>
    </main>
  );
}
