import Link from "next/link";
import { requireShop } from "@/lib/shop";
import type { Category } from "@/lib/types";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ ajoute?: string }> }) {
  const { ajoute } = await searchParams;
  const { supabase, shop, user } = await requireShop();
  const { data: categories } = await supabase.from("categories").select("*").eq("shop_id", shop.id).order("name").returns<Category[]>();

  return (
    <div className="space-y-4">
      <Link href="/dashboard/produits" className="text-sm font-semibold text-stone-500">← Mes produits</Link>
      <h1 className="text-2xl font-extrabold">Nouveau produit</h1>
      {ajoute && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">Produit ajouté ✓ Tu peux en mettre un autre.</p>}
      <ProductForm key={ajoute ? Date.now() : "new"} userId={user.id} categories={categories ?? []} />
    </div>
  );
}
