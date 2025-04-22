-- Create a new storage bucket for item images
insert into storage.buckets (id, name, public)
values ('items', 'items', true);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to create buckets
CREATE POLICY "Allow users to create buckets"
ON storage.buckets
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to upload objects
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'items' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'items' AND auth.uid() = owner);

-- Create policy to allow public to view images
CREATE POLICY "Allow public to view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'items');

-- Create policy to allow authenticated users to delete their own objects
CREATE POLICY "Allow users to delete own objects"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'items' AND auth.uid() = owner); 