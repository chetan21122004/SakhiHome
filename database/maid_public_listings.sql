-- Privacy-safe public maid listings (verified + available only).
create or replace view public.maid_public_listings as
select
  m.id,
  case
    when position(' ' in btrim(m.payload->>'name')) > 0 then
      split_part(btrim(m.payload->>'name'), ' ', 1) || ' ' || left(split_part(btrim(m.payload->>'name'), ' ', 2), 1) || '.'
    else btrim(m.payload->>'name')
  end as display_name,
  m.payload->>'area' as area,
  m.payload->'services' as services,
  (m.payload->>'experience')::numeric as experience,
  coalesce(m.payload->>'languages', '') as languages,
  coalesce(m.payload->>'schedule', '') as schedule
from public.maids m
where m.payload->>'status' = 'Available'
  and m.payload->>'verification' = 'Verified';

-- Public access revoked; see database/maid_share_links.sql
-- grant select on public.maid_public_listings to anon, authenticated;
