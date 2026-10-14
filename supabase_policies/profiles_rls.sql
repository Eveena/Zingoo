-- Policies for public.profiles: allow authenticated users to SELECT/UPDATE their own row

ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Profiles - allow select own"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Profiles - allow update own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Optionally allow INSERT for signed up users if you need it (careful with duplicates):
-- CREATE POLICY IF NOT EXISTS "Profiles - allow insert own"
-- ON public.profiles
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (auth.uid() = id);
