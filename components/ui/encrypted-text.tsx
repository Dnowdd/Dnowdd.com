"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type EncryptedTextProps = {
  text: string;
  className?: string;
  /**
   * Time in milliseconds between revealing each subsequent real character.
   * Lower is faster. Defaults to 50ms per character.
   */
  revealDelayMs?: number;
  /** Optional custom character set to use for the gibberish effect. */
  charset?: string;
  /**
   * Time in milliseconds between gibberish flips for unrevealed characters.
   * Lower is more jittery. Defaults to 50ms.
   */
  flipDelayMs?: number;
  /** CSS class for styling the encrypted/scrambled characters */
  encryptedClassName?: string;
  /** CSS class for styling the revealed characters */
  revealedClassName?: string;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length);
  return charset.charAt(index);
}

function generateGibberishPreservingSpaces(
  original: string,
  charset: string
): string {
  if (!original) return "";
  let result = "";
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    result += ch === " " ? " " : generateRandomCharacter(charset);
  }
  return result;
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const [revealCount, setRevealCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  // Initialize with empty array to avoid hydration mismatch
  const [scrambleChars, setScrambleChars] = useState<string[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (!isInView || !text) {
      isAnimatingRef.current = false;
      return;
    }

    // Start a new animation
    isAnimatingRef.current = true;
    const initialScramble = generateGibberishPreservingSpaces(
      text,
      charset
    ).split("");
    let currentRevealCount = 0;
    const currentScramble = [...initialScramble];
    const startTime = performance.now();
    let lastFlipTime = startTime;
    let isFirstFrame = true;

    const update = (now: number) => {
      if (!isAnimatingRef.current) return;

      // Initialize state on first frame to avoid sync setState in effect
      if (isFirstFrame) {
        setRevealCount(0);
        setScrambleChars(initialScramble);
        isFirstFrame = false;
      }

      const elapsedMs = now - startTime;
      const totalLength = text.length;
      const newRevealCount = Math.min(
        totalLength,
        Math.floor(elapsedMs / Math.max(1, revealDelayMs))
      );

      if (newRevealCount !== currentRevealCount) {
        currentRevealCount = newRevealCount;
        setRevealCount(currentRevealCount);
      }

      if (currentRevealCount >= totalLength) {
        isAnimatingRef.current = false;
        return;
      }

      // Re-randomize unrevealed scramble characters on an interval
      const timeSinceLastFlip = now - lastFlipTime;
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        let needsUpdate = false;
        for (let index = 0; index < totalLength; index += 1) {
          if (index >= currentRevealCount) {
            if (text[index] !== " ") {
              currentScramble[index] = generateRandomCharacter(charset);
              needsUpdate = true;
            } else {
              currentScramble[index] = " ";
            }
          }
        }
        if (needsUpdate) {
          setScrambleChars([...currentScramble]);
        }
        lastFlipTime = now;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      isAnimatingRef.current = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isInView, text, revealDelayMs, charset, flipDelayMs]);

  if (!text) return null;

  // During SSR and before mount, show the final revealed text to avoid hydration mismatch
  if (!isMounted) {
    return (
      <motion.span
        ref={ref}
        className={cn(className)}
        aria-label={text}
        role="text"
      >
        {text.split("").map((char, index) => (
          <span key={index} className={cn(revealedClassName)}>
            {char}
          </span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      aria-label={text}
      role="text"
    >
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount;
        const displayChar = isRevealed
          ? char
          : char === " "
          ? " "
          : scrambleChars[index] || char;

        return (
          <span
            key={index}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {displayChar}
          </span>
        );
      })}
    </motion.span>
  );
};
