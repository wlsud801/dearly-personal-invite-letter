"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — CardReveal (가로 모드 콘텐츠 페이드인)                          */
/*                                                                             */
/*  가로(카드) 모드에서 카드에 접근할 때 배경 데코(레이스 띠·배경 사진·봉투)는     */
/*  그대로 두고, 이 래퍼로 감싼 콘텐츠(텍스트) 블록만 아래→위로 페이드인한다.      */
/*  세로 모드에서는 셸(TemplateShell)이 섹션 전체를 reveal 하므로 여기서는        */
/*  레이아웃(className/style)만 유지한 채 통과시킨다 — 모드 간 DOM 구조 동일.     */
/* -------------------------------------------------------------------------- */

import { Reveal, useIsHorizontal } from "@/templates/shared";

type CardRevealProps = {
  children: React.ReactNode;
  /** 콘텐츠 블록의 레이아웃 클래스 — 기존 콘텐츠 div 의 클래스를 그대로 받는다 */
  className?: string;
  /** 기존 콘텐츠 div 의 인라인 스타일 (absolute 배치 좌표 등) */
  style?: React.CSSProperties;
  /** 등장 지연(초) — 한 카드 안에서 블록을 순차 등장시킬 때 */
  delay?: number;
};

/** threshold — 카드가 스와이프로 ~15% 드러날 때 발동. 넛지 peek(~22px ≈ 5%)로는
    발동하지 않고, 콘텐츠 블록이 카드 높이보다 길어도 도달 가능한 값. */
const AMOUNT = 0.15;

export function CardReveal({
  children,
  className,
  style,
  delay = 0,
}: CardRevealProps) {
  const isHorizontal = useIsHorizontal();

  if (!isHorizontal) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <Reveal
      from="up"
      amount={AMOUNT}
      duration={0.8}
      delay={delay}
      className={className}
      style={style}
    >
      {children}
    </Reveal>
  );
}
