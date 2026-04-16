"use client";

import { deleteMessage } from "@/app/actions/messages";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import PasswordConfirmModal from "./PasswordConfirmModal";
import { useToast } from "./Toast";

type Props = {
  messageId: string;
  onDeleted?: () => void;
};

export default function MessageDeleteButton({ messageId, onDeleted }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, toastNode] = useToast();

  const handleConfirm = async (password: string) => {
    setLoading(true);
    const result = await deleteMessage(messageId, password);
    setLoading(false);

    if (result.error) {
      toast.show(result.error);
      return;
    }

    toast.show("메세지가 삭제되었습니다.");
    setShowModal(false);
    onDeleted?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="p-1 text-[#c0b8ad] hover:text-[#99958f] active:opacity-70"
        aria-label="메세지 삭제"
      >
        <Trash2Icon size={14} />
      </button>
      {showModal && (
        <PasswordConfirmModal
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      )}
      {toastNode}
    </>
  );
}
