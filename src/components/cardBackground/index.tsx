import { Badge } from "@/components/ui/badge";

interface CardExperienceProps {
  image: any;
  role: string;
  company?: string;
  dateStart: Date;
  dateEnd?: Date;
  description: string;
  tags?: string[];
}

function formatDate(date: Date): string {
  return date
    .toLocaleString("en-US", { month: "short", year: "numeric" })
    .replace(/(\w+)\s(\d+)/, "$1. $2");
}

export default function CardExperience({
  image,
  role,
  company,
  dateStart,
  dateEnd,
  description,
  tags,
}: CardExperienceProps) {
  return (
    <div className="flex gap-4 border rounded-xl p-6 lg:p-8 select-none transition hover:scale-[1.01] hover:shadow-lg relative">
      <div className="absolute lg:relative top-2 right-2 transform translate-x-1/4 -translate-y-1/4 lg:translate-x-0 lg:translate-y-0">
        <img
          src={image}
          alt={company}
          title={company}
          className="border lg:border-none rounded-xl lg:rounded-full w-16 lg:w-36 xl:w-24 2xl:w-16"
        />
      </div>
      <div>
        <h1 className="font-semibold text-lg xl:text-xl pr-10 lg:pr-0">
          <span>{role}</span>
          <div className="w-1 h-1 hidden 2xl:inline-block bg-neutral-800 rounded-full my-1 mx-2"></div>
          <span className="block 2xl:inline-block text-sm 2xl:text-xl text-neutral-500 2xl:text-black">
            {company}
          </span>
        </h1>
        <h2 className="flex gap-2 items-center text-base xl:text-lg text-neutral-600">
          <span>{formatDate(dateStart)}</span>
          <span className="w-2 h-0.5 bg-neutral-800"></span>
          <span>{dateEnd ? formatDate(dateEnd) : "Present"}</span>
        </h2>
        <p className="text-neutral-500 text-sm xl:text-base">{description}</p>
        <div className="mt-2 xl:mt-4 flex gap-1 xl:gap-2 flex-wrap">
          {tags &&
            tags.map((tag, index) => (
              <Badge
                variant="outline"
                key={index}
                className="text-[10px] xl:text-xs"
              >
                {tag}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
}
