"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEMO_USER_ID } from "@/lib/constants";
import { getListingById } from "@/lib/mock-listings";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function applyToListing(listingId: string): Promise<{ letter: string }> {
  const listing = getListingById(listingId);
  if (!listing) {
    throw new Error("Listing not found");
  }

  const profile = await prisma.user_profiles.findUnique({
    where: { user_id: DEMO_USER_ID },
  });

  const response = await fetch(`${BACKEND_URL}/motivation-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: {
        profession: profile?.profession ?? null,
        income_monthly: profile?.income_monthly
          ? Number(profile.income_monthly)
          : null,
        has_pets: profile?.has_pets ?? false,
        lifestyle: profile?.lifestyle ?? null,
      },
      listing: {
        title: listing.title,
        price: listing.price,
        description: listing.description,
        city: listing.city,
        url: listing.url,
        source: listing.source,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate motivation letter");
  }

  const { letter } = (await response.json()) as { letter: string };

  await prisma.alerts_history.create({
    data: {
      user_id: DEMO_USER_ID,
      listing_title: listing.title,
      listing_price: listing.price,
      listing_url: listing.url,
      listing_source: listing.source,
      motivation_letter: letter,
      sent_to_telegram: false,
    },
  });

  revalidatePath("/alerts");

  return { letter };
}
