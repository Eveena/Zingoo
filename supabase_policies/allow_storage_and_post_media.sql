-- Policy: Allow authenticated users to upload to the 'posts' storage bucket
-- Run this in the Supabase SQL editor or with the Supabase CLI (or psql using the DB connection string).

-- 1) Storage objects: allow INSERT into storage.objects for the specific bucket
-- Requires the storage schema (storage.objects) which already has RLS enabled.

CREATE POLICY IF NOT EXISTS "Allow authenticated uploads to posts bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'posts'
  AND auth.uid() = owner
);

-- 2) post_media table: ensure RLS is enabled and allow authenticated users to INSERT only their own rows

ALTER TABLE IF EXISTS public.post_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow authenticated insert own post_media"
ON public.post_media
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- NOTES:
-- - These policies only grant INSERT permissions to authenticated users when the auth.uid() matches the provided user_id (and bucket owner for storage).
-- - Do NOT run these as a non-superuser if your Supabase project prevents DDL; instead use the Supabase SQL editor (Project -> SQL)
-- - If you also need UPDATE/DELETE/SELECT rules, add policies for those actions following the same auth.uid() = user_id pattern.
