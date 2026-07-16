"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 방명록 전체보기 모달 (Figma message-전체보기 128:40839)           */
/*                                                                             */
/*  guestbook-section 의 "메세지 전체보기" 클릭 시 열린다. 다크 브라운 풀스크린에   */
/*  "Message" 타이틀 + 좌측 닫기(꺽쇠) + 전체 방명록 메시지 스크롤 리스트.          */
/*  각 메시지는 상/하단 플러시(guest-deco)로 감싸고, 본문 + From.이름, 우측 삭제(X)   */
/*  affordance, 카드 사이 하트(deco-heart). body 로 portal, 스크롤 잠금, ESC 닫기. */
/* -------------------------------------------------------------------------- */

import { useInvitationData } from "@/templates/shared";
import { Fragment, useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { deleteMessage } from "@/app/jinyoung-jihoon/actions";
import { ASSET } from "../assets";
import { COLOR, FONT } from "../theme";
import { GuestbookDeleteDialog } from "./guestbook-delete-dialog";

type GuestbookModalProps = { open: boolean; onClose: () => void };

const messageStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: 1.5,
  letterSpacing: "-0.022em",
  color: COLOR.text,
} as const;

export function GuestbookModal({ open, onClose }: GuestbookModalProps) {
  const { guestbook } = useInvitationData();
  const messages = guestbook.messages;
  // 삭제 확인 다이얼로그 대상 메시지 인덱스 (null = 닫힘)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  // 열려 있는 동안 body 스크롤 잠금 + ESC (삭제 다이얼로그 먼저, 없으면 모달) 닫기
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (deleteIndex !== null) {
        setDeleteIndex(null);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, deleteIndex]);

  if (!open || typeof document === "undefined") return null;

  function handleConfirmDelete(password: string) {
    const id = deleteIndex !== null ? messages[deleteIndex]?.id : undefined;
    if (!id) {
      setDeleteIndex(null);
      return;
    }
    startTransition(async () => {
      const result = await deleteMessage(id, password);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleteError(null);
      setDeleteIndex(null);
      router.refresh();
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="방명록 전체보기"
    >
      <div
        className="relative mx-auto flex h-full max-h-[100dvh] w-full max-w-[480px] flex-col gap-4 px-5 pb-10 pt-5"
        style={{ backgroundColor: COLOR.background }}
      >
        {/* 타이틀 + 좌측 닫기 */}
        <div className="relative flex w-full shrink-0 items-center justify-center">
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
            Message
          </p>
        </div>

        {/* 메시지 리스트 (스크롤) */}
        <div className="flex flex-1 flex-col items-center gap-2 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="py-10" style={{ ...messageStyle, color: COLOR.muted }}>
              아직 남겨진 메시지가 없어요.
            </p>
          ) : (
            messages.map((msg, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <img alt="" aria-hidden src={ASSET.decoHeart} className="size-2 shrink-0" />
                )}
                <div className="relative flex w-full flex-col items-center gap-2 py-3 pl-3 pr-6">
                  {/* 상단 플러시 */}
                  <img
                    alt=""
                    aria-hidden
                    src={ASSET.guestDecoSm}
                    className="w-full rotate-180"
                  />
                  <p className="w-full whitespace-pre-line" style={messageStyle}>
                    {msg.text}
                  </p>
                  <div
                    className="flex items-center gap-1"
                    style={{ fontSize: 12, color: COLOR.muted }}
                  >
                    <span style={{ fontFamily: FONT.altesse }}>From.</span>
                    <span style={{ fontFamily: FONT.pretendard, fontWeight: 500 }}>
                      {msg.from}
                    </span>
                  </div>
                  {/* 하단 플러시 */}
                  <img
                    alt=""
                    aria-hidden
                    src={ASSET.guestDecoSm}
                    className="w-full -scale-y-100"
                  />
                  {/* 삭제 — 본인 작성 글에만 노출 (비밀번호로 본인 확인) */}
                  {msg.mine && (
                    <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setDeleteIndex(i)}
                        aria-label="메시지 삭제"
                        className="flex size-6 items-center justify-center opacity-60"
                        style={{ color: COLOR.text }}
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              </Fragment>
            ))
          )}
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <GuestbookDeleteDialog
        open={deleteIndex !== null}
        onClose={() => {
          setDeleteError(null);
          setDeleteIndex(null);
        }}
        onConfirm={handleConfirmDelete}
        error={deleteError}
      />

    </div>,
    document.body,
  );
}
