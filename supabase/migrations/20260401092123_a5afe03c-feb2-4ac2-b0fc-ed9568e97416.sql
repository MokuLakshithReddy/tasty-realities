
DROP POLICY "Anyone can insert analytics" ON public.analytics_events;
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events FOR INSERT
  WITH CHECK (
    event_type IN ('view_3d', 'view_ar', 'qr_scan', 'menu_view', 'add_to_cart')
    AND EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id)
  );
