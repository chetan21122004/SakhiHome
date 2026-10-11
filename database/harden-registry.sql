alter table public.maids add constraint maid_required_fields check (payload ?& array['id','name','phone','area','services','experience','status','verification','documents']);
alter table public.households add constraint household_required_fields check (payload ?& array['id','name','phone','area','service']);
alter table public.applications add constraint application_required_fields check (payload ?& array['id','name','phone','area','services','language','status','consent']);
alter table public.placements add constraint placement_required_fields check (payload ?& array['id','workerId','householdId','service','days','from','to','salary','start','status']);
alter table public.maids add constraint maid_services check ((payload->'services') <@ '["Cleaning","Cooking","Childcare","Elder care","Full-time help"]'::jsonb);
alter table public.applications add constraint application_services check ((payload->'services') <@ '["Cleaning","Cooking","Childcare","Elder care","Full-time help"]'::jsonb);
alter table public.placements add constraint placement_days check ((string_to_array(replace(payload->>'days',' ',''),',')) <@ array['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] and length(payload->>'days')>0);
alter policy staff_edit on public.staff_access with check ((select private.staff_role())='Admin' and (email<>lower(auth.jwt()->>'email') or (enabled and role='Admin')));

create unique index maids_application_unique on public.maids ((payload->>'applicationId')) where payload->>'applicationId' is not null;
