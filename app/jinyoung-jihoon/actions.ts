'use server'

/* -------------------------------------------------------------------------- */
/*  진영·지훈 청첩장 전용 서버 액션                                              */
/*  혜빈·재환 페이지(app/actions/*)와 테이블을 분리해                            */
/*  jinyoung_jihoon_messages / jinyoung_jihoon_rsvp 를 사용한다.                */
/*  테이블 생성 SQL: supabase/jinyoung-jihoon-tables.sql                        */
/* -------------------------------------------------------------------------- */

import { revalidatePath } from 'next/cache'
import { createSupabaseClient, Message } from '@/lib/supabase'

const MESSAGES_TABLE = 'jinyoung_jihoon_messages'
const RSVP_TABLE = 'jinyoung_jihoon_rsvp'
const PAGE_PATH = '/jinyoung-jihoon'

export async function getMessages(): Promise<Message[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export type SubmitState = { error?: string; success?: boolean } | null

export async function submitGuestbookEntry(
  prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const text = (formData.get('text') as string)?.trim()
  const from_name = (formData.get('from_name') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!text || !from_name) return { error: '이름과 메세지를 모두 입력해주세요.' }
  if (!password || !/^\d{4}$/.test(password)) return { error: '비밀번호는 숫자 4자리로 입력해주세요.' }
  if (text.length > 200) return { error: '메세지는 200자 이내로 입력해주세요.' }

  const supabase = createSupabaseClient()
  const { error } = await supabase.from(MESSAGES_TABLE).insert({ text, from_name, password })

  if (error) return { error: '메세지 저장에 실패했습니다.' }

  revalidatePath(PAGE_PATH)
  return { success: true }
}

export async function updateMessage(
  id: string,
  password: string,
  text: string,
  fromName: string
): Promise<{ error?: string; success?: boolean }> {
  const trimmedText = text?.trim()
  const trimmedName = fromName?.trim()
  const trimmedPassword = password?.trim()

  if (!id) return { error: '메세지를 찾을 수 없습니다.' }
  if (!trimmedText || !trimmedName) return { error: '이름과 메세지를 모두 입력해주세요.' }
  if (trimmedText.length > 200) return { error: '메세지는 200자 이내로 입력해주세요.' }
  if (!trimmedPassword || !/^\d{4}$/.test(trimmedPassword))
    return { error: '비밀번호는 숫자 4자리입니다.' }

  const supabase = createSupabaseClient()
  // 작성 시 설정한 비밀번호가 일치하는 경우에만 수정 — 본인 글만 수정 가능
  const { data, error: fetchError } = await supabase
    .from(MESSAGES_TABLE)
    .select('password')
    .eq('id', id)
    .single()

  if (fetchError || !data) return { error: '메세지를 찾을 수 없습니다.' }
  if (data.password !== trimmedPassword) return { error: '비밀번호가 일치하지 않습니다.' }

  const { error } = await supabase
    .from(MESSAGES_TABLE)
    .update({ text: trimmedText, from_name: trimmedName })
    .eq('id', id)
  if (error) return { error: '수정에 실패했습니다.' }

  revalidatePath(PAGE_PATH)
  return { success: true }
}

export async function deleteMessage(
  id: string,
  password: string
): Promise<{ error?: string; success?: boolean }> {
  if (!id || !password) return { error: '비밀번호를 입력해주세요.' }
  if (!/^\d{4}$/.test(password)) return { error: '비밀번호는 숫자 4자리입니다.' }

  const supabase = createSupabaseClient()
  const { data, error: fetchError } = await supabase
    .from(MESSAGES_TABLE)
    .select('password')
    .eq('id', id)
    .single()

  if (fetchError || !data) return { error: '메세지를 찾을 수 없습니다.' }
  if (data.password !== password) return { error: '비밀번호가 일치하지 않습니다.' }

  const { error } = await supabase.from(MESSAGES_TABLE).delete().eq('id', id)
  if (error) return { error: '삭제에 실패했습니다.' }

  revalidatePath(PAGE_PATH)
  return { success: true }
}

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
  if (!headcount || !/^\d+$/.test(headcount)) return { error: '총 인원을 숫자로 입력해주세요.' }
  if (!attendance) return { error: '참석 여부를 선택해주세요.' }
  if (!meal) return { error: '식사 여부를 선택해주세요.' }

  const supabase = createSupabaseClient()
  const { error } = await supabase.from(RSVP_TABLE).insert({
    side,
    name,
    phone,
    headcount: parseInt(headcount),
    attendance,
    meal,
  })

  if (error) return { error: '전송에 실패했습니다. 다시 시도해주세요.' }

  revalidatePath(PAGE_PATH)
  return { success: true }
}
