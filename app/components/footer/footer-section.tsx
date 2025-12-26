"use client";

import { motion } from "motion/react";

export function FooterSection() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full py-8 border-t border-white/5 bg-background confirm-footer"
    >
      <div className="container mx-auto flex flex-col items-center justify-center gap-2">
        <motion.div
          className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3], scaleX: [0.8, 1.2, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="text-xs text-muted-foreground/60 font-medium tracking-widest transition-colors hover:text-muted-foreground">
          Designed & Developed by Dnowdd
        </p>
      </div>
    </motion.footer>
  );
}
