-- Client CRM + per-client maid profile grants (no public anonymous access).
create table if not exists public.clients (
  id text primary key,
  name text not null,
  phone text not null,
  phone_normalized text not null,
  area text not null default '',
  service text not null default '',
  message text not null default '',
  source text not null check (source in ('enquiry', 'manual')),
  enquiry_id text references public.enquiries (id) on delete set null,
  status text not null default 'lead' check (status in ('lead', 'active', 'closed')),
  portal_token text not null unique,
  portal_enabled boolean not null default false,
  serious_client boolean not null default false,
  access_pin_hash text not null default '',
  pin_rotated_at timestamptz,
  staff_last_touched_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(id) <= 80),
  check (length(phone_normalized) between 10 and 13)
);

create unique index if not exists clients_phone_normalized_idx
  on public.clients (phone_normalized);

create index if not exists clients_status_idx on public.clients (status);
create index if not exists clients_portal_token_idx on public.clients (portal_token);

create table if not exists public.client_profile_grants (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.clients (id) on delete restrict,
  maid_id text not null references public.maids (id) on delete restrict,
  access_level text not null default 'teaser' check (access_level in ('teaser', 'full')),
  granted_by text,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists client_grants_client_idx on public.client_profile_grants (client_id);
create index if not exists client_grants_maid_idx on public.client_profile_grants (maid_id);

create unique index if not exists client_grants_active_unique
  on public.client_profile_grants (client_id, maid_id)
  where revoked_at is null;

alter table public.clients enable row level security;
alter table public.client_profile_grants enable row level security;

revoke all on public.clients from anon, authenticated;
revoke all on public.client_profile_grants from anon, authenticated;
grant select, insert, update on public.clients to service_role;
grant select, insert, update on public.client_profile_grants to service_role;
