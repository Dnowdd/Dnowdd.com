"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";
import { Badge } from "./badge";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    school?: string;
    from: string;
    to?: string;
    description: string;
    tags?: string[];
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 py-10", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/10 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="bg-neutral-950 !border-neutral-900 shadow shadow-neutral-900 select-none">
            <div className="flex flex-col items-center text-center">
              <p className="text-neutral-400 font-semibold">{item.school}</p>
              <div className="flex gap-2 items-center text-neutral-400">
                <p>{item.from}</p>
                <div className="w-4 h-px bg-neutral-500"></div>
                <p>{item.to ?? "Atualmente"}</p>
              </div>
            </div>

            <div className="my-8">
              <h3 className="text-2xl font-bold text-neutral-100 text-center w-5/6 mx-auto">
                {item.title}
              </h3>
              <p className="text-neutral-400 line-clamp-3 text-center mt-2">
                {item.description}
              </p>
            </div>

            {item.tags && (
              <div className="flex flex-wrap gap-2 justify-center">
                {item.tags.map((tag, tagIdx) => (
                  <Badge
                    variant="outline"
                    className="text-neutral-400 bg-neutral-900/50"
                    key={tagIdx}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
