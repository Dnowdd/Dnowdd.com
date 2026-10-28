import { useSyncExternalStore } from "react";

export const INTRO_DONE_EVENT = "intro:done";

const subscribe = (onChange: () => void) => {
  window.addEventListener(INTRO_DONE_EVENT, onChange);
  return () => window.removeEventListener(INTRO_DONE_EVENT, onChange);
};

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.intro === "done",
    () => false,
  );
}
