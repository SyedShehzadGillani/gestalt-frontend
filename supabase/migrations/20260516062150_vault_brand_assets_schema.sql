-- VAULT Brand Assets v2 schema
-- Spec: features-to-implement/GPS-VAULT-Developer-Specification-05-15-v2.md §13
-- Multi-tenant via company_id; RLS enforced on every table.

-- =====================================================================
-- vault_assets — core asset table
-- =====================================================================
create table if not exists public.vault_assets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  section text not null,
  name text not null,
  category text,
  file_url text,
  thumbnail_url text,
  version text default 'v1.0',
  permission text not null default 'internal' check (permission in ('public','vendor','internal')),
  campaign text,
  tags text[] not null default '{}',
  type text not null default 'document' check (type in ('document','photo','video','motion')),
  guidelines text,
  restrictions text,
  download_count integer not null default 0,
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid
);
create index if not exists vault_assets_company_section_idx on public.vault_assets (company_id, section);
create index if not exists vault_assets_tags_idx on public.vault_assets using gin (tags);
alter table public.vault_assets enable row level security;

-- =====================================================================
-- vault_versions — per-asset version history
-- =====================================================================
create table if not exists public.vault_versions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.vault_assets(id) on delete cascade,
  version text not null,
  file_url text,
  is_current boolean not null default false,
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid
);
alter table public.vault_versions enable row level security;

-- =====================================================================
-- vault_messaging — tagline, pitch tiers, etc.
-- =====================================================================
create table if not exists public.vault_messaging (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  block_id text not null,
  content text,
  source text not null default 'manual',
  version_label text not null default 'v1.0',
  updated_at timestamptz not null default now(),
  updated_by uuid
);
create index if not exists vault_messaging_company_block_idx on public.vault_messaging (company_id, block_id);
alter table public.vault_messaging enable row level security;

-- =====================================================================
-- vault_foundation — brand foundation content blocks
-- =====================================================================
create table if not exists public.vault_foundation (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  block_id text not null,
  content text,
  source text not null default 'manual',
  version_label text not null default 'v1.0',
  updated_at timestamptz not null default now()
);
create index if not exists vault_foundation_company_block_idx on public.vault_foundation (company_id, block_id);
alter table public.vault_foundation enable row level security;

-- =====================================================================
-- vault_favorites — per-user favorites with ordering
-- =====================================================================
create table if not exists public.vault_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  asset_id uuid not null references public.vault_assets(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, asset_id)
);
alter table public.vault_favorites enable row level security;

-- =====================================================================
-- vault_tags — company-level tag library
-- =====================================================================
create table if not exists public.vault_tags (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  tag text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  unique (company_id, tag)
);
alter table public.vault_tags enable row level security;

-- =====================================================================
-- vault_comments — asset annotations
-- =====================================================================
create table if not exists public.vault_comments (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.vault_assets(id) on delete cascade,
  author_id uuid not null,
  author_name text,
  text text not null,
  created_at timestamptz not null default now()
);
alter table public.vault_comments enable row level security;

-- =====================================================================
-- vault_campaigns — campaign associations
-- =====================================================================
create table if not exists public.vault_campaigns (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  name text not null,
  status text not null default 'active' check (status in ('active','completed')),
  project_id uuid,
  created_at timestamptz not null default now()
);
alter table public.vault_campaigns enable row level security;

-- =====================================================================
-- vault_review_alerts — AI-generated freshness alerts
-- =====================================================================
create table if not exists public.vault_review_alerts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  asset_id uuid not null references public.vault_assets(id) on delete cascade,
  reason text,
  urgency text not null check (urgency in ('HIGH','MEDIUM','LOW','ARCHIVE')),
  dependent_asset_ids uuid[] not null default '{}',
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.vault_review_alerts enable row level security;

-- =====================================================================
-- vault_asset_dependencies — file dependency graph
-- =====================================================================
create table if not exists public.vault_asset_dependencies (
  id uuid primary key default gen_random_uuid(),
  parent_asset_id uuid not null references public.vault_assets(id) on delete cascade,
  dependent_asset_id uuid not null references public.vault_assets(id) on delete cascade,
  relationship text,
  created_at timestamptz not null default now(),
  unique (parent_asset_id, dependent_asset_id)
);
alter table public.vault_asset_dependencies enable row level security;

