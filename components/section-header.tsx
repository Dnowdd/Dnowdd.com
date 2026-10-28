"use client";

import { motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;

export function RevealText({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        {words.map((word, w) => {
          const offset = words.slice(0, w).join("").length;
          return (
            <span key={w} className="inline-block whitespace-nowrap">
              {word.split("").map((char, c) => (
                <motion.span
                  key={c}
                  className="inline-block"
                  variants={{
                    hidden: { y: "110%" },
                    visible: {
                      y: "0%",
                      transition: {
                        duration: 0.8,
                        ease: EASE,
                        delay: delay + (offset + c) * 0.025,
                      },
                    },
                  }}
                >
                  {char}
                </motion.span>
              ))}
              {w < words.length - 1 && " "}
            </span>
          );
        })}
      </motion.span>
    </span>
  );
}

export function SectionHeader({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <header className="flex flex-col gap-6">
      <motion.p
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 0.6, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em]"
      >
        <span>{index}</span>
        <span className="h-px w-12 bg-current" />
        <span>{label}</span>
      </motion.p>
      <h2 className="text-5xl font-bold leading-[0.95] tracking-tighter md:text-8xl">
        <RevealText text={title} />
      </h2>
    </header>
  );
}
