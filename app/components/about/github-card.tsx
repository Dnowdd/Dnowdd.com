"use client";

import { GITHUB_LOGIN, type GithubStats } from "@/lib/github-shared";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const LEVELS = [
  "bg-neutral-800/70",
  "bg-primary/30",
  "bg-primary/55",
  "bg-primary/80",
  "bg-fuchsia-400",
];

const levelFor = (count: number, max: number) => {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.6) return 4;
  if (ratio > 0.35) return 3;
  if (ratio > 0.15) return 2;
  return 1;
};

const magnify = (distance: number) => {
  if (distance === 0) return 2;
  if (distance < 1.5) return 1.45;
  if (distance < 2.5) return 1.15;
  return 1;
};

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

export function GithubCard({ stats }: { stats: GithubStats }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.4 });
  const [hovered, setHovered] = useState<{ week: number; day: number } | null>(
    null,
  );
  const max = Math.max(1, ...stats.weeks.flat().map((count) => count ?? 0));
  const columns = stats.weeks.length;
  const hoveredCount = hovered ? stats.weeks[hovered.week][hovered.day] : null;

  const numbers = [
    { label: "contribuições", value: stats.contributions },
    { label: "repositórios", value: stats.repositories },
    { label: "estrelas", value: stats.stars },
    { label: "dias seguidos", value: stats.longestStreak },
  ];

  return (
    <a
      href={`https://github.com/${GITHUB_LOGIN}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Perfil de ${GITHUB_LOGIN} no GitHub`}
      className="group/card flex min-w-0 flex-col gap-6"
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {numbers.map((item) => (
          <div key={item.label}>
            <dd className="text-3xl font-semibold tracking-tight text-neutral-50 transition-colors duration-300 group-hover/card:text-white">
              {formatNumber(item.value)}
            </dd>
            <dt className="mt-1 text-xs text-neutral-500">{item.label}</dt>
          </div>
        ))}
      </dl>

      <div className="relative">
        <div
          ref={gridRef}
          role="img"
          data-cursor="default"
          aria-label={`${formatNumber(stats.contributions)} contribuições no último ano`}
          className="grid grid-flow-col grid-rows-7 gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          onPointerLeave={() => setHovered(null)}
        >
          {stats.weeks.map((week, w) =>
            week.map((count, d) => {
              const distance = hovered
                ? Math.hypot(hovered.week - w, hovered.day - d)
                : Infinity;
              const scale = magnify(Math.round(distance * 10) / 10);
              return (
                <span
                  key={`${w}-${d}`}
                  onPointerEnter={() =>
                    count !== null && setHovered({ week: w, day: d })
                  }
                  className={`relative aspect-square rounded-[1px] transition-[opacity,transform,filter] duration-300 ${
                    count === null ? "invisible" : LEVELS[levelFor(count, max)]
                  }`}
                  style={{
                    opacity: inView ? 1 : 0,
                    transitionDelay: inView && !hovered ? `${w * 12}ms` : "0ms",
                    transform: `scale(${scale})`,
                    zIndex: scale > 1 ? 1 : 0,
                    filter: distance === 0 ? "brightness(1.6)" : undefined,
                  }}
                />
              );
            }),
          )}
        </div>

        {hovered && hoveredCount !== null && (
          <span
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm bg-neutral-50 px-2 py-1 font-mono text-[10px] text-neutral-950"
            style={{
              left: `${((hovered.week + 0.5) / columns) * 100}%`,
              top: `calc(${(hovered.day / 7) * 100}% - 8px)`,
            }}
          >
            {hoveredCount}{" "}
            {hoveredCount === 1 ? "contribuição" : "contribuições"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex h-1 overflow-hidden rounded-full bg-neutral-800">
          {stats.languages.map((language) => (
            <span
              key={language.name}
              style={{
                width: `${language.share * 100}%`,
                backgroundColor: language.color,
              }}
            />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-neutral-500">
          {stats.languages.map((language) => (
            <li key={language.name} className="flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: language.color }}
              />
              {language.name}
              <span className="text-neutral-600">
                {Math.round(language.share * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}
