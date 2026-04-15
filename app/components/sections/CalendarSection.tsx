'use client';
import CountdownTimer from "../CountdownTimer";
import { imgCalTopDeco, imgCalBotDeco, imgCalRing } from "./assets";
import {
  WEDDING_YEAR,
  WEDDING_MONTH,
  WEDDING_DAY,
  WEDDING_KO_DOW,
  WEDDING_EN_DOW,
  WEDDING_EN_MONTH,
  WEDDING_TIME_KO,
  WEDDING_TIME_EN,
} from "@/app/constants/wedding";

const HEADERS = ["sun", "mon", "tus", "wed", "thu", "fri", "sat"];

function WeddingCalendar() {
  const firstDayOfWeek = new Date(WEDDING_YEAR, WEDDING_MONTH - 1, 1).getDay();
  const daysInMonth = new Date(WEDDING_YEAR, WEDDING_MONTH, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // 7개씩 row로 분리 — divide-x가 부모 컨테이너에서만 동작하기 때문에 필수
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <div
      className="w-full "
      style={{ fontFamily: "'Soluga', serif" }}
    >
      {/* 헤더 행 */}
      <div className="grid grid-cols-7 text-center border-b border-[#c8bdb0] divide-x divide-[#c8bdb0]">
        {HEADERS.map((h) => (
          <div key={h} className="text-[#4b3a2a] text-[14px] py-2">
            {h}
          </div>
        ))}
      </div>

      {/* 날짜 행 */}
      <div className="divide-y divide-[#c8bdb0]">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-7 text-center divide-x divide-[#c8bdb0]">
            {row.map((day, colIdx) => (
              <div
                key={colIdx}
                className={`relative flex items-center justify-center h-10 text-[18px] text-[#4b3a2a] ${
                  day === WEDDING_DAY ? "font-semibold" : ""
                }`}
              >
                {day === WEDDING_DAY ? (
                  <>
                    <span className="relative z-10">{day}</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <img src={imgCalRing} alt="" className="w-9 h-9 object-contain" />
                    </span>
                  </>
                ) : (
                  day
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarSection() {
  return (
    <section className="bg-[#fffdf8] flex flex-col items-center gap-5 relative overflow-hidden">
      <img
        src={imgCalTopDeco}
        alt=""
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "17%" }}
      />

      <div className="flex flex-col items-center gap-5 w-full px-12 pt-16 pb-12">
        <h2
          className="text-[#4b3a2a] text-[36px] text-center"
          style={{ fontFamily: "'Soluga', serif" }}
        >
          Wedding Day
        </h2>

        <WeddingCalendar />

        <div className="flex flex-col items-center gap-1 w-full">
          <p className="text-black text-[16px] font-medium tracking-[-0.64px] text-center">
            {WEDDING_YEAR}년 {WEDDING_MONTH}월 {WEDDING_DAY}일&nbsp;&nbsp;|&nbsp;&nbsp;{WEDDING_KO_DOW}요일 {WEDDING_TIME_KO}
          </p>
          <p
            className="text-[#99958f] text-[14px] text-center"
            style={{ fontFamily: "'Badoney', cursive" }}
          >
            {WEDDING_DAY} {WEDDING_EN_MONTH} {WEDDING_YEAR}, {WEDDING_EN_DOW} {WEDDING_TIME_EN}
          </p>
        </div>

        <CountdownTimer />
      </div>

      <img
        src={imgCalBotDeco}
        alt=""
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: "17%" }}
      />
    </section>
  );
}
