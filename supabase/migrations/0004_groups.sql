-- =========================================================
-- Tailender — player grouping (Step 1: tables + group catalog)
--
-- A "group" is something a player belongs to:
--   * international : a nation + format (e.g. India / Test)
--   * ipl          : an IPL franchise (e.g. Chennai Super Kings)
--
-- player_groups is the membership join, with the seasons attached.
--   - For IPL groups, `years` = the exact seasons the player was in that squad.
--   - For international groups, `years` is left empty for now (we have format
--     membership but not per-player career years yet — a later data pass).
-- =========================================================

create table if not exists public.groups (
  id           text primary key,
  category     text not null check (category in ('international','ipl')),
  display_name text not null,
  nation       text,                       -- international only
  format       text check (format in ('Test','ODI','T20I')),  -- international only
  aka          text[] not null default '{}',   -- former names (helps name matching)
  active_years int[]  not null default '{}'     -- ipl: seasons the franchise ran
);

create table if not exists public.player_groups (
  player_id text not null references public.entities(id) on delete cascade,
  group_id  text not null references public.groups(id)   on delete cascade,
  years     int[] not null default '{}',
  primary key (player_id, group_id)
);
create index if not exists player_groups_group_idx on public.player_groups(group_id);

-- ---------- IPL franchises (renames folded into one franchise) ----------
insert into public.groups(id,category,display_name,aka,active_years) values
 ('ipl_csk','ipl','Chennai Super Kings','{}', '{2008,2009,2010,2011,2012,2013,2014,2015,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_mi','ipl','Mumbai Indians','{}', '{2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_rcb','ipl','Royal Challengers Bengaluru', '{"Royal Challengers Bangalore"}', '{2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_kkr','ipl','Kolkata Knight Riders','{}', '{2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_rr','ipl','Rajasthan Royals','{}', '{2008,2009,2010,2011,2012,2013,2014,2015,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_dc','ipl','Delhi Capitals', '{"Delhi Daredevils"}', '{2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_pbks','ipl','Punjab Kings', '{"Kings XI Punjab"}', '{2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_srh','ipl','Sunrisers Hyderabad','{}', '{2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025}'),
 ('ipl_deccan','ipl','Deccan Chargers','{}', '{2008,2009,2010,2011,2012}'),
 ('ipl_kochi','ipl','Kochi Tuskers Kerala','{}', '{2011}'),
 ('ipl_pwi','ipl','Pune Warriors India','{}', '{2011,2012,2013}'),
 ('ipl_gl','ipl','Gujarat Lions','{}', '{2016,2017}'),
 ('ipl_rps','ipl','Rising Pune Supergiant', '{"Rising Pune Supergiants"}', '{2016,2017}'),
 ('ipl_gt','ipl','Gujarat Titans','{}', '{2022,2023,2024,2025}'),
 ('ipl_lsg','ipl','Lucknow Super Giants','{}', '{2022,2023,2024,2025}')
on conflict (id) do update set display_name=excluded.display_name, aka=excluded.aka, active_years=excluded.active_years;

-- ---------- International groups (nation + format) ----------
-- 12 Full Members play all three formats; Netherlands & Scotland: ODI + T20I only.
insert into public.groups(id,category,display_name,nation,format) values
 ('intl_australia_test','international','Australia (Test)','Australia','Test'),
 ('intl_australia_odi','international','Australia (ODI)','Australia','ODI'),
 ('intl_australia_t20i','international','Australia (T20I)','Australia','T20I'),
 ('intl_england_test','international','England (Test)','England','Test'),
 ('intl_england_odi','international','England (ODI)','England','ODI'),
 ('intl_england_t20i','international','England (T20I)','England','T20I'),
 ('intl_india_test','international','India (Test)','India','Test'),
 ('intl_india_odi','international','India (ODI)','India','ODI'),
 ('intl_india_t20i','international','India (T20I)','India','T20I'),
 ('intl_pakistan_test','international','Pakistan (Test)','Pakistan','Test'),
 ('intl_pakistan_odi','international','Pakistan (ODI)','Pakistan','ODI'),
 ('intl_pakistan_t20i','international','Pakistan (T20I)','Pakistan','T20I'),
 ('intl_south_africa_test','international','South Africa (Test)','South Africa','Test'),
 ('intl_south_africa_odi','international','South Africa (ODI)','South Africa','ODI'),
 ('intl_south_africa_t20i','international','South Africa (T20I)','South Africa','T20I'),
 ('intl_new_zealand_test','international','New Zealand (Test)','New Zealand','Test'),
 ('intl_new_zealand_odi','international','New Zealand (ODI)','New Zealand','ODI'),
 ('intl_new_zealand_t20i','international','New Zealand (T20I)','New Zealand','T20I'),
 ('intl_sri_lanka_test','international','Sri Lanka (Test)','Sri Lanka','Test'),
 ('intl_sri_lanka_odi','international','Sri Lanka (ODI)','Sri Lanka','ODI'),
 ('intl_sri_lanka_t20i','international','Sri Lanka (T20I)','Sri Lanka','T20I'),
 ('intl_west_indies_test','international','West Indies (Test)','West Indies','Test'),
 ('intl_west_indies_odi','international','West Indies (ODI)','West Indies','ODI'),
 ('intl_west_indies_t20i','international','West Indies (T20I)','West Indies','T20I'),
 ('intl_bangladesh_test','international','Bangladesh (Test)','Bangladesh','Test'),
 ('intl_bangladesh_odi','international','Bangladesh (ODI)','Bangladesh','ODI'),
 ('intl_bangladesh_t20i','international','Bangladesh (T20I)','Bangladesh','T20I'),
 ('intl_zimbabwe_test','international','Zimbabwe (Test)','Zimbabwe','Test'),
 ('intl_zimbabwe_odi','international','Zimbabwe (ODI)','Zimbabwe','ODI'),
 ('intl_zimbabwe_t20i','international','Zimbabwe (T20I)','Zimbabwe','T20I'),
 ('intl_afghanistan_test','international','Afghanistan (Test)','Afghanistan','Test'),
 ('intl_afghanistan_odi','international','Afghanistan (ODI)','Afghanistan','ODI'),
 ('intl_afghanistan_t20i','international','Afghanistan (T20I)','Afghanistan','T20I'),
 ('intl_ireland_test','international','Ireland (Test)','Ireland','Test'),
 ('intl_ireland_odi','international','Ireland (ODI)','Ireland','ODI'),
 ('intl_ireland_t20i','international','Ireland (T20I)','Ireland','T20I'),
 ('intl_netherlands_odi','international','Netherlands (ODI)','Netherlands','ODI'),
 ('intl_netherlands_t20i','international','Netherlands (T20I)','Netherlands','T20I'),
 ('intl_scotland_odi','international','Scotland (ODI)','Scotland','ODI'),
 ('intl_scotland_t20i','international','Scotland (T20I)','Scotland','T20I')
on conflict (id) do update set display_name=excluded.display_name, nation=excluded.nation, format=excluded.format;
