import {
  Editable,
  useCoverScrollLock,
  useInvitationData,
} from "@/templates/shared";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ASSET } from "../assets";
import styles from "../cover.module.css";
import { useIntro } from "../intro-context";
import { COLOR, EFFECT, FONT } from "../theme";
import { FILL_MS, SUB, SWAP_FADE_MS, bodyStyle } from "./greeting-section";

/**
 * 편지지 도착 시점(ms) = letterDipRise delay 1000 + duration 2000.
 * 도착 즉시 확장을 시작한다. 봉투 모션(delay 1000 + duration 2500)은 그 뒤에도
 * 잠깐 이어지지만 확장 오버레이가 위를 덮으므로 보이지 않는다.
 */
const OPEN_ANIM_MS = 3000;

/**
 * 확장 오버레이의 시작 클립 — 도착한 편지지(intro-letter.png 782×875, 402px 폭)의
 * 크림 영역(테두리 안쪽 x 13~389 / y 8~430, 모서리 라운드)과 일치한다.
 * 여기서 화면 전체(BG_CLIP_FULL)로 FILL_MS 동안 확장된다.
 */
const BG_CLIP_LETTER = "inset(8px 13px calc(100% - 430px) 13px round 14px)";
const BG_CLIP_FULL = "inset(0px 0px 0px 0px round 0px)";

/*
 * 표지 퇴장 크로스페이드(SWAP_FADE_MS)는 greeting-section 과 공유한다.
 * 세로 모드에서는 바로 뒤에 동일한 greeting 이 그려져 있어 페이드 자체는 보이지
 * 않고, display 제거 순간의 리페인트 깜박임만 가려진다. 가로(카드) 모드에서는
 * greeting 이 옆 카드라 표지 뒤가 셸의 어두운 배경뿐이므로 페이드를 쓰면 화면이
 * 어둡게 깜박인다 — 페이드 없이 카드를 즉시 접어(collapsed) greeting 카드가 같은
 * 프레임에 그 자리를 대신하게 한다.
 */

function CoverSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // 표지를 한 번 클릭하면 하나로 이어진 모션이 재생된다.
  // 뚜껑은 위로 사라지고, 봉투(열린 뚜껑·몸통·뒷배경)는 시차를 두고 하단으로 내려가며,
  // 그 사이 편지지가 위로 떠올라 최종 화면(Figma 128:42278)이 된다.
  const [opened, setOpened] = useState(false);
  // 열림 모션이 끝나 편지지가 도착했는지. 이때부터 확장 오버레이가 화면을 채운다.
  const [done, setDone] = useState(false);
  // 세로 모드: 확장(FILL_MS)까지 끝나 표지 퇴장 크로스페이드를 시작했는지.
  const [hidden, setHidden] = useState(false);
  // 세로 모드: 크로스페이드(SWAP_FADE_MS)까지 끝나 표지를 페인트에서 제거했는지.
  const [gone, setGone] = useState(false);
  // 가로 모드: 확장이 끝난 뒤 표지 카드를 완전히 접었는지(페이드 없이 즉시).
  const [collapsed, setCollapsed] = useState(false);
  const { markCoverDone, isHorizontal } = useIntro();

  const { groom, bride, schedule, venue, greeting } = useInvitationData();
  const d = new Date(schedule.weddingDate);
  const bigDate = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;

  // 열림 모션 동안엔 다음 섹션으로 스크롤되지 않도록 스크롤 컨테이너를 잠근다.
  // 세로=overflowY(아래 greeting), 가로=overflowX(옆 카드). 확장이 끝나 표지가
  // 감춰질 때(세로=hidden, 가로=collapsed)까지 잠금을 유지한다.
  useCoverScrollLock(
    sectionRef,
    isHorizontal ? collapsed : hidden,
    isHorizontal ? "x" : "y",
  );

  // 클릭 후 편지지가 도착하는 시점에 지체 없이 확장을 시작하고 greeting 에 알린다.
  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(() => {
      setDone(true);
      markCoverDone();
    }, OPEN_ANIM_MS);
    return () => clearTimeout(t);
  }, [opened, markCoverDone]);

  // 확장 오버레이가 화면을 다 채우면 표지를 치운다.
  //  - 세로: 뒤에 동일한 greeting 이 그려져 있어 짧은 크로스페이드로
  //    제거 순간의 리페인트 깜박임만 가린다.
  //  - 가로: greeting 이 옆 카드라 표지 뒤에는 셸의 어두운 배경뿐이다.
  //    페이드를 거치면 어두운 화면이 새어 보여 깜박이므로, 페이드 없이
  //    곧바로 카드를 접는다 — greeting 카드가 같은 프레임에 첫 카드 자리로
  //    들어오고, 확장 완료 화면과 greeting 초기 화면이 동일해 이음새가 없다.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(
      () => (isHorizontal ? setCollapsed(true) : setHidden(true)),
      FILL_MS,
    );
    return () => clearTimeout(t);
  }, [done, isHorizontal]);

  // 세로 모드: 크로스페이드가 끝나면 표지를 페인트에서 완전히 제거한다.
  useEffect(() => {
    if (!hidden) return;
    const t = setTimeout(() => setGone(true), SWAP_FADE_MS);
    return () => clearTimeout(t);
  }, [hidden]);

  // 접힘을 부모 카드(shell 이 렌더한 [data-section] 래퍼)에 적용 → 스냅 대상에서 제거.
  // 표지가 첫 카드였으므로 greeting 이 자연스럽게 첫 카드 자리로 들어온다.
  // useLayoutEffect: 페인트 전에 동기로 감춰 표지 제거와 greeting 등장이
  // 항상 같은 프레임에 일어난다(중간 빈 카드 프레임 방지).
  useLayoutEffect(() => {
    if (!collapsed) return;
    const card = sectionRef.current?.closest<HTMLElement>("[data-section]");
    if (card) card.style.display = "none";
  }, [collapsed]);

  // 편지지와 확장 오버레이가 공유하는 본문 — greeting 상단 블록과 동일한
  // 마크업·스타일이라 표지가 사라지는 순간 greeting 텍스트와 그대로 겹친다.
  const letterBody = (
    <>
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
    </>
  );

  return (
    <section
      ref={sectionRef}
      aria-label="표지"
      onClick={() => setOpened(true)}
      className="absolute inset-x-0 top-0 z-30 w-full cursor-pointer select-none overflow-hidden"
      style={{
        height: "100cqh",
        backgroundColor: COLOR.background,
        // 퇴장(세로 모드): 짧은 크로스페이드(깜박임 방지) 후 display 로 제거한다.
        // 가로 모드는 hidden/gone 을 쓰지 않고 부모 카드 접기로만 사라진다.
        // visibility 는 확장 오버레이의 명시적 visible 이 부모 hidden 을
        // 덮어써 계속 그려지므로 쓰지 않는다.
        opacity: hidden ? 0 : 1,
        transition: `opacity ${SWAP_FADE_MS}ms linear`,
        display: gone ? "none" : undefined,
        pointerEvents: done ? "none" : "auto",
      }}
    >
      <div className="w-full h-full">
        {/* 열린 편지 봉투 뚜껑 */}
        <div
          className={`absolute left-0 z-7 transition-all duration-2500 delay-1000 ease-in-out ${
            opened ? "top-[55%]" : "top-[-50%]"
          }`}
        >
          <img
            alt=""
            aria-hidden
            src={ASSET.introBgLid}
            className="max-w-none object-cover w-full rotate-180"
          />
        </div>
        {/* 편지 봉투 뚜껑 — 클릭 시 dim 되며 위로 사라짐 */}
        <div
          className={`absolute z-10 origin-top transition-all duration-2000 ease-in-out ${
            opened
              ? "pointer-events-none -translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <img
            alt=""
            aria-hidden
            src={ASSET.introBgLid}
            className=" max-w-none object-cover"
            style={{ width: "100%" }}
          />
          <div
            className="absolute w-full top-[35%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center leading-[1.1]"
            style={{
              fontFamily: FONT.filmotype,
              fontSize: "68px",
              color: "#DFD2C6",
              filter: EFFECT.innerShadow,
            }}
          >
            <Editable field="names.en" label="영문 이름">
              <p>
                {bride.en} <span style={{ fontSize: "3rem" }}>&</span>
              </p>
              <p>{groom.en}</p>
            </Editable>
          </div>
        </div>

        {/* 편지 봉투 몸통 — 뚜껑이 열린 뒤(딜레이) 아래로 내려감 */}
        <div
          className={`absolute bottom-0 w-full h-full z-9 transition-transform duration-2500 delay-1000 ease-in-out ${
            opened ? "translate-y-[95%]" : "translate-y-0"
          }`}
        >
          <img
            alt=""
            aria-hidden
            src={ASSET.introPocket}
            className="max-w-none object-cover "
            style={{ width: "100%" }}
          />
          {/* save the date */}
          <div className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center">
            <img src={ASSET.introDeco} alt="" className="mb-6" />
            <p
              style={{
                fontFamily: FONT.roaming,
                color: COLOR.label,
                fontSize: "16px",
              }}
            >
              Save the Date
            </p>
            <Editable
              as="p"
              field="schedule"
              label="예식 일시"
              style={{
                fontFamily: FONT.maltiner,
                fontSize: "68px",
                color: COLOR.text,
                filter: EFFECT.innerShadow,
              }}
            >
              {bigDate}
            </Editable>
            <img src={ASSET.introDeco} alt="" className="rotate-180 mb-3" />

            {/* date and venue */}
            <div className="text-center mt-4">
              <Editable
                as="p"
                field="schedule"
                label="예식 일시"
                style={{ fontFamily: FONT.pretendard, color: COLOR.muted }}
              >
                {schedule.dateKo}
              </Editable>
              <Editable
                as="p"
                field="venue"
                label="예식 장소"
                style={{ fontFamily: FONT.pretendard, color: COLOR.muted }}
              >
                {venue.name}
              </Editable>

              <Editable
                as="p"
                field="schedule"
                label="예식 일시"
                className="mt-4"
                style={{ fontFamily: FONT.roaming, color: COLOR.muted }}
              >
                {schedule.dateEn}
              </Editable>
            </div>
          </div>
        </div>

        {/* 편지지 — 봉투와 같은 시점에 아래로 내려갔다가 위로 떠올라
            greeting 섹션과 같은 자리에 멈춘다. 텍스트는 greeting 상단 블록과
            동일한 마크업·스타일이고, 도착 위치(translate -6px) + top-[94px]
            = 88px 로 greeting 의 pt-[88px] 텍스트와 정확히 겹친다. */}
        <div
          className={`absolute w-full h-103 top-0 left-1/2 -translate-x-1/2 z-8 ${
            opened ? styles.letterDipRise : "translate-y-[40%]"
          }`}
        >
          <img
            alt=""
            aria-hidden
            className="absolute max-w-none object-cover"
            src={ASSET.introLetter}
            style={{ width: "100%" }}
          />
          <div className="absolute inset-x-0 top-[94px] flex flex-col items-center gap-5 px-6 text-center">
            {letterBody}
          </div>
        </div>

        {/* 편지 봉투 뒷 배경 */}
        <img
          alt=""
          aria-hidden
          src={ASSET.introBack}
          className={`absolute left-0 max-w-none object-cover z-6 transition-all duration-2500 delay-1000 ease-in-out ${
            opened ? "top-[90%]" : "top-[-15%]"
          }`}
          style={{ width: "100%" }}
        />

        {/* 확장 편지지 — 도착한 편지지의 종이 영역에서 시작해 봉투·배경 위로
            화면 전체를 덮는다. 배경(greetingBg)과 본문이 greeting 섹션과 동일해
            확장이 끝나고 표지가 사라져도 화면이 그대로 이어진다. */}
        <div
          className="absolute inset-0 z-11"
          style={{
            visibility: done ? "visible" : "hidden",
            clipPath: done ? BG_CLIP_FULL : BG_CLIP_LETTER,
            transition: `clip-path ${FILL_MS}ms ease-in-out`,
          }}
        >
          {/* object-top: greeting 섹션(콘텐츠 높이)과 오버레이(100cqh)의 높이가
              달라도 상단 크롭이 같아 표지 제거 순간 배경이 튀지 않는다. */}
          <img
            alt=""
            aria-hidden
            src={isHorizontal ? ASSET.greetingBgHorizontal : ASSET.greetingBg}
            className="absolute inset-0 size-full object-cover object-top"
          />
          <div className="absolute inset-x-0 top-[88px] flex flex-col items-center gap-5 px-6 text-center">
            {letterBody}
          </div>
        </div>
      </div>

      {/* 탭 안내 토스트(Figma 519:3592) — 열리기 전에만, 클릭은 섹션이 받도록
          pointer-events 없음. top 42.9% = 375/874 (디자인 프레임 기준) */}
      {!opened && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[42.9%] z-20 flex justify-center"
        >
          <span
            className={`${styles.toastBlink} rounded-[8px] px-4 py-2`}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(12px)",
              boxShadow: "4px 4px 12px 0px rgba(124, 109, 95, 0.12)",
              fontFamily: "var(--font-nanum-myeongjo), serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: 1.4,
              letterSpacing: "-0.04em",
              color: "rgba(124, 109, 95, 0.8)",
            }}
          >
            화면을 눌러 봉투를 열어주세요
          </span>
        </div>
      )}
    </section>
  );
}

export default CoverSection;
