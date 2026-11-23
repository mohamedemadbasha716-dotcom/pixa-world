-- DRAFT ONLY. Additive English storage. Apply only after scoped approval and rehearsal.
begin;
create table public.english_adventure_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id text not null check (lesson_id in ('hello','numbers','family','colours','body')),
 completed boolean not null default false,
 best_score integer not null default 0 check(best_score between 0 and 10),
 updated_at timestamptz not null default now(), primary key(user_id,lesson_id)
);
create table public.english_adventure_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id text not null check (lesson_id in ('hello','numbers','family','colours','body')),
 state jsonb not null, revision integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index english_adventure_attempts_user on public.english_adventure_attempts(user_id);
alter table public.english_adventure_progress enable row level security;
alter table public.english_adventure_attempts enable row level security;
revoke all on public.english_adventure_progress,public.english_adventure_attempts from anon,authenticated;
grant select on public.english_adventure_progress to authenticated;
create policy english_own_progress on public.english_adventure_progress for select to authenticated using ((select auth.uid())=user_id);
grant all on public.english_adventure_progress,public.english_adventure_attempts to service_role;
create function public.english_adventure_save_answer(p_attempt uuid,p_user uuid,p_revision integer,p_state jsonb,p_completed boolean,p_lesson text,p_score integer)
returns void language plpgsql set search_path='' as $$
begin
 update public.english_adventure_attempts set state=p_state,revision=revision+1,updated_at=now()
 where id=p_attempt and user_id=p_user and revision=p_revision and lesson_id=p_lesson;
 if not found then raise exception 'conflict'; end if;
 if p_completed then
  insert into public.english_adventure_progress(user_id,lesson_id,completed,best_score) values(p_user,p_lesson,true,p_score)
  on conflict(user_id,lesson_id) do update set completed=true,best_score=greatest(english_adventure_progress.best_score,excluded.best_score),updated_at=now();
 end if;
end;$$;
revoke all on function public.english_adventure_save_answer(uuid,uuid,integer,jsonb,boolean,text,integer) from public,anon,authenticated;
grant execute on function public.english_adventure_save_answer(uuid,uuid,integer,jsonb,boolean,text,integer) to service_role;
commit;
-- Safe rollback: remove the application entry point and revoke API access, retain tables/data.
-- No shared tables/policies changed. No user roles granted. No new audience.
