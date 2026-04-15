'use client';
import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
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

const DAYS_IN_MONTH = new Date(WEDDING_YEAR, WEDDING_MONTH, 0).getDate();
// 달력 숫자가 모두 나타난 후 하단 요소 등장 시작 시점
const AFTER_CAL = DAYS_IN_MONTH * 0.08 + 0.2;

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const dayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (day: number) => ({
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', delay: day * 0.08 },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
};

function WeddingCalendar({ inView }: { inView: boolean }) {
  const firstDayOfWeek = new Date(WEDDING_YEAR, WEDDING_MONTH - 1, 1).getDay();
  const daysInMonth = new Date(WEDDING_YEAR, WEDDING_MONTH, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <div className="w-full" style={{ fontFamily: "'Soluga', serif" }}>
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
                    <motion.span
                      className="relative z-10"
                      variants={dayVariants}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                      custom={day}
                    >
                      {day}
                    </motion.span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <img src={imgCalRing} alt="" className="w-9 h-9 object-contain" />
                    </span>
                  </>
                ) : day ? (
                  <motion.span
                    variants={dayVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    custom={day}
                  >
                    {day}
                  </motion.span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="bg-[#fffdf8] flex flex-col items-center gap-5 relative overflow-hidden">
      <img
        src={imgCalTopDeco}
        alt=""
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "17%" }}
      />

      <div className="flex flex-col items-center gap-5 w-full px-12 pt-16 pb-12">
        <motion.h2
          className="text-[#4b3a2a] text-[36px] text-center"
          style={{ fontFamily: "'Soluga', serif" }}
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Wedding Day
        </motion.h2>

        <WeddingCalendar inView={inView} />

        <div className="flex flex-col items-center gap-1 w-full">
          <motion.p
            className="text-black text-[16px] font-medium tracking-[-0.64px] text-center"
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={AFTER_CAL}
          >
            {WEDDING_YEAR}년 {WEDDING_MONTH}월 {WEDDING_DAY}일&nbsp;&nbsp;|&nbsp;&nbsp;{WEDDING_KO_DOW}요일 {WEDDING_TIME_KO}
          </motion.p>
          <motion.p
            className="text-[#99958f] text-[14px] text-center"
            style={{ fontFamily: "'Badoney', cursive" }}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={AFTER_CAL + 0.18}
          >
            {WEDDING_DAY} {WEDDING_EN_MONTH} {WEDDING_YEAR}, {WEDDING_EN_DOW} {WEDDING_TIME_EN}
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={AFTER_CAL + 0.36}
        >
          <CountdownTimer />
        </motion.div>
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
