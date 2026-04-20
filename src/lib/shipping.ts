import { supabaseServer } from "@/lib/supabase/server";

export type PickupLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string | null;
  phone: string | null;
  hours: string | null;
  notes: string | null;
  sort_order: number;
  active: boolean;
};

export type ShippingMethod = "delivery" | "pickup" | "foxpost";

export type ShippingDetails =
  | { method: "delivery"; address: string }
  | { method: "pickup"; location_id: string; location_name: string; location_address: string }
  | { method: "foxpost"; apm_id: string; apm_name: string; apm_address: string };

// Szállítási díjak HUF-ban
export const SHIPPING_FEES = {
  delivery: 1690,
  pickup: 0,
  foxpost: 890,
} as const;

export const FREE_SHIPPING_THRESHOLD = 30000;

// A tényleges díj a módszer + subtotal alapján
export function calcShippingFee(method: ShippingMethod, discountedSubtotal: number): number {
  if (method === "pickup") return 0;
  if (discountedSubtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEES[method];
}

export async function getActivePickupLocations(): Promise<PickupLocation[]> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("pickup_locations")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return (data as PickupLocation[]) ?? [];
}
