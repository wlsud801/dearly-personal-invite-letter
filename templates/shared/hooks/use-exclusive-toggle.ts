"use client";

/* -------------------------------------------------------------------------- */
/*  useExclusiveToggle — accordion state (only one key open at a time)         */
/* -------------------------------------------------------------------------- */

import { useState } from "react";

/**
 * Tracks a single open key. Selecting the currently-open key closes it
 * (re-selecting another switches). Pass `initial` to open one by default.
 */
export function useExclusiveToggle<T extends string>(initial: T | null = null) {
  const [open, setOpen] = useState<T | null>(initial);
  const toggle = (key: T) => setOpen((prev) => (prev === key ? null : key));
  return { open, toggle, setOpen };
}
