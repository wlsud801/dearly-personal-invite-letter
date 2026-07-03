"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — RSVP(참석 의사) 모달 (Figma 128:41061)                          */
/*                                                                             */
/*  우측 하단 RSVP 씰 클릭 시 열린다. 신랑/신부측 + 성함·인원·전화번호 + 참석/식사  */
/*  여부를 입력받는 풀스크린 시트. 표지·섹션이 overflow-hidden 이라 클리핑되지     */
/*  않도록 body 로 portal 한다. 열려 있는 동안 body 스크롤을 잠그고 ESC/배경으로    */
/*  닫는다. 제출은 UI 까지만 — 실제 전송은 백엔드 연동 시 연결한다(TODO).          */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import RoughButton from "@/templates/season1/components/rough-button";
import { submitRSVP } from "@/app/jinyoung-jihoon/actions";
import { FONT } from "../theme";

/* DB 저장 값 — 기존 hyebin-jaehwan 페이지(app/components/RSVPModal.tsx)와 동일 컨벤션 */
const SIDE_VALUES = ["신랑측", "신부측"] as const;
const ATTEND_VALUES = ["참석", "불참석"] as const;
const MEAL_VALUES = ["식사예정", "불참석"] as const;

const PAPER = "#EAE3DE"; // 시트 배경 — 라이트 웜 크림
const TITLE = "#7C6D5F"; // 타이틀/입력 텍스트 — 브라운
const TONE = "#9C8D81"; // 토글·라벨·보더 — 토프 (placeholder #99958F 는 className 으로)

const PILL_SHADOW =
  "0px 4px 8px 0px rgba(58,49,42,0.15), 0px 1px 3px 0px rgba(219,240,223,0.4)";

/** 2지 선택 알약 토글 (신랑측/신부측, 참석/불참, 식사 여부) */
function SegmentedPair({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly [string, string];
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex w-full gap-2.5" role="group" aria-label={ariaLabel}>
      {options.map((label, i) => {
        const active = value === i;
        return (
          <button
            key={label + i}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(i as 0 | 1)}
            className="flex h-12 flex-1 items-center justify-center rounded-[80px] border-2 border-solid p-3 transition-colors"
            style={{
              borderColor: TONE,
              backgroundColor: active ? TONE : "transparent",
              color: active ? "#FFFFFF" : TONE,
              boxShadow: active ? PILL_SHADOW : undefined,
              fontFamily: FONT.pretendard,
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "24px",
              letterSpacing: "-0.04em",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** 라벨 + 텍스트 인풋 */
function Field({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
  digitsOnly = false,
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "text" | "numeric" | "tel";
  /** true 면 숫자 외 문자를 입력 시점에 걸러낸다 (인원 수·전화번호) */
  digitsOnly?: boolean;
  /** true 면 라벨에 필수 표시(*)를 붙인다 (검증은 handleSubmit) */
  required?: boolean;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span
        style={{
          fontFamily: FONT.pretendard,
          fontSize: 16,
          lineHeight: 1.6,
          letterSpacing: "-0.04em",
          color: TONE,
        }}
      >
        {label}
        {required && (
          <span aria-hidden style={{ color: "#C0564F" }}>
            {" "}
            *
          </span>
        )}
      </span>
      <input
        value={value}
        onChange={(e) =>
          onChange(
            digitsOnly
              ? e.target.value.replace(/\D/g, "")
              : e.target.value,
          )
        }
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={digitsOnly ? "[0-9]*" : undefined}
        className="w-full rounded-lg border-2 border-solid bg-transparent px-3 py-2 outline-none placeholder:text-[#99958f] placeholder:opacity-80"
        style={{
          borderColor: TONE,
          color: TITLE,
          fontFamily: FONT.pretendard,
          fontSize: 16,
          lineHeight: 1.6,
          letterSpacing: "-0.04em",
        }}
      />
    </label>
  );
}

type RsvpModalProps = { open: boolean; onClose: () => void };

export function RsvpModal({ open, onClose }: RsvpModalProps) {
  const [side, setSide] = useState<0 | 1>(0); // 0 신랑측 / 1 신부측
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [phone, setPhone] = useState("");
  const [attend, setAttend] = useState<0 | 1>(0); // 0 참석 / 1 불참
  const [meal, setMeal] = useState<0 | 1>(0); // 0 식사 예정 / 1 불참
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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

  function handleSubmit() {
    if (pending) return;
    // 필수 값 — 성함 / 인원 수 (서버 액션 검증과 동일 기준)
    if (!name.trim()) {
      setError("성함을 입력해주세요.");
      return;
    }
    if (!count.trim()) {
      setError("인원 수를 입력해주세요.");
      return;
    }
    const formData = new FormData();
    formData.set("side", SIDE_VALUES[side]);
    formData.set("name", name);
    formData.set("phone", phone);
    formData.set("headcount", count);
    formData.set("attendance", ATTEND_VALUES[attend]);
    formData.set("meal", MEAL_VALUES[meal]);
    startTransition(async () => {
      const result = await submitRSVP(null, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setName("");
      setCount("");
      setPhone("");
      onClose();
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="참석 의사 전달"
    >
      {/* 배경 dim */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* 페이퍼 시트 */}
      <div
        className="relative mx-auto flex h-full max-h-[100dvh] w-full max-w-[480px] flex-col gap-10 overflow-y-auto px-5 py-10"
        style={{ backgroundColor: PAPER }}
      >
        {/* 타이틀 */}
        <div
          className="flex w-full flex-col items-center gap-2 text-center"
          style={{ color: TITLE }}
        >
          <p style={{ fontFamily: FONT.roaming, fontSize: 32, lineHeight: 1 }}>
            <span className="block">Please confirm</span>
            <span className="block">your attendance.</span>
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
            참석 여부를 알려주시면 참고하겠습니다.
          </p>
        </div>

        {/* 입력 */}
        <div className="flex w-full flex-col gap-5">
          <SegmentedPair
            ariaLabel="측 선택"
            options={["신랑측", "신부측"]}
            value={side}
            onChange={setSide}
          />

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full gap-3">
              <Field
                label="성함"
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={setName}
                required
              />
              <Field
                label="인원 수"
                placeholder="인원 수를 입력해주세요."
                value={count}
                onChange={setCount}
                inputMode="numeric"
                digitsOnly
                required
              />
            </div>
            <Field
              label="전화번호"
              placeholder="전화번호를 입력해주세요."
              value={phone}
              onChange={setPhone}
              inputMode="tel"
              digitsOnly
            />
          </div>

          <div className="flex w-full flex-col gap-3">
            <SegmentedPair
              ariaLabel="참석 여부"
              options={["참석", "불참"]}
              value={attend}
              onChange={setAttend}
            />
            <SegmentedPair
              ariaLabel="식사 여부"
              options={["식사 예정", "불참"]}
              value={meal}
              onChange={setMeal}
            />
          </div>
        </div>

        {/* 에러 메세지 */}
        {error && (
          <p
            className="-my-6 w-full text-center"
            style={{
              fontFamily: FONT.pretendard,
              fontSize: 13,
              color: "#C0564F",
            }}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* 하단 액션 — RoughButton (arrow 없음) */}
        <div className="flex w-full gap-3">
          <RoughButton
            label="작성 취소"
            variant="line"
            colorType="green"
            onClick={onClose}
            className="min-w-0 flex-1"
          />
          <RoughButton
            label={pending ? "전송 중..." : "작성 완료"}
            variant="filled"
            colorType="green"
            onClick={handleSubmit}
            className="min-w-0 flex-1"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
