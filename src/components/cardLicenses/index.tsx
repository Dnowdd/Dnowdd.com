import { useTranslation } from "react-i18next";

interface CardLicensesProps {
  img: any;
  title: string;
  company: string;
  issued: Date;
  link?: string;
}

export default function CardLicenses({
  img,
  title,
  company,
  issued,
  link,
}: CardLicensesProps) {
  const { t, i18n } = useTranslation();

  function formatDate(date: Date): string {
    const localeMap: { [key: string]: string } = {
      pt: "pt-BR",
      en: "en-US",
    };

    const currentLocale = localeMap[i18n.language] || "en-US";

    const formatted = date
      .toLocaleString(currentLocale, { month: "short", year: "numeric" })
      .replace(/(\w+)\s(\d+)/, "$1. $2");

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return (
    <div
      className={`flex gap-4 border rounded-xl px-8 py-6 transition ${
        link && "cursor-pointer hover:scale-[1.01] hover:shadow-lg"
      }`}
      onClick={() => link && window.open(link, "_blank")}
    >
      <div>
        <img src={img} alt={company} className="rounded-full w-16" />
      </div>
      <div>
        <h1 className="font-semibold text-xl">{title}</h1>
        <h2 className="font-medium text-neutral-600 dark:text-neutral-300">
          {company}
        </h2>
        <h3 className="text-neutral-500 dark:text-neutral-400">
          {t("system.issued")} {formatDate(issued)}
        </h3>
      </div>
    </div>
  );
}
