begin;
insert into public.staff_access(email,role) values('registry-test-coordinator@example.invalid','Coordinator');
set local role anon;
do $$ begin
  begin
    if (select count(*) from public.maids)<>0 then raise exception 'Anonymous profile leak'; end if;
  exception when insufficient_privilege then null; end;
  begin
    insert into public.applications(id,payload) values('TEST-INVALID','{"id":"TEST-INVALID","status":"New","consent":true,"language":"English","services":["Cleaning"],"area":"Wakad"}');
    raise exception 'Incomplete application accepted';
  exception when check_violation then null; end;
  insert into public.applications(id,payload) values('TEST-APPLICATION','{"id":"TEST-APPLICATION","name":"Verification Test","phone":"9000000098","area":"Wakad","services":["Cleaning"],"language":"English","status":"New","consent":true}');
  begin
    if (select count(*) from public.applications)<>0 then raise exception 'Anonymous application leak'; end if;
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects(bucket_id,name) values('maid-photos','TEST-WORKER/anonymous.png');
    raise exception 'Anonymous image upload accepted';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000001","email":"outsider@example.invalid","role":"authenticated"}',true);
do $$ begin
  if (select count(*) from public.maids)<>0 then raise exception 'Non-staff profile leak'; end if;
  begin perform public.save_registry_changes('[]'); raise exception 'Non-staff write accepted'; exception when raise_exception then if sqlerrm<>'Staff access required' then raise; end if; end;
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000002","email":"registry-test-coordinator@example.invalid","role":"authenticated"}',true);
do $$ declare worker jsonb; begin
  insert into storage.objects(bucket_id,name) values('maid-photos','TEST-WORKER/photo.png');
  worker='{"id":"TEST-WORKER","name":"Verification Test","phone":"9000000098","area":"Wakad","services":["Cleaning"],"experience":3,"status":"Available","verification":"Pending","documents":[],"photoPath":"TEST-WORKER/photo.png"}';
  perform public.save_registry_changes(jsonb_build_array(jsonb_build_object('table','maids','before',null,'after',worker)));
  if not exists(select 1 from public.maids where id='TEST-WORKER') then raise exception 'Staff save failed'; end if;
  begin
    update public.maids set payload=jsonb_set(payload,'{verification}','"Verified"') where id='TEST-WORKER';
    raise exception 'Unreviewed verification accepted';
  exception when raise_exception then if sqlerrm<>'Review all required documents before verification' then raise; end if; end;
  begin
    update public.maids set payload=jsonb_set(payload,'{status}','"Archived"') where id='TEST-WORKER';
    raise exception 'Coordinator archive accepted';
  exception when raise_exception then if sqlerrm<>'Only admins can archive profiles' then raise; end if; end;
  begin
    perform public.save_registry_changes(jsonb_build_array(jsonb_build_object('table','maids','before',null,'after',worker)));
    raise exception 'Stale write accepted';
  exception when raise_exception then if sqlerrm<>'This record changed. Refresh and try again.' then raise; end if; end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000002","email":"registry-test-coordinator@example.invalid","role":"authenticated"}',true);
do $$ begin
  insert into storage.objects(bucket_id,name) values
    ('maid-documents','TEST-WORKER/identity.pdf'),
    ('maid-documents','TEST-WORKER/address.pdf'),
    ('maid-documents','TEST-WORKER/police.pdf');
  update public.maids set payload=payload || '{"verification":"Verified","documents":[{"name":"Identity proof","file":"identity.pdf","path":"TEST-WORKER/identity.pdf","reviewed":true},{"name":"Address proof","file":"address.pdf","path":"TEST-WORKER/address.pdf","reviewed":true},{"name":"Police verification","file":"police.pdf","path":"TEST-WORKER/police.pdf","reviewed":true}]}'::jsonb where id='TEST-WORKER';
  insert into public.households(id,payload) values('TEST-HOUSEHOLD','{"id":"TEST-HOUSEHOLD","name":"Verification household","phone":"9000000098","area":"Wakad","service":"Cleaning"}');
  insert into public.placements(id,payload) values('TEST-PLACEMENT','{"id":"TEST-PLACEMENT","workerId":"TEST-WORKER","householdId":"TEST-HOUSEHOLD","service":"Cleaning","days":"Mon, Tue, Wed, Thu, Fri","from":"09:00","to":"11:00","salary":"3000","start":"2026-10-15","status":"Active"}');
  begin
    insert into public.placements(id,payload) values('TEST-OVERLAP','{"id":"TEST-OVERLAP","workerId":"TEST-WORKER","householdId":"TEST-HOUSEHOLD","service":"Cleaning","days":"Mon, Tue","from":"10:00","to":"12:00","salary":"3000","start":"2026-10-15","status":"Active"}');
    raise exception 'Overlapping placement accepted';
  exception when raise_exception then if sqlerrm<>'This professional already has a placement during those hours' then raise; end if; end;
end $$;
reset role;
rollback;
select 'Registration, staff access, private storage, verification, archive permissions, stale writes and placement overlap checks passed; test changes rolled back.' as result;
