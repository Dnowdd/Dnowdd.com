import { useMessages } from "next-intl";
import { useMemo } from "react";

export type ProjectLink = { icon: string; url: string };

export type Project = {
  title: string;
  summary?: string;
  description: string;
  image: string;
  video?: string;
  year?: string;
  role?: string;
  tags: string[];
  featured?: boolean;
  mobileApp?: boolean;
  links?: ProjectLink[];
};

export function useProjects() {
  const { projects } = useMessages();
  return useMemo(() => {
    const items = projects.items as Project[];
    const featured = items.filter((project) => project.featured);
    const archive = items.filter((project) => !project.featured);
    return { featured, archive, all: [...featured, ...archive] };
  }, [projects]);
}

export const pad = (n: number) => String(n).padStart(2, "0");

export const mediaAspect = (project: Project) =>
  project.mobileApp ? 1080 / 2400 : 1600 / 933;

export const projectLinks = (project: Project) => ({
  repo: project.links?.find((link) => link.icon === "Github")?.url,
  live: project.links?.find((link) => link.icon === "Globe")?.url,
});

export const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable);

export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
