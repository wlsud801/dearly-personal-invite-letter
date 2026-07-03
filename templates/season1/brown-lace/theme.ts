/* -------------------------------------------------------------------------- */
/*  brown-lace — design tokens (fonts + colors)                                */
/*                                                                             */
/*  Values extracted from the Figma source (node 128:40488). Centralized here  */
/*  so sections reference FONT.* / COLOR.* instead of hardcoding hex/font vars. */
/*                                                                             */
/*  Fonts are registered as next/font/local in app/layout.tsx and exposed as   */
/*  CSS variables in app/globals.css:                                          */
/*    --font-pretendard  (본문/한글)                                            */
/*    --font-aurora      (Figma "Filmotype Yukon" → Aurora Moonlight)          */
/*    --font-badoney     (Figma "Maltiner Display" → Badoney)                  */
/*    --font-roaming     (Roaming)                                             */
/*    --font-filmotype   (Filmotype Yukon)                                      */
/* -------------------------------------------------------------------------- */

/** font-family stacks (CSS var → graceful fallback) */
export const FONT = {
  /** 한글 본문·UI 전반 */
  pretendard: "var(--font-pretendard), sans-serif",
  /** 큰 영문 디스플레이 타이틀 */
  aurora: "var(--font-aurora), serif",
  /** 보조 영문 디스플레이 */
  badoney: "var(--font-badoney), serif",
  /** 영문 스크립트/포인트 */
  roaming: "var(--font-roaming), serif",
  /** Filmotype Yukon */
  filmotype: "var(--font-filmotype), serif",
  /** Maltiner Display */
  maltiner: "var(--font-maltiner), serif",
  /** Altesse Std — 영문 필기체 (인사말 영문 등) */
  altesse: "var(--font-altesse), serif",
} as const;

/**
 * Palette. 이 템플릿은 "다크 브라운 배경 + 크림 텍스트"가 기본 톤이다.
 * `background` 위에 올라가는 본문/디스플레이는 `text`(크림), 라이트 패널
 * (편지지·레이스) 위 텍스트는 `heading`/`muted`(브라운) 계열을 쓴다.
 */
export const COLOR = {
  /** 페이지 기본 배경 — 다크 브라운 (루트 프레임 fill, 가장 넓은 면) */
  background: "#3A312A",
  /** 다크 배경 위 기본 텍스트·디스플레이 타이틀 — 크림 (전체에서 가장 많이 쓰임) */
  text: "#D7CEC6",
  /** 라이트 패널 위 헤딩/강조 텍스트 — 다크 브라운 (Pretendard Bold) */
  heading: "#53473D",
  /** 보조·뮤트 텍스트 — 미드 브라운 (Pretendard Medium) */
  muted: "#7C6D5F",
  /** 라이트 패널 위 얇은 라벨 — 라이트 토프 ("Save the Date" 등) */
  label: "#BBAEA2",
  /** 라이트 웜 서피스 — 상태바/밴드 등 */
  surface: "#E9E2DD",
  /** 액센트 — 하트 등 포인트 (dusty rose) */
  accent: "#D26566",
} as const;

/**
 * SVG 필터 id. 실제 `<filter>` 정의는 `<BrownLaceDefs/>`(effects.tsx)에서
 * 템플릿당 한 번 렌더되고, 각 섹션은 `EFFECT.*` 토큰으로 참조만 한다.
 */
export const FILTER_ID = {
  /** 글자 글리프 안쪽 음각 (Figma node 128:42008 inner shadow ×2) */
  innerShadow: "brown-lace-inner-shadow",
} as const;

/** `style={{ filter: EFFECT.innerShadow }}` 형태로 쓰는 filter CSS 값 토큰 */
export const EFFECT = {
  innerShadow: `url(#${FILTER_ID.innerShadow})`,
} as const;

export type FontKey = keyof typeof FONT;
export type ColorKey = keyof typeof COLOR;
