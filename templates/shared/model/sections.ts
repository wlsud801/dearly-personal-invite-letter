/* -------------------------------------------------------------------------- */
/*  Shared section helpers (template-agnostic)                                 */
/* -------------------------------------------------------------------------- */

import type { Section, SectionId } from "@/templates/season1/constant/section";

/** Props every template accepts so the editor can drive scroll / order / hiding. */
export type TemplateProps = {
  /** vertical = top-to-bottom scroll, horizontal = card-per-section paging */
  scrollMode?: "vertical" | "horizontal";
  /** sections hidden by the editor — filtered out of render */
  hiddenSections?: Set<SectionId>;
  /** allows the editor to feed a reordered list; defaults to canonical order */
  sections?: Section[];
  /**
   * 편지 종류 — invitation(청첩장, 기본) / thanks(감사장).
   * thanks 일 때만 감사장 전용 페이지가 렌더되고, 청첩장 섹션은 표시되지 않는다.
   */
  letterType?: "invitation" | "thanks";
};

/** Drops sections the editor hid (non-hideable ones always stay). */
export function getVisibleSections(
  sections: Section[],
  hiddenSections?: Set<SectionId>,
): Section[] {
  return sections.filter((s) => !s.hideable || !hiddenSections?.has(s.id));
}
