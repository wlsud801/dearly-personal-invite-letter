"use client";

import { useEffect, useState } from "react";
import RSVPModal from "./RSVPModal";

export default function RSVPButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const target = document.getElementById("invitation-section");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          // 아직 스크롤 전 (위에서 내려오는 중)
          setVisible(false);
        }
        // boundingClientRect.top < 0 이면 이미 지나친 것 → 유지
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        style={{ right: "calc(max(0px, (100vw - 430px) / 2) + 16px)" }}
        className={`fixed top-4 z-40 transition-all duration-700 ease-out ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="참석여부 전달하기"
          className="active:opacity-70"
        >
          <img
            src="/images/RSVP/RSVP.png"
            alt="RSVP"
            className="w-[65px] animate-float"
          />
        </button>
      </div>
      {open && <RSVPModal onClose={() => setOpen(false)} />}
    </>
  );
}
