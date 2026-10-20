-- tokyo.exe sync setup: paste into Supabase → SQL Editor → New query → Run
-- Uses the same project, logins and members list as quest.exe, so there is nothing to edit.

create table if not exists public.tokyo_docs (
  id text primary key,
  kind text not null,
  data jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.tokyo_docs enable row level security;

drop policy if exists "members read" on public.tokyo_docs;
drop policy if exists "members add" on public.tokyo_docs;
drop policy if exists "members change" on public.tokyo_docs;
create policy "members read"   on public.tokyo_docs for select to authenticated using (public.is_member());
create policy "members add"    on public.tokyo_docs for insert to authenticated with check (public.is_member());
create policy "members change" on public.tokyo_docs for update to authenticated using (public.is_member()) with check (public.is_member());

drop trigger if exists docs_touch on public.tokyo_docs;
create trigger docs_touch before insert or update on public.tokyo_docs for each row execute function public.docs_touch();

do $$ begin
  alter publication supabase_realtime add table public.tokyo_docs;
exception when duplicate_object then null; end $$;
