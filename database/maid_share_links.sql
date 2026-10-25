-- Staff-only share tokens for invitation profile links (teaser vs full).
create table if not exists public.maid_share_links (
  maid_id text primary key references public.maids (id) on delete cascade,
  teaser_token text not null unique,
  full_token text not null unique,
  created_by text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  check (length(teaser_token) >= 32 and length(full_token) >= 32)
);

create index if not exists maid_share_links_teaser_idx on public.maid_share_links (teaser_token);
create index if not exists maid_share_links_full_idx on public.maid_share_links (full_token);

alter table public.maid_share_links enable row level security;

-- No policies: only service role (Next.js admin APIs) reads/writes this table.

revoke all on public.maid_share_links from anon, authenticated;
grant select, insert, update, delete on public.maid_share_links to service_role;

-- Stop public enumeration via the listings view.
revoke select on public.maid_public_listings from anon, authenticated;
