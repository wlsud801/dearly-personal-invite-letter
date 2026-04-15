"use client";

import { useState, useEffect } from "react";
import { WEDDING_DATE } from "@/app/constants/wedding";

function calcTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calcTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (!timeLeft) return <div className="py-6 h-[72px]" />;

  const numStyle: React.CSSProperties = { display: 'inline-block', width: '2.5ch', textAlign: 'center' };

  return (
    <div className="flex items-end justify-center gap-2 py-6" style={{ fontFamily: "'Rusilla Serif', serif" }}>
      <span className="text-[#2c4221] text-4xl leading-none" style={numStyle}>{pad(timeLeft.days)}</span>
      <span className="text-[#2c4221] text-xl leading-none mb-1" style={{ fontFamily: "'Soluga', serif" }}>Day</span>
      <span className="text-[#2c4221] text-4xl leading-none" style={numStyle}>{pad(timeLeft.hours)}</span>
      <span className="text-[#2c4221] text-4xl leading-none" style={{ fontFamily: "'Soluga', serif" }}>:</span>
      <span className="text-[#2c4221] text-4xl leading-none" style={numStyle}>{pad(timeLeft.minutes)}</span>
      <span className="text-[#2c4221] text-4xl leading-none" style={{ fontFamily: "'Soluga', serif" }}>:</span>
      <span className="text-[#2c4221] text-4xl leading-none" style={numStyle}>{pad(timeLeft.seconds)}</span>
    </div>
  );
}
