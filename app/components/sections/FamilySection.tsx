'use client';

import { useState } from "react";
import { imgFamilyLine, imgContactIcon } from "./assets";
import ContactModal from "../ContactModal";

const FAMILIES = [
  { dad: "손세호", mom: "이정은", order: "장남", name: "재환" },
  { dad: "김철규", mom: "권영희", order: "차녀", name: "혜빈" },
];

export default function FamilySection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-[#f1eee7] flex flex-col items-center px-12 py-12 gap-5">
      <div className="flex flex-col gap-5 w-full">
        {/* 가족 소개 */}
        <div className="flex flex-col w-full">
          {FAMILIES.map((p) => (
            <div
              key={p.name}
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
            </div>
          ))}
        </div>

        {/* 축하 연락하기 버튼 */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center justify-between bg-[#a7bcab] rounded-[10px] h-[50px] px-4 w-full"
        >
          <span className="text-white text-[15px] font-medium tracking-[-0.6px]">
            축하 연락하기
          </span>
          <img src={imgContactIcon} alt="" className="w-[19px] h-[19px]" />
        </button>
      </div>

      {open && <ContactModal onClose={() => setOpen(false)} />}

      {/* 구분선 */}
      <div className="flex items-center justify-center py-6 w-full">
        <img src={imgFamilyLine} alt="" className="h-[19px] w-auto" />
      </div>
    </section>
  );
}
