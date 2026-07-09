"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 가로(카드) 모드 페이지 도트 (하단 중앙)                          */
/*                                                                             */
/*  프레임 하단 중앙에 섹션 수만큼 점을 띄워 현재 페이지를 표시하고, 점을 탭하면    */
/*  해당 카드로 스크롤한다. MusicButton 과 같은 프레임 고정 오버레이로, 표지        */
/*  모션이 끝난 뒤(coverDone) 페이드인된다. 세로 모드에서는 렌더하지 않는다.       */
/*                                                                             */
/*  현재 페이지는 셸 스크롤 컨테이너의 scrollLeft 로 계산한다 — 카드가 모두        */
/*  w-full(=컨테이너 폭)이라 index = round(scrollLeft / clientWidth).           */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import type { Section } from "@/templates/season1/constant/section";
import { useIntro } from "./intro-context";
import { COLOR } from "./theme";

type PageDotsProps = {
  /** 실제 카드로 보이는 섹션 목록(숨김·표지·미등록 제외) — 점 개수·라벨의 근거 */
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

  if (!isHorizontal || sections.length < 2) return null;

  // 편집 중 섹션 숨김으로 점 개수가 줄어도 활성 인덱스가 범위를 벗어나지 않게.
  const current = Math.min(active, sections.length - 1);

  const goTo = (index: number) => {
    const scroller = findScroller(ref.current);
    scroller?.scrollTo({
      left: index * scroller.clientWidth,
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
      {/* backdrop-blur 금지 — iOS Safari 에서 자식 너비 애니메이션과 겹치면
          블러 레이어가 재도색되지 않아 흰색 잔상 바가 남는다. */}
      <div className="flex items-center rounded-full bg-[#3A312A]/45 px-1.5 py-1 shadow">
        {sections.map((section, i) => (
          <button
            key={section.id}
            type="button"
            aria-label={section.label}
            aria-current={i === current ? "page" : undefined}
            onClick={() => goTo(i)}
            // 점은 작게 유지하되 버튼 패딩으로 탭 영역을 확보한다.
            className="flex h-5 items-center px-[3px]"
          >
            <span
              className={`h-1.5 transform-gpu rounded-full transition-all duration-300 ease-out ${
                i === current ? "w-4" : "w-1.5"
              }`}
              style={{
                backgroundColor: COLOR.text,
                opacity: i === current ? 1 : 0.35,
              }}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
