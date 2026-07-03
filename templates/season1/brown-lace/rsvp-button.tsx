"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — RSVP 씰 버튼                                                    */
/*                                                                             */
/*  표지(cover) 열림 모션이 모두 끝난 뒤(coverDone) 우측 하단에 페이드인되는       */
/*  플로팅 왁스 씰 버튼. 스크롤 컨테이너 밖(프레임 기준 absolute)이라 스크롤해도    */
/*  하단에 고정된다. 감사장 모드에는 표지가 없어 coverDone 이 false → 표시 안 됨.   */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ASSET } from "./assets";
import { useIntro } from "./intro-context";
import { RsvpModal } from "./modal/rsvp-modal";
import styles from "./rsvp-button.module.css";

export function RsvpButton() {
  const { coverDone } = useIntro();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="참석 의사 전달"
        aria-hidden={!coverDone}
        tabIndex={coverDone ? 0 : -1}
        onClick={() => setOpen(true)}
        className={`absolute bottom-5 right-5 z-40 transition-all duration-700 ease-out ${
          coverDone
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {/* 등장(translate/opacity)은 부모 버튼이, 미세 바운스는 이미지가 담당해
            translate 속성 충돌을 피한다. 표지 모션이 끝난 뒤에만 바운스. */}
        <img
          src={ASSET.rsvp}
          alt=""
          aria-hidden
          className={`w-16 drop-shadow-[0px_4px_8px_rgba(58,49,42,0.3)] ${
            coverDone ? styles.bounce : ""
          }`}
        />
      </button>

      <RsvpModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
