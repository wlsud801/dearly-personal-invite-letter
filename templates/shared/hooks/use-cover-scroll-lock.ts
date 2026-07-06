/* -------------------------------------------------------------------------- */
/*  useCoverScrollLock — 표지 열림 모션 동안 스크롤 컨테이너 잠금                */
/*                                                                             */
/*  표지(cover)를 탭하면 봉투/편지 열림 모션이 재생되는데, 그 사이 사용자가       */
/*  스크롤·스와이프로 다음 섹션으로 넘어가면 모션이 잘려 보인다. 모션이 끝나기      */
/*  전까지(=unlocked 가 false) 가장 가까운 스크롤 컨테이너의 overflow 를 잠가     */
/*  다음 페이지로 넘어가지 못하게 한다.                                          */
/*                                                                             */
/*  템플릿은 셸이 스크롤러라 body 가 아니라 스크롤 부모를 잠근다. 세로 모드는      */
/*  overflowY(아래 섹션), 가로(카드) 모드는 overflowX(옆 카드)를 잠근다.          */
/* -------------------------------------------------------------------------- */

import { useEffect, type RefObject } from "react";

/** 해당 축으로 "실제로 스크롤되는" 가장 가까운 컨테이너를 찾는다(세로=y, 가로=x).
    주의: CSS 규칙상 한 축이 auto/scroll/hidden 이면 반대 축의 computed 값도
    visible→auto 로 강제된다. 그래서 overflow 값만 보면 가로(카드) 모드에서
    카드 래퍼(overflow-y-auto)가 overflowX:auto 로 잡혀 셸 대신 잠기게 되므로,
    내용이 그 축으로 넘치는지(scrollSize > clientSize)까지 확인한다. */
function findScrollParent(
  el: HTMLElement | null,
  axis: "x" | "y",
): HTMLElement | null {
  const prop = axis === "x" ? "overflowX" : "overflowY";
  let node = el?.parentElement ?? null;
  while (node) {
    const o = getComputedStyle(node)[prop];
    const scrollable =
      axis === "x"
        ? node.scrollWidth > node.clientWidth
        : node.scrollHeight > node.clientHeight;
    if ((o === "auto" || o === "scroll") && scrollable) return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * 표지 열림 모션 동안 스크롤 컨테이너를 잠근다.
 *
 * @param ref      표지 섹션 엘리먼트 ref (스크롤 부모 탐색 시작점)
 * @param unlocked 모션이 끝나 잠금을 풀어도 되는지. false 인 동안 스크롤 잠금.
 * @param axis     잠글 스크롤 축. 가로 카드 모드는 "x", 세로는 "y"(기본).
 */
export function useCoverScrollLock(
  ref: RefObject<HTMLElement | null>,
  unlocked: boolean,
  axis: "x" | "y" = "y",
): void {
  useEffect(() => {
    const scroller = findScrollParent(ref.current, axis);
    if (!scroller) return;
    const prop = axis === "x" ? "overflowX" : "overflowY";
    scroller.style[prop] = unlocked ? "" : "hidden";
    return () => {
      scroller.style[prop] = "";
    };
  }, [ref, unlocked, axis]);
}
