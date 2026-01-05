import FluidWaves from "./components/fluid-waves";
import texts from "@/content/texts.json";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-neutral-950 overflow-hidden flex items-center justify-center h-screen">
      {/* Content */}
      <div className="flex flex-col gap-4 items-start z-10">
        <div className="flex flex-col font-light tracking-wide items-start">
          <h1 className="text-neutral-400 text-4xl font-light leading-0">
            {texts.hero.subtitle}
          </h1>
          <h2 className="text-9xl font-bold text-neutral-100">
            {texts.hero.title}
          </h2>
        </div>
        {texts.hero.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-neutral-400 text-lg font-light tracking-wide max-w-3xl"
            dangerouslySetInnerHTML={{
              __html: paragraph.text.replace(
                /<strong>/g,
                '<strong class="font-semibold">'
              ),
            }}
          />
        ))}
      </div>

      {/* Fluid Waves */}
      <FluidWaves />
    </section>
  );
}
