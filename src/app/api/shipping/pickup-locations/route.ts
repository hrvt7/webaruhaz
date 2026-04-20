import { NextResponse } from "next/server";
import { getActivePickupLocations } from "@/lib/shipping";

export const revalidate = 60;

export async function GET() {
  const locations = await getActivePickupLocations();
  return NextResponse.json({
    locations: locations.map((l) => ({
      id: l.id,
      name: l.name,
      address: l.address,
      city: l.city,
      postcode: l.postcode,
      hours: l.hours,
    })),
  });
}
