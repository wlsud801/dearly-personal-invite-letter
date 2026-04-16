'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Modal from './Modal'
import { submitGuestbookEntry } from '@/app/actions/messages'

type Props = { onClose: () => void }

export default function MessagePenModal({ onClose }: Props) {
    const [state, formAction, pending] = useActionState(submitGuestbookEntry, null)
    const formRef = useRef<HTMLFormElement>(null)
    const [text, setText] = useState('')

    useEffect(() => {
        if (state?.success) {
            onClose()
        }
    }, [state, onClose])

    return (
        <Modal onClose={onClose}>
            <div className="relative bg-[#fffbf1] flex flex-col px-6 py-10 gap-5 w-[calc(100vw-48px)] max-w-[402px] rounded-[10px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.25)]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-[#99958f] active:opacity-70"
                >
                    <X size={20} />
                </button>

                <p className="text-black text-[16px] font-medium tracking-[-0.64px] text-center">
                    방명록 작성
                </p>

                <form ref={formRef} action={formAction} className="flex flex-col gap-3 w-full">
                    <input
                        name="from_name"
                        type="text"
                        placeholder="성함"
                        maxLength={20}
                        required
                        className="w-full h-[44px] rounded-[8px] border border-[#e0d9cf] bg-[#fffcf5] px-4 text-[14px] text-black placeholder:text-[#c0bbb4] outline-none focus:border-[#d7b6a2]"
                    />
                    <input
                        name="password"
                        type="password"
                        inputMode="numeric"
                        pattern="\d{4}"
                        placeholder="비밀번호 숫자 4자리 (삭제 시 사용)"
                        maxLength={4}
                        required
                        onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 4)
                        }}
                        className="w-full h-[44px] rounded-[8px] border border-[#e0d9cf] bg-[#fffcf5] px-4 text-[14px] text-black placeholder:text-[#c0bbb4] outline-none focus:border-[#d7b6a2]"
                    />
                    <div className="relative">
                        <textarea
                            name="text"
                            placeholder="축하 메세지를 남겨주세요"
                            maxLength={200}
                            required
                            rows={5}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full rounded-[8px] border border-[#e0d9cf] bg-[#fffcf5] px-4 py-3 pb-7 text-[14px] text-black placeholder:text-[#c0bbb4] outline-none focus:border-[#d7b6a2] resize-none"
                        />
                        <span className="absolute bottom-3 right-3 text-[12px] text-[#c0bbb4]">
                            {text.length}/200
                        </span>
                    </div>
                    {state?.error && (
                        <p className="text-red-400 text-[13px]">{state.error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full h-[50px] rounded-[8px] bg-[#d7b6a2] text-white text-[15px] font-medium tracking-[-0.6px] disabled:opacity-60 active:opacity-80"
                    >
                        {pending ? '저장 중...' : '방명록 남기기'}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
