"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hero", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "trajetoria", label: "Trajetória" },
  { id: "contato", label: "Contato" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    const elements = SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegação por seções"
      className="hidden lg:flex flex-col gap-2 fixed right-5 top-1/2 -translate-y-1/2 z-50"
    >
      {SECTIONS.map(({ id, label }, index) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex size-5 items-center justify-center"
          >
            {isActive && (
              <motion.span
                layoutId="section-nav-ring"
                className="absolute size-3 rounded-full border-2 border-primary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className={cn(
                "rounded-full transition-all duration-300",
                isActive
                  ? "size-0"
                  : "size-1 bg-neutral-700 group-hover:size-1.5 group-hover:bg-neutral-300",
              )}
            />
            <span className="pointer-events-none absolute right-full mr-3 flex translate-x-1 items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-neutral-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <span className="text-neutral-600">{pad(index + 1)}</span>
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
