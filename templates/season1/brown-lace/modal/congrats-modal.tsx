"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 축하 연락하기 모달 (Figma RSVP 128:41088)                        */
/*                                                                             */
/*  "축하 연락하기" 버튼 클릭 시 열린다. 신랑/신부 탭으로 양가 연락처를 보여주고,    */
/*  각 행의 전화(call)·문자(mail) 아이콘으로 바로 연락할 수 있다.                  */
/*  greeting <section> 이 overflow-hidden 이라 클리핑되지 않도록 body 로 portal     */
/*  한다. 열려 있는 동안 body 스크롤을 잠그고, 배경/닫기/ESC 로 닫는다.             */
/* -------------------------------------------------------------------------- */

import { useInvitationData, type Person } from "@/templates/shared";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { FONT } from "../theme";

/** Figma 텍스트 색 — 타이틀(브라운) / 본문·라벨(토프) */
const TITLE = "#7C6D5F";
const TEXT = "#9C8D81";
/** 모달 페이퍼 배경 — 라이트 웜 크림 */
const PAPER = "#ECE5DC";

type Contact = { label: string; name: string; phone: string };

/** 한 쪽(신랑/신부) 연락처 행 — 본인 + 부·모 중 전화번호가 있는 항목만 */
function contactsFor(person: Person, side: string): Contact[] {
  const { father, mother, fatherPhone, motherPhone } = person.parents;
  const rows: Contact[] = [];
  if (person.phone) rows.push({ label: side, name: person.ko, phone: person.phone });
  if (fatherPhone) rows.push({ label: `${side} 부`, name: father, phone: fatherPhone });
  if (motherPhone) rows.push({ label: `${side} 모`, name: mother, phone: motherPhone });
  return rows;
}

const titleStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  color: TEXT,
} as const;

function ContactRow({ contact }: { contact: Contact }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {/* 라벨 + 이름 */}
      <div className="flex w-full items-center gap-2">
        <span className="flex-1 text-left" style={titleStyle}>
          {contact.label}
        </span>
        <span className="whitespace-nowrap" style={{ ...titleStyle, fontWeight: 700 }}>
          {contact.name}
        </span>
      </div>
      {/* 전화번호 + 액션(전화/문자) */}
      <div className="flex w-full items-center">
        <span className="flex-1 text-left" style={titleStyle}>
          {contact.phone}
        </span>
        <div className="flex items-center" style={{ color: TEXT }}>
          <a
            href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
            aria-label={`${contact.name} 에게 전화`}
            className="flex size-10 items-center justify-center"
          >
            <Phone className="size-[14px]" />
          </a>
          <a
            href={`sms:${contact.phone.replace(/[^0-9+]/g, "")}`}
            aria-label={`${contact.name} 에게 문자`}
            className="flex size-10 items-center justify-center"
          >
            <Mail className="size-[16px]" />
          </a>
        </div>
      </div>
    </div>
  );
}

/** 행 사이 하트 디바이더 (Figma 6px vector) */
function HeartDivider() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 7C4 7 0.5 4.8 0.5 2.6C0.5 1.4 1.4 0.5 2.5 0.5C3.2 0.5 3.8 0.9 4 1.4C4.2 0.9 4.8 0.5 5.5 0.5C6.6 0.5 7.5 1.4 7.5 2.6C7.5 4.8 4 7 4 7Z"
        fill={TEXT}
      />
    </svg>
  );
}

type CongratsModalProps = { open: boolean; onClose: () => void };

export function CongratsModal({ open, onClose }: CongratsModalProps) {
  const { groom, bride } = useInvitationData();
  const [side, setSide] = useState<"groom" | "bride">("groom");

  // 열려 있는 동안 body 스크롤 잠금 + ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // open 은 클라이언트 클릭으로만 true 가 되므로 이 시점에 document 는 항상 존재한다.
  if (!open || typeof document === "undefined") return null;

  const person = side === "groom" ? groom : bride;
  const contacts = contactsFor(person, side === "groom" ? "신랑" : "신부");

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="축하 연락하기"
    >
      {/* 배경 dim */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* 페이퍼 패널 */}
      <div
        className="relative mx-auto flex h-full max-h-[100dvh] w-full max-w-[480px] flex-col overflow-y-auto px-5 py-10"
        style={{ backgroundColor: PAPER }}
      >
        <div className="flex flex-col items-center gap-10">
          {/* 타이틀 — 좌측 꺽쇠 버튼으로 닫는다 */}
          <div
            className="relative flex w-full flex-col items-center gap-2 text-center"
            style={{ color: TITLE }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="absolute left-0 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center"
              style={{ color: TITLE }}
            >
              <ChevronLeft className="size-6" />
            </button>
            <p style={{ fontFamily: FONT.roaming, fontSize: 32, lineHeight: 1 }}>
              Send Congratulations
            </p>
            <p
              style={{
                fontFamily: FONT.pretendard,
                fontWeight: 500,
                fontSize: 16,
                lineHeight: 1.4,
                letterSpacing: "-0.02em",
              }}
            >
              기쁜 마음으로 축하해 주세요!
            </p>
          </div>

          {/* 내용 */}
          <div className="flex w-full flex-col gap-5">
            {/* 탭 */}
            <div className="flex w-full items-stretch">
              {(["groom", "bride"] as const).map((key) => {
                const active = side === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSide(key)}
                    className="flex flex-1 items-center justify-center border-b border-solid p-2 transition-opacity"
                    style={{
                      borderColor: TITLE,
                      opacity: active ? 1 : 0.6,
                      fontFamily: FONT.pretendard,
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: "24px",
                      letterSpacing: "-0.04em",
                      color: TEXT,
                    }}
                  >
                    {key === "groom" ? "신랑" : "신부"}
                  </button>
                );
              })}
            </div>

            {/* 연락처 목록 */}
            <div className="flex w-full flex-col items-center gap-5 p-3">
              {contacts.length === 0 ? (
                <p style={titleStyle}>등록된 연락처가 없어요.</p>
              ) : (
                contacts.map((c, i) => (
                  <Fragment key={c.label}>
                    {i > 0 && <HeartDivider />}
                    <ContactRow contact={c} />
                  </Fragment>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
