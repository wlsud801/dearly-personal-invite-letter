"use client";

/* -------------------------------------------------------------------------- */
/*  IntroContext — 표지 열림 모션 → greeting 전환 단계를 섹션 간에 공유          */
/*                                                                             */
/*  cover-section 이 열림 모션을 끝내면 markCoverDone() 을 호출하고,             */
/*  greeting-section 은 coverDone 이 true 가 될 때 dim(페이드인)으로 나타난다.    */
/*  Provider 밖(단독 렌더)에서는 coverDone=true 기본값으로 항상 보이게 한다.      */
/* -------------------------------------------------------------------------- */

import { createContext, useCallback, useContext, useState } from "react";

type IntroContextValue = {
  /** 표지 열림 모션이 끝나 greeting 으로 전환됐는지 */
  coverDone: boolean;
  /** 표지가 모션 종료 시 호출 */
  markCoverDone: () => void;
  /**
   * 가로(카드 페이징) 모드 여부. 세로 모드에서는 표지가 페이드아웃되며 바로 아래
   * greeting 을 드러내지만, 가로 모드에서는 greeting 이 별도 카드라 표지가 사라지면
   * 표지 카드가 빈 화면이 된다. 따라서 가로 모드에서는 표지를 페이드아웃하지 않는다.
   */
  isHorizontal: boolean;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({
  children,
  isHorizontal = false,
}: {
  children: React.ReactNode;
  isHorizontal?: boolean;
}) {
  const [coverDone, setCoverDone] = useState(false);
  const markCoverDone = useCallback(() => setCoverDone(true), []);

  return (
    <IntroContext.Provider value={{ coverDone, markCoverDone, isHorizontal }}>
      {children}
    </IntroContext.Provider>
  );
}

/** Provider 밖에서도 안전하게 기본값(전환 완료)을 돌려준다. */
export function useIntro(): IntroContextValue {
  return (
    useContext(IntroContext) ?? {
      coverDone: true,
      markCoverDone: () => {},
      isHorizontal: false,
    }
  );
}
