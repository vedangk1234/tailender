-- Widen time columns to bigint (ms timestamps can exceed int4).
drop view if exists public.leaderboard_daily;
drop view if exists public.leaderboard_weekly;

alter table public.scorecards alter column time_ms type bigint;
alter table public.submissions alter column ms type bigint;

create or replace view public.leaderboard_daily as
select
  s.date, s.user_id, p.nickname,
  coalesce(us.equipped_mascot, 'default') as mascot,
  s.total, s.time_ms,
  rank() over (partition by s.date order by s.total desc, s.time_ms asc) as rank
from public.scorecards s
join public.profiles p on p.id = s.user_id
left join public.user_state us on us.user_id = s.user_id
where p.nickname is not null;

create or replace view public.leaderboard_weekly as
with wk as (
  select user_id, date_trunc('week', date)::date as week_start,
         sum(total) as total, sum(time_ms) as time_ms
  from public.scorecards group by user_id, date_trunc('week', date)
)
select
  wk.week_start, wk.user_id, p.nickname,
  coalesce(us.equipped_mascot, 'default') as mascot,
  wk.total, wk.time_ms,
  rank() over (partition by wk.week_start order by wk.total desc, wk.time_ms asc) as rank
from wk
join public.profiles p on p.id = wk.user_id
left join public.user_state us on us.user_id = wk.user_id
where p.nickname is not null;

grant select on public.leaderboard_daily  to anon, authenticated;
grant select on public.leaderboard_weekly to anon, authenticated;

-- Clean the orphan rows from the failed insert (today IST).
delete from public.daily_stats where date = (now() + interval '5 hours 30 minutes')::date;
update public.user_state set last_played_date = null, current_streak = 0
  where last_played_date = (now() + interval '5 hours 30 minutes')::date;
