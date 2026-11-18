-- =========================================================
-- Tailender — daily rollover (puzzle rotation)
--
-- Deterministically picks 5 questions for each IST day and
-- persists them in `daily_sets`. Runs three ways, all safe to
-- repeat:
--   1. pg_cron at 00:00 IST (18:30 UTC) — the normal path.
--   2. On-demand from the `daily` Edge Function (first visitor
--      of the day triggers build_daily_set via RPC) — so the
--      game still rotates even if pg_cron is unavailable.
--   3. Backfilled once when this migration is applied.
--
-- Puzzle #1 == 2026-11-01 IST, matching _shared/game.ts EPOCH.
-- =========================================================

-- Build (idempotently) the daily set for one IST date.
create or replace function public.build_daily_set(d date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  p   int;
  n   int;
  off int;
  ids text[];
begin
  -- Already built for this day → nothing to do.
  if exists (select 1 from daily_sets where date = d) then
    return;
  end if;

  p := (d - date '2026-11-01') + 1;            -- puzzle number (1-based)

  select count(*) into n from questions;
  if n = 0 then
    return;                                    -- no content yet
  end if;

  off := ((p - 1) * 5) % n;                    -- rotating window start

  -- Take the 5 questions whose rotated position is 0..4, in order.
  with ordered as (
    select id, (row_number() over (order by id) - 1) as rn
    from questions
  )
  select array_agg(id order by pos)
    into ids
  from (
    select id, ((rn - off + n) % n) as pos
    from ordered
  ) s
  where pos < 5;

  insert into daily_sets (date, puzzle_number, question_ids)
  values (d, p, ids)
  on conflict (date) do nothing;
end;
$$;

-- Build today (IST) and pre-build tomorrow.
create or replace function public.roll_daily()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  today date;
begin
  today := ((now() at time zone 'UTC') + interval '5 hours 30 minutes')::date;
  perform public.build_daily_set(today);
  perform public.build_daily_set(today + 1);
end;
$$;

-- Edge Functions use the service role; let it call the builder via RPC.
grant execute on function public.build_daily_set(date) to service_role;
grant execute on function public.roll_daily()         to service_role;

-- ---------- Schedule via pg_cron (optional / best-effort) ----------
-- pg_cron may need enabling first (Supabase: Database → Extensions → pg_cron,
-- or the statement below). If it isn't available (e.g. local dev), the
-- on-demand RPC path keeps the game working, so we swallow any error.
do $$
begin
  create extension if not exists pg_cron;

  -- Re-running the migration shouldn't duplicate the job.
  begin
    perform cron.unschedule('tailender-daily-rollover');
  exception when others then
    null;
  end;

  perform cron.schedule(
    'tailender-daily-rollover',
    '30 18 * * *',                 -- 18:30 UTC == 00:00 IST, daily
    $cron$ select public.roll_daily(); $cron$
  );
exception when others then
  raise notice 'pg_cron not scheduled (%). On-demand rollover still active.', sqlerrm;
end;
$$;

-- Backfill today + tomorrow right now.
select public.roll_daily();
