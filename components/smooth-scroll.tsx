"use client";

import { useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
