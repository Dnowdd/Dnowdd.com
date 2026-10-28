"use client";

import texts from "@/content/texts.json";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, Copy } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { RevealText } from "@/components/section-header";

const AsciiCanvas = dynamic(() => import("./components/ascii-canvas"), {
  ssr: false,
});

const EMAIL = texts.contact.links
  .find((link) => link.href.startsWith("mailto:"))
  ?.href.replace("mailto:", "");
const LINKS = texts.contact.links.filter(
  (link) => !link.href.startsWith("mailto:"),
);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!EMAIL) return;
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contato"
      className="relative overflow-hidden bg-neutral-950 text-neutral-100"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <div className="absolute inset-x-0 top-1/2 h-[32rem] -translate-y-1/2">
          <AsciiCanvas isVisible={inView} />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-between gap-20 px-6 pb-10 pt-32 md:px-10 md:pt-48">
        <div className="flex flex-col items-start gap-12">
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 0.6, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em]"
          >
            <span>05</span>
            <span className="h-px w-12 bg-current" />
            <span>{texts.contact.label}</span>
          </motion.p>

          <h2 className="text-6xl font-bold leading-[0.9] tracking-tighter md:text-[9rem]">
            {texts.contact.title.map((line, i) => (
              <RevealText key={line} text={line} delay={i * 0.15} />
            ))}
          </h2>

          {EMAIL && (
            <button
              type="button"
              onClick={copyEmail}
              className="group flex w-fit items-center gap-4 text-left text-xl text-neutral-300 transition-colors hover:text-neutral-50 md:text-4xl"
            >
              <span className="relative">
                {EMAIL}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
              </span>
              <span className="relative flex size-10 items-center justify-center rounded-full border border-neutral-700 transition-colors group-hover:border-primary md:size-12">
                <Copy className="size-4" />
              </span>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="font-mono text-xs uppercase tracking-widest text-primary"
                  >
                    {texts.contact.copied}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          <ul className="flex flex-wrap gap-x-10 gap-y-4">
            {LINKS.map((link) => {
              const isDownload = link.href.endsWith(".pdf");
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={isDownload ? undefined : "_blank"}
                    rel={isDownload ? undefined : "noopener noreferrer"}
                    download={
                      isDownload ? "Currículo - David Queiroz.pdf" : undefined
                    }
                    className="group flex items-center gap-2 text-lg text-neutral-400 transition-colors hover:text-neutral-50"
                  >
                    {link.name}
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-widest text-neutral-600 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()}</span>
          <span>{texts.contact.credit}</span>
        </footer>
      </div>
    </section>
  );
}
