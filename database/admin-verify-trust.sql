-- Staff API (service role) may mark profiles Verified without uploaded docs.
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
    if new.payload->>'verification' = 'Verified'
      and not private.backend_request() then
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
