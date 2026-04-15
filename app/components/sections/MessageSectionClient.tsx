'use client'

import { useState } from 'react'
import MessageListModal from '../MessageListModal'
import type { Message } from '@/lib/supabase'

type Props = {
  messages: Message[]
  imgArrowRight: string
}

export default function MessageSectionClient({ messages, imgArrowRight }: Props) {
  const [open, setOpen] = useState(false)

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
          <img src={imgArrowRight} alt="" className="w-[7px] h-[15px]" />
        </div>
      </button>

      {open && (
        <MessageListModal messages={messages} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
