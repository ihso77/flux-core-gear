
-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  product_handle TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Customer showcase table
CREATE TABLE public.customer_showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.customer_showcase ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read showcase" ON public.customer_showcase FOR SELECT USING (true);
CREATE POLICY "Admins can manage showcase" ON public.customer_showcase FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Storage bucket for showcase images
INSERT INTO storage.buckets (id, name, public) VALUES ('showcase', 'showcase', true);

CREATE POLICY "Anyone can view showcase images" ON storage.objects FOR SELECT USING (bucket_id = 'showcase');
CREATE POLICY "Admins can upload showcase images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'showcase' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete showcase images" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'showcase' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
