"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 전체 갤러리 모달 (Figma gallery 128:41027)                       */
/*                                                                             */
/*  album-section 의 "더 많은 사진 보기" 클릭 시 열린다. 다크 브라운 풀스크린에     */
/*  "Gallery" 타이틀 + 좌측 닫기(꺽쇠) + 메인 사진 + (n / total) 네비게이션.       */
/*  body 로 portal, 열린 동안 스크롤 잠금, 꺽쇠/ESC 로 닫는다.                    */
/*                                                                             */
/*  사진은 [이전, 현재, 다음] 3장 트랙을 translate3d 로 이동해 좌우 스와이프/       */
/*  화살표 전환을 캐러셀처럼 보여준다. transitionend 시점에 인덱스를 커밋해         */
/*  인덱스 교체 시 이미지 튐을 방지한다.                                          */
/* -------------------------------------------------------------------------- */

import { useInvitationData } from "@/templates/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLOR, FONT } from "../theme";

type GalleryModalProps = { open: boolean; onClose: () => void };

const SWIPE_THRESHOLD = 50;

export function GalleryModal({ open, onClose }: GalleryModalProps) {
  const { gallery } = useInvitationData();
  const photos = gallery.photos;
  const total = photos.length;
  const [current, setCurrent] = useState(0);

  // 스와이프/슬라이드 상태
  //   offset: 트랙을 -100%(현재 사진 중앙) 기준으로 얼마나 px 이동했는지
  //     드래그 중  -> 손가락 이동량
  //     릴리스 후  -> ±컨테이너 너비(이웃 사진으로 애니메이션), 완료 후 인덱스 커밋
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swiping = useRef(false);
  const pending = useRef<0 | 1 | -1>(0); // 릴리스 후 커밋할 방향

  // 열려 있는 동안 body 스크롤 잠금 + ESC 로 닫기.
  // 열릴 때마다 첫 사진(1 / total)부터 다시 시작한다.
  useEffect(() => {
    if (!open) return;
    setCurrent(0);
    setOffset(0);
    setAnimating(false);
    pending.current = 0;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const index = total ? Math.min(current, total - 1) : 0;

  // 화살표/키보드 내비게이션 — 스와이프와 같은 슬라이드로 이동한다.
  const go = useCallback(
    (dir: 1 | -1) => {
      if (animating || total <= 1) return;
      const width = trackRef.current?.clientWidth ?? 0;
      if (width <= 0) {
        // 너비 측정 불가 시 애니메이션 없이 즉시 커밋 (안전장치)
        setCurrent((c) => (c + dir + total) % total);
        return;
      }
      pending.current = dir;
      setAnimating(true);
      setOffset(dir === 1 ? -width : width);
    },
    [animating, total],
  );

  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  // 좌우 방향키 내비게이션
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (animating || total <= 1) return;
      const t = e.touches[0];
      touchStartX.current = t.clientX;
      touchStartY.current = t.clientY;
      swiping.current = false;
    },
    [animating, total],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (animating || total <= 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX.current;
      const dy = t.clientY - touchStartY.current;
      // 세로 스크롤보다 가로 이동이 우세할 때만 스와이프로 처리
      if (!swiping.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        swiping.current = true;
      }
      if (swiping.current) {
        // 한 번에 최대 한 장까지만 끌리도록 이동량을 제한
        const width = trackRef.current?.clientWidth ?? 0;
        const clamped = width > 0 ? Math.max(-width, Math.min(width, dx)) : dx;
        setOffset(clamped);
      }
    },
    [animating, total],
  );

  const onTouchEnd = useCallback(() => {
    if (!swiping.current) return;
    swiping.current = false;
    const width = trackRef.current?.clientWidth ?? 0;
    if (offset <= -SWIPE_THRESHOLD) {
      pending.current = 1;
      setAnimating(true);
      setOffset(-width);
    } else if (offset >= SWIPE_THRESHOLD) {
      pending.current = -1;
      setAnimating(true);
      setOffset(width);
    } else {
      // 임계값 미달 -> 원위치 복귀
      setAnimating(true);
      setOffset(0);
    }
  }, [offset]);

  // 슬라이드 애니메이션 종료 후 인덱스 커밋 & 트랙 원위치
  const onTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      // 트랙 자신의 transform 전환에만 반응 (자식 이벤트 버블링 무시)
      if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
      if (!animating) return;
      if (pending.current === 1) setCurrent((c) => (c + 1) % total);
      else if (pending.current === -1) setCurrent((c) => (c - 1 + total) % total);
      pending.current = 0;
      setAnimating(false);
      setOffset(0);
    },
    [animating, total],
  );

  if (!open || typeof document === "undefined") return null;

  const main = photos[index];

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
          {/* 메인 사진 — 좌우 스와이프로 이전/다음 전환 (세로 스크롤은 통과) */}
          <div
            className="relative aspect-[134/194] w-full touch-pan-y overflow-hidden rounded-lg"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {total > 1 ? (
              <div
                ref={trackRef}
                className="absolute inset-0 flex"
                style={{
                  transform: `translate3d(calc(-100% + ${offset}px), 0, 0)`,
                  transition: animating ? "transform 0.3s ease-out" : "none",
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {[
                  (index - 1 + total) % total,
                  index,
                  (index + 1) % total,
                ].map((idx, i) => (
                  <div key={i} className="relative h-full w-full shrink-0">
                    <img
                      alt=""
                      src={photos[idx]}
                      className="size-full select-none object-contain"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              main && (
                <img
                  alt=""
                  src={main}
                  className="size-full object-contain"
                  draggable={false}
                />
              )
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
