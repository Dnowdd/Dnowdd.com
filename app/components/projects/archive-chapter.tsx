"use client";

import { cn } from "@/lib/utils";
import texts from "@/content/texts.json";
import { motion, useMotionValue, useSpring, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  archiveProjects,
  EASE_OUT,
  featuredProjects,
  mediaAspect,
  pad,
} from "./data";

const DistortionPreview = dynamic(
  () => import("./distortion-preview").then((m) => m.DistortionPreview),
  { ssr: false },
);

const SPRING = { stiffness: 150, damping: 20, mass: 0.6 };
const CANVAS = { width: 640, height: 580 };
const SOURCES = archiveProjects.map((project) => project.image);
const SIZES = archiveProjects.map((project): [number, number] => {
  const width = project.mobileApp ? 200 : 420;
  return [width, width / mediaAspect(project)];
});

export function ArchiveChapter({
  onOpen,
}: {
  onOpen: (index: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const velocityX = useVelocity(springX);
  const velocityY = useVelocity(springY);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: EASE_OUT, delay: 0.2 },
      }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="mx-auto flex w-full max-w-4xl flex-col gap-10"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h3 className="text-5xl font-bold tracking-tighter text-neutral-50 md:text-7xl">
          {texts.projects.archive.title}
        </h3>
        <p className="max-w-lg text-neutral-400">
          {texts.projects.archive.description}
        </p>
      </div>

      <div
        className="relative"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHovered(null)}
      >
        <ul className="border-t border-neutral-800">
          {archiveProjects.map((project, i) => {
            const isHovered = hovered === i;
            const dimmed = hovered !== null && !isHovered;
            return (
              <li key={project.title} className="border-b border-neutral-800">
                <button
                  type="button"
                  onClick={() => onOpen(featuredProjects.length + i)}
                  onPointerEnter={() => {
                    setHovered(i);
                    setShown(i);
                  }}
                  onFocus={() => setHovered(null)}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 text-left outline-none focus-visible:bg-neutral-900/60 md:grid-cols-[3.5rem_1fr_auto_2rem] md:py-6"
                >
                  <span className="font-mono text-xs text-neutral-600 transition-colors group-hover:text-primary">
                    {pad(featuredProjects.length + i + 1)}
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-semibold tracking-tight transition-[color,translate] duration-500 md:text-4xl",
                      dimmed ? "text-neutral-700" : "text-neutral-100",
                      isHovered && "translate-x-3",
                    )}
                  >
                    {project.title}
                  </span>
                  <span
                    className={cn(
                      "hidden font-mono text-xs uppercase tracking-widest transition-colors duration-500 md:block",
                      dimmed ? "text-neutral-800" : "text-neutral-500",
                    )}
                  >
                    {project.tags.slice(0, 3).join(" / ")}
                  </span>
                  <ArrowUpRight className="size-5 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-50" />
                </button>
              </li>
            );
          })}
        </ul>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          style={{
            ...CANVAS,
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <DistortionPreview
            sources={SOURCES}
            sizes={SIZES}
            canvas={CANVAS}
            active={shown}
            visible={hovered !== null}
            velocityX={velocityX}
            velocityY={velocityY}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
