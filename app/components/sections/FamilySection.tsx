"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import ContactModal from "../ContactModal";

const FAMILIES = [
  { dad: "손세호", mom: "이은정", order: "장남", name: "재환" },
  { dad: "김철규", mom: "권영희", order: "차녀", name: "혜빈" },
];

const fromBottom: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

export default function FamilySection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-[#f1eee7] flex flex-col items-center px-12 py-12 gap-5">
      <div className="flex flex-col gap-5 w-full">
        {/* 가족 소개 */}
        <div className="flex flex-col w-full">
          {FAMILIES.map((p, i) => (
            <motion.div
              key={p.name}
              variants={fromBottom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              custom={i * 0.15}
              className="flex items-center justify-between px-6 py-4 text-[16px] font-medium tracking-[-0.64px]"
            >
              <div className="flex items-center gap-2 text-black">
                <span>{p.dad}</span>
                <span className="text-black/50 mx-1">·</span>
                <span className="w-14">{p.mom}</span>
                <span className="text-black/50">의</span>
              </div>
              <div className="flex items-center justify-between w-[73px]">
                <span className="text-black/50">{p.order}</span>
                <span className="text-black w-[30px]">{p.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 축하 연락하기 버튼 */}
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          variants={fromBottom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={FAMILIES.length * 0.15}
          className="flex items-center justify-between bg-[#a7bcab] rounded-[10px] h-[50px] px-4 w-full"
        >
          <span className="text-white text-[15px] font-medium tracking-[-0.6px]">
            축하 연락하기
          </span>
          <ArrowRightIcon className="w-[19px] h-[19px] text-white" />
        </motion.button>
      </div>

      {open && <ContactModal onClose={() => setOpen(false)} />}

      {/* 구분선 */}
      <div className="flex items-center justify-center py-6 w-full">
        <img
          src={"/images/components/flower-line.svg"}
          alt=""
          className="h-[19px] w-auto"
        />
      </div>
    </section>
  );
}
