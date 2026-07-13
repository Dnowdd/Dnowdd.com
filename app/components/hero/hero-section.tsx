import FluidWaves from "./components/fluid-waves-lazy";
import texts from "@/content/texts.json";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-neutral-950 overflow-hidden flex items-center justify-center min-h-[100dvh] py-20 md:py-0 md:h-screen">
      {/* Content */}
      <div className="flex flex-col gap-4 items-start z-10 px-6 md:px-0">
        <h1 className="flex flex-col font-light tracking-wide items-start">
          <span className="text-neutral-400 text-3xl sm:text-4xl font-light leading-6 md:leading-0">
            {texts.hero.subtitle}
          </span>
          <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-neutral-100">
            {texts.hero.title}
          </span>
          <span className="sr-only">
            David Queiroz — Desenvolvedor Full-Stack
          </span>
        </h1>
        {texts.hero.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-neutral-400 text-sm sm:text-lg font-light tracking-wide max-w-3xl"
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
