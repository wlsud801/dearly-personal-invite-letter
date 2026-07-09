"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — mobile wedding invitation template                            */
/*                                                                             */
/*  Built from Figma file KTCSliL9f8oNYI3Lsu9NWL. 현재는 cover(표지) 섹션의      */
/*  편지 봉투 열림 애니메이션만 구현되어 있다. 나머지 섹션은 컴포넌트가 등록되면    */
/*  shell 이 자동으로 렌더한다(미등록 섹션은 건너뜀).                            */
/* -------------------------------------------------------------------------- */

import {
  SECTIONS,
  THANKS_SECTIONS,
  type Section,
  type SectionId,
} from "@/templates/season1/constant/section";
import {
  getVisibleSections,
  InvitationProvider,
  TemplateShell,
  ToastHost,
  type InvitationData,
  type InvitationEditor,
  type InvitationMode,
  type SectionComponents,
  type TemplateProps,
} from "@/templates/shared";

import { BrownLaceDefs } from "./effects";
import { IntroProvider } from "./intro-context";
import { MusicButton } from "./music-button";
import { PageDots } from "./page-dots";
import { RsvpButton } from "./rsvp-button";
import { AccountSection } from "./sections/account-section";
import { AlbumSection } from "./sections/album-section";
import CoverSection from "./sections/cover-section";
import { GreetingSection } from "./sections/greeting-section";
import { GuestbookSection } from "./sections/guestbook-section";
import { ReceptionSection } from "./sections/reception-section";
import { ScheduleSection } from "./sections/schedule-section";
import { ShareSection } from "./sections/share-section";
import { ThanksSection } from "./sections/thanks-section";
import { VenueSection } from "./sections/venue-section";
import { SwipeNudge } from "./swipe-nudge";

const SECTION_COMPONENTS: SectionComponents = {
  cover: CoverSection,
  greeting: GreetingSection,
  schedule: ScheduleSection,
  album: AlbumSection,
  reception: ReceptionSection,
  guestbook: GuestbookSection,
  venue: VenueSection,
  account: AccountSection,
  share: ShareSection,
  thanks: ThanksSection,
};

type BrownLaceTemplateProps = TemplateProps & {
  /** 렌더할 청첩장 데이터 */
  data: InvitationData;
  /** view = 표시 전용, edit = 편집 */
  mode?: InvitationMode;
  /** edit 모드에서 편집 연결 훅 */
  editor?: InvitationEditor;
};

function BrownLaceTemplate({
  data,
  mode,
  editor,
  letterType = "invitation",
  sections,
  ...shell
}: BrownLaceTemplateProps) {
  // 감사장 모드는 감사장 전용 페이지만, 청첩장 모드는 기존 섹션 목록을 렌더한다.
  // (sections 가 undefined 면 shell 이 기본 SECTIONS 로 폴백)
  const resolvedSections = letterType === "thanks" ? THANKS_SECTIONS : sections;
  // 페이지 도트용 — 셸과 동일한 규칙(기본 SECTIONS 폴백 + 숨김 필터)으로
  // 실제 렌더되는 카드 목록을 재현해 점 개수/순서를 맞춘다.
  // 여기에 더해 카드로 보이지 않는 섹션은 제외한다:
  //  - cover: 표지 모션이 끝나면 카드가 접혀 스냅 대상에서 빠진다(도트는 그 후에야 표시됨)
  //  - 미등록 섹션(fullImage 등): 컴포넌트가 없어 셸이 카드를 렌더하지 않는다
  const dotSections = getVisibleSections(
    resolvedSections ?? SECTIONS,
    shell.hiddenSections,
  ).filter((section) => section.id !== "cover" && SECTION_COMPONENTS[section.id]);
  return (
    <InvitationProvider data={data} mode={mode} editor={editor}>
      <BrownLaceDefs />
      <IntroProvider isHorizontal={shell.scrollMode === "horizontal"}>
        {/* 스크롤 컨테이너를 감싸는 프레임 — RSVP 버튼을 스크롤과 무관하게
            프레임 우측 하단에 고정시키기 위한 relative 기준점. */}
        <div className="relative mx-auto size-full max-w-[480px]">
          <TemplateShell
            {...shell}
            sections={resolvedSections}
            components={SECTION_COMPONENTS}
            revealOnScroll
            className="no-scrollbar relative bg-[#3A312A] text-label-neutral-primary"
            ariaLabel="brown-lace 청첩장"
          />
          {/* RSVP 씰은 청첩장 전용 — 감사장 모드에는 렌더하지 않는다. */}
          {letterType !== "thanks" ? <RsvpButton /> : null}
          {/* BGM 토글 — 좌측 상단, 표지 모션이 끝난 뒤 페이드인 */}
          <MusicButton />
          {/* 가로 모드 전용 페이지 도트 — 하단 중앙, 현재 카드 표시 + 탭 이동 */}
          <PageDots sections={dotSections} />
          {/* 가로 모드 전용 스와이프 넛지 — 표지 모션이 끝난 뒤 카드가 살짝
              왼쪽으로 밀렸다 돌아오며 다음 카드를 암시. (세로 모드는 no-op) */}
          <SwipeNudge />
          {/* 복사 등 액션 피드백 토스트 — 프레임 하단 중앙 */}
          <ToastHost />
        </div>
      </IntroProvider>
    </InvitationProvider>
  );
}

export { SECTIONS };
export type { BrownLaceTemplateProps, Section, SectionId };
export default BrownLaceTemplate;
