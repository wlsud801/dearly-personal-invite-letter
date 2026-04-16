'use client'

import { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import MessageDeleteButton from './MessageDeleteButton'
import Modal from './Modal'
import MessageWriteForm from './MessageWriteForm'
import type { Message } from '@/lib/supabase'

type Props = {
  messages: Message[]
  onClose: () => void
}

export default function MessageListModal({ messages: initialMessages, onClose }: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [showForm, setShowForm] = useState(false)

  const refreshMessages = useCallback(async () => {
    const { getMessages } = await import('@/app/actions/messages')
    const updated = await getMessages()
    setMessages(updated)
  }, [])

  const handleSuccess = useCallback(async () => {
    await refreshMessages()
    setShowForm(false)
  }, [refreshMessages])

  return (
    <Modal onClose={onClose}>
      <div className="relative bg-[#fffbf1] flex flex-col px-6 py-10 gap-5 w-[calc(100vw-48px)] max-w-[402px] max-h-[80vh] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#99958f] active:opacity-70"
        >
          <X size={20} />
        </button>

        <p className="text-black text-[16px] font-medium tracking-[-0.64px] text-center">
          방명록
        </p>

        {/* 메세지 목록 */}
        <div className="flex flex-col gap-[5px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-[#99958f] text-[14px] text-center py-8">
              아직 메세지가 없습니다.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-[#fff6e2] rounded-[10px] p-5 flex flex-col gap-3 relative"
              >
                <div className="absolute top-3 right-3">
                  <MessageDeleteButton messageId={msg.id} onDeleted={refreshMessages} />
                </div>
                <p className="text-black text-[14px] leading-relaxed tracking-[-0.308px] whitespace-pre-line pr-6">
                  {msg.text}
                </p>
                <p className="text-[#7a7a7a] text-[13px] tracking-[-0.308px]">
                  From. {msg.from_name}
                </p>
              </div>
            ))
          )}
        </div>

        {/* 작성 폼 */}
        {showForm ? (
          <MessageWriteForm onSuccess={handleSuccess} />
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full h-[50px] rounded-[8px] bg-[#d7b6a2] text-white text-[15px] font-medium tracking-[-0.6px] active:opacity-80"
          >
            메세지 남기기
          </button>
        )}
      </div>
    </Modal>
  )
}
