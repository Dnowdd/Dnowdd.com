"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

// Carrega o three.js fora do bundle inicial, só no cliente
const FluidWaves = dynamic(() => import("./fluid-waves"), { ssr: false });

export default function FluidWavesLazy() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return <FluidWaves />;
}
