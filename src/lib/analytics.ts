import { supabase } from "@/integrations/supabase/client";

export type EventType = "qr_scan" | "menu_view" | "view_3d" | "view_ar";

export async function recordAnalyticsEvent({
  eventType,
  restaurantId,
  menuItemId,
  tableId,
}: {
  eventType: EventType;
  restaurantId?: string | null;
  menuItemId?: string | null;
  tableId?: string | null;
}) {
  if (!restaurantId && !menuItemId) return;

  try {
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      restaurant_id: restaurantId || null,
      menu_item_id: menuItemId || null,
      table_id: tableId || null,
      device_info: {
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        screenWidth: typeof window !== "undefined" ? window.innerWidth : null,
      },
    });
  } catch (err) {
    console.error("Failed to record analytics event:", err);
  }
}
