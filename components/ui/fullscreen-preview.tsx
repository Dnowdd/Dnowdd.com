"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullscreenPreviewProps {
  /** Conteúdo clicável que abre o fullscreen */
  children: React.ReactNode;
  /** URL da imagem a exibir em fullscreen */
  imageSrc: string;
  /** Texto alternativo da imagem */
  alt?: string;
  /** Classe no wrapper do trigger */
  className?: string;
  /** Notifica quando o fullscreen abre/fecha */
  onOpenChange?: (open: boolean) => void;
}

export function FullscreenPreview({
  children,
  imageSrc,
  alt = "Preview em tela cheia",
  className,
  onOpenChange,
}: FullscreenPreviewProps) {
  const [open, setOpenState] = useState(false);

  const setOpen = useCallback(
    (value: boolean) => {
      setOpenState(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn("cursor-pointer outline-none", className)}
        aria-label="Abrir em tela cheia"
      >
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={close}
          >
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Fechar"
            >
              <X className="size-5" />
            </motion.button>

            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={imageSrc}
              alt={alt}
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
