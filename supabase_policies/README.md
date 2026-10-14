Quick steps to apply the RLS policies for storage uploads and post_media inserts

1) Open your Supabase project dashboard -> SQL Editor and paste the contents of
   `supabase_policies/allow_storage_and_post_media.sql` and run it.

OR using the Supabase CLI:

```bash
# install supabase CLI first if needed
supabase login
supabase projects list # optional
# run SQL against your project (ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY if required)
supabase db query < supabase_policies/allow_storage_and_post_media.sql
```

2) Verify flow
- Start frontend, log in as an authenticated user.
- Use the Create -> upload flow. The storage upload should now be allowed (storage.objects INSERT) for the `posts` bucket when auth.uid() = owner.
- The `post_media` INSERT should succeed when `user_id` equals `auth.uid()`.

3) If you still see issues:
- Confirm the bucket name is `posts` (see `Frontend/src/pages/CreatePage.tsx`) and that uploads set the owner correctly (Supabase storage automatically sets owner for authenticated uploads).
- Check the exact column names in `post_media` (we assumed `user_id` column exists). If different, adjust the SQL policy's `user_id` reference accordingly.

If you want, I can attempt to add a migration runner script, but it's best to run these policies using the Supabase Dashboard or CLI with your project credentials.
