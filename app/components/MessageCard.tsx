"use client";

import type { Message } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import MessageDeleteButton from "./MessageDeleteButton";

type Props = {
  message: Message;
};

export default function MessageCard({ message }: Props) {
  const router = useRouter();

  return (
    <div className="bg-[#fff6e2] rounded-[10px] p-5 w-full flex flex-col gap-5 relative">
      <div className="absolute top-3 right-3">
        <MessageDeleteButton
          messageId={message.id}
          onDeleted={() => router.refresh()}
        />
      </div>
      <p className="text-black text-[14px] leading-relaxed tracking-[-0.308px] whitespace-pre-line pr-6">
        {message.text}
      </p>
      <p className="text-[#7a7a7a] text-[14px] leading-relaxed tracking-[-0.308px]">
        From. {message.from_name}
      </p>
    </div>
  );
}
