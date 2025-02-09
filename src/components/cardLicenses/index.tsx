interface CardLicensesProps {
  img: any;
  title: string;
  company: string;
  issued: Date;
  link?: string;
}

function formatDate(date: Date): string {
  return date
    .toLocaleString("en-US", { month: "short", year: "numeric" })
    .replace(/(\w+)\s(\d+)/, "$1. $2");
}

export default function CardLicenses({
  img,
  title,
  company,
  issued,
  link,
}: CardLicensesProps) {
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
        <h2 className="font-medium text-neutral-600">{company}</h2>
        <h3 className="text-neutral-500">Issued {formatDate(issued)}</h3>
      </div>
    </div>
  );
}
