-- 20260627000001_storage_setup.sql

-- Create the required buckets
insert into storage.buckets (id, name, public) values 
  ('cover', 'cover', true),
  ('hero', 'hero', true),
  ('gallery', 'gallery', true),
  ('couple', 'couple', true),
  ('qrcodes', 'qrcodes', true),
  ('gifts', 'gifts', true)
on conflict (id) do nothing;

-- Enable RLS for objects if not already enabled (it should be by default in Supabase)
alter table storage.objects enable row level security;

-- Drop existing policies if they exist (to allow safe re-runs)
drop policy if exists "Allow authenticated full access to storage" on storage.objects;
drop policy if exists "Allow public read access to storage" on storage.objects;

-- Admins can do everything on all buckets
create policy "Allow authenticated full access to storage" 
on storage.objects to authenticated using (true) with check (true);

-- Public can read all public buckets
create policy "Allow public read access to storage" 
on storage.objects for select using ( 
  bucket_id in ('cover', 'hero', 'gallery', 'couple', 'qrcodes', 'gifts') 
);