-- =====================================================================
-- vault_custom_categories — user-defined categories
-- =====================================================================
create table if not exists public.vault_custom_categories (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.vault_custom_categories enable row level security;

-- =====================================================================
-- vault_ai_cache — cached AI results, 24h TTL
-- =====================================================================
create table if not exists public.vault_ai_cache (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  cache_key text not null,
  result jsonb not null,
  expires_at timestamptz not null,
  unique (company_id, cache_key)
);
create index if not exists vault_ai_cache_expires_idx on public.vault_ai_cache (expires_at);
alter table public.vault_ai_cache enable row level security;

-- =====================================================================
-- RLS policies — multi-tenant isolation via profiles.company_id
-- Assumes profiles(id, company_id) already exists. If not, policies
-- still install but reads return empty until profiles table is in place.
-- =====================================================================

-- Helper: current user's company_id
create or replace function public.vault_current_company_id()
returns uuid
language sql stable security definer
as $$
  select company_id from public.profiles where id = auth.uid() limit 1;
$$;

-- vault_assets
drop policy if exists vault_assets_read on public.vault_assets;
create policy vault_assets_read on public.vault_assets
  for select using (company_id = public.vault_current_company_id());
drop policy if exists vault_assets_write on public.vault_assets;
create policy vault_assets_write on public.vault_assets
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());

-- vault_versions (inherits asset company_id)
drop policy if exists vault_versions_rw on public.vault_versions;
create policy vault_versions_rw on public.vault_versions
  for all using (
    asset_id in (select id from public.vault_assets where company_id = public.vault_current_company_id())
  );

-- vault_messaging
drop policy if exists vault_messaging_rw on public.vault_messaging;
create policy vault_messaging_rw on public.vault_messaging
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());

-- vault_foundation
drop policy if exists vault_foundation_rw on public.vault_foundation;
create policy vault_foundation_rw on public.vault_foundation
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());

-- vault_favorites (per user)
drop policy if exists vault_favorites_rw on public.vault_favorites;
create policy vault_favorites_rw on public.vault_favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- vault_tags
drop policy if exists vault_tags_rw on public.vault_tags;
create policy vault_tags_rw on public.vault_tags
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());

-- vault_comments — read all same-company, write own
drop policy if exists vault_comments_read on public.vault_comments;
create policy vault_comments_read on public.vault_comments
  for select using (
    asset_id in (select id from public.vault_assets where company_id = public.vault_current_company_id())
  );
drop policy if exists vault_comments_write on public.vault_comments;
create policy vault_comments_write on public.vault_comments
  for insert with check (author_id = auth.uid());
drop policy if exists vault_comments_delete on public.vault_comments;
create policy vault_comments_delete on public.vault_comments
  for delete using (author_id = auth.uid());

-- vault_campaigns
drop policy if exists vault_campaigns_rw on public.vault_campaigns;
create policy vault_campaigns_rw on public.vault_campaigns
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());

-- vault_review_alerts
drop policy if exists vault_review_alerts_rw on public.vault_review_alerts;
create policy vault_review_alerts_rw on public.vault_review_alerts
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());

-- vault_asset_dependencies
drop policy if exists vault_asset_dependencies_rw on public.vault_asset_dependencies;
create policy vault_asset_dependencies_rw on public.vault_asset_dependencies
  for all using (
    parent_asset_id in (select id from public.vault_assets where company_id = public.vault_current_company_id())
  );

-- vault_custom_categories
drop policy if exists vault_custom_categories_rw on public.vault_custom_categories;
create policy vault_custom_categories_rw on public.vault_custom_categories
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());

-- vault_ai_cache
drop policy if exists vault_ai_cache_rw on public.vault_ai_cache;
create policy vault_ai_cache_rw on public.vault_ai_cache
  for all using (company_id = public.vault_current_company_id())
  with check (company_id = public.vault_current_company_id());
