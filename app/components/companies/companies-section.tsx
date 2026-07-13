import { Badge } from "@/components/ui/badge";
import { StarsBackground } from "@/components/ui/stars-background";
import { TextAnimate } from "@/components/ui/text-animate";
import { Timeline } from "@/components/ui/timeline";
import texts from "@/content/texts.json";

const CompaniesSection = () => {
  const timeline = texts.companies.timeline.map((item) => ({
    title: (
      <div className="flex gap-2 md:gap-3 items-end">
        <p className="text-xl md:text-2xl whitespace-nowrap">
          {item.period.start}
        </p>
        <div className="flex items-center gap-3">
          <div className="w-6 h-px bg-neutral-600"></div>
          <p className="font-light text-xs md:text-base">{item.period.end}</p>
        </div>
      </div>
    ),
    content: (
      <div className="flex flex-col gap-1">
        <h3 className="text-xl md:text-3xl xl:text-4xl font-bold text-neutral-100">
          {item.position}
        </h3>
        <p className="text-lg md:text-xl xl:text-2xl text-neutral-400">
          {item.company}
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base xl:text-lg font-light text-neutral-400">
            {item.description}
          </p>
          <div className="flex gap-2">
            {item.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-neutral-400 bg-neutral-900/50 text-xs md:text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="bg-neutral-950 py-20 relative z-[1]">
      <StarsBackground />

      <div>
        <TextAnimate
          animation="slideUp"
          by="character"
          className="text-neutral-400 text-2xl font-light leading-2 text-center"
        >
          {texts.companies.subtitle}
        </TextAnimate>
        <TextAnimate
          as="h2"
          animation="slideUp"
          by="character"
          className="text-4xl md:text-6xl font-bold text-neutral-100 text-center"
        >
          {texts.companies.title}
        </TextAnimate>
      </div>

      <Timeline data={timeline} />
    </div>
  );
};

export default CompaniesSection;
