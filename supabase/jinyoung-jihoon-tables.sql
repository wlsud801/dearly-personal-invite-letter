-- ---------------------------------------------------------------------------
-- 진영·지훈 청첩장 전용 테이블 (혜빈·재환의 messages / rsvp 테이블과 분리)
-- Supabase 대시보드 → SQL Editor 에서 "전체를 한 번에" 실행 (여러 번 실행해도 안전)
-- 기존 테이블과 동일한 신뢰 모델: anon 키로 읽기/쓰기, 비밀번호 검증은 서버 액션에서 수행
-- ---------------------------------------------------------------------------

-- 방명록 -----------------------------------------------------------------

create table if not exists public.jinyoung_jihoon_messages (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  from_name text not null,
  password text,
  created_at timestamptz not null default now()
);

-- 테이블을 Table Editor 로 먼저 만든 경우를 대비해 누락 컬럼 보강
alter table public.jinyoung_jihoon_messages
  add column if not exists text text,
  add column if not exists from_name text,
  add column if not exists password text,
  add column if not exists created_at timestamptz not null default now();

alter table public.jinyoung_jihoon_messages enable row level security;

drop policy if exists "anon select" on public.jinyoung_jihoon_messages;
create policy "anon select" on public.jinyoung_jihoon_messages
  for select using (true);

drop policy if exists "anon insert" on public.jinyoung_jihoon_messages;
create policy "anon insert" on public.jinyoung_jihoon_messages
  for insert with check (true);

drop policy if exists "anon delete" on public.jinyoung_jihoon_messages;
create policy "anon delete" on public.jinyoung_jihoon_messages
  for delete using (true);

-- RSVP -------------------------------------------------------------------

create table if not exists public.jinyoung_jihoon_rsvp (
  id uuid primary key default gen_random_uuid(),
  side text not null,
  name text not null,
  phone text not null,
  headcount int not null,
  attendance text not null,
  meal text not null,
  created_at timestamptz not null default now()
);

alter table public.jinyoung_jihoon_rsvp enable row level security;

drop policy if exists "anon insert" on public.jinyoung_jihoon_rsvp;
create policy "anon insert" on public.jinyoung_jihoon_rsvp
  for insert with check (true);
