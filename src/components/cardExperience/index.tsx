import { BorderBeam } from "@/components/magicui/border-beam";

interface CardExperienceProps {
  image: string;
  title: string;
  subtitle: string;
  dateStart: Date;
  dateEnd?: Date;
  active?: boolean;
}

function formatDate(date: Date): string {
  return date
    .toLocaleString("en-US", { month: "short", year: "numeric" })
    .replace(/(\w+)\s(\d+)/, "$1. $2");
}

export default function CardExperience({
  image,
  title,
  subtitle,
  dateStart,
  dateEnd,
  active,
}: CardExperienceProps) {
  return (
    <div className="relative flex justify-between items-center border px-4 py-3 rounded-xl w-full overflow-hidden">
      {active && (
        <BorderBeam size={120} delay={Math.floor(Math.random() * 101)} />
      )}
      <div className="flex gap-2 items-center">
        <img
          className="w-10 h-10 bg-slate-100 rounded-full border"
          src={image}
        />
        <div className="flex flex-col leading-4">
          <h1 className="font-semibold">{title}</h1>
          <h2
            style={{
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
              lineHeight: "1.5",
            }}
            className="text-ellipsis overflow-hidden"
          >
            {subtitle}
          </h2>
        </div>
      </div>

      <div className="hidden sm:block">
        {formatDate(dateStart)} - {dateEnd ? formatDate(dateEnd) : "Currently"}
      </div>
    </div>
  );
}
