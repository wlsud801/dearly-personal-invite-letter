'use client';

import { useState } from "react";
import { X } from "lucide-react";
import Modal from "./Modal";

const CONTACTS = {
  groom: [
    { label: "신랑", name: "재환", phone: "010-0000-0000" },
    { label: "신랑 부", name: "손세호", phone: "010-0000-0000" },
    { label: "신랑 모", name: "이정은", phone: "010-0000-0000" },
  ],
  bride: [
    { label: "신부", name: "혜빈", phone: "010-0000-0000" },
    { label: "신부 부", name: "김철규", phone: "010-0000-0000" },
    { label: "신부 모", name: "권영희", phone: "010-0000-0000" },
  ],
};

type Tab = "groom" | "bride";

type Props = { onClose: () => void };

export default function ContactModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("groom");
  const contacts = CONTACTS[tab];

  return (
    <Modal onClose={onClose}>
      <div className="relative bg-[#fffbf1] flex flex-col items-center px-12 py-12 gap-[30px] w-[calc(100vw-48px)] max-w-[402px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#99958f] active:opacity-70"
        >
          <X size={20} />
        </button>

        {/* 헤더 */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-black text-[16px] font-medium tracking-[-0.64px]">축하 연락하기</p>
          <p className="text-[#99958f] text-[15px] tracking-[-0.6px]">기쁜 마음으로 축하해 주세요!</p>
        </div>

        {/* 탭 */}
        <div className="flex w-full">
          {(["groom", "bride"] as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex-1 flex flex-col items-center gap-[13px] pt-[15px]"
              >
                <span
                  className="text-[16px] font-medium tracking-[-0.64px] w-full text-center"
                  style={{ color: active ? "#000" : "#8f8f8f" }}
                >
                  {t === "groom" ? "신랑" : "신부"}
                </span>
                <div
                  className="w-full"
                  style={{
                    height: active ? "2px" : "1px",
                    backgroundColor: active ? "#000" : "#b4b4b4",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* 연락처 목록 */}
        <div className="flex flex-col gap-[30px] w-full">
          {contacts.map(({ label, name, phone }) => (
            <div key={label} className="flex flex-col gap-[18px]">
              <div className="flex items-center justify-between text-[14px] font-medium tracking-[-0.56px]">
                <span className="text-black">{label}</span>
                <span className="text-black">{name}</span>
              </div>
              <div className="flex gap-[9px]">
                <a
                  href={`sms:${phone}`}
                  className="flex flex-1 items-center justify-center h-[50px] rounded-[8px] bg-[#a7bcab] text-white text-[14px] font-medium tracking-[-0.56px]"
                >
                  문자 보내기
                </a>
                <a
                  href={`tel:${phone}`}
                  className="flex flex-1 items-center justify-center h-[50px] rounded-[8px] bg-[#8fae95] text-white text-[14px] font-medium tracking-[-0.56px]"
                >
                  전화하기
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
