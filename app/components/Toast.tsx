'use client'

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface ToastHandle {
  show: (message: string) => void;
}

export function useToast(): [ToastHandle, React.ReactNode] {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const show = useCallback((msg: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (unmountTimer.current) clearTimeout(unmountTimer.current);

    setVisible(false);
    setMessage(msg);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });

    hideTimer.current = setTimeout(() => {
      setVisible(false);
      unmountTimer.current = setTimeout(() => setMessage(null), 600);
    }, 3000);
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (unmountTimer.current) clearTimeout(unmountTimer.current);
  }, []);

  const toastEl = message ? (
    <div
      className="fixed bottom-8 left-1/2 z-50 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : "12px"})`,
        transition: visible
          ? "opacity 400ms ease-out, transform 400ms ease-out"
          : "opacity 600ms ease-in, transform 600ms ease-in",
      }}
    >
      <div className="bg-[#2a2a2a]/90 text-white text-[14px] tracking-[-0.28px] px-5 py-3 rounded-full whitespace-nowrap">
        {message}
      </div>
    </div>
  ) : null;

  const node = mounted && toastEl ? createPortal(toastEl, document.body) : null;

  return [{ show }, node];
}
