-- Simple admin login: email + password stored on staff_access (no Supabase Auth).
alter table public.staff_access
  add column if not exists password text not null default '';

update public.staff_access
set password = '123456'
where email = 'chetan44rt@gmail.com';
