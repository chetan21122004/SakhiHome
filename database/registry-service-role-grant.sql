-- Registry writes from Next.js admin API (Supabase service role JWT).
-- Requires database/admin-service-role.sql (backend_request + save_registry_changes).

grant usage on schema private to service_role;
grant execute on function private.backend_request() to service_role;
grant execute on function private.staff_role() to service_role;

grant execute on function public.save_registry_changes(jsonb, jsonb) to service_role;

grant select, insert, update on public.maids to service_role;
grant select, insert, update on public.households to service_role;
grant select, insert, update on public.applications to service_role;
grant select, insert, update on public.placements to service_role;
grant select, insert on public.registry_activity to service_role;
