-- 00000000000000_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- GROUPS TABLE
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'Família',
  notes text,
  status text not null default 'pending', -- pending, confirmed, declined
  allow_new_confirmation boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- GUESTS TABLE
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  phone text,
  email text,
  group_id uuid references public.groups(id) on delete cascade,
  type text default 'Convidado',
  notes text,
  can_bring_companions boolean default false,
  max_companions int default 0,
  confirmation_status text default 'pending', -- pending, confirmed, declined
  confirmation_date timestamp with time zone,
  confirmation_source text, -- admin, site
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- GIFTS TABLE
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image text,
  price numeric not null,
  status text not null default 'available', -- available, reserved, gifted
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- GIFT TRANSACTIONS TABLE
create table if not exists public.gift_transactions (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid references public.gifts(id) on delete set null,
  guest_name text not null,
  phone text,
  payment_status text default 'pending',
  reserved_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- PIX SETTINGS TABLE
create table if not exists public.pix_settings (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  pix_key text not null,
  pix_type text not null,
  qr_code text,
  enabled boolean default true
);

-- LOCATIONS TABLE
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  address text not null,
  google_maps text,
  qr_code text,
  created_at timestamp with time zone default now()
);

-- SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  bride text not null,
  groom text not null,
  wedding_date timestamp with time zone not null,
  music text,
  countdown boolean default true,
  verse text,
  hero_image text,
  cover_image text,
  footer_image text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- GALLERY TABLE
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  "order" int default 0,
  created_at timestamp with time zone default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table public.groups enable row level security;
alter table public.guests enable row level security;
alter table public.gifts enable row level security;
alter table public.gift_transactions enable row level security;
alter table public.pix_settings enable row level security;
alter table public.locations enable row level security;
alter table public.site_settings enable row level security;
alter table public.gallery enable row level security;

-- PUBLIC READ ACCESS FOR NECESSARY TABLES
create policy "Allow public read access to settings" on public.site_settings for select using (true);
create policy "Allow public read access to locations" on public.locations for select using (true);
create policy "Allow public read access to gallery" on public.gallery for select using (true);
create policy "Allow public read access to gifts" on public.gifts for select using (true);
create policy "Allow public read access to pix" on public.pix_settings for select using (true);

-- GUESTS & GROUPS PUBLIC ACCESS (For Search & RSVP)
-- Allow public select so guests can find their names
create policy "Allow public read access to groups" on public.groups for select using (true);
create policy "Allow public read access to guests" on public.guests for select using (true);
-- Allow public update to guests and groups ONLY if status is pending or allow_new_confirmation is true
create policy "Allow public to update group status" on public.groups for update using (status = 'pending' or allow_new_confirmation = true);
create policy "Allow public to update guest status" on public.guests for update using (
  exists (
    select 1 from public.groups g 
    where g.id = guests.group_id 
    and (g.status = 'pending' or g.allow_new_confirmation = true)
  )
);

-- GIFT RESERVATIONS PUBLIC ACCESS
create policy "Allow public to insert gift transactions" on public.gift_transactions for insert with check (true);
create policy "Allow public to update gift status" on public.gifts for update using (status = 'available');

-- ADMIN FULL ACCESS
-- Authenticated users (the couple) can do anything
create policy "Allow authenticated full access to groups" on public.groups to authenticated using (true) with check (true);
create policy "Allow authenticated full access to guests" on public.guests to authenticated using (true) with check (true);
create policy "Allow authenticated full access to gifts" on public.gifts to authenticated using (true) with check (true);
create policy "Allow authenticated full access to gift_transactions" on public.gift_transactions to authenticated using (true) with check (true);
create policy "Allow authenticated full access to pix_settings" on public.pix_settings to authenticated using (true) with check (true);
create policy "Allow authenticated full access to locations" on public.locations to authenticated using (true) with check (true);
create policy "Allow authenticated full access to site_settings" on public.site_settings to authenticated using (true) with check (true);
create policy "Allow authenticated full access to gallery" on public.gallery to authenticated using (true) with check (true);

-- TRIGGERS FOR UPDATED_AT
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_groups_updated_at before update on public.groups for each row execute procedure update_updated_at_column();
create trigger update_guests_updated_at before update on public.guests for each row execute procedure update_updated_at_column();
create trigger update_gifts_updated_at before update on public.gifts for each row execute procedure update_updated_at_column();
create trigger update_site_settings_updated_at before update on public.site_settings for each row execute procedure update_updated_at_column();
