-- =========================================================
-- Tailender — security: per-question guess rate limiting
-- Backs the spam cap in the `guess` Edge Function. Clients cannot read or
-- write this table (RLS on, no policies); only the service role touches it
-- through bump_guess_attempt().
-- =========================================================

create table if not exists public.guess_attempts (
  user_id  uuid not null references auth.users(id) on delete cascade,
  date     date not null,
  q_index  int  not null,
  attempts int  not null default 0,
  first_at   timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, date, q_index)
);

alter table public.guess_attempts enable row level security;  -- no policies → client-locked

-- Atomically increment and return the attempt count for (user, day, question).
create or replace function public.bump_guess_attempt(uid uuid, d date, qi int)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  insert into public.guess_attempts (user_id, date, q_index, attempts)
  values (uid, d, qi, 1)
  on conflict (user_id, date, q_index)
  do update set attempts = guess_attempts.attempts + 1, updated_at = now()
  returning attempts into n;
  return n;
end;
$$;

grant execute on function public.bump_guess_attempt(uuid, date, int) to service_role;
