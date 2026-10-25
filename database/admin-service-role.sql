-- Allow registry writes from the Next.js admin API (Supabase service role, no Auth users).
create or replace function private.backend_request()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() ->> 'role') = 'service_role', false);
$$;

create or replace function public.save_registry_changes(changes jsonb, messages jsonb default '[]'::jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare item jsonb; tab text; row_id text; current_payload jsonb; message jsonb;
begin
  if not private.backend_request() and private.staff_role() is null then
    raise exception 'Staff access required';
  end if;
  if jsonb_typeof(changes) <> 'array' or jsonb_array_length(changes) > 50 then
    raise exception 'Invalid change request';
  end if;
  perform pg_advisory_xact_lock(771204663);
  for item in select value from jsonb_array_elements(changes) loop
    tab := item->>'table';
    row_id := item->'after'->>'id';
    if tab not in ('maids', 'households', 'applications', 'placements') or row_id is null then
      raise exception 'Invalid entity';
    end if;
    execute format('select payload from public.%I where id=$1 for update', tab)
      into current_payload using row_id;
    if current_payload is distinct from nullif(item->'before', 'null'::jsonb) then
      raise exception 'This record changed. Refresh and try again.';
    end if;
    execute format(
      'insert into public.%I(id,payload) values($1,$2) on conflict(id) do update set payload=excluded.payload',
      tab
    ) using row_id, item->'after';
  end loop;
  for message in select value from jsonb_array_elements(messages) loop
    insert into public.registry_activity(message) values (left(message #>> '{}', 300));
  end loop;
end;
$$;

create or replace function private.guard_record()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare kind text; path text;
begin
  new.updated_at := now();
  if tg_table_name = 'maids' then
    if new.payload->>'status' = 'Archived' then
      if not private.backend_request() and private.staff_role() <> 'Admin' then
        raise exception 'Only admins can archive profiles';
      end if;
      if exists (
        select 1 from public.placements
        where worker_id = new.id and payload->>'status' = 'Active'
      ) then
        raise exception 'End active placements before archiving';
      end if;
    end if;
    if new.payload->>'verification' = 'Verified' then
      foreach kind in array array['Identity proof', 'Address proof', 'Police verification'] loop
        if not exists (
          select 1 from jsonb_array_elements(new.payload->'documents') d
          where d->>'name' = kind and d->'reviewed' = 'true'::jsonb and length(d->>'path') > 0
        ) then
          raise exception 'Review all required documents before verification';
        end if;
      end loop;
    end if;
    for path in
      select value from (
        select new.payload->>'photoPath' as value
        union all
        select d->>'path' from jsonb_array_elements(new.payload->'documents') d
      ) paths
      where value is not null and value <> ''
    loop
      if split_part(path, '/', 1) <> new.id
        or not exists (
          select 1 from storage.objects
          where bucket_id in ('maid-photos', 'maid-documents') and name = path
        )
      then
        raise exception 'Uploaded file is missing or belongs to another profile';
      end if;
    end loop;
  elsif tg_table_name = 'placements' and new.payload->>'status' = 'Active' then
    perform pg_advisory_xact_lock(hashtextextended(new.payload->>'workerId', 0));
    if not exists (
      select 1 from public.maids
      where id = new.payload->>'workerId'
        and payload->>'verification' = 'Verified'
        and payload->>'status' not in ('On leave', 'Archived')
        and payload->'services' ? (new.payload->>'service')
    ) then
      raise exception 'Choose a verified, available professional with this skill';
    end if;
    if exists (
      select 1 from public.placements p
      where p.worker_id = new.payload->>'workerId'
        and p.id <> new.id
        and p.payload->>'status' = 'Active'
        and p.payload->>'from' < new.payload->>'to'
        and new.payload->>'from' < p.payload->>'to'
        and exists (
          select 1
          from unnest(string_to_array(p.payload->>'days', ',')) a
          join unnest(string_to_array(new.payload->>'days', ',')) b on btrim(a) = btrim(b)
        )
    ) then
      raise exception 'This professional already has a placement during those hours';
    end if;
  end if;
  return new;
end;
$$;
