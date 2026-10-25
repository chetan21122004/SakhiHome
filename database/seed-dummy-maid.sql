-- Full demo maid for testing field, admin, and share links.
-- Id: DEMO-TEST-MAID (safe to re-run: upserts payload)
insert into storage.objects (bucket_id, name)
values
  ('maid-photos', 'DEMO-TEST-MAID/photo.png'),
  ('maid-documents', 'DEMO-TEST-MAID/aadhaar-demo.png'),
  ('maid-documents', 'DEMO-TEST-MAID/address-demo.png'),
  ('maid-documents', 'DEMO-TEST-MAID/police-demo.png'),
  ('maid-documents', 'DEMO-TEST-MAID/reference-demo.png'),
  ('maid-documents', 'DEMO-TEST-MAID/experience-demo.png')
on conflict do nothing;

insert into public.maids (id, payload)
values (
  'DEMO-TEST-MAID',
  '{
    "id": "DEMO-TEST-MAID",
    "name": "Priya Sharma (Demo)",
    "phone": "9876543210",
    "area": "Hinjewadi Phase 3",
    "services": ["Cleaning", "Cooking", "Childcare"],
    "experience": 8,
    "salary": "14000",
    "languages": "Marathi, Hindi, basic English",
    "schedule": "7:00 AM – 4:00 PM, Mon–Sat",
    "status": "Available",
    "verification": "Verified",
    "address": "Flat 204, Wing B, Sample Society, Wakad, Pune 411057",
    "maritalStatus": "Married",
    "guardian": "Raj Sharma (husband) · 9876543211",
    "dependants": "2",
    "emergency": "Raj Sharma · 9876543211",
    "notes": "INTERNAL: Demo profile for testing share links and field UI. Not a real person.",
    "photoPath": "DEMO-TEST-MAID/photo.png",
    "documents": [
      {"id": "demo-doc-identity", "name": "Identity proof", "file": "aadhaar-demo.png", "path": "DEMO-TEST-MAID/aadhaar-demo.png", "reviewed": true},
      {"id": "demo-doc-address", "name": "Address proof", "file": "address-demo.png", "path": "DEMO-TEST-MAID/address-demo.png", "reviewed": true},
      {"id": "demo-doc-police", "name": "Police verification", "file": "police-demo.png", "path": "DEMO-TEST-MAID/police-demo.png", "reviewed": true},
      {"id": "demo-doc-ref", "name": "Reference letter", "note": "Previous employer in Blue Ridge", "file": "reference-demo.png", "path": "DEMO-TEST-MAID/reference-demo.png", "reviewed": false},
      {"id": "demo-doc-exp", "name": "Experience certificate", "note": "5 years cooking", "file": "experience-demo.png", "path": "DEMO-TEST-MAID/experience-demo.png", "reviewed": false}
    ]
  }'::jsonb
)
on conflict (id) do update set
  payload = excluded.payload,
  updated_at = now();

-- Share links (requires maid_share_links table)
insert into public.maid_share_links (
  maid_id,
  teaser_token,
  full_token,
  created_by,
  expires_at,
  revoked_at
)
values (
  'DEMO-TEST-MAID',
  encode(gen_random_bytes(32), 'hex'),
  encode(gen_random_bytes(32), 'hex'),
  'seed-dummy-maid.sql',
  now() + interval '90 days',
  null
)
on conflict (maid_id) do update set
  teaser_token = encode(gen_random_bytes(32), 'hex'),
  full_token = encode(gen_random_bytes(32), 'hex'),
  expires_at = now() + interval '90 days',
  revoked_at = null,
  created_at = now();
