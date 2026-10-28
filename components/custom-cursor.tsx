"use client";

import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Mode = "default" | "hover" | "media" | "hidden";

const INTERACTIVE =
  "a, button, [role='button'], label, summary, input, textarea, select";

const modeFor = (target: EventTarget | null): Mode => {
  if (!(target instanceof Element)) return "default";
  const tagged = target.closest<HTMLElement>("[data-cursor]");
  if (tagged) return (tagged.dataset.cursor as Mode) ?? "default";
  if (target.closest(INTERACTIVE)) return "hover";
  if (target.closest("img, video")) return "media";
  return "default";
};

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      root.classList.add("custom-cursor");
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => setMode(modeFor(event.target));
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("custom-cursor");
    };
  }, [reducedMotion, x, y]);

  const isMedia = mode === "media";
  const scale = isMedia ? 7 : mode === "hover" ? 3 : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-100 mix-blend-difference transition-opacity duration-200"
      style={{ opacity: visible && mode !== "hidden" ? 1 : 0 }}
    >
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.span
          className="block size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{ scale: pressed ? scale * 0.7 : scale }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        />
      </motion.div>
    </div>
  );
}
