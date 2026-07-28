"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hero", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "redes-sociais", label: "Redes Sociais" },
  { id: "experiencias", label: "Experiências" },
  { id: "educacao", label: "Educação" },
];

export function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegação por seções"
      className="hidden lg:flex flex-col gap-4 fixed right-6 top-1/2 -translate-y-1/2 z-50"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center justify-end py-1"
          >
            <span
              className={cn(
                "rounded-full transition-all duration-300",
                isActive
                  ? "size-2.5 bg-primary"
                  : "size-1.5 bg-neutral-600 group-hover:bg-neutral-400"
              )}
              style={isActive ? { boxShadow: "0 0 8px 2px rgba(168,85,247,0.6)" } : undefined}
            />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
