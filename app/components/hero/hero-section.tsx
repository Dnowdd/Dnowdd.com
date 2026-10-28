"use client";

import { useIntroDone } from "@/components/use-intro-done";
import texts from "@/content/texts.json";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import FluidWaves from "./components/fluid-waves-lazy";

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (ready: boolean, delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export default function HeroSection() {
  const ready = useIntroDone();
  return (
    <section
      id="hero"
      className="relative w-full bg-neutral-950 overflow-hidden flex items-center justify-center min-h-[100dvh] py-28 md:py-0 md:h-screen"
    >
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

        <motion.p
          {...reveal(ready, 0.15)}
          className="max-w-xl text-lg font-light tracking-tight text-neutral-400 sm:text-xl"
        >
          {texts.hero.tagline.map((part) =>
            "strong" in part ? (
              <strong key={part.text} className="font-medium text-neutral-100">
                {part.text}
              </strong>
            ) : (
              part.text
            ),
          )}
        </motion.p>

        <motion.div
          {...reveal(ready, 0.3)}
          className="flex flex-wrap items-center gap-6 pt-2"
        >
          <a
            href={texts.hero.cta.primary.href}
            className="group flex items-center gap-2 rounded-full bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-950 transition-transform hover:scale-[1.03]"
          >
            {texts.hero.cta.primary.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={texts.hero.cta.secondary.href}
            download="Currículo - David Queiroz.pdf"
            className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-50"
          >
            {texts.hero.cta.secondary.label}
            <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      <motion.div
        {...reveal(ready, 0.9)}
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-end px-6 pb-8 font-mono text-[11px] uppercase tracking-widest text-neutral-500 md:px-10"
      >
        <a
          href="#sobre"
          className="flex flex-col items-center gap-3 transition-colors hover:text-neutral-200"
        >
          {texts.hero.scroll}
          <span className="relative block h-10 w-px overflow-hidden bg-neutral-800">
            <motion.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-neutral-300"
              animate={{ y: ["-100%", "200%"] }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </span>
        </a>
      </motion.div>

      <FluidWaves />
    </section>
  );
}
