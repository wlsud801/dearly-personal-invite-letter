"use client";

import { useState } from "react";
import Modal from "./Modal";

type Props = {
  onConfirm: (password: string) => void;
  onClose: () => void;
  loading?: boolean;
};

export default function PasswordConfirmModal({
  onConfirm,
  onClose,
  loading,
}: Props) {
  const [password, setPassword] = useState("");

  const isValid = /^\d{4}$/.test(password);

  const handleSubmit = () => {
    if (isValid) onConfirm(password);
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-[#fffbf1] rounded-[16px] px-6 py-8 w-[calc(100vw-80px)] max-w-[320px] flex flex-col items-center gap-6 shadow-[0px_4px_30px_0px_rgba(0,0,0,0.25)]">
        <p className="text-black text-[16px] font-medium tracking-[-0.64px] text-center">
          비밀번호 확인
        </p>
        <p className="text-[#99958f] text-[13px] text-center leading-relaxed">
          작성 시 입력한 비밀번호 4자리를 입력해주세요.
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="숫자 4자리"
          className="w-full h-[44px] px-4 text-[14px] text-center tracking-[0.5em] bg-white border border-[#e0dbd4] rounded-[10px] outline-none focus:border-[#d7b6a2] transition-colors"
          autoFocus
        />
        <div className="flex gap-2.5 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[44px] rounded-[10px] bg-[#f0ece6] text-[#7a7a7a] text-[14px] font-medium active:opacity-70"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="flex-1 h-[44px] rounded-[10px] bg-[#d7b6a2] text-white text-[14px] font-medium active:opacity-70 disabled:opacity-50"
          >
            {loading ? "확인 중..." : "삭제"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
