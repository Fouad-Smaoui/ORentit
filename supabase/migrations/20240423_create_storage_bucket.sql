-- Create a new storage bucket for item images
insert into storage.buckets (id, name, public)
values ('items', 'items', true);

-- Set up storage policy to allow authenticated users to upload
create policy "Allow authenticated users to upload images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'items' AND
  auth.role() = 'authenticated'
);

-- Set up storage policy to allow public to view images
create policy "Allow public to view images"
on storage.objects for select
to public
using (bucket_id = 'items'); 