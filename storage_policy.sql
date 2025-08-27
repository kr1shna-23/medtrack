-- Grant insert access to authenticated users for the 'avatars' bucket
CREATE POLICY "Enable insert for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Grant update access to authenticated users for their own avatars
CREATE POLICY "Enable update for users based on user_id"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (bucket_id = 'avatars');

-- Grant delete access to authenticated users for their own avatars
CREATE POLICY "Enable delete for users based on user_id"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
