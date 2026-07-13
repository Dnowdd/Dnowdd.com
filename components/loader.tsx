"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const COOKIE_NAME = "dnowdd-intro-seen";
const COOKIE_MAX_AGE_S = 60 * 60; // 1 hora sem visitar -> intro de novo
const INTRO_DURATION_MS = 2200;
const PRELOAD_TIMEOUT_MS = 5000;

const hasSeenIntro = () =>
  document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));

const markIntroSeen = () => {
  document.cookie = `${COOKIE_NAME}=1; max-age=${COOKIE_MAX_AGE_S}; path=/; samesite=lax`;
};

// Aquece o chunk do three.js atrás da cortina — é o mesmo módulo do dynamic
// import do hero, então quando a intro termina as ondas já estão no palco.
const preloadHeroScene = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve();
  }
  return Promise.race([
    import("@/app/components/hero/components/fluid-waves"),
    new Promise((resolve) => setTimeout(resolve, PRELOAD_TIMEOUT_MS)),
  ]);
};

export function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = hasSeenIntro();
    markIntroSeen();

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (seen) {
      timers.push(setTimeout(() => setIsLoading(false), 0));
    } else {
      timers.push(setTimeout(() => setShowIntro(true), 0));

      const minDuration = new Promise((resolve) => {
        timers.push(setTimeout(resolve, INTRO_DURATION_MS));
      });

      Promise.all([minDuration, preloadHeroScene()]).then(() => {
        if (!cancelled) setIsLoading(false);
      });
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950"
          aria-hidden
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {showIntro && (
            <div className="flex flex-col items-center justify-center overflow-hidden">
              {/* First Text Line */}
              <div className="overflow-hidden">
                <motion.p
                  className="text-2xl md:text-4xl font-light text-muted-foreground/80 tracking-widest"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: "circOut", delay: 0.1 }}
                >
                  Com prazer,
                </motion.p>
              </div>

              {/* Second Text Line */}
              <div className="overflow-hidden mt-2">
                <motion.p
                  className="text-3xl md:text-5xl font-semibold text-white tracking-tighter"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: "circOut", delay: 0.6 }}
                >
                  seja bem-vindo
                </motion.p>
              </div>

              {/* Decorative loading bar */}
              <motion.div
                className="h-[2px] bg-white mt-8"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100px", opacity: 1 }}
                transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
