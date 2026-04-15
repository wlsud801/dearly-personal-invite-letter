'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseClient } from '@/lib/supabase'

export type RSVPState = { error?: string; success?: boolean } | null

export async function submitRSVP(
    prevState: RSVPState,
    formData: FormData
): Promise<RSVPState> {
    const side = formData.get('side') as string
    const name = (formData.get('name') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const headcount = formData.get('headcount') as string
    const attendance = formData.get('attendance') as string
    const meal = formData.get('meal') as string

    if (!side) return { error: '신랑측/신부측을 선택해주세요.' }
    if (!name) return { error: '성함을 입력해주세요.' }
    if (!phone) return { error: '전화번호를 입력해주세요.' }
    if (!headcount) return { error: '총 인원을 입력해주세요.' }
    if (!attendance) return { error: '참석 여부를 선택해주세요.' }
    if (!meal) return { error: '식사 여부를 선택해주세요.' }

    const supabase = createSupabaseClient()
    const { error } = await supabase.from('rsvp').insert({
        side,
        name,
        phone,
        headcount: parseInt(headcount),
        attendance,
        meal,
    })

    if (error) return { error: '전송에 실패했습니다. 다시 시도해주세요.' }

    revalidatePath('/')
    return { success: true }
}
