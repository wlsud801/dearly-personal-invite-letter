/* -------------------------------------------------------------------------- */
/*  Shared template primitives — barrel                                        */
/* -------------------------------------------------------------------------- */

/* model ------------------------------------------------------------------- */
export { getVisibleSections, type TemplateProps } from "./model/sections";
export * from "./model/invitation";
export {
  EDIT_DIALOGS,
  getByPath,
  setByPath,
  applyEdits,
  type FieldKey,
  type FieldType,
  type FieldSpec,
  type EditDialogDef,
  type CustomEditorKind,
  type EditDraft,
} from "./model/edit-schema";

/* components -------------------------------------------------------------- */
export { TemplateShell, type SectionComponents } from "./components/template-shell";
export { MapButton } from "./components/map-button";
export { MusicToggle } from "./components/music-toggle";
export { KakaoMap } from "./components/kakao-map";
export { Editable, resolveAnchor, type EditableProps } from "./components/editable";
export { Lines } from "./components/lines";
export { Reveal } from "./components/reveal";
export { Deco, useIsHorizontal } from "./components/section-image";
export { ToastHost, showToast, copyWithToast } from "./components/toast";

/* context ----------------------------------------------------------------- */
export {
  InvitationProvider,
  useInvitation,
  useInvitationData,
  type InvitationMode,
  type InvitationEditor,
} from "./context/invitation-context";

/* hooks ------------------------------------------------------------------- */
export { useCountdown, type Countdown } from "./hooks/use-countdown";
export { useExclusiveToggle } from "./hooks/use-exclusive-toggle";
export { useCoverScrollLock } from "./hooks/use-cover-scroll-lock";

/* lib --------------------------------------------------------------------- */
export {
  deriveScheduleLabels,
  deriveScheduleEdits,
  type ScheduleLabels,
} from "./lib/schedule";
export { WEEK, EN_MONTHS, pad2, buildMonthGrid } from "./lib/calendar";
export {
  copyToClipboard,
  copyLink,
  openMap,
  shareKakao,
  shareUrl,
  absoluteUrl,
  kakaoMapUrl,
  type MapProvider,
  type ShareResult,
} from "./lib/actions";
