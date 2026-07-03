"use client";

/* -------------------------------------------------------------------------- */
/*  Reveal — framer-motion-free scroll/stagger reveal (shared primitive)        */
/*                                                                             */
/*  The reference template (dearly-personal-invite-letter) used framer-motion   */
/*  `whileInView` + variant stagger. framer-motion is NOT a dependency here, so  */
/*  this reimplements the same effect with IntersectionObserver + a CSS          */
/*  transition (opacity + translateY). Mode-agnostic: identical markup in        */
/*  vertical and horizontal scroll. The observer watches the shared shell        */
/*  scroll container as its root via `null` (viewport) which also works inside   */
/*  the mockup since the element still crosses the viewport intersection.        */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "none";

const OFFSET: Record<Direction, string> = {
  up: "translateY(24px)",
  down: "translateY(-16px)",
  none: "translateY(0)",
};

type RevealProps = {
  children: React.ReactNode;
  /** seconds to wait before this element animates in (stagger) */
  delay?: number;
  /** entrance direction */
  from?: Direction;
  /** transition duration in seconds */
  duration?: number;
  className?: string;
  /** render as something other than a div (e.g. "li") */
  as?: "div" | "li" | "span";
  /** extra layout styles (merged before the reveal transform) */
  style?: React.CSSProperties;
  /** IntersectionObserver threshold — 보이는 비율 기준 (기본 0.2) */
  amount?: number;
  /**
   * IntersectionObserver rootMargin (기본 "0px"). 뷰포트 하단을 줄이면
   * "스크롤 N% 진입 시" 트리거가 된다. 예: "0px 0px -30% 0px" → 상단 70%
   * 영역 진입 시 발동(섹션 높이와 무관, threshold 0 과 함께 사용 권장).
   */
  rootMargin?: string;
};

/**
 * Reveals its children once when scrolled into view. Re-usable per element;
 * pass a staggered `delay` to sequence siblings the way the reference did.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  duration = 0.6,
  className = "",
  as: Tag = "div",
  style,
  amount = 0.2,
  rootMargin = "0px",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced-motion: reveal immediately.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount, rootMargin]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement & HTMLSpanElement>}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: `${style?.transform ?? ""} ${shown ? "translateY(0)" : OFFSET[from]}`.trim(),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
