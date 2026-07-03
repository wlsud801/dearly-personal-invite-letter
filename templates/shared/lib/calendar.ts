/* -------------------------------------------------------------------------- */
/*  Calendar grid helpers (template-agnostic)                                  */
/* -------------------------------------------------------------------------- */

export const WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

/** 0-based 월 인덱스 → 영문 월 풀네임 ("September" 등) */
export const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** 숫자를 2자리로 zero-pad ("9" → "09") */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Builds a month grid for the month containing `date`: leading `null`s pad the
 * weekday offset of the 1st, followed by 1..daysInMonth.
 *
 * e.g. May 2026 (1st is a Friday) -> [null×5, 1, 2, …, 31]
 */
export function buildMonthGrid(date: Date): (number | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
}
