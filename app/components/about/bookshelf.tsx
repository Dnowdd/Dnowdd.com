"use client";

import books from "@/content/books.json";
import texts from "@/content/texts.json";
import { GITHUB_LOGIN } from "@/lib/github-shared";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Book = { title: string; image: string };

const LIBRARY = books as Book[];
const MORE_URL = `https://github.com/${GITHUB_LOGIN}`;
const COVER_WIDTH = 88;
const GAP = 16;

export function Bookshelf() {
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
  const overflow = LIBRARY.length > capacity;
  const visible = overflow ? LIBRARY.slice(0, capacity - 1) : LIBRARY;
  const remaining = LIBRARY.length - visible.length;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
        {texts.about.books}
      </p>

      <ul ref={listRef} className="flex gap-4 pb-8">
        {visible.map((book) => (
          <li
            key={book.title}
            data-cursor="media"
            className="group relative shrink-0"
            style={{ width: COVER_WIDTH }}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900 transition-transform duration-500 group-hover:-translate-y-1.5">
              <Image
                src={book.image}
                alt={`Capa de ${book.title}`}
                fill
                sizes={`${COVER_WIDTH}px`}
                className="object-cover"
              />
            </div>
            <p className="absolute inset-x-0 top-full mt-2 line-clamp-2 text-[11px] leading-tight text-neutral-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {book.title}
            </p>
          </li>
        ))}
        {overflow && (
          <li className="shrink-0" style={{ width: COVER_WIDTH }}>
            <a
              href={MORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver mais ${remaining} livros`}
              className="group flex aspect-[2/3] flex-col items-center justify-center gap-1 rounded-sm border border-neutral-800 bg-neutral-900/60 transition-colors duration-300 hover:border-primary hover:bg-primary/10"
            >
              <span className="text-2xl font-semibold tracking-tight text-neutral-100">
                +{remaining}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 transition-colors group-hover:text-neutral-300">
                {texts.about.moreBooks}
              </span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
