"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { Project } from "./data";

type ProjectMediaProps = {
  project: Project;
  sizes: string;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function ProjectMedia({
  project,
  sizes,
  className,
  priority,
  decorative,
}: ProjectMediaProps) {
  const reducedMotion = useReducedMotion();
  const alt = decorative ? "" : `Captura de tela do projeto ${project.title}`;

  if (project.video && !reducedMotion) {
    return (
      <video
        src={project.video}
        poster={project.image}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : alt}
        className={cn("absolute inset-0 size-full object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={project.image}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      draggable={false}
      className={cn("object-cover", className)}
    />
  );
}
