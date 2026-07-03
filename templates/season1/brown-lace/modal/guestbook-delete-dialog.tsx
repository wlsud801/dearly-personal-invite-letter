"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 방명록 삭제 확인 다이얼로그 (Figma message-삭제 128:40937)         */
/*                                                                             */
/*  전체보기 모달에서 본인 글의 X 클릭 시, dim 위에 라이트 크림 카드로 뜬다.        */
/*  작성 시 설정한 비밀번호를 입력받아 삭제한다. 취소/딤 클릭으로 닫는다.          */
/*  부모(GuestbookModal) 의 portal 안에서 렌더되므로 자체 portal 은 쓰지 않는다.   */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import RoughButton from "@/templates/season1/components/rough-button";
import { COLOR, FONT } from "../theme";

const PAPER = "#EAE3DE";
const TITLE = "#7C6D5F";
const LABEL = "#9C8D81";

type GuestbookDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  /** 서버 검증 실패 시 표시할 에러 메세지 */
  error?: string | null;
};

export function GuestbookDeleteDialog({
  open,
  onClose,
  onConfirm,
  error,
}: GuestbookDeleteDialogProps) {
  const [password, setPassword] = useState("");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">
      {/* dim */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0"
        style={{ backgroundColor: COLOR.background, opacity: 0.6 }}
      />

      {/* 카드 */}
      <div
        className="relative flex w-full max-w-[362px] flex-col items-center gap-5 rounded-2xl p-5"
        style={{ backgroundColor: PAPER }}
      >
        <div className="flex flex-col items-center gap-2 text-center" style={{ color: TITLE }}>
          <p
            style={{
              fontFamily: FONT.pretendard,
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
            }}
          >
            메세지를 삭제하시겠습니까?
          </p>
          <p
            style={{
              fontFamily: FONT.pretendard,
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
            }}
          >
            메세지 작성 시 설정한 비밀번호를 입력해주세요.
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요."
          className="w-full rounded-lg border-2 bg-transparent px-3 py-2 outline-none placeholder:text-[#99958F] placeholder:opacity-80"
          style={{
            borderColor: LABEL,
            color: TITLE,
            fontFamily: FONT.pretendard,
            fontSize: 16,
            letterSpacing: "-0.04em",
          }}
        />

        {error && (
          <p
            className="-my-2 w-full text-center"
            style={{ fontFamily: FONT.pretendard, fontSize: 13, color: "#C0564F" }}
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex w-full gap-3">
          <RoughButton
            label="취소"
            variant="line"
            colorType="green"
            onClick={onClose}
            className="min-w-0 flex-1"
          />
          <RoughButton
            label="삭제"
            variant="filled"
            colorType="green"
            onClick={() => onConfirm(password)}
            className="min-w-0 flex-1"
          />
        </div>
      </div>
    </div>
  );
}
