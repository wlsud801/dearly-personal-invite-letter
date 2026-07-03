/* -------------------------------------------------------------------------- */
/*  TemplateShell — vertical/horizontal scroll chrome shared by all templates  */
/* -------------------------------------------------------------------------- */

import { SECTIONS, type SectionId } from "@/templates/season1/constant/section";
import { getVisibleSections, type TemplateProps } from "../model/sections";
import { Reveal } from "./reveal";
import { ScrollModeProvider } from "./section-image";

/** Maps each section id to the component a template uses to render it. */
export type SectionComponents = Partial<Record<SectionId, React.ComponentType>>;

type TemplateShellProps = TemplateProps & {
  /** section id -> component; ids without an entry are skipped */
  components: SectionComponents;
  /** template-specific outer classes (background color, text color, max width…) */
  className?: string;
  /** accessible label for the invitation root */
  ariaLabel?: string;
  /** 세로 스크롤에서 각 섹션을 뷰포트 ~30% 진입 시 fade-in.
      가로(카드) 모드는 섹션 전체가 아닌 콘텐츠 블록만 움직이도록
      각 섹션이 CardReveal 로 자체 처리한다(셸은 관여하지 않음). */
  revealOnScroll?: boolean;
};

export function TemplateShell({
  scrollMode = "vertical",
  hiddenSections,
  sections = SECTIONS,
  components,
  className = "",
  ariaLabel,
  revealOnScroll = false,
}: TemplateShellProps) {
  const visible = getVisibleSections(sections, hiddenSections);
  const isHorizontal = scrollMode === "horizontal";

  return (
    // 부모 박스를 폭·높이 모두 꽉 채우는 size 컨테이너.
    // 내부 cqw/cqh가 뷰포트가 아닌 "이 박스"(=부모) 기준으로 풀리므로, 위치·크기·반응형이
    // 전부 부모 기준이 된다. 폭 제한(모바일 너비)은 부모가 담당한다.
    // 전제: 부모는 폭·높이가 정해진 박스 (목업 프레임 / 풀스크린 h-dvh 등).
    <div
      className={[
        "flex size-full overscroll-contain [container-type:size]",
        isHorizontal
          ? "flex-row snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
          : "flex-col overflow-y-auto",
        className,
      ].join(" ")}
      aria-label={ariaLabel}
    >
      <ScrollModeProvider isHorizontal={isHorizontal}>
        {visible.map((section, index) => {
        const Section = components[section.id];
        // 모든 섹션은 optional — 컴포넌트가 없으면 아예 렌더하지 않는다.
        // (가로모드에서 빈 div 가 빈 페이지/스냅 카드가 되어 레이아웃이 틀어지는 것을 방지)
        if (!Section) return null;
        // 세로 모드 + revealOnScroll 일 때만 스크롤 fade-in 으로 감싼다.
        // 단, 첫 섹션(표지)은 항상 화면 안이라 reveal 불필요 + 표지는 absolute
        // z-index 오버레이라 reveal 의 stacking context 가 클릭을 가로채므로 제외.
        // rootMargin 하단 -30% → 섹션이 뷰포트로 ~30% 진입 시 발동(높이 무관).
        const reveal = revealOnScroll && !isHorizontal && index > 0;
        const content = reveal ? (
          <Reveal
            from="up"
            amount={0}
            rootMargin="0px 0px -30% 0px"
            duration={0.8}
          >
            <Section />
          </Reveal>
        ) : (
          <Section />
        );
        return (
          <div
            key={section.id}
            data-section={section.id}
            className={
              isHorizontal
                ? "overlay-scrollbar flex h-full w-full shrink-0 snap-center flex-col overflow-y-auto"
                : "w-full"
            }
          >
            {/* 가로(카드) 모드의 '카드 채움'은 각 섹션이 ScrollModeProvider
                컨텍스트(useIsHorizontal)로 받아 minHeight:100cqh 로 처리한다.
                my-auto: 섹션이 카드보다 짧으면 화면 세로 중앙에 배치하고,
                카드보다 길면 margin 이 0 으로 접혀 평소처럼 위에서부터 스크롤된다. */}
            {isHorizontal ? <div className="my-auto w-full">{content}</div> : content}
          </div>
        );
        })}
      </ScrollModeProvider>
    </div>
  );
}
