"use client";

/* -------------------------------------------------------------------------- */
/*  <Editable> — edit 모드에서만 클릭 가능한 편집 영역 표시                      */
/*                                                                             */
/*  view / edit 모두 동일한 래퍼 엘리먼트(className 그대로)를 렌더하므로,        */
/*  기존 구조용 div 를 <Editable> 로 치환해도 레이아웃이 바뀌지 않는다.          */
/*  edit 모드에서만 cursor + outline 강조와 클릭 핸들러가 추가되고,             */
/*  클릭 시 editor.onEditField(key) 로 편집 다이얼로그를 연다. outline 은        */
/*  레이아웃에 영향을 주지 않아 디자인이 흔들리지 않는다.                        */
/* -------------------------------------------------------------------------- */

import type { CSSProperties, ElementType, ReactNode } from "react";
import type { FieldKey } from "../model/edit-schema";
import { useInvitation } from "../context/invitation-context";

type EditableProps = {
  /** 편집 다이얼로그를 결정하는 키 */
  field: FieldKey;
  children: ReactNode;
  /** 래퍼 태그 (인라인 영역은 "span") — 기본 "div" */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** 접근성 라벨 (없으면 "편집") */
  label?: string;
};

const HIGHLIGHT =
  "cursor-pointer rounded-[6px] outline-2 outline-offset-2 outline-transparent transition-[outline-color] duration-150 hover:outline-accent-primary/60 focus-visible:outline-accent-primary";

/**
 * 편집 패널의 anchor 로 쓸 요소. display:contents 래퍼(앨범 콜라주 등)는
 * 레이아웃 박스가 없어 rect 가 (0,0)이 되므로, 박스를 가진 첫 자식으로 대체한다.
 */
export function resolveAnchor(el: HTMLElement): HTMLElement {
  if (el.getClientRects().length > 0) return el;
  for (const child of el.children) {
    if (child instanceof HTMLElement && child.getClientRects().length > 0) {
      return child;
    }
  }
  return el;
}

export function Editable({
  field,
  children,
  as,
  className = "",
  style,
  label,
}: EditableProps) {
  const { mode, editor } = useInvitation();
  const Tag = (as ?? "div") as ElementType;
  const interactive = mode === "edit" && !!editor;

  const interactiveProps = interactive
    ? {
        role: "button",
        tabIndex: 0,
        "aria-label": label ? `${label} 편집` : "편집",
        "data-edit-field": field,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          editor!.onEditField(field, resolveAnchor(e.currentTarget));
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            editor!.onEditField(field, resolveAnchor(e.currentTarget));
          }
        },
      }
    : {};

  return (
    <Tag
      className={[className, interactive && HIGHLIGHT].filter(Boolean).join(" ")}
      style={style}
      {...interactiveProps}
    >
      {children}
    </Tag>
  );
}

export type { EditableProps };
