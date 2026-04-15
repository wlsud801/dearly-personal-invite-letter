/** 결혼식 일시 (KST) — 이 값을 바꾸면 전체 청첩장에 반영됩니다 */
export const WEDDING_DATE = new Date("2026-05-31T11:30:00+09:00");

// KST 기준 날짜 분해 (UTC+9 offset 보정)
const _kst = new Date(WEDDING_DATE.getTime() + 9 * 60 * 60 * 1000);

export const WEDDING_YEAR   = _kst.getUTCFullYear();
export const WEDDING_MONTH  = _kst.getUTCMonth() + 1; // 1~12
export const WEDDING_DAY    = _kst.getUTCDate();
export const WEDDING_HOUR   = _kst.getUTCHours();
export const WEDDING_MINUTE = _kst.getUTCMinutes();
export const WEDDING_DOW    = _kst.getUTCDay(); // 0=일, 6=토

const KO_DAYS  = ['일', '월', '화', '수', '목', '금', '토'] as const;
const EN_DAYS  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;

export const WEDDING_KO_DOW   = KO_DAYS[WEDDING_DOW];      // '일'
export const WEDDING_EN_DOW   = EN_DAYS[WEDDING_DOW];      // 'Sunday'
export const WEDDING_EN_MONTH = EN_MONTHS[WEDDING_MONTH - 1]; // 'May'

const _ampm = WEDDING_HOUR < 12 ? '전' : '후';
const _h    = WEDDING_HOUR % 12 || 12;
const _m    = WEDDING_MINUTE ? ` ${WEDDING_MINUTE}분` : '';

/** 예: "오전 11시 30분" */
export const WEDDING_TIME_KO = `오${_ampm} ${_h}시${_m}`;

/** 예: "AM 11:30" */
export const WEDDING_TIME_EN = `${WEDDING_HOUR < 12 ? 'AM' : 'PM'} ${_h}:${String(WEDDING_MINUTE).padStart(2, '0')}`;

/** 예: "05" */
export const WEDDING_MONTH_PADDED = String(WEDDING_MONTH).padStart(2, '0');
