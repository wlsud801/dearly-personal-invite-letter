"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

export default function InvitationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      id="invitation-section"
      className="bg-[#f8f5f0] flex flex-col items-center px-8 py-12 gap-5"
    >
      {/* INVITATION 헤더 */}
      <motion.div
        className="flex items-center gap-3 px-2.5"
        variants={fadeDown}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={0}
      >
        <img
          src={"/images/invitation/invitation_header.svg"}
          alt="INVITATION"
          className="h-[86px]"
        />
      </motion.div>

      {/* 청첩 본문 */}
      <div className="flex flex-col items-center w-full">
        <motion.div
          className="px-6 py-5 text-center"
          variants={fadeDown}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.15}
        >
          <p className="text-[#99958f] text-[15px] leading-relaxed tracking-[-0.6px] whitespace-pre-line">
            {`평생을 함께하고 싶은\n사람을 만났습니다.\n서로를 아껴주고 사랑하며 살겠습니다.`}
          </p>
        </motion.div>
        <motion.div
          className="px-6 py-5 text-center"
          variants={fadeDown}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.3}
        >
          <p className="text-black text-[16px] leading-relaxed tracking-[-0.64px] whitespace-pre-line font-medium">
            {`우리 약속 위에\n따뜻한 격려로 축복해 주셔서\n힘찬 출발의 디딤이 되어주십시오`}
          </p>
        </motion.div>

        {/* 신랑 신부 */}
        <motion.div
          className="flex items-center gap-3.5 px-4 py-5"
          variants={fadeDown}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0.45}
        >
          <div className="flex items-center gap-1.5 text-black text-[16px] font-medium tracking-[-0.64px]">
            <span>신랑</span>
            <span>재환</span>
          </div>
          <img
            src={"/images/invitation/present.svg"}
            alt="♥"
            className="w-[18px] h-5"
          />
          <div className="flex items-center gap-1.5 text-black text-[16px] font-medium tracking-[-0.64px]">
            <span>신부</span>
            <span>혜빈</span>
          </div>
        </motion.div>
      </div>

      {/* 영문 부제 */}
      <motion.p
        className="text-[#99958f] text-[14px] text-center leading-relaxed whitespace-pre-line"
        style={{ fontFamily: "'Badoney', cursive" }}
        variants={fadeDown}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={0.6}
      >
        {`We would be delighted to have you join us \nin celebrating our love and the beginning of our forever.`}
      </motion.p>
    </section>
  );
}
