/* -------------------------------------------------------------------------- */
/*  brown-lace — 공용 SVG 필터 정의                                             */
/*                                                                             */
/*  텍스트 글리프 안쪽 음각(inner shadow)은 CSS text-shadow/box-shadow:inset    */
/*  로 표현할 수 없어 SVG 필터로 재현한다. 이 컴포넌트를 템플릿 루트에서 한 번만   */
/*  렌더하면, 어느 섹션에서든 style={{ filter: EFFECT.innerShadow }} 로 참조한다. */
/* -------------------------------------------------------------------------- */

import { FILTER_ID } from "./theme";

/** 템플릿당 1회 렌더하는 SVG 필터 defs. 레이아웃 공간을 차지하지 않는다. */
export function BrownLaceDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      {/*
        Figma node 128:42008 inner shadow ×2
        - #1: X0 Y0 Blur1  #BFAD97 80%  → stdDeviation 0.5
        - #2: X1 Y1 Blur3  #BFAD97 80%  → stdDeviation 1.5
        (Figma blur = CSS 블러 반경 ≈ 2×stdDeviation 이므로 stdDeviation = blur/2)
      */}
      <filter
        id={FILTER_ID.innerShadow}
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
      >
        {/* shadow #1 — X0 Y0 Blur1 */}
        <feComponentTransfer in="SourceAlpha" result="inv1">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur in="inv1" stdDeviation="0.5" />
        <feOffset dx="0" dy="0" result="off1" />
        <feFlood floodColor="#BFAD97" floodOpacity="0.8" />
        <feComposite in2="off1" operator="in" />
        <feComposite in2="SourceAlpha" operator="in" result="shadow1" />
        {/* shadow #2 — X1 Y1 Blur3 */}
        <feComponentTransfer in="SourceAlpha" result="inv2">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur in="inv2" stdDeviation="1.5" />
        <feOffset dx="1" dy="1" result="off2" />
        <feFlood floodColor="#BFAD97" floodOpacity="0.8" />
        <feComposite in2="off2" operator="in" />
        <feComposite in2="SourceAlpha" operator="in" result="shadow2" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="shadow1" />
          <feMergeNode in="shadow2" />
        </feMerge>
      </filter>
    </svg>
  );
}
