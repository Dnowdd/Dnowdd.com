"use client";

import { SectionHeader } from "@/components/section-header";
import texts from "@/content/texts.json";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Kind = "work" | "education";

type Entry = {
  kind: Kind;
  start: string;
  period: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
};

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const toMonthIndex = (label: string) => {
  const [month, year] = label.toLowerCase().replace(".", "").split(" ");
  return Number(year) * 12 + Math.max(0, MONTHS.indexOf(month));
};

const KIND_LABEL: Record<Kind, string> = {
  work: texts.journey.work,
  education: texts.journey.education,
};

const ENTRIES: Entry[] = [
  ...texts.companies.timeline.map((item) => ({
    kind: "work" as const,
    start: item.period.start,
    period: `${item.period.start} — ${item.period.end}`,
    title: item.position,
    org: item.company,
    description: item.description,
    tags: item.tags,
  })),
  ...texts.education.items.map((item) => ({
    kind: "education" as const,
    start: item.from,
    period: `${item.from} — ${item.to}`,
    title: item.title,
    org: item.school,
    description: item.description,
    tags: item.tags,
  })),
].sort((a, b) => toMonthIndex(b.start) - toMonthIndex(a.start));

export default function JourneySection() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.6"],
  });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="trajetoria"
      className="relative bg-neutral-950 text-neutral-100"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-32 md:px-10 md:py-48">
        <SectionHeader
          index="04"
          label={texts.journey.label}
          title={texts.journey.title}
        />

        <div className="hidden grid-cols-[1fr_3rem_1fr] border-b border-neutral-800 pb-4 font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 lg:grid">
          <span className="text-right">{KIND_LABEL.work}</span>
          <span />
          <span>{KIND_LABEL.education}</span>
        </div>

        <ol
          ref={timelineRef}
          className="relative flex flex-col gap-14 md:gap-20"
        >
          <span
            aria-hidden
            className="absolute bottom-0 left-0 top-0 w-px bg-neutral-800 lg:left-1/2"
          />
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 top-0 w-px origin-top bg-linear-to-b from-primary via-fuchsia-400 to-sky-400 lg:left-1/2"
            style={{ scaleY: line }}
          />

          {ENTRIES.map((entry) => {
            const isWork = entry.kind === "work";
            return (
              <motion.li
                key={entry.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid pl-8 lg:grid-cols-[1fr_3rem_1fr] lg:pl-0"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1.5 size-2.5 -translate-x-1/2 rounded-full bg-neutral-950 ring-1 lg:left-1/2",
                    isWork ? "ring-fuchsia-400" : "ring-sky-400",
                  )}
                />
                <article
                  className={cn(
                    "flex flex-col gap-4",
                    isWork
                      ? "lg:col-start-1 lg:items-end lg:text-right"
                      : "lg:col-start-3",
                  )}
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                    <span className="lg:hidden">
                      {KIND_LABEL[entry.kind]} ·{" "}
                    </span>
                    {entry.period}
                  </p>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-neutral-50 md:text-3xl">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-lg text-neutral-400">{entry.org}</p>
                  </div>
                  <p className="max-w-xl leading-relaxed text-neutral-400">
                    {entry.description}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-widest text-neutral-600">
                    {entry.tags.join(" · ")}
                  </p>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
