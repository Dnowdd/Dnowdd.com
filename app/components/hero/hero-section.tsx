import FluidWaves from "./components/fluid-waves-lazy";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import texts from "@/content/texts.json";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full bg-neutral-950 overflow-hidden flex items-center justify-center min-h-[100dvh] py-20 md:py-0 md:h-screen"
    >
      {/* Content */}
      <div className="flex flex-col gap-6 items-start z-10 px-6 md:px-0">
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
        <p
          className="text-neutral-400 text-base sm:text-xl font-light tracking-wide max-w-xl"
          dangerouslySetInnerHTML={{
            __html: texts.hero.tagline.replace(
              /<strong>/g,
              '<strong class="font-semibold text-neutral-200">'
            ),
          }}
        />
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="group cursor-pointer shadow-[0_0_20px_-4px_rgba(168,85,247,0.7)] hover:shadow-[0_0_30px_-2px_rgba(168,85,247,0.9)] hover:scale-[1.03] transition-all"
          >
            <a href={texts.hero.cta.primary.href}>
              {texts.hero.cta.primary.label}
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 border-neutral-800 text-neutral-300"
          >
            <a
              href={texts.hero.cta.secondary.href}
              download="Currículo - David Queiroz.pdf"
            >
              {texts.hero.cta.secondary.label}
              <Download />
            </a>
          </Button>
        </div>
      </div>

      {/* Fluid Waves */}
      <FluidWaves />
    </section>
  );
}
