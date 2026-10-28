import texts from "@/content/texts.json";

export type ProjectLink = { icon: string; url: string };

export type Project = {
  title: string;
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

const items = texts.projects.items as Project[];

export const featuredProjects = items.filter((project) => project.featured);
export const archiveProjects = items.filter((project) => !project.featured);
export const allProjects = [...featuredProjects, ...archiveProjects];

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
