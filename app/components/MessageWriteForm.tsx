'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitMessage } from '@/app/actions/messages'

type Props = { onSuccess: () => void }

export default function MessageWriteForm({ onSuccess }: Props) {
  const [state, formAction, pending] = useActionState(submitMessage, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      onSuccess()
    }
  }, [state, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 w-full">
      <input
        name="from_name"
        type="text"
        placeholder="이름"
        maxLength={20}
        required
        className="w-full h-[44px] rounded-[8px] border border-[#e0d9cf] bg-[#fffcf5] px-4 text-[14px] text-black placeholder:text-[#c0bbb4] outline-none focus:border-[#a7bcab]"
      />
      <textarea
        name="text"
        placeholder="축하 메세지를 남겨주세요 (최대 300자)"
        maxLength={300}
        required
        rows={4}
        className="w-full rounded-[8px] border border-[#e0d9cf] bg-[#fffcf5] px-4 py-3 text-[14px] text-black placeholder:text-[#c0bbb4] outline-none focus:border-[#a7bcab] resize-none"
      />
      {state?.error && (
        <p className="text-red-400 text-[13px]">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full h-[50px] rounded-[8px] bg-[#8fae95] text-white text-[15px] font-medium tracking-[-0.6px] disabled:opacity-60 active:opacity-80"
      >
        {pending ? '전송 중...' : '메세지 남기기'}
      </button>
    </form>
  )
}
