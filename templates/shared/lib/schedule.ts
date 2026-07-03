/* -------------------------------------------------------------------------- */
/*  Schedule 표기 문자열 파생 유틸                                              */
/*                                                                             */
/*  편집 다이얼로그는 schedule.weddingDate(ISO)만 수정하므로, 템플릿이 그리는   */
/*  표기 문자열(dateLabel/dateKo/dateEn)을 weddingDate 에서 파생 생성한다.      */
/*  포맷은 SAMPLE_INVITATION 의 표기를 따른다:                                  */
/*    dateLabel: "2026. 05. 31"                                                */
/*    dateKo:    "2026년 5월 31일 일요일 오전 11시 30분"                        */
/*    dateEn:    "31 May 2026, Sunday AM 11:30"                                */
/* -------------------------------------------------------------------------- */

import { EN_MONTHS, pad2 } from "./calendar";
import type { EditDraft } from "../model/edit-schema";

const KO_WEEKDAYS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

const EN_WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export type ScheduleLabels = {
  dateLabel: string;
  dateKo: string;
  dateEn: string;
};

/** weddingDate ISO → 표기 문자열 묶음. 잘못된 날짜면 null. */
export function deriveScheduleLabels(
  weddingDateIso: string,
): ScheduleLabels | null {
  const date = new Date(weddingDateIso);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const day = date.getDate();
  const weekday = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const meridiemKo = hours < 12 ? "오전" : "오후";
  const meridiemEn = hours < 12 ? "AM" : "PM";

  // 분이 0이면 "오전 11시", 아니면 "오전 11시 30분"
  const timeKo = `${meridiemKo} ${hour12}시${minutes ? ` ${minutes}분` : ""}`;

  return {
    dateLabel: `${year}. ${pad2(month + 1)}. ${pad2(day)}`,
    dateKo: `${year}년 ${month + 1}월 ${day}일 ${KO_WEEKDAYS[weekday]} ${timeKo}`,
    dateEn: `${day} ${EN_MONTHS[month]} ${year}, ${EN_WEEKDAYS[weekday]} ${meridiemEn} ${hour12}:${pad2(minutes)}`,
  };
}

/** weddingDate 수정 커밋에 함께 적용할 파생 표기 edits (dot-path 묶음) */
export function deriveScheduleEdits(weddingDateIso: string): EditDraft {
  const labels = deriveScheduleLabels(weddingDateIso);
  if (!labels) return {};
  return {
    "schedule.dateLabel": labels.dateLabel,
    "schedule.dateKo": labels.dateKo,
    "schedule.dateEn": labels.dateEn,
  };
}
