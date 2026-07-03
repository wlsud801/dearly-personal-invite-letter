"use client";

/* -------------------------------------------------------------------------- */
/*  Accordion — 부드럽게 열리는 접이식 패널 (template-agnostic)                   */
/*                                                                             */
/*  높이 애니메이션은 framer-motion 없이 CSS grid-template-rows(0fr↔1fr) +        */
/*  overflow-hidden 트릭으로 처리한다(내용 높이 측정 불필요, 반응형).            */
/*  스타일은 전부 className 으로 주입 — 헤더 라벨은 `header`, 본문은 children.     */
/*  uncontrolled(기본) 또는 open/onToggle 로 controlled 모두 지원.               */
/* -------------------------------------------------------------------------- */

import { useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type AccordionProps = {
  /** 헤더 좌측에 들어갈 라벨/내용 */
  header: ReactNode;
  /** 펼쳐지는 본문 */
  children: ReactNode;
  /** uncontrolled 초기 열림 상태 (기본 false) */
  defaultOpen?: boolean;
  /** controlled — 지정 시 onToggle 과 함께 사용 */
  open?: boolean;
  onToggle?: () => void;
  /** 래퍼 className */
  className?: string;
  /** 헤더 버튼 className (색·패딩·라운드 등) */
  headerClassName?: string;
  /** 헤더 버튼 inline style (theme COLOR 등) */
  headerStyle?: CSSProperties;
  /** 본문 내부 래퍼 className */
  bodyClassName?: string;
  /** 본문 내부 래퍼 inline style (theme COLOR 등) */
  bodyStyle?: CSSProperties;
  /** chevron 표시 여부 (기본 true) */
  showChevron?: boolean;
  /** chevron 크기 클래스 (기본 size-6) */
  chevronClassName?: string;
};

export function Accordion({
  header,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  className = "",
  headerClassName = "",
  headerStyle,
  bodyClassName = "",
  bodyStyle,
  showChevron = true,
  chevronClassName = "size-6",
}: AccordionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = () => {
    if (isControlled) onToggle?.();
    else setUncontrolledOpen((v) => !v);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between ${headerClassName}`}
        style={headerStyle}
      >
        {header}
        {showChevron && (
          <ChevronDown
            aria-hidden
            className={`shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            } ${chevronClassName}`}
          />
        )}
      </button>

      {/* grid-rows 0fr↔1fr 트랜지션으로 높이를 부드럽게 애니메이션 */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className={bodyClassName} style={bodyStyle}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
