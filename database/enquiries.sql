-- Customer enquiries from the public website (staff-only read).
create table public.enquiries (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (payload->>'id' = id and length(id) <= 80),
  check (length(btrim(payload->>'name')) between 1 and 150),
  check (length(regexp_replace(payload->>'phone', '[^0-9]', '', 'g')) between 10 and 13),
  check (payload->>'status' in ('New', 'Contacted', 'Closed')),
  check (octet_length(payload::text) < 5000)
);
alter table public.enquiries enable row level security;
grant insert on public.enquiries to anon;
create policy public_enquiry_insert on public.enquiries for insert to anon with check (
  payload->>'status' = 'New'
  and (payload - array['id', 'name', 'phone', 'area', 'service', 'budget', 'startTime', 'endTime', 'message', 'status']) = '{}'::jsonb
);
grant select, update on public.enquiries to authenticated;
create policy staff_enquiries_select on public.enquiries for select to authenticated using ((select private.staff_role()) is not null);
create policy staff_enquiries_update on public.enquiries for update to authenticated using ((select private.staff_role()) is not null) with check ((select private.staff_role()) is not null);
