import Link from "next/link";
import { notFound } from "next/navigation";
import { requireShop } from "@/lib/shop";
import type { Category, Product } from "@/lib/types";
import { deleteProduct } from "../actions";
import { ProductForm } from "../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, shop, user } = await requireShop();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).eq("shop_id", shop.id).maybeSingle<Product>(),
    supabase.from("categories").select("*").eq("shop_id", shop.id).order("name").returns<Category[]>(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <Link href="/dashboard/produits" className="text-sm font-semibold text-mute">← Mes produits</Link>
      <h1 className="font-display text-2xl font-bold tight">Modifier le produit</h1>
      <ProductForm userId={user.id} categories={categories ?? []} product={product} />
      <form action={deleteProduct} className="pt-4">
        <input type="hidden" name="id" value={product.id} />
        <button className="w-full rounded-xl py-3 text-sm font-semibold text-red-600 hover:bg-red-50">Supprimer ce produit</button>
      </form>
    </div>
  );
}
