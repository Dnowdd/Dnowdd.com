"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import {
  allProjects,
  EASE_IN_OUT,
  EASE_OUT,
  mediaAspect,
  pad,
  type Project,
  projectLinks,
} from "./data";
import { ProjectMedia } from "./project-media";

type CaseOverlayProps = {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const total = allProjects.length;
const wrap = (index: number) => (index + total) % total;

export function CaseOverlay({ index, onClose, onNavigate }: CaseOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;
  const project = isOpen ? allProjects[index] : null;
  const lenis = useLenis();

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (index === null) return;
    panelRef.current?.scrollTo({ top: 0 });
    const { repo, live } = projectLinks(allProjects[index]);

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "escape") onClose();
      else if (key === "arrowright") onNavigate(wrap(index + 1));
      else if (key === "arrowleft") onNavigate(wrap(index - 1));
      else if (key === "g" && repo) window.open(repo, "_blank", "noopener");
      else if (key === "l" && live) window.open(live, "_blank", "noopener");
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [index, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {project && index !== null && (
        <motion.div
          ref={panelRef}
          className="fixed inset-0 z-60 overflow-y-auto overscroll-contain bg-neutral-950"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <header className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-b from-neutral-950 to-transparent px-6 py-5 font-mono text-xs uppercase tracking-widest text-neutral-500 md:px-10">
            <span>
              Case <span className="text-neutral-100">{pad(index + 1)}</span> /{" "}
              {pad(total)}
            </span>
            <div className="flex items-center gap-2">
              <IconButton
                label="Projeto anterior"
                onClick={() => onNavigate(wrap(index - 1))}
              >
                <ArrowLeft className="size-4" />
              </IconButton>
              <IconButton
                label="Próximo projeto"
                onClick={() => onNavigate(wrap(index + 1))}
              >
                <ArrowRight className="size-4" />
              </IconButton>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="ml-2 flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 py-2 pl-3 pr-2 text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
              >
                Esc <X className="size-4" />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-10 pt-6 md:gap-16 md:px-10"
            >
              <h2 className="text-5xl font-bold tracking-tighter text-neutral-50 md:text-8xl lg:text-9xl">
                {project.title}
              </h2>

              {project.mobileApp ? (
                <div className="flex w-full justify-center rounded-lg border border-neutral-900 bg-[radial-gradient(ellipse_at_center,rgba(128,51,230,0.18),transparent_70%)] py-10 md:py-16">
                  <div
                    className="relative h-[70svh] max-h-205 overflow-hidden rounded-[2rem] border-4 border-neutral-800 bg-neutral-900 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
                    style={{ aspectRatio: mediaAspect(project) }}
                  >
                    <ProjectMedia project={project} sizes="400px" />
                  </div>
                </div>
              ) : (
                <div
                  className="relative w-full overflow-hidden rounded-lg border border-neutral-900 bg-neutral-900"
                  style={{ aspectRatio: mediaAspect(project) }}
                >
                  <ProjectMedia
                    project={project}
                    sizes="(min-width: 1280px) 1280px, 100vw"
                  />
                </div>
              )}

              <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
                <CaseMeta project={project} />
                <div className="flex flex-col gap-8">
                  <p className="text-lg leading-relaxed text-neutral-300 md:text-2xl md:leading-relaxed">
                    {project.description}
                  </p>
                  <CaseLinks project={project} />
                </div>
              </div>

              <NextProject
                project={allProjects[wrap(index + 1)]}
                onClick={() => onNavigate(wrap(index + 1))}
              />
            </motion.article>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CaseMeta({ project }: { project: Project }) {
  const rows = [
    project.role && { label: "Papel", value: project.role },
    project.year && { label: "Ano", value: project.year },
    { label: "Stack", value: project.tags.join(" · ") },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <dl className="flex flex-col gap-6 font-mono text-xs uppercase tracking-widest">
      {rows.map((row) => (
        <div key={row.label} className="border-t border-neutral-900 pt-4">
          <dt className="text-neutral-600">{row.label}</dt>
          <dd className="mt-2 leading-relaxed text-neutral-300">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseLinks({ project }: { project: Project }) {
  const { repo, live } = projectLinks(project);
  if (!repo && !live) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {live && <LinkPill href={live} label="Ver ao vivo" shortcut="L" />}
      {repo && <LinkPill href={repo} label="Código fonte" shortcut="G" />}
    </div>
  );
}

function LinkPill({
  href,
  label,
  shortcut,
}: {
  href: string;
  label: string;
  shortcut: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-full border border-neutral-700 bg-neutral-950/60 py-2 pl-5 pr-2 text-sm text-neutral-100 backdrop-blur transition-colors hover:border-primary hover:bg-primary/15"
    >
      {label}
      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      <kbd className="hidden rounded-full border border-neutral-700 px-2 py-0.5 font-mono text-[10px] text-neutral-400 md:inline">
        {shortcut}
      </kbd>
    </a>
  );
}

function NextProject({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mt-10 flex flex-col items-start gap-3 overflow-hidden border-t border-neutral-900 pt-10 text-left"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-neutral-600">
        Próximo projeto →
      </span>
      <span className="text-4xl font-bold tracking-tighter text-neutral-700 transition-colors duration-500 group-hover:text-neutral-50 md:text-7xl">
        {project.title}
      </span>
    </button>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-full border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
    >
      {children}
    </button>
  );
}
