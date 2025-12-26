"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force minimum load time of 3.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950"
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <div className="flex flex-col items-center justify-center overflow-hidden">
            {/* First Text Line */}
            <div className="overflow-hidden">
              <motion.p
                className="text-2xl md:text-4xl font-light text-muted-foreground/80 tracking-widest"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
              >
                Com prazer,
              </motion.p>
            </div>

            {/* Second Text Line */}
            <div className="overflow-hidden mt-2">
              <motion.p
                className="text-3xl md:text-5xl font-semi bold text-white tracking-tighter"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "circOut", delay: 1.2 }}
              >
                seja bem-vindo
              </motion.p>
            </div>

            {/* Decorative loading bar */}
            <motion.div
              className="h-[2px] bg-white mt-8"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100px", opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
