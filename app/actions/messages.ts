'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseClient, Message } from '@/lib/supabase'

export async function getMessages(): Promise<Message[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export type SubmitState = { error?: string; success?: boolean } | null

export async function submitMessage(
  prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const text = (formData.get('text') as string)?.trim()
  const from_name = (formData.get('from_name') as string)?.trim()

  if (!text || !from_name) return { error: '이름과 메세지를 모두 입력해주세요.' }
  if (text.length > 300) return { error: '메세지는 300자 이내로 입력해주세요.' }

  const supabase = createSupabaseClient()
  const { error } = await supabase.from('messages').insert({ text, from_name })

  if (error) return { error: '메세지 저장에 실패했습니다.' }

  revalidatePath('/')
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
    .from('messages')
    .select('password')
    .eq('id', id)
    .single()

  if (fetchError || !data) return { error: '메세지를 찾을 수 없습니다.' }
  if (data.password !== password) return { error: '비밀번호가 일치하지 않습니다.' }

  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) return { error: '삭제에 실패했습니다.' }

  revalidatePath('/')
  return { success: true }
}

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
  const { error } = await supabase.from('messages').insert({ text, from_name, password })

  if (error) return { error: '메세지 저장에 실패했습니다.' }

  revalidatePath('/')
  return { success: true }
}
