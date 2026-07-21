"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — greeting (인삿말) section                                      */
/*                                                                             */
/*  Figma frame 128:40501 "letter" (402×670), file KTCSliL9f8oNYI3Lsu9NWL.     */
/*  크림 페이퍼(레이스 보더) 위에:                                              */
/*   · 인사말(intro/blessing) + 신랑·신부 이름 + 영문 클로징                     */
/*   · 양가 혼주(부·모 의 관계 자녀) 2행                                         */
/*   · 액션 버튼 2개(축하 연락하기 / 참석 여부 전달)                             */
/*  색상·폰트는 Figma 노드 데이터에서 추출. absolute 좌표 대신 flex column 으로       */
/*  내용을 세로로 쌓아 높이는 내용이 결정한다(반응형). 배경(레이스 페이퍼)만          */
/*  뒤에 깔리는 absolute 레이어로 두고, 콘텐츠는 그 위에서 자연스럽게 흐른다.         */
/*                                                                             */
/*  표지 → 인삿말 전환 (Figma 530:1652 시퀀스):                                  */
/*   1. 표지 편지지가 도착한 위치·텍스트와 이 섹션의 상단 블록이 동일하다.          */
/*   2. coverDone → 표지 안의 확장 오버레이(편지지 영역 → 전체 화면)가 FILL_MS     */
/*      동안 화면을 채운 뒤 표지가 즉시 사라진다. 이 섹션은 페이드 없이 그대로       */
/*      드러난다 — 확장 완료 화면과 이 섹션의 초기 화면이 동일해 이음새가 없다.      */
/*   3. 그 뒤(coverDone + FILL_MS) 하단(디바이더·혼주·버튼)이 아래에서 위로         */
/*      나타난다.                                                               */
/* -------------------------------------------------------------------------- */

import { Editable, useInvitationData, type Person } from "@/templates/shared";
import { useEffect, useState } from "react";
import RoughButton from "@/templates/season1/components/rough-button";
import { ASSET } from "../assets";
import { useIntro } from "../intro-context";
import { COLOR, FONT } from "../theme";
import { CongratsModal } from "../modal/congrats-modal";
import { RsvpModal } from "../modal/rsvp-modal";

/** 보조 텍스트(의·관계·영문) 그레이 — Figma #99958f. 표지 편지지도 같은 값을 쓴다. */
export const SUB = "#99958f";

/**
 * 표지 편지지 확장 시간(ms) — cover 의 확장 오버레이 애니메이션과 하단 콘텐츠
 * 등장 시점을 동기화한다. 이 시간이 지나면 하단 콘텐츠가 아래에서 위로 올라온다.
 */
export const FILL_MS = 1200;

/**
 * 표지 퇴장 크로스페이드(ms) — cover 와 공유. 하단 콘텐츠 상승은 표지가
 * 완전히 제거된 뒤(FILL_MS + SWAP_FADE_MS) 시작해, 표지가 사라지는 동안
 * 화면이 완전히 정지된 상태를 유지한다(겹치면 깜박여 보인다).
 */
export const SWAP_FADE_MS = 250;

/** 본문(한글) 공통 스타일 — Pretendard Medium 16 / brown #7C6D5F. 표지 편지지와 공유. */
export const bodyStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  color: COLOR.muted,
} as const;

function ParentRow({ person }: { person: Person }) {
  const { father, mother, role } = person.parents;
  return (
    <div className="flex h-[43px] w-full items-center gap-[12px] px-[24px] py-[16px]">
      <span className="whitespace-nowrap" style={bodyStyle}>
        {father}
      </span>
      <span
        className="size-[2px] shrink-0 rounded-full"
        style={{ background: COLOR.muted }}
      />
      <span className="whitespace-nowrap" style={bodyStyle}>
        {mother}
      </span>
      <span
        className="flex-1"
        style={{
          fontFamily: FONT.pretendard,
          fontWeight: 500,
          fontSize: 14,
          lineHeight: 1.4,
          letterSpacing: "-0.04em",
          color: SUB,
        }}
      >
        의
      </span>
      <span
        className="whitespace-nowrap"
        style={{
          fontFamily: FONT.pretendard,
          fontWeight: 500,
          fontSize: 14,
          lineHeight: 1.4,
          letterSpacing: "-0.04em",
          color: SUB,
        }}
      >
        {role}
      </span>
      <span className="whitespace-nowrap" style={bodyStyle}>
        {person.ko}
      </span>
    </div>
  );
}

