-- =========================================================
-- Tailender — "Stadiums" group. Puts every venue entity into one
-- "stadium" grouping (parallel to the nation / IPL-franchise groups),
-- independent of IPL.
-- =========================================================

-- Allow a 'stadium' category on groups.
alter table public.groups drop constraint if exists groups_category_check;
alter table public.groups
  add constraint groups_category_check check (category in ('international','ipl','stadium'));

-- The group.
insert into public.groups(id, category, display_name)
values ('stadiums', 'stadium', 'Stadiums')
on conflict (id) do update set display_name = excluded.display_name, category = excluded.category;

-- Every venue entity belongs to it.
insert into public.player_groups(player_id, group_id, years)
select id, 'stadiums', '{}'
from public.entities
where kind = 'venue'
on conflict (player_id, group_id) do nothing;
