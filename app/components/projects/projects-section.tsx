"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { useMessages, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { ArchiveChapter } from "./archive-chapter";
import { CaseLinks, CaseOverlay } from "./case-overlay";
import {
  EASE_IN_OUT,
  EASE_OUT,
  isTypingTarget,
  type Project,
  useProjects,
} from "./data";
import { ProjectMedia } from "./project-media";

const ProjectSection = () => {
  const { projects } = useMessages();
  const t = useTranslations("projects");
  const { featured: featuredProjects, archive: archiveProjects } =
    useProjects();
  const archiveIndex = featuredProjects.length;
  const chapterCount =
    featuredProjects.length + (archiveProjects.length > 0 ? 1 : 0);
  const labels = [
    ...featuredProjects.map((project) => project.title),
    projects.archive.title,
  ].slice(0, chapterCount);

  const [chapters, setChapters] = useState({ active: 0, previous: 0 });
  const active = chapters.active;
  const [open, setOpen] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: enterProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "start start"],
  });
  const inset = useTransform(enterProgress, [0, 1], [1, 0]);
  const insetY = useTransform(inset, (v) => `${1 + v * 13}%`);
  const insetX = useTransform(inset, (v) => `${1 + v * 8}%`);
  const radius = useTransform(inset, (v) => `${20 + v * 8}px`);
  const windowClip = useMotionTemplate`inset(${insetY} ${insetX} round ${radius})`;
  const edgeFade = useTransform(enterProgress, [0.75, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(chapterCount - 1, Math.floor(progress * chapterCount));
    setChapters((current) =>
      current.active === next
        ? current
        : { active: next, previous: current.active },
    );
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 20 });
  const parallaxX = useTransform(smoothX, (v) => v * -18);
  const parallaxY = useTransform(smoothY, (v) => v * -12);

  const lenis = useLenis();

  const scrollToChapter = useCallback(
    (chapter: number) => {
      const track = trackRef.current;
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const distance = track.offsetHeight - window.innerHeight;
      const target = top + ((chapter + 0.02) / chapterCount) * distance;
      if (lenis) lenis.scrollTo(target, { duration: 1.1 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    },
    [lenis, chapterCount],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const track = trackRef.current;
      if (!track || isTypingTarget(event.target)) return;
      const rect = track.getBoundingClientRect();
      const pinned = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!pinned) return;

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const delta = event.key === "ArrowRight" ? 1 : -1;
        scrollToChapter(Math.max(0, Math.min(chapterCount - 1, active + delta)));
      } else if (
        event.key === "Enter" &&
        active < archiveIndex &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest("a, button")
        )
      ) {
        setOpen(active);
      } else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, scrollToChapter, chapterCount, archiveIndex]);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerX.set(event.clientX / window.innerWidth - 0.5);
    pointerY.set(event.clientY / window.innerHeight - 0.5);
  };

  const closeCase = useCallback(() => setOpen(null), []);
  const isArchive = active === archiveIndex;
  const project = featuredProjects[Math.min(active, archiveIndex - 1)];

  return (
    <section id="projetos" className="relative bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-48">
        <SectionHeader
          index="03"
          label={projects.title}
          title={projects.heading}
        />
      </div>
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${chapterCount * 100}svh` }}
      >
        <motion.div
          className="sticky top-0 h-svh overflow-hidden"
          style={{ clipPath: windowClip }}
          onPointerMove={onPointerMove}
        >
          <motion.div
            className="absolute -inset-8 will-change-transform"
            style={{ x: parallaxX, y: parallaxY }}
          >
            {labels.map((label, layer) => (
              <BackgroundLayer
                key={label}
                layer={layer}
                project={featuredProjects[layer]}
                active={chapters.active}
                previous={chapters.previous}
              />
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/70" />
          <div className="pointer-events-none absolute inset-0 z-2 bg-[radial-gradient(ellipse_at_center,transparent_40%,color-mix(in_oklab,var(--color-neutral-950)_80%,transparent)_100%)]" />
          <div className="film-grain pointer-events-none absolute inset-0 z-2 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-2 h-48 bg-linear-to-b from-neutral-950 to-transparent"
            style={{ opacity: edgeFade }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-48 bg-linear-to-t from-neutral-950 to-transparent" />

          <div className="relative z-3 mx-auto flex h-full max-w-7xl flex-col justify-between gap-6 px-6 pb-10 pt-3 md:px-10 md:pb-14 md:pt-4">
            <nav
              aria-label={t("chapters")}
              className="flex items-center gap-2"
            >
              {labels.map((label, chapter) => (
                <Segment
                  key={label}
                  chapter={chapter}
                  label={label}
                  chapters={chapterCount}
                  active={chapter === active}
                  progress={scrollYProgress}
                  onClick={() => scrollToChapter(chapter)}
                />
              ))}
            </nav>

            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col",
                isArchive ? "justify-center" : "justify-end",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isArchive ? (
                  <ArchiveChapter key="archive" onOpen={setOpen} />
                ) : (
                  <FeaturedChapter
                    key={active}
                    project={project}
                    onOpen={() => setOpen(active)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <CaseOverlay index={open} onClose={closeCase} onNavigate={setOpen} />
    </section>
  );
};

function BackgroundLayer({
  layer,
  project,
  active,
  previous,
}: {
  layer: number;
  project?: Project;
  active: number;
  previous: number;
}) {
  const isActive = layer === active;
  const zIndex = isActive ? 2 : layer === previous ? 1 : 0;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex }}
      initial={false}
      animate={
        isActive
          ? { clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0%)"] }
          : { clipPath: "inset(0 0 0 0%)" }
      }
      transition={{ duration: isActive ? 1 : 0, ease: EASE_IN_OUT }}
    >
      {project ? (
        <motion.div
          className="relative size-full"
          initial={false}
          animate={isActive ? { scale: [1.3, 1.05] } : { scale: 1.05 }}
          transition={{ duration: isActive ? 7 : 0, ease: "linear" }}
        >
          <ProjectMedia
            project={project}
            sizes="100vw"
            priority
            decorative
            still={!isActive}
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-neutral-950 bg-[radial-gradient(rgba(128,51,230,0.28)_1px,transparent_1px)] [background-size:12px_12px]">
          <div className="absolute inset-0 bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent,black_75%)]" />
        </div>
      )}
    </motion.div>
  );
}

function FeaturedChapter({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const t = useTranslations("projects");
  const words = project.title.split(" ");

  return (
    <motion.div
      className="flex flex-col gap-6 md:gap-8"
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.35 } },
          exit: { opacity: 0, transition: { duration: 0.2 } },
        }}
        className="font-mono text-xs uppercase tracking-widest text-neutral-400"
      >
        {[project.year, ...project.tags.slice(0, 4)]
          .filter(Boolean)
          .join(" · ")}
      </motion.p>

      <h3 className="pb-[0.06em] text-[13vw] font-bold leading-[0.92] tracking-tighter text-neutral-50 md:text-[7.5vw] 2xl:text-[8.5rem]">
        <span className="sr-only">{project.title}</span>
        <span aria-hidden className="block overflow-hidden">
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
                          ease: EASE_IN_OUT,
                          delay: 0.15 + (offset + c) * 0.025,
                        },
                      },
                      exit: {
                        y: "-110%",
                        transition: {
                          duration: 0.4,
                          ease: EASE_IN_OUT,
                          delay: (offset + c) * 0.01,
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
        </span>
      </h3>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.5, duration: 0.6, ease: EASE_OUT },
          },
          exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
        }}
        className="grid gap-6 md:grid-cols-[3fr_2fr] md:items-end md:gap-10"
      >
        <p className="line-clamp-3 max-w-2xl text-sm leading-relaxed text-neutral-300 md:line-clamp-4 md:text-lg">
          {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <button
            type="button"
            onClick={onOpen}
            className="group flex items-center rounded-full bg-neutral-50 px-5 py-2 text-sm font-medium text-neutral-950 transition-transform hover:scale-[1.03]"
          >
            {t("openCase")}
          </button>
          <CaseLinks project={project} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Segment({
  chapter,
  label,
  chapters: chapterCount,
  active,
  progress,
  onClick,
}: {
  chapter: number;
  label: string;
  chapters: number;
  active: boolean;
  progress: MotionValue<number>;
  onClick: () => void;
}) {
  const t = useTranslations("projects");
  const fill = useTransform(
    progress,
    [chapter / chapterCount, (chapter + 1) / chapterCount],
    [0, 1],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("goTo", { label })}
      aria-current={active ? "step" : undefined}
      className="group min-w-0 flex-1 py-3"
    >
      <span className="block h-0.5 w-full overflow-hidden rounded-full bg-neutral-800 transition-colors group-hover:bg-neutral-700">
        <motion.span
          className="block h-full origin-left bg-neutral-50"
          style={{ scaleX: fill }}
        />
      </span>
    </button>
  );
}

export default ProjectSection;
