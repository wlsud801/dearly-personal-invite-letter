"use client";

/* -------------------------------------------------------------------------- */
/*  Shared template UI primitives — ScrollMode 컨텍스트 + Deco                  */
/*                                                                             */
/*  Sections are built from decorative assets + live text layers. 가로(카드)     */
/*  스크롤 모드에서 각 섹션은 useIsHorizontal() 로 모드를 받아                      */
/*  minHeight:100cqh 로 카드 높이를 채운다 — brown-lace 섹션과 동일한 방식          */
/*  (셸이 ScrollModeProvider 로 모드를 내려준다).                                */
/* -------------------------------------------------------------------------- */

import { createContext, useContext } from "react";

/** 셸 → 하위 섹션에 가로/세로 모드를 전달하는 컨텍스트. */
const ScrollModeContext = createContext(false);

export function ScrollModeProvider({
  isHorizontal,
  children,
}: {
  isHorizontal: boolean;
  children: React.ReactNode;
}) {
  return (
    <ScrollModeContext.Provider value={isHorizontal}>
      {children}
    </ScrollModeContext.Provider>
  );
}

/** 현재 가로(카드) 스크롤 모드인지 — 섹션이 모드별 분기에 사용. */
export function useIsHorizontal() {
  return useContext(ScrollModeContext);
}

type DecoProps = {
  /** local asset path (/assets/templates/green-envelop/...) */
  src: string;
  /** decorative by default (empty alt); pass for meaningful imagery */
  alt?: string;
  className?: string;
  /** load eagerly only for above-the-fold (cover) art */
  priority?: boolean;
  /** inline layout styles (Figma collage geometry) */
  style?: React.CSSProperties;
};

/**
 * Decorative artwork image. Plain <img> (codebase convention for decorative
 * SVGs); lazy by default since many green-envelop SVGs are large.
 */
export function Deco({ src, alt = "", className = "", priority = false, style }: DecoProps) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={className}
      style={style}
    />
  );
}
