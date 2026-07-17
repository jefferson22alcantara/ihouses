"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEMO_USER_ID } from "@/lib/constants";

export async function saveProfileAndFilters(formData: FormData) {
  const income = formData.get("income_monthly");
  const profession = String(formData.get("profession") ?? "").trim();
  const hasPets = formData.get("has_pets") === "on";
  const lifestyle = String(formData.get("lifestyle") ?? "").trim();

  const city = String(formData.get("city") ?? "").trim();
  const maxBudget = formData.get("max_budget");
  const radiusKm = formData.get("radius_km");
  const propertyType = String(formData.get("property_type") ?? "").trim();
  const telegramChatId = String(formData.get("telegram_chat_id") ?? "").trim();

  if (!city || !maxBudget) {
    throw new Error("City and max budget are required");
  }

  await prisma.$transaction(async (tx) => {
    await tx.users.update({
      where: { id: DEMO_USER_ID },
      data: { telegram_chat_id: telegramChatId || null },
    });

    await tx.user_profiles.upsert({
      where: { user_id: DEMO_USER_ID },
      update: {
        income_monthly: income ? Number(income) : null,
        profession: profession || null,
        has_pets: hasPets,
        lifestyle: lifestyle || null,
      },
      create: {
        user_id: DEMO_USER_ID,
        income_monthly: income ? Number(income) : null,
        profession: profession || null,
        has_pets: hasPets,
        lifestyle: lifestyle || null,
      },
    });

    const existingFilter = await tx.search_filters.findFirst({
      where: { user_id: DEMO_USER_ID },
      orderBy: { created_at: "asc" },
    });

    const filterData = {
      city,
      max_budget: Number(maxBudget),
      radius_km: radiusKm ? Number(radiusKm) : 5,
      property_type: propertyType || null,
      is_active: true,
    };

    if (existingFilter) {
      await tx.search_filters.update({
        where: { id: existingFilter.id },
        data: filterData,
      });
    } else {
      await tx.search_filters.create({
        data: { user_id: DEMO_USER_ID, ...filterData },
      });
    }
  });

  revalidatePath("/dashboard");
}