export function GreetingSection() {
  const { groom, bride, greeting } = useInvitationData();
  const { coverDone, isHorizontal } = useIntro();
  // coverDone → 표지 확장 오버레이(FILL_MS) → 표지 크로스페이드 제거
  // (SWAP_FADE_MS) → filled(하단 콘텐츠 상승) 순서. 표지가 화면에서 완전히
  // 사라진 뒤에 올라와야 전환 중 깜박임 없이 하단 정보만 자연스럽게 나타난다.
  // Provider 밖(단독 렌더)에서는 coverDone 이 처음부터 true 라 즉시 최종 상태다.
  const [filled, setFilled] = useState(coverDone);
  useEffect(() => {
    if (!coverDone || filled) return;
    const t = setTimeout(() => setFilled(true), FILL_MS + SWAP_FADE_MS + 100);
    return () => clearTimeout(t);
  }, [coverDone, filled]);
  // "축하 연락하기" / "참석 여부 전달" 모달 열림 여부
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <section
      aria-label="인삿말"
      // 가로(카드) 모드에서도 세로 중앙 정렬 없이 상단(pt-[88px])부터 흐른다 —
      // 표지 확장 오버레이의 텍스트 위치(y 88px)와 동일해야 전환 시 점프가 없다.
      className="relative w-full select-none overflow-hidden drop-shadow-[0px_-2px_8px_rgba(101,89,79,0.2)]"
      style={{
        backgroundColor: COLOR.background,
        // 페이드인 없음 — 표지의 확장 완료 화면과 동일해 그대로 드러난다.
        // 가로(카드) 모드에서만 표지 열림 전까지 감춰 넛지 peek 로 새어 보이지
        // 않게 한다(카드가 화면 밖에 있을 때 즉시 전환되므로 페이드가 아니다).
        opacity: isHorizontal && !coverDone ? 0 : 1,
        // 표지의 확장 완료 화면(100cqh 꽉 찬 배경)과 동일한 높이가 되도록
        // 두 모드 모두 뷰포트/카드 높이(100cqh = shell [container-type:size])만큼
        // 채운다. 내용이 더 길면 늘어난다.
        minHeight: "100cqh",
      }}
    >
      {/* 크림 페이퍼(레이스 보더) 배경 — 뒤에 깔리는 레이어.
          object-top: 표지 확장 오버레이(100cqh 고정)와 상단 크롭을 맞춰
          표지가 제거되는 순간 배경이 튀지 않게 한다. */}
      <img
        alt=""
        aria-hidden
        src={isHorizontal ? ASSET.greetingBgHorizontal : ASSET.greetingBg}
        className="absolute inset-0 size-full object-cover object-top"
      />

      {/* 내용 — flex column 으로 위에서 아래로 자연스럽게 흐른다.
          표지의 확장 오버레이와 같은 화면이어야 하므로 CardReveal(페이드인) 없이
          그대로 렌더한다. 하단 블록만 filled 시점에 아래→위로 나타난다. */}
      <div className="relative flex flex-col w-full items-center gap-7 px-6 pb-20 pt-[88px] text-center">
        {/* ===== 인사말 + 신랑·신부 + 영문 클로징 ===== */}
        <div className="flex w-full flex-col items-center gap-5">
          <Editable field="greeting" label="인사말" className="w-full">
            <p style={bodyStyle}>
              {greeting.intro.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Editable>

          <Editable field="greeting" label="인사말" className="w-full">
            <p style={bodyStyle}>
              {greeting.blessing.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Editable>

          {/* 신랑 {이름}  ♥  신부 {이름} */}
          <Editable field="names.ko" label="국문 이름">
            <div className="flex items-center justify-center gap-[12px]">
              <span className="flex items-center gap-[4px]" style={bodyStyle}>
                <span>신랑</span>
                <span>{groom.ko}</span>
              </span>
              <img
                alt=""
                aria-hidden
                src={ASSET.introDecoHeart}
                className="size-[20px] shrink-0"
              />
              <span className="flex items-center gap-[4px]" style={bodyStyle}>
                <span>신부</span>
                <span>{bride.ko}</span>
              </span>
            </div>
          </Editable>

          <Editable field="greeting" label="인사말" className="w-full">
            <p
              style={{
                fontFamily: FONT.altesse,
                fontSize: 12,
                lineHeight: 1.3,
                color: SUB,
              }}
            >
              {greeting.closingEn.map((line, i) => (
                <span key={i} className="text-center block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </p>
          </Editable>
        </div>

        {/* ===== 하단 콘텐츠 — 배경이 꽉 찬 뒤 아래에서 위로 서서히 나타난다 ===== */}
        <div
          className="flex w-full flex-col items-center gap-7"
          style={{
            opacity: filled ? 1 : 0,
            transform: filled ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
          }}
        >
          {/* 플로럴 디바이더 */}
          <img
            alt=""
            aria-hidden
            src={ASSET.greetingDeco}
            className="w-full max-w-[242px]"
          />

          {/* ===== 양가 혼주 정보 ===== */}
          <div className="flex justify-center flex-col">
            <Editable field="parents.groom" label="신랑 혼주 정보">
              <ParentRow person={groom} />
            </Editable>
            <Editable field="parents.bride" label="신부 혼주 정보">
              <ParentRow person={bride} />
            </Editable>
          </div>

          {/* ===== 액션 버튼 (축하 연락하기 / 참석 여부 전달) — RoughButton ===== */}
          <div className="flex w-full justify-center gap-3">
            <RoughButton
              label="축하 연락하기"
              variant="filled"
              colorType="green"
              arrow
              onClick={() => setCongratsOpen(true)}
              className="min-w-0 flex-1"
            />
            <RoughButton
              label="참석 여부 전달"
              variant="filled"
              colorType="green"
              arrow
              onClick={() => setRsvpOpen(true)}
              className="min-w-0 flex-1"
            />
          </div>
        </div>
      </div>

      {/* 축하 연락하기 / 참석 여부(RSVP) 모달 */}
      <CongratsModal open={congratsOpen} onClose={() => setCongratsOpen(false)} />
      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </section>
  );
}
