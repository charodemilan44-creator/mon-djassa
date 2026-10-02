"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/FormMessage";
import { requireShop } from "@/lib/shop";
import { RESERVED_SLUGS, normalizePhone, slugify } from "@/lib/utils";

export async function saveShop(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, shop } = await requireShop();
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? ""));
  const whatsapp = normalizePhone(String(formData.get("whatsapp") ?? ""));
  const color = String(formData.get("color") ?? "#F77F00");

  if (name.length < 2) return { error: "Le nom de la boutique est trop court." };
  if (slug.length < 3 || RESERVED_SLUGS.has(slug)) return { error: "Ce lien n'est pas disponible." };
  if (!whatsapp) return { error: "Ce numéro WhatsApp ne semble pas valide." };
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) return { error: "Couleur invalide." };

  const { error } = await supabase
    .from("shops")
    .update({
      name,
      slug,
      whatsapp,
      color,
      description: String(formData.get("description") ?? "").trim() || null,
      hours: String(formData.get("hours") ?? "").trim() || null,
      logo_url: String(formData.get("logo_url") ?? "") || null,
      banner_url: String(formData.get("banner_url") ?? "") || null,
      accepts_cash: formData.get("accepts_cash") === "on",
      accepts_wave: formData.get("accepts_wave") === "on",
      accepts_orange_money: formData.get("accepts_orange_money") === "on",
    })
    .eq("id", shop.id);

  if (error?.code === "23505") return { error: `Le lien mondjassa.ci/${slug} est déjà pris.` };
  if (error) return { error: "Les changements n'ont pas pu être enregistrés." };

  revalidatePath(`/${shop.slug}`);
  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard", "layout");
  return { ok: slug !== shop.slug ? `Enregistré ✓ Ton nouveau lien : mondjassa.ci/${slug}` : "Enregistré ✓" };
}
