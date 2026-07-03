"use client";

/* -------------------------------------------------------------------------- */
/*  Toast — 템플릿 공용 하단 토스트 (template-agnostic)                          */
/*                                                                             */
/*  ToastHost 를 템플릿 프레임(relative 박스) 안에 한 번 렌더하면, 어디서든        */
/*  showToast("...") 로 프레임 하단 중앙에 토스트를 띄운다. React 트리와          */
/*  무관하게 window CustomEvent 로 전달하므로 컨텍스트 배선이 필요 없다.          */
/*  copyWithToast = 클립보드 복사 + 성공/실패 토스트 헬퍼.                        */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "../lib/actions";

const TOAST_EVENT = "template:toast";

/** 하단 토스트를 띄운다. ToastHost 가 마운트되어 있어야 한다. */
export function showToast(message: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

/** 클립보드 복사 후 성공/실패 토스트까지 띄우는 헬퍼. */
export async function copyWithToast(
  text: string,
  successMessage = "복사되었습니다.",
): Promise<void> {
  const ok = await copyToClipboard(text);
  showToast(ok ? successMessage : "복사에 실패했습니다.");
}

/** 템플릿 프레임(relative 컨테이너)당 1회 렌더하는 토스트 표시 레이어. */
export function ToastHost() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (!detail) return;
      setMessage(detail);
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 2000);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex justify-center px-5">
      <div
        role="status"
        aria-live="polite"
        className={`rounded-full bg-black/70 px-4 py-2.5 text-center text-sm text-white backdrop-blur-sm transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
