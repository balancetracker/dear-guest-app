
-- Make music bucket public so visitors can play music
UPDATE storage.buckets SET public = true WHERE id = 'music';

-- Storage RLS policies for photos bucket (already public)
CREATE POLICY "Allow public read photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Allow public insert photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Allow public delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos');

-- Storage RLS policies for music bucket
CREATE POLICY "Allow public read music" ON storage.objects FOR SELECT USING (bucket_id = 'music');
CREATE POLICY "Allow public insert music" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'music');
