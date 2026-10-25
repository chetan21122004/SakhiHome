-- Simple admin login: email + password on staff_access (no Supabase Auth).
-- Run this entire file in Supabase → SQL Editor.

alter table public.staff_access
  add column if not exists password text not null default '';

insert into public.staff_access (email, role, enabled, password)
values ('chetan44rt@gmail.com', 'Admin', true, '123456')
on conflict (email) do update
set password = excluded.password,
    role = excluded.role,
    enabled = true;
