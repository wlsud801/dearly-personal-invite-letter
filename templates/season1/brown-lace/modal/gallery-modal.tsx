"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 전체 갤러리 모달 (Figma gallery 128:41027)                       */
/*                                                                             */
/*  album-section 의 "더 많은 사진 보기" 클릭 시 열린다. 다크 브라운 풀스크린에     */
/*  "Gallery" 타이틀 + 좌측 닫기(꺽쇠) + 메인 사진 + (n / total) 네비게이션.       */
/*  body 로 portal, 열린 동안 스크롤 잠금, 꺽쇠/ESC 로 닫는다.                    */
/* -------------------------------------------------------------------------- */

import { useInvitationData } from "@/templates/shared";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLOR, FONT } from "../theme";
import styles from "./gallery-modal.module.css";

type GalleryModalProps = { open: boolean; onClose: () => void };

export function GalleryModal({ open, onClose }: GalleryModalProps) {
  const { gallery } = useInvitationData();
  const photos = gallery.photos;
  const total = photos.length;
  const [current, setCurrent] = useState(0);

  // 열려 있는 동안 body 스크롤 잠금 + ESC 로 닫기.
  // 열릴 때마다 첫 사진(1 / total)부터 다시 시작한다.
  useEffect(() => {
    if (!open) return;
    setCurrent(0);
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

  const index = total ? Math.min(current, total - 1) : 0;
  const main = photos[index];
  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="갤러리"
    >
      <div
        className="relative mx-auto flex h-full max-h-[100dvh] w-full max-w-[480px] flex-col gap-5 overflow-y-auto p-5"
        style={{ backgroundColor: COLOR.background }}
      >
        {/* 타이틀 + 좌측 닫기 */}
        <div className="relative flex w-full items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute left-0 flex size-6 items-center justify-center"
            style={{ color: COLOR.text }}
          >
            <ChevronLeft className="size-6" />
          </button>
          <p style={{ fontFamily: FONT.roaming, fontSize: 32, lineHeight: 1, color: COLOR.text }}>
            Gallery
          </p>
        </div>

        {/* 사진 + 네비게이션 — my-auto 로 남은 공간의 세로 중앙에 배치.
            화면이 작아 넘치면 margin 이 0 으로 접혀 평소처럼 위에서부터 스크롤된다. */}
        <div className="my-auto flex w-full flex-col gap-5">
          {/* 메인 사진 */}
          <div
            className="aspect-[134/194] w-full overflow-hidden rounded-lg"
            style={{ backgroundColor: COLOR.surface }}
          >
            {main && (
              // key=index: 사진이 바뀔 때마다 img 를 새로 마운트해 페이드인을 재생한다.
              <img
                key={index}
                alt=""
                src={main}
                className={`size-full object-cover ${styles.fadeIn}`}
                draggable={false}
              />
            )}
          </div>

          {/* 네비게이션 (n / total) */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-3" style={{ color: COLOR.text }}>
              <button
                type="button"
                onClick={prev}
                aria-label="이전 사진"
                className="flex size-6 items-center justify-center"
              >
                <ChevronLeft className="size-5" />
              </button>
              <div
                className="flex items-center gap-2"
                style={{ fontFamily: FONT.maltiner, fontSize: 20, lineHeight: 1 }}
              >
                <span>{index + 1}</span>
                <span>/</span>
                <span>{total}</span>
              </div>
              <button
                type="button"
                onClick={next}
                aria-label="다음 사진"
                className="flex size-6 items-center justify-center"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
