/* -------------------------------------------------------------------------- */
/*  Fixed section definition (shared across templates)                         */
/*  ids / order / hideable MUST stay in sync with                              */
/*  views/editor/components/section-list-panel.tsx                             */
/* -------------------------------------------------------------------------- */

export type SectionId =
  | "cover"
  | "greeting"
  | "schedule"
  | "album"
  | "reception"
  | "guestbook"
  | "fullImage"
  | "venue"
  | "account"
  | "share"
  // 감사장 모드 전용 — 청첩장 SECTIONS 에는 포함되지 않는다(THANKS_SECTIONS 참고)
  | "thanks";

export type Section = {
  id: SectionId;
  label: string;
  hideable: boolean;
};

export const SECTIONS: Section[] = [
  { id: "cover", label: "표지", hideable: false },
  { id: "greeting", label: "인삿말", hideable: true },
  { id: "schedule", label: "일정 정보", hideable: true },
  { id: "album", label: "앨범", hideable: true },
  { id: "reception", label: "피로연 안내", hideable: true },
  { id: "guestbook", label: "방명록", hideable: true },
  { id: "fullImage", label: "풀 이미지", hideable: true },
  { id: "venue", label: "장소 정보", hideable: true },
  { id: "account", label: "계좌 정보", hideable: true },
  { id: "share", label: "공유하기", hideable: true },
];

/* -------------------------------------------------------------------------- */
/*  감사장(thank-you) 섹션 — letterType="thanks" 일 때만 렌더된다.              */
/*  청첩장(SECTIONS)과 분리되어 있어 청첩장 모드에는 절대 포함되지 않는다.       */
/* -------------------------------------------------------------------------- */
export const THANKS_SECTIONS: Section[] = [
  { id: "thanks", label: "감사장", hideable: false },
];
