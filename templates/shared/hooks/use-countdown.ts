"use client";

/* -------------------------------------------------------------------------- */
/*  useCountdown — live D-day countdown shared by all templates                */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ZERO: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function diff(targetMs: number): Countdown {
  const ms = targetMs - Date.now();
  if (ms <= 0) return ZERO;
  const sec = Math.floor(ms / 1000);
  return {
    days: Math.floor(sec / 86400),
    hours: Math.floor((sec % 86400) / 3600),
    minutes: Math.floor((sec % 3600) / 60),
    seconds: sec % 60,
  };
}

/**
 * Ticks every second toward `target`. Starts at all-zero so SSR and the first
 * client render match (avoids hydration mismatch); the interval fires the first
 * real value right after mount.
 */
export function useCountdown(target: Date): Countdown {
  const targetMs = target.getTime();
  const [time, setTime] = useState<Countdown>(ZERO);

  useEffect(() => {
    const tick = () => setTime(diff(targetMs));
    const kickoff = setTimeout(tick, 0); // first value asap (async, post-hydration)
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(id);
    };
  }, [targetMs]);

  return time;
}
