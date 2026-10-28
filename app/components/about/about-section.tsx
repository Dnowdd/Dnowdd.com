"use client";

import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "@/components/section-header";
import texts from "@/content/texts.json";

type Kind = "marker" | "circle" | "spark" | "underline";
type Segment = { text: string; kind?: Kind };

const STATEMENT = texts.about.statement as Segment[];
const FACTS = texts.about.facts;

const EASE = [0.76, 0, 0.24, 1] as const;
const TOTAL_WORDS = STATEMENT.reduce((n, s) => n + s.text.split(" ").length, 0);

export default function AboutSection({
  children,
}: {
  children?: React.ReactNode;
}) {
  const statementRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const glowX = useSpring(useMotionValue(-1000), {
    stiffness: 80,
    damping: 20,
  });
  const glowY = useSpring(useMotionValue(-1000), {
    stiffness: 80,
    damping: 20,
  });
  const glow = useMotionTemplate`radial-gradient(500px circle at ${glowX}px ${glowY}px, rgba(128,51,230,0.14), transparent 70%)`;

  let wordIndex = 0;

  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-neutral-950 text-neutral-100"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        glowX.set(event.clientX - rect.left);
        glowY.set(event.clientY - rect.top);
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-32 md:gap-24 md:px-10 md:py-48">
        <SectionHeader
          index="02"
          label={texts.about.label}
          title={texts.about.title}
        />

        <p
          ref={statementRef}
          className="max-w-5xl text-3xl font-semibold leading-[1.25] tracking-tight md:text-6xl md:leading-[1.2]"
        >
          {STATEMENT.map((segment, s) => {
            const words = segment.text.split(" ").map((word) => {
              const i = wordIndex++;
              return (
                <Word
                  key={i}
                  word={word}
                  progress={scrollYProgress}
                  range={[i / TOTAL_WORDS, (i + 1) / TOTAL_WORDS]}
                />
              );
            });
            return segment.kind ? (
              <span key={s}>
                <Mark kind={segment.kind}>{words}</Mark>{" "}
              </span>
            ) : (
              <span key={s}>{words}</span>
            );
          })}
        </p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-neutral-800 pt-10 md:grid-cols-4">
          {FACTS.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <dt className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                {fact.label}
              </dt>
              <dd className="mt-2 text-lg text-neutral-200">{fact.value}</dd>
            </motion.div>
          ))}
        </dl>

        {children}
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

function Mark({ kind, children }: { kind: Kind; children: React.ReactNode }) {
  return (
    <motion.span
      className="relative inline-block whitespace-nowrap"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 1, margin: "0px 0px -25% 0px" }}
    >
      {kind === "marker" && (
        <motion.span
          aria-hidden
          className="absolute -inset-x-[0.12em] inset-y-[0.06em] origin-left -rotate-1 rounded-[0.12em] bg-primary"
          variants={{
            hidden: { scaleX: 0 },
            visible: {
              scaleX: 1,
              transition: { duration: 0.6, ease: EASE, delay: 0.2 },
            },
          }}
        />
      )}
      {kind === "circle" && (
        <svg
          aria-hidden
          viewBox="0 0 200 70"
          preserveAspectRatio="none"
          className="absolute -left-[0.3em] -top-[0.18em] h-[calc(100%+0.36em)] w-[calc(100%+0.6em)] overflow-visible"
        >
          <motion.path
            d="M40 10 C 100 -2, 192 6, 196 32 C 200 60, 70 70, 18 52 C -12 40, 12 12, 76 6"
            fill="none"
            stroke="#f472b6"
            strokeWidth={2.5}
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.9, ease: "easeInOut", delay: 0.2 },
              },
            }}
          />
        </svg>
      )}
      {kind === "underline" && (
        <svg
          aria-hidden
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute -bottom-[0.12em] left-0 h-[0.3em] w-full overflow-visible"
        >
          <motion.path
            d="M2 8 C 40 2, 80 12, 120 6 S 180 3, 198 7"
            fill="none"
            stroke="#38bdf8"
            strokeWidth={1.6}
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 },
              },
            }}
          />
        </svg>
      )}
      <span className="relative">{children}</span>
      {kind === "spark" && (
        <motion.span
          aria-hidden
          className="absolute -right-[0.5em] -top-[0.3em] text-[0.7em] text-fuchsia-400"
          variants={{
            hidden: { scale: 0, rotate: -120, opacity: 0 },
            visible: {
              scale: 1,
              rotate: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 380,
                damping: 11,
                delay: 0.3,
              },
            },
          }}
        >
          ✱
        </motion.span>
      )}
    </motion.span>
  );
}
