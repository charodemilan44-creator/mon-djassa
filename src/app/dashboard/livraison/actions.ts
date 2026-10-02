"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/FormMessage";
import { requireShop } from "@/lib/shop";

export async function addZone(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, shop } = await requireShop();
  const commune = String(formData.get("commune") === "autre" ? formData.get("other") : formData.get("commune") ?? "").trim();
  const fee = Number(String(formData.get("fee") ?? "0").replace(/\s/g, "") || 0);
  if (!commune) return { error: "Choisis une commune." };
  if (!Number.isInteger(fee) || fee < 0) return { error: "Les frais doivent être un nombre en FCFA, par exemple 1500." };

  const { error } = await supabase.from("delivery_zones").upsert({ shop_id: shop.id, commune, fee }, { onConflict: "shop_id,commune" });
  if (error) return { error: "Impossible d'enregistrer cette commune." };
  revalidatePath("/dashboard/livraison");
  revalidatePath(`/${shop.slug}`);
  return { ok: `${commune} enregistrée ✓` };
}

export async function deleteZone(formData: FormData) {
  const { supabase, shop } = await requireShop();
  await supabase.from("delivery_zones").delete().eq("id", String(formData.get("id"))).eq("shop_id", shop.id);
  revalidatePath("/dashboard/livraison");
  revalidatePath(`/${shop.slug}`);
}
