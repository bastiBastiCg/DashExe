-- Enable pgcrypto for gen_random_uuid
create extension if not exists "pgcrypto";

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'presenter', 'viewer')) default 'viewer',
  created_at timestamptz not null default now()
);

-- Dashboards table
create table if not exists public.dashboards (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  status text not null check (status in ('draft', 'published')) default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  data_path text,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

-- Trigger to create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.dashboards enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select"
on public.profiles
for select
using (
  exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles
for update
using (
  exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Dashboards policies
drop policy if exists "dashboards_select_published" on public.dashboards;
create policy "dashboards_select_published"
on public.dashboards
for select
using (status = 'published');

drop policy if exists "dashboards_presenter_select_own" on public.dashboards;
create policy "dashboards_presenter_select_own"
on public.dashboards
for select
using (auth.uid() = created_by);

drop policy if exists "dashboards_presenter_insert" on public.dashboards;
create policy "dashboards_presenter_insert"
on public.dashboards
for insert
with check (auth.uid() = created_by);

drop policy if exists "dashboards_presenter_update_own" on public.dashboards;
create policy "dashboards_presenter_update_own"
on public.dashboards
for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

drop policy if exists "dashboards_admin_all" on public.dashboards;
create policy "dashboards_admin_all"
on public.dashboards
for all
using (
  exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Storage bucket and policies
insert into storage.buckets (id, name, public)
values ('dashboard-data', 'dashboard-data', false)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

drop policy if exists "dashboard_data_presenter_insert" on storage.objects;
create policy "dashboard_data_presenter_insert"
on storage.objects
for insert
with check (
  bucket_id = 'dashboard-data'
  and auth.uid() = owner
  and name like ('dashboards/' || auth.uid() || '/%')
);

drop policy if exists "dashboard_data_viewer_select" on storage.objects;
create policy "dashboard_data_viewer_select"
on storage.objects
for select
using (
  bucket_id = 'dashboard-data'
  and (
    exists (
      select 1
      from public.dashboards d
      where d.data_path = storage.objects.name
        and d.status = 'published'
    )
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
    or auth.uid() = owner
  )
);
