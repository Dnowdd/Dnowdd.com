"use client";

import { TextAnimate } from "@/components/ui/text-animate";
import texts from "@/content/texts.json";

const AboutSection = () => {
  return (
    <div id="sobre" className="bg-neutral-950 py-20 flex flex-col items-center gap-8">
      <div>
        <TextAnimate
          animation="slideUp"
          by="character"
          className="text-neutral-400 text-2xl font-light leading-2 text-center"
        >
          {texts.about.subtitle}
        </TextAnimate>
        <TextAnimate
          as="h2"
          animation="slideUp"
          by="character"
          className="text-4xl md:text-6xl font-bold text-neutral-100 text-center"
        >
          {texts.about.title}
        </TextAnimate>
      </div>

      <div className="flex flex-col gap-4 max-w-3xl px-6">
        {texts.about.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-neutral-400 text-sm sm:text-lg font-light tracking-wide"
            dangerouslySetInnerHTML={{
              __html: paragraph.text.replace(
                /<strong>/g,
                '<strong class="font-semibold text-neutral-200">'
              ),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
