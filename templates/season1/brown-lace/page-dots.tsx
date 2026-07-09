"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 가로(카드) 모드 페이지 도트 (하단 중앙)                          */
/*                                                                             */
/*  프레임 하단 중앙에 점을 띄워 현재 페이지를 표시하고, 점을 탭하면 해당 카드로   */
/*  스크롤한다. 표지(cover)는 점 개수에서 제외한다 — 표지에 있을 때는 어떤 점도    */
/*  활성화되지 않는다. MusicButton 과 같은 프레임 고정 오버레이로, 표지 모션이     */
/*  끝난 뒤(coverDone) 페이드인된다. 세로 모드에서는 렌더하지 않는다.             */
/*                                                                             */
/*  현재 페이지는 셸 스크롤 컨테이너의 scrollLeft 로 계산한다 — 카드가 모두        */
/*  w-full(=컨테이너 폭)이라 index = round(scrollLeft / clientWidth).           */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import type { Section } from "@/templates/season1/constant/section";
import { useIntro } from "./intro-context";
import { COLOR } from "./theme";

type PageDotsProps = {
  /** 셸이 실제로 렌더하는 카드 목록(숨김·미등록 필터 후) — 순서까지 카드와 1:1 */
  sections: Section[];
};

/** SwipeNudge 와 동일한 방식으로 셸 스크롤 컨테이너를 찾는다.
    (셸은 카드([data-section])의 부모) */
function findScroller(el: HTMLElement | null) {
  return el?.parentElement?.querySelector("[data-section]")?.parentElement;
}

export function PageDots({ sections }: PageDotsProps) {
  const { coverDone, isHorizontal } = useIntro();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!isHorizontal) return;
    const scroller = findScroller(ref.current);
    if (!scroller) return;
    const onScroll = () => {
      setActive(Math.round(scroller.scrollLeft / scroller.clientWidth));
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [isHorizontal]);

  // 표지는 점에서 제외하되, 스크롤 위치와의 매핑을 위해 카드 인덱스는 보존한다.
  // (표지가 카드 0 이므로 점들은 카드 1부터 시작 — 표지 위에서는 활성 점 없음)
  const dots = sections
    .map((section, cardIndex) => ({ section, cardIndex }))
    .filter(({ section }) => section.id !== "cover");

  if (!isHorizontal || dots.length < 2) return null;

  // 편집 중 섹션 숨김으로 카드 수가 줄어도 활성 인덱스가 범위를 벗어나지 않게.
  const current = Math.min(active, sections.length - 1);

  const goTo = (cardIndex: number) => {
    const scroller = findScroller(ref.current);
    scroller?.scrollTo({
      left: cardIndex * scroller.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <nav
      ref={ref}
      aria-label="페이지 이동"
      // bottom-5: RSVP 씰(우측 bottom-5)과 같은 높이의 하단 중앙.
      // 토스트(bottom-8, z-50)가 뜨면 잠깐 가려지지만 순간 피드백이라 허용.
      className={`absolute inset-x-0 bottom-5 z-40 flex justify-center transition-opacity duration-700 ease-out ${
        coverDone ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex items-center rounded-full bg-[#3A312A]/45 px-1.5 py-1 shadow backdrop-blur-sm">
        {dots.map(({ section, cardIndex }) => (
          <button
            key={section.id}
            type="button"
            aria-label={section.label}
            aria-current={cardIndex === current ? "page" : undefined}
            onClick={() => goTo(cardIndex)}
            // 점은 작게 유지하되 버튼 패딩으로 탭 영역을 확보한다.
            className="flex h-5 items-center px-[3px]"
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                cardIndex === current ? "w-4" : "w-1.5"
              }`}
              style={{
                backgroundColor: COLOR.text,
                opacity: cardIndex === current ? 1 : 0.35,
              }}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
