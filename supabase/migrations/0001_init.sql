-- =========================================================
-- Tailender — core schema (v1)
-- Clients are READ-ONLY (via RLS). All game writes go through
-- Edge Functions using the service role. Answer data is never
-- exposed to the client.
-- =========================================================

-- ---------- Identity / player state ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique,
  display_name text,
  avatar_url text,
  is_guest boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  equipped_mascot text not null default 'default',
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_played_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.mascots_unlocked (
  user_id uuid not null references auth.users(id) on delete cascade,
  mascot_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, mascot_id)
);

create table if not exists public.trophies (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,            -- 'orange_cap','purple_cap',...
  period text not null,          -- IST date or ISO week key
  created_at timestamptz not null default now(),
  unique (user_id, kind, period)
);

-- ---------- Content (server-only; no client RLS policies) ----------
create table if not exists public.entities (
  id text primary key,
  canonical text not null,
  aliases text[] not null default '{}',
  kind text not null default 'player'
);

create table if not exists public.questions (
  id text primary key,
  prompt text not null,
  category text not null default ''
);

create table if not exists public.question_answers (
  question_id text not null references public.questions(id) on delete cascade,
  entity_id text not null references public.entities(id) on delete cascade,
  tier text not null,
  primary key (question_id, entity_id)
);

create table if not exists public.daily_sets (
  date date primary key,
  puzzle_number int not null,
  question_ids text[] not null
);

-- ---------- Play records ----------
create table if not exists public.submissions (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  q_index int not null,
  entity_id text,
  display text,
  tier text not null,
  points int not null default 0,
  ms int,
  created_at timestamptz not null default now(),
  primary key (user_id, date, q_index)
);

create table if not exists public.scorecards (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  total int not null,
  time_ms int not null default 0,
  items jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, date)
);

create table if not exists public.daily_stats (
  date date primary key,
  plays_count int not null default 0,
  top_score int not null default 0
);

create index if not exists scorecards_date_idx on public.scorecards (date, total desc, time_ms asc);

-- ---------- Row-Level Security ----------
alter table public.profiles          enable row level security;
alter table public.user_state        enable row level security;
alter table public.mascots_unlocked  enable row level security;
alter table public.trophies          enable row level security;
alter table public.scorecards        enable row level security;
alter table public.submissions       enable row level security;
alter table public.daily_stats       enable row level security;
-- content tables: RLS on, no policies => clients cannot read them
alter table public.entities          enable row level security;
alter table public.questions         enable row level security;
alter table public.question_answers  enable row level security;
alter table public.daily_sets        enable row level security;

drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles for select using (true);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "user_state_read_own" on public.user_state;
create policy "user_state_read_own" on public.user_state for select using (auth.uid() = user_id);

drop policy if exists "mascots_read_own" on public.mascots_unlocked;
create policy "mascots_read_own" on public.mascots_unlocked for select using (auth.uid() = user_id);

drop policy if exists "trophies_read" on public.trophies;
create policy "trophies_read" on public.trophies for select using (true);

drop policy if exists "scorecards_read_own" on public.scorecards;
create policy "scorecards_read_own" on public.scorecards for select using (auth.uid() = user_id);

drop policy if exists "submissions_read_own" on public.submissions;
create policy "submissions_read_own" on public.submissions for select using (auth.uid() = user_id);

drop policy if exists "daily_stats_read" on public.daily_stats;
create policy "daily_stats_read" on public.daily_stats for select using (true);

-- ---------- Leaderboard views (owner-rights; expose only safe columns) ----------
create or replace view public.leaderboard_daily as
select
  s.date,
  s.user_id,
  p.nickname,
  coalesce(us.equipped_mascot, 'default') as mascot,
  s.total,
  s.time_ms,
  rank() over (partition by s.date order by s.total desc, s.time_ms asc) as rank
from public.scorecards s
join public.profiles p on p.id = s.user_id
left join public.user_state us on us.user_id = s.user_id
where p.nickname is not null;

create or replace view public.leaderboard_weekly as
with wk as (
  select user_id,
         date_trunc('week', date)::date as week_start,
         sum(total) as total,
         sum(time_ms) as time_ms
  from public.scorecards
  group by user_id, date_trunc('week', date)
)
select
  wk.week_start,
  wk.user_id,
  p.nickname,
  coalesce(us.equipped_mascot, 'default') as mascot,
  wk.total,
  wk.time_ms,
  rank() over (partition by wk.week_start order by wk.total desc, wk.time_ms asc) as rank
from wk
join public.profiles p on p.id = wk.user_id
left join public.user_state us on us.user_id = wk.user_id
where p.nickname is not null;

grant select on public.leaderboard_daily  to anon, authenticated;
grant select on public.leaderboard_weekly to anon, authenticated;

-- ---------- Auto-provision profile + state on new auth user ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, is_guest)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.is_anonymous)::boolean, true)
  )
  on conflict (id) do nothing;

  insert into public.user_state (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.mascots_unlocked (user_id, mascot_id)
  values (new.id, 'default')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
