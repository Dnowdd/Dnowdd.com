import { Badge } from "@/components/ui/badge";
import { StarsBackground } from "@/components/ui/stars-background";
import { TextAnimate } from "@/components/ui/text-animate";
import { Timeline } from "@/components/ui/timeline";
import texts from "@/content/texts.json";

const CompaniesSection = () => {
  const timeline = texts.companies.timeline.map((item) => ({
    title: (
      <div className="flex flex-col items-end">
        <h1>{item.period.start}</h1>
        <div className="flex items-center gap-3">
          <div className="w-6 h-px bg-neutral-600"></div>
          <p className="font-light text-lg">{item.period.end}</p>
        </div>
      </div>
    ),
    content: (
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-neutral-100">{item.position}</h1>
        <h2 className="text-xl text-neutral-400">{item.company}</h2>
        <p className="text-sm font-light max-w-2/3 text-neutral-500">
          {item.description}
        </p>
        <div className="flex gap-2">
          {item.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-neutral-500 bg-neutral-900/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <div className="bg-neutral-950 py-20 relative z-10">
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
          animation="slideUp"
          by="character"
          className="text-6xl font-bold text-neutral-100 text-center"
        >
          {texts.companies.title}
        </TextAnimate>
      </div>

      <Timeline data={timeline} />
    </div>
  );
};

export default CompaniesSection;
