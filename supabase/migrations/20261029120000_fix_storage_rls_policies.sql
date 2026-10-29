-- Fix storage object RLS policies for models and menu-images buckets
-- Drop existing insecure policies that allowed any authenticated user to update/delete any upload

DROP POLICY IF EXISTS "Users can update their uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their uploads" ON storage.objects;

CREATE POLICY "Users can update their uploads" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id IN ('models', 'menu-images')
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their uploads" ON storage.objects
  FOR DELETE
  USING (
    bucket_id IN ('models', 'menu-images')
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );
