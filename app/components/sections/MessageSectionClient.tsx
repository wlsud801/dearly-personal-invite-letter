"use client";

import type { Message } from "@/lib/supabase";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import MessageListModal from "../MessageListModal";

type Props = {
  messages: Message[];
};

export default function MessageSectionClient({ messages }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-between bg-[#d7b6a2] rounded-[10px] h-[50px] pl-5 w-full shadow-sm"
      >
        <span className="text-white text-[15px] font-medium tracking-[-0.6px]">
          메세지 전체보기
        </span>
        <div className="flex items-center justify-center w-[51px] h-full">
          <ChevronRightIcon className="w-[15px] h-[15px] text-white" />
        </div>
      </button>

      {open && (
        <MessageListModal messages={messages} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
