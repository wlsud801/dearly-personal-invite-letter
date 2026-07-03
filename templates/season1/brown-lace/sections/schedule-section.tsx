"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — schedule (일정 정보 / wedding-day) section                      */
/*                                                                             */
/*  Figma frame 128:40665 "wedding-day" (402×651), file KTCSliL9f8oNYI3Lsu9NWL. */
/*  다크 브라운 배경 위에 위→아래로:                                            */
/*   · 상단 레이스 띠(calendar-lace, 풀폭)                                       */
/*   · 월 표기(YYYY.MM / 영문월) + 그리드 캘린더(예식일은 하트 마크)             */
/*   · 국문/영문 예식 일시                                                       */
/*   · 라이브 D-day 카운트다운(00 day  00 : 00 : 00)                            */
/*  월/요일/날짜/카운트다운은 모두 schedule.weddingDate(ISO)에서 파생한다.        */
/*  수치·폰트·색은 Figma 노드 데이터에서 추출.                                   */
/* -------------------------------------------------------------------------- */

import {
  buildMonthGrid,
  Editable,
  EN_MONTHS,
  pad2,
  useCountdown,
  useInvitationData,
  WEEK,
} from "@/templates/shared";
import { useEffect, useRef, useState } from "react";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { COLOR, EFFECT, FONT } from "../theme";
import styles from "./schedule-section.module.css";

/** 예식일 하트 마크 — 캘린더 페이드인(0.8s)이 끝난 뒤 뾰옹 하고 나타난다.
    reveal 은 세로 모드(셸 Reveal)·가로 모드(CardReveal) 어느 쪽이든 하트보다
    같거나 먼저 발동하므로, 하트 자체를 같은 조건(rootMargin -30%)으로 관찰해
    페이드인 duration 만큼 지연시키면 두 모드 모두에서 페이드 종료 후 등장한다. */
function WeddingHeart() {
  const ref = useRef<HTMLImageElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      alt=""
      aria-hidden
      src={ASSET.calendarDate}
      className={`absolute left-1/2 top-1/2 h-10 w-[43px] -translate-x-1/2 -translate-y-1/2 ${styles.heart} ${shown ? styles.pop : ""}`}
    />
  );
}

/** 카운트다운 큰 숫자 — Aurora 40 + 글리프 내부 음각(EFFECT.innerShadow).
    Aurora 는 숫자마다 폭이 다른 비례폭 글꼴이라, 자릿수 기준 고정폭(em)으로
    잠가 값이 바뀌어도 옆 숫자들의 위치가 흔들리지 않게 한다. shrink-0 이 없으면
    flex 컨테이너가 좁을 때 박스가 다시 글자 폭까지 줄어들어 고정폭이 무효가 된다. */
function CountNumber({ value }: { value: number }) {
  const text = pad2(value);
  return (
    <span
      style={{
        fontFamily: FONT.aurora,
        fontSize: 40,
        lineHeight: 1,
        color: COLOR.text,
        filter: EFFECT.innerShadow,
        width: `${text.length * 0.3}em`,
      }}
      className="shrink-0 text-center"
    >
      {text}
    </span>
  );
}

export function ScheduleSection() {
  const { schedule } = useInvitationData();
  const wedding = new Date(schedule.weddingDate);
  const weddingDay = wedding.getDate();
  const monthLabel = `${wedding.getFullYear()}.${pad2(wedding.getMonth() + 1)}`;
  const monthName = EN_MONTHS[wedding.getMonth()];

  const grid = buildMonthGrid(wedding);
  const { days, hours, minutes, seconds } = useCountdown(wedding);

  return (
    <section
      aria-label="일정 정보"
      className="relative flex w-full select-none flex-col items-center gap-10 overflow-hidden pb-10"
      style={{ backgroundColor: COLOR.background }}
    >
      {/* 상단 레이스 띠 (풀폭) */}
      <img alt="" aria-hidden src={ASSET.calendarLace} className="w-full" />

      {/* 캘린더 영역 — 가로 모드: 상단 레이스 띠는 두고 콘텐츠만 페이드인 */}
      <CardReveal className="flex w-full max-w-[362px] flex-col items-center gap-5 px-5">
        {/* 월 표기 */}
        <div className="flex w-full flex-col items-center gap-1">
          <p
            style={{
              fontFamily: FONT.aurora,
              fontSize: 48,
              lineHeight: 1,
              color: COLOR.text,
            }}
          >
            {monthLabel}
          </p>
          <p
            style={{
              fontFamily: FONT.roaming,
              fontSize: 20,
              lineHeight: 1,
              color: COLOR.text,
            }}
          >
            {monthName}
          </p>
        </div>

        {/* 그리드 캘린더 */}
        <div className="flex w-full flex-col gap-2 py-3">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 px-2 text-center">
            {WEEK.map((w) => (
              <span
                key={w}
                className="capitalize"
                style={{
                  fontFamily: FONT.roaming,
                  fontSize: 20,
                  lineHeight: 1,
                  color: COLOR.text,
                }}
              >
                {w}
              </span>
            ))}
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-7 gap-y-2 px-2 text-center">
            {grid.map((day, i) => {
              const isWedding = day === weddingDay;
              return (
                <div
                  key={i}
                  className="relative flex h-10 items-center justify-center"
                  aria-current={isWedding ? "date" : undefined}
                >
                  {isWedding && <WeddingHeart />}
                  {day && (
                    <span
                      className="relative"
                      style={{
                        fontFamily: FONT.aurora,
                        fontSize: 16,
                        lineHeight: 1,
                        color: isWedding ? "#ffffff" : COLOR.text,
                      }}
                    >
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 국문 / 영문 예식 일시 */}
        <Editable
          field="schedule"
          label="예식 일시"
          className="flex w-full flex-col items-center gap-4"
        >
          <p
            className="whitespace-nowrap text-center"
            style={{
              fontFamily: FONT.pretendard,
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "20px",
              letterSpacing: "-0.02em",
              color: COLOR.text,
            }}
          >
            {schedule.dateKo}
          </p>
          <p
            className="whitespace-nowrap text-center"
            style={{
              fontFamily: FONT.roaming,
              fontSize: 16,
              lineHeight: 1,
              color: COLOR.muted,
            }}
          >
            {schedule.dateEn}
          </p>
        </Editable>
      </CardReveal>

      {/* D-day 라이브 카운트다운 — 캘린더보다 살짝 늦게 순차 등장 */}
      <CardReveal className="flex items-center gap-5" delay={0.15}>
        {/* 00 day */}
        <div className="flex items-baseline gap-1">
          <CountNumber value={days} />
          <span
            style={{
              fontFamily: FONT.roaming,
              fontSize: 20,
              lineHeight: 1,
              color: COLOR.text,
            }}
          >
            day
          </span>
        </div>

        {/* 00 : 00 : 00 — 각 숫자가 고정폭이라 컨테이너 폭을 강제할 필요 없다 */}
        <div className="flex items-center gap-3">
          <CountNumber value={hours} />
          <Colon />
          <CountNumber value={minutes} />
          <Colon />
          <CountNumber value={seconds} />
        </div>
      </CardReveal>
    </section>
  );
}

/** 카운트다운 구분 콜론 — Aurora 20 */
function Colon() {
  return (
    <span
      style={{
        fontFamily: FONT.aurora,
        fontSize: 20,
        lineHeight: 1,
        color: COLOR.text,
      }}
    >
      :
    </span>
  );
}
