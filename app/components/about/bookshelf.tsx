"use client";

import books from "@/content/books.json";
import texts from "@/content/texts.json";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Book = { title: string; author: string; image: string };

const LIBRARY = books as Book[];
const COVER_WIDTH = 88;
const GAP = 16;

type BookshelfProps = {
  totalRead: number | null;
  profileUrl: string | null;
};

export function Bookshelf({ totalRead, profileUrl }: BookshelfProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [capacity, setCapacity] = useState(5);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setCapacity(Math.max(2, Math.floor((width + GAP) / (COVER_WIDTH + GAP))));
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  if (LIBRARY.length === 0) return null;
  const total = Math.max(totalRead ?? 0, LIBRARY.length);
  const needsMore = total > LIBRARY.length || LIBRARY.length > capacity;
  const visible = needsMore ? LIBRARY.slice(0, capacity - 1) : LIBRARY;
  const remaining = total - visible.length;

  const moreContent = (
    <>
      <span className="text-2xl font-semibold tracking-tight text-neutral-100">
        +{remaining}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 transition-colors group-hover:text-neutral-300">
        {texts.about.moreBooks}
      </span>
    </>
  );
  const moreClassName =
    "group flex aspect-2/3 flex-col items-center justify-center gap-1 rounded-sm border border-neutral-800 bg-neutral-900/60";

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4 font-mono text-xs uppercase tracking-widest">
        <p className="text-neutral-500">{texts.about.books}</p>
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 text-[10px] text-neutral-600 transition-colors hover:text-neutral-300"
          >
            {texts.about.trapiche}
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>

      <ul ref={listRef} className="flex gap-4">
        {visible.map((book) => (
          <li
            key={book.title}
            data-cursor="media"
            className="group shrink-0"
            style={{ width: COVER_WIDTH }}
          >
            <div className="relative aspect-2/3 overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900 transition-transform duration-500 group-hover:-translate-y-1.5">
              <Image
                src={`/books/${book.image}`}
                alt={`Capa de ${book.title}`}
                fill
                sizes={`${COVER_WIDTH}px`}
                className="object-cover"
              />
            </div>
            <p
              className="mt-2 truncate text-[11px] leading-tight text-neutral-300"
              title={book.title}
            >
              {book.title}
            </p>
            <p
              className="mt-0.5 truncate text-[10px] leading-tight text-neutral-600"
              title={book.author}
            >
              {book.author}
            </p>
          </li>
        ))}
        {needsMore && (
          <li className="shrink-0" style={{ width: COVER_WIDTH }}>
            {profileUrl ? (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver mais ${remaining} livros no Trapiche`}
                className={`${moreClassName} transition-colors duration-300 hover:border-primary hover:bg-primary/10`}
              >
                {moreContent}
              </a>
            ) : (
              <div className={moreClassName}>{moreContent}</div>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
