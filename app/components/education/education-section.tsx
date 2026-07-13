import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { TextAnimate } from "@/components/ui/text-animate";
import texts from "@/content/texts.json";

const EducationSection = () => {
  const projects = texts.education.items;

  return (
    <div className="bg-neutral-950 py-20 relative overflow-hidden">
      <BackgroundRippleEffect cols={35} rows={15} />
      <div className="z-20 relative">
        <TextAnimate
          animation="slideUp"
          by="character"
          className="text-neutral-400 text-2xl font-light leading-2 text-center"
        >
          {texts.education.subtitle}
        </TextAnimate>
        <TextAnimate
          as="h2"
          animation="slideUp"
          by="character"
          className="text-4xl md:text-6xl font-bold text-neutral-100 text-center"
        >
          {texts.education.title}
        </TextAnimate>
      </div>

      <div className="flex justify-center items-center gap-12 max-w-5xl mx-auto px-8">
        <HoverEffect items={projects} />
      </div>
    </div>
  );
};

export default EducationSection;
