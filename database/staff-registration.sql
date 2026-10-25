-- Allow sign-up only for emails pre-approved in staff_access (no public admin registration).
create or replace function public.staff_registration_allowed(target_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_access
    where email = lower(trim(target_email))
      and enabled
  );
$$;
revoke all on function public.staff_registration_allowed(text) from public;
grant execute on function public.staff_registration_allowed(text) to anon, authenticated;

-- Only the bootstrap admin email may be stored with role Admin.
drop policy if exists staff_add on public.staff_access;
create policy staff_add on public.staff_access for insert to authenticated
  with check (
    (select private.staff_role()) = 'Admin'
    and (
      role = 'Coordinator'
      or (role = 'Admin' and email = 'chetan44rt@gmail.com')
    )
  );
