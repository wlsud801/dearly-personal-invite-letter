"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 방명록 작성 모달 (Figma message-남기기 128:41046)                 */
/*                                                                             */
/*  guestbook-section 의 "메세지 남기기" 클릭 시 열린다. 다른 모달과 달리 라이트     */
/*  크림(#EAE3DE) 배경. "Message" + 안내문 + 성함/비밀번호/메세지 입력 + 작성       */
/*  취소(라인)/작성 완료(채움) 버튼. body 로 portal, 스크롤 잠금, ESC/꺽쇠 닫기.    */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import RoughButton from "@/templates/season1/components/rough-button";
import { submitGuestbookEntry } from "@/app/jinyoung-jihoon/actions";
import { FONT } from "../theme";

/** Figma 색 — 라이트 크림 폼 */
const PAPER = "#EAE3DE";
const TITLE = "#7C6D5F"; // 타이틀/안내문
const LABEL = "#9C8D81"; // 라벨/인풋 보더
const PLACEHOLDER = "#99958F";

const fieldStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 1.6,
  letterSpacing: "-0.04em",
  color: TITLE,
} as const;

const labelStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 1.6,
  letterSpacing: "-0.04em",
  color: LABEL,
} as const;

type GuestbookWriteModalProps = {
  open: boolean;
  onClose: () => void;
};

export function GuestbookWriteModal({ open, onClose }: GuestbookWriteModalProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // 열릴 때마다 폼 초기화
  useEffect(() => {
    if (!open) return;
    setName("");
    setMessage("");
    setPassword("");
    setError(null);
  }, [open]);

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

  if (!open || typeof document === "undefined") return null;

  function handleSubmit() {
    if (pending) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("text", message);
      formData.set("from_name", name);
      formData.set("password", password);
      const result = await submitGuestbookEntry(null, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setName("");
      setPassword("");
      setMessage("");
      router.refresh();
      onClose();
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="방명록 작성"
    >
      <div
        className="relative mx-auto flex h-full max-h-[100dvh] w-full max-w-[480px] flex-col gap-10 overflow-y-auto p-5"
        style={{ backgroundColor: PAPER }}
      >
        {/* 타이틀 + 좌측 닫기 */}
        <div className="relative flex w-full flex-col items-center gap-1 text-center">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center"
            style={{ color: TITLE }}
          >
            <ChevronLeft className="size-6" />
          </button>
          <p style={{ fontFamily: FONT.roaming, fontSize: 32, lineHeight: 1, color: TITLE }}>
            Message
          </p>
          <p
            style={{
              fontFamily: FONT.pretendard,
              fontWeight: 500,
              fontSize: 16,
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
              color: TITLE,
            }}
          >
            저희의 행복한 결혼을 함께 축하해 주세요!
          </p>
        </div>

        {/* 입력 */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full gap-3">
            <label className="flex flex-1 flex-col gap-1">
              <span style={labelStyle}>성함</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요."
                className="w-full rounded-lg border-2 bg-transparent px-3 py-2 outline-none placeholder:opacity-80"
                style={{ ...fieldStyle, borderColor: LABEL }}
              />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span style={labelStyle}>비밀번호</span>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="숫자 4자리를 입력해주세요."
                className="w-full rounded-lg border-2 bg-transparent px-3 py-2 outline-none placeholder:opacity-80"
                style={{ ...fieldStyle, borderColor: LABEL }}
              />
            </label>
          </div>

          <label className="flex w-full flex-col gap-1">
            <span style={labelStyle}>메세지</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="축하 인사를 입력해주세요."
              rows={6}
              className="h-[160px] w-full resize-none rounded-lg border-2 bg-transparent px-3 py-2 outline-none placeholder:opacity-80"
              style={{ ...fieldStyle, borderColor: LABEL }}
            />
          </label>
        </div>

        {/* 에러 메세지 */}
        {error && (
          <p
            className="-my-6 w-full text-center"
            style={{ ...fieldStyle, fontSize: 13, color: "#C0564F" }}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* 액션 — RoughButton (arrow 없음) */}
        <div className="flex w-full gap-3">
          <RoughButton
            label="작성 취소"
            variant="line"
            colorType="green"
            onClick={onClose}
            className="min-w-0 flex-1"
          />
          <RoughButton
            label={pending ? "등록 중..." : "작성 완료"}
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
