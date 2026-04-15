'use client'

import { useState } from 'react'
import MessagePenModal from './MessagePenModal'

export default function MessagePenButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute -bottom-10 -right-16"
                aria-label="방명록 작성"
            >
                <img
                    src="/images/message/message_pen.svg"
                    alt=""
                    className="w-[154px] h-auto animate-float"
                />
            </button>
            {open && <MessagePenModal onClose={() => setOpen(false)} />}
        </>
    )
}
