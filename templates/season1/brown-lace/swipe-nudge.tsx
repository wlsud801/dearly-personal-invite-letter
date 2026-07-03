"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 가로 스와이프 힌트 (넛지 + 상단 안내 문구)                        */
/*                                                                             */
/*  가로(카드) 모드에서 표지 열림 모션이 끝나 스와이프 잠금이 풀린 직후,          */
/*   1) 카드 전체를 왼쪽으로 ~22px 탄력 있게 밀었다 되돌리는 넛지를 1회 재생해     */
/*      오른쪽에 다음 카드가 있음을 보여주고,                                    */
/*   2) 프레임 상단 중앙에 "오른쪽으로 넘겨주세요 >" 문구를 깜박이며 띄운다.       */
/*  scrollLeft 를 움직이면 snap-mandatory 와 충돌하므로 넛지는 transform         */
/*  (translateX)만 쓴다. 사용자가 실제로 스와이프하면 넛지 중단 + 문구 페이드아웃. */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { useIntro } from "./intro-context";
import { COLOR, FONT } from "./theme";

/** coverDone 후 힌트 시작까지 대기(ms) — 표지 페이드아웃(1s) + 카드 접힘 직후 */
const START_DELAY_MS = 1800;

/** 넛지 1회(밀림→복귀→잔여 바운스) 길이(ms) */
const NUDGE_MS = 1600;

/** 카드가 왼쪽으로 밀리는 넛지 모션. 오버슈트(+방향)는 첫 카드 왼쪽에 배경이
    드러나므로 모든 값을 0 이하로 유지하고, 잔여 바운스로 탄성을 표현한다. */
const NUDGE_KEYFRAMES: Keyframe[] = [
  { transform: "translateX(0)", offset: 0, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { transform: "translateX(-22px)", offset: 0.26, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)" },
  { transform: "translateX(0)", offset: 0.61, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { transform: "translateX(-7px)", offset: 0.81, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)" },
  { transform: "translateX(0)", offset: 1 },
];

export function SwipeNudge() {
  const { coverDone, isHorizontal } = useIntro();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isHorizontal || !coverDone) return;
    const frame = ref.current?.parentElement;
    // shell(스크롤 컨테이너)은 카드([data-section])의 부모다.
    const scroller = frame?.querySelector("[data-section]")?.parentElement;
    if (!frame || !scroller) return;

    const anims: Animation[] = [];
    const stop = () => anims.forEach((a) => a.cancel());

    // 사용자가 실제로 옆 카드로 넘어가기 시작하면 넛지를 멈추고 문구를 치운다.
    // scroll 이벤트는 버블되지 않으므로 capture 로 받고, 카드 내부 세로 스크롤과
    // 구분하기 위해 scrollLeft 만 본다. (transform 은 scroll 이벤트를 만들지 않는다)
    const onScroll = (e: Event) => {
      const el = e.target;
      if (el instanceof HTMLElement && el.scrollLeft > 10) {
        stop();
        setDismissed(true);
      }
    };
    frame.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });

    const t = setTimeout(() => {
      // 이미 스와이프했다면 굳이 알려주지 않는다.
      if (scroller.scrollLeft > 10) return;
      setVisible(true);
      // 넛지는 1회만 재생.
      for (const card of scroller.querySelectorAll("[data-section]")) {
        anims.push(card.animate(NUDGE_KEYFRAMES, { duration: NUDGE_MS }));
      }
    }, START_DELAY_MS);

    return () => {
      clearTimeout(t);
      stop();
      frame.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [coverDone, isHorizontal]);

  // 세로 모드에서는 렌더하지 않는다. (dismissed 후에도 DOM 은 유지해
  // 페이드아웃 트랜지션이 자연스럽게 끝나게 둔다 — pointer-events 는 항상 없음)
  if (!isHorizontal) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-6 z-40 flex justify-center transition-opacity duration-700 ease-out ${
        visible && !dismissed ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 표지의 "봉투를 클릭해주세요" 힌트와 동일한 스타일 */}
      <span
        className="animate-pulse tracking-[0.3em]"
        style={{
          fontFamily: FONT.pretendard,
          fontSize: 12,
          color: COLOR.muted,
        }}
      >
        오른쪽으로 넘겨주세요 &gt;
      </span>
    </div>
  );
}
