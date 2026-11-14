-- Esquema do diário/planner por data.
-- Rode uma vez em: Supabase → SQL Editor → New query → Run.

create table if not exists public.entries (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  date       date        not null,
  intention  text        not null default '',
  tasks      jsonb       not null default '[]'::jsonb,
  journal    text        not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- Cada pessoa enxerga e altera apenas as próprias linhas.
alter table public.entries enable row level security;

drop policy if exists "entries_select_own" on public.entries;
drop policy if exists "entries_insert_own" on public.entries;
drop policy if exists "entries_update_own" on public.entries;
drop policy if exists "entries_delete_own" on public.entries;

create policy "entries_select_own" on public.entries
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "entries_insert_own" on public.entries
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "entries_update_own" on public.entries
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "entries_delete_own" on public.entries
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Visitantes sem login não têm nenhum acesso à tabela.
revoke all on public.entries from anon;
grant select, insert, update, delete on public.entries to authenticated;
