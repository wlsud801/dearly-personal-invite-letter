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
/* -------------------------------------------------------------------------- */

import { Editable, useInvitationData, type Person } from "@/templates/shared";
import { useState } from "react";
import RoughButton from "@/templates/season1/components/rough-button";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { useIntro } from "../intro-context";
import { COLOR, FONT } from "../theme";
import { CongratsModal } from "../modal/congrats-modal";
import { RsvpModal } from "../modal/rsvp-modal";

/** 보조 텍스트(의·관계·영문) 그레이 — Figma #99958f */
const SUB = "#99958f";

/** 본문(한글) 공통 스타일 — Pretendard Medium 16 / brown #7C6D5F */
const bodyStyle = {
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
  // 표지 모션이 끝나면 dim(페이드인)으로 나타난다.
  const { coverDone, isHorizontal } = useIntro();
  // "축하 연락하기" / "참석 여부 전달" 모달 열림 여부
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <section
      aria-label="인삿말"
      className={`relative w-full select-none overflow-hidden drop-shadow-[0px_-2px_8px_rgba(101,89,79,0.2)] transition-opacity duration-1000 ease-in-out ${
        // 가로(카드) 모드: 카드 높이(100cqh)를 채우므로 콘텐츠를 세로 중앙에 배치
        isHorizontal ? "flex flex-col justify-center" : ""
      }`}
      style={{
        backgroundColor: COLOR.background,
        opacity: coverDone ? 1 : 0,
        // 가로(카드) 모드: 카드 높이만큼 채워 배경 이미지가 화면을 꽉 채우게 한다.
        // 100cqh = shell([container-type:size]) 높이 = 카드 높이. 내용이 더 길면 늘어난다.
        minHeight: isHorizontal ? "100cqh" : undefined,
      }}
    >
      {/* 크림 페이퍼(레이스 보더) 배경 — 뒤에 깔리는 레이어 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.greetingBg}
        className="absolute inset-0 size-full object-cover"
      />

      {/* 내용 — flex column 으로 위에서 아래로 자연스럽게 흐른다.
          가로 모드: 배경(레이스 페이퍼)은 두고 이 콘텐츠만 아래→위 페이드인 */}
      <CardReveal className="relative flex flex-col w-full items-center gap-7 px-6 pb-20 pt-[88px] text-center">
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

        {/* 플로럴 디바이더 */}
        <img
          alt=""
          aria-hidden
          src={ASSET.divide}
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
      </CardReveal>

      {/* 축하 연락하기 / 참석 여부(RSVP) 모달 */}
      <CongratsModal open={congratsOpen} onClose={() => setCongratsOpen(false)} />
      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </section>
  );
}
