-- SakhiHome registry. All records and file contents are staff-only.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.staff_access (
  email text primary key check (email = lower(email) and email ~ '^[^@ ]+@[^@ ]+\.[^@ ]+$'),
  role text not null check (role in ('Admin','Coordinator')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.staff_access enable row level security;
create function private.staff_role() returns text language sql stable security definer set search_path = '' as $$
  select role from public.staff_access where auth.uid() is not null and email=lower(auth.jwt()->>'email') and enabled;
$$;
revoke all on function private.staff_role() from public,anon;
grant execute on function private.staff_role() to authenticated;
create policy staff_read on public.staff_access for select to authenticated using (email=lower(auth.jwt()->>'email') or (select private.staff_role())='Admin');
create policy staff_add on public.staff_access for insert to authenticated with check ((select private.staff_role())='Admin');
create policy staff_edit on public.staff_access for update to authenticated using ((select private.staff_role())='Admin') with check ((select private.staff_role())='Admin');
grant select,insert,update on public.staff_access to authenticated;

create table public.maids (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  check (payload->>'id'=id and length(id) <= 80),
  check (length(btrim(payload->>'name')) between 1 and 150 and length(payload->>'phone') between 10 and 20),
  check (payload->>'status' in ('Available','Placed','On leave','Archived')),
  check (payload->>'verification' in ('Pending','Verified')),
  check (jsonb_typeof(payload->'services')='array' and jsonb_array_length(payload->'services') between 1 and 5),
  check (jsonb_typeof(payload->'documents')='array'),
  check ((payload->>'experience')::numeric between 0 and 60),
  check (octet_length(payload::text)<30000)
);
create table public.households (
  id text primary key, payload jsonb not null, updated_at timestamptz not null default now(),
  check (payload->>'id'=id and length(id)<=80),
  check (length(btrim(payload->>'name')) between 1 and 150 and length(payload->>'phone') between 10 and 20),
  check (octet_length(payload::text)<10000)
);
create table public.applications (
  id text primary key, payload jsonb not null, updated_at timestamptz not null default now(),
  check (payload->>'id'=id and length(id)<=80),
  check (length(btrim(payload->>'name')) between 1 and 150),
  check (length(regexp_replace(payload->>'phone','[^0-9]','','g')) between 10 and 13),
  check (length(payload->>'area') between 1 and 100),
  check (payload->>'language' in ('English','Hindi','Marathi')),
  check (payload->>'status' in ('New','Approved','Declined')),
  check (payload->'consent' = 'true'::jsonb),
  check (jsonb_typeof(payload->'services')='array' and jsonb_array_length(payload->'services') between 1 and 5),
  check (length(coalesce(payload->>'schedule',''))<=200),
  check (octet_length(payload::text)<2000)
);
create unique index one_pending_application_per_phone on public.applications ((regexp_replace(payload->>'phone','[^0-9]','','g'))) where payload->>'status'='New';
create table public.placements (
  id text primary key, payload jsonb not null,
  worker_id text generated always as (payload->>'workerId') stored references public.maids(id),
  household_id text generated always as (payload->>'householdId') stored references public.households(id),
  updated_at timestamptz not null default now(),
  check (payload->>'id'=id and length(id)<=80),
  check (payload->>'status' in ('Active','Ended')),
  check (payload->>'from' ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' and payload->>'to' ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' and payload->>'from' < payload->>'to'),
  check ((payload->>'salary')::numeric>0),
  check ((payload->>'start')::date is not null),
  check (octet_length(payload::text)<5000)
);
create index placements_worker_idx on public.placements(worker_id);
create index placements_household_idx on public.placements(household_id);
create index maids_area_idx on public.maids((payload->>'area'));
create index maids_status_idx on public.maids((payload->>'status'));
create table public.registry_activity (
  id bigint generated always as identity primary key,
  message text not null,
  actor uuid default auth.uid(),
  created_at timestamptz not null default now()
);
do $$ declare tab text; begin
  foreach tab in array array['maids','households','applications','placements','registry_activity'] loop
    execute format('alter table public.%I enable row level security',tab);
    execute format('create policy staff_select on public.%I for select to authenticated using ((select private.staff_role()) is not null)',tab);
    execute format('create policy staff_insert on public.%I for insert to authenticated with check ((select private.staff_role()) is not null)',tab);
    if tab <> 'registry_activity' then
      execute format('create policy staff_update on public.%I for update to authenticated using ((select private.staff_role()) is not null) with check ((select private.staff_role()) is not null)',tab);
    end if;
    execute format('grant select,insert,update on public.%I to authenticated',tab);
  end loop;
end $$;
grant usage,select on sequence public.registry_activity_id_seq to authenticated;
grant insert on public.applications to anon;
create policy public_apply on public.applications for insert to anon with check (
  payload->>'status'='New' and payload->'consent'='true'::jsonb and
  (payload - array['id','name','phone','area','services','language','schedule','status','consent'])='{}'::jsonb
);

create function private.guard_record() returns trigger language plpgsql security invoker set search_path='' as $$
declare doc jsonb; kind text; path text;
begin
  new.updated_at=now();
  if tg_table_name='maids' then
    if new.payload->>'status'='Archived' then
      if private.staff_role()<>'Admin' then raise exception 'Only admins can archive profiles'; end if;
      if exists(select 1 from public.placements where worker_id=new.id and payload->>'status'='Active') then raise exception 'End active placements before archiving'; end if;
    end if;
    if new.payload->>'verification'='Verified' then
      foreach kind in array array['Identity proof','Address proof','Police verification'] loop
        if not exists(select 1 from jsonb_array_elements(new.payload->'documents') d where d->>'name'=kind and d->'reviewed'='true'::jsonb and length(d->>'path')>0) then raise exception 'Review all required documents before verification'; end if;
      end loop;
    end if;
    for path in select value from (select new.payload->>'photoPath' as value union all select d->>'path' from jsonb_array_elements(new.payload->'documents') d) paths where value is not null and value<>'' loop
      if split_part(path,'/',1)<>new.id or not exists(select 1 from storage.objects where bucket_id in ('maid-photos','maid-documents') and name=path) then raise exception 'Uploaded file is missing or belongs to another profile'; end if;
    end loop;
  elsif tg_table_name='placements' and new.payload->>'status'='Active' then
    perform pg_advisory_xact_lock(hashtextextended(new.payload->>'workerId',0));
    if not exists(select 1 from public.maids where id=new.payload->>'workerId' and payload->>'verification'='Verified' and payload->>'status' not in ('On leave','Archived') and payload->'services' ? (new.payload->>'service')) then raise exception 'Choose a verified, available professional with this skill'; end if;
    if exists(select 1 from public.placements p where p.worker_id=new.payload->>'workerId' and p.id<>new.id and p.payload->>'status'='Active' and p.payload->>'from'<new.payload->>'to' and new.payload->>'from'<p.payload->>'to' and exists(select 1 from unnest(string_to_array(p.payload->>'days',',')) a join unnest(string_to_array(new.payload->>'days',',')) b on btrim(a)=btrim(b))) then raise exception 'This professional already has a placement during those hours'; end if;
  end if;
  return new;
end $$;
revoke all on function private.guard_record() from public,anon;
do $$ declare tab text; begin
  foreach tab in array array['maids','households','applications','placements'] loop
    execute format('create trigger guard_record before insert or update on public.%I for each row execute function private.guard_record()',tab);
  end loop;
end $$;

create function public.save_registry_changes(changes jsonb, messages jsonb default '[]'::jsonb) returns void language plpgsql security invoker set search_path='' as $$
declare item jsonb; tab text; row_id text; current_payload jsonb; found_row boolean; message jsonb;
begin
  if private.staff_role() is null then raise exception 'Staff access required'; end if;
  if jsonb_typeof(changes)<>'array' or jsonb_array_length(changes)>50 then raise exception 'Invalid change request'; end if;
  perform pg_advisory_xact_lock(771204663);
  for item in select value from jsonb_array_elements(changes) loop
    tab=item->>'table'; row_id=item->'after'->>'id';
    if tab not in ('maids','households','applications','placements') or row_id is null then raise exception 'Invalid entity'; end if;
    execute format('select payload from public.%I where id=$1 for update',tab) into current_payload using row_id;
    if current_payload is distinct from nullif(item->'before','null'::jsonb) then raise exception 'This record changed. Refresh and try again.'; end if;
    execute format('insert into public.%I(id,payload) values($1,$2) on conflict(id) do update set payload=excluded.payload',tab) using row_id,item->'after';
  end loop;
  for message in select value from jsonb_array_elements(messages) loop
    insert into public.registry_activity(message) values(left(message #>> '{}',300));
  end loop;
end $$;
revoke all on function public.save_registry_changes(jsonb,jsonb) from public,anon;
grant execute on function public.save_registry_changes(jsonb,jsonb) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('maid-photos','maid-photos',false,5242880,array['image/jpeg','image/png','image/webp']),
 ('maid-documents','maid-documents',false,10485760,array['image/jpeg','image/png','image/webp','application/pdf']);
create policy staff_files_read on storage.objects for select to authenticated using (bucket_id in ('maid-photos','maid-documents') and (select private.staff_role()) is not null);
create policy staff_files_upload on storage.objects for insert to authenticated with check (bucket_id in ('maid-photos','maid-documents') and (select private.staff_role()) is not null);
create policy staff_files_delete on storage.objects for delete to authenticated using (bucket_id in ('maid-photos','maid-documents') and (select private.staff_role()) is not null);

insert into public.staff_access(email,role) values('chetan44rt@gmail.com','Admin');
