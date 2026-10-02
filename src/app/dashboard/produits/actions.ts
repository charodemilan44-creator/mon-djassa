"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/FormMessage";
import { requireShop } from "@/lib/shop";

function readProduct(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    price: Number(String(formData.get("price") ?? "").replace(/\s/g, "")),
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "") || null,
    in_stock: formData.get("in_stock") === "on",
    categoryId: String(formData.get("category_id") ?? ""),
    newCategory: String(formData.get("new_category") ?? "").trim(),
  };
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, shop } = await requireShop();
  const id = String(formData.get("id") ?? "");
  const p = readProduct(formData);

  if (!p.name) return { error: "Donne un nom au produit." };
  if (!Number.isInteger(p.price) || p.price < 0) return { error: "Le prix doit être un nombre en FCFA, par exemple 15000." };

  let category_id: string | null = p.categoryId && p.categoryId !== "new" ? p.categoryId : null;
  if (p.categoryId === "new" && p.newCategory) {
    const { data, error } = await supabase
      .from("categories")
      .upsert({ shop_id: shop.id, name: p.newCategory }, { onConflict: "shop_id,name" })
      .select("id")
      .single();
    if (error) return { error: "Impossible de créer la catégorie." };
    category_id = data.id;
  }

  const row = { name: p.name, price: p.price, description: p.description, image_url: p.image_url, in_stock: p.in_stock, category_id };
  const { error } = id
    ? await supabase.from("products").update(row).eq("id", id).eq("shop_id", shop.id)
    : await supabase.from("products").insert({ ...row, shop_id: shop.id });
  if (error) return { error: "Le produit n'a pas pu être enregistré. Réessaie." };

  revalidatePath(`/${shop.slug}`);
  redirect(formData.get("again") === "1" ? "/dashboard/produits/nouveau?ajoute=1" : "/dashboard/produits");
}

export async function toggleStock(formData: FormData) {
  const { supabase, shop } = await requireShop();
  const id = String(formData.get("id"));
  const inStock = formData.get("in_stock") === "true";
  await supabase.from("products").update({ in_stock: !inStock }).eq("id", id).eq("shop_id", shop.id);
  revalidatePath("/dashboard/produits");
  revalidatePath(`/${shop.slug}`);
}

export async function deleteProduct(formData: FormData) {
  const { supabase, shop } = await requireShop();
  await supabase.from("products").delete().eq("id", String(formData.get("id"))).eq("shop_id", shop.id);
  revalidatePath(`/${shop.slug}`);
  redirect("/dashboard/produits");
}

export async function deleteCategory(formData: FormData) {
  const { supabase, shop } = await requireShop();
  await supabase.from("categories").delete().eq("id", String(formData.get("id"))).eq("shop_id", shop.id);
  revalidatePath("/dashboard/produits");
  revalidatePath(`/${shop.slug}`);
}
