import Link from "next/link";
import { requireShop } from "@/lib/shop";
import type { Category, Product } from "@/lib/types";
import { formatFCFA } from "@/lib/utils";
import { deleteCategory, toggleStock } from "./actions";

export default async function ProductsPage() {
  const { supabase, shop } = await requireShop();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("shop_id", shop.id).order("created_at", { ascending: false }).returns<Product[]>(),
    supabase.from("categories").select("*").eq("shop_id", shop.id).order("name").returns<Category[]>(),
  ]);
  const catName = new Map((categories ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Mes produits</h1>
        <Link href="/dashboard/produits/nouveau" className="btn-primary px-4 py-2">+ Ajouter</Link>
      </div>

      {!products?.length ? (
        <div className="card py-10 text-center">
          <p className="text-4xl">🛍️</p>
          <p className="mt-2 font-semibold">Aucun produit pour l&apos;instant</p>
          <p className="text-sm text-stone-500">Ajoute ton premier produit, ça prend moins d&apos;une minute.</p>
          <Link href="/dashboard/produits/nouveau" className="btn-primary mt-4">Ajouter un produit</Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="card flex items-center gap-3 p-2">
              <Link href={`/dashboard/produits/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="size-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-stone-100 text-2xl">📦</span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{p.name}</span>
                  <span className="block text-sm text-stone-600">{formatFCFA(p.price)}</span>
                  {p.category_id && <span className="block text-xs text-stone-400">{catName.get(p.category_id)}</span>}
                </span>
              </Link>
              <form action={toggleStock}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="in_stock" value={String(p.in_stock)} />
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${p.in_stock ? "bg-leaf/10 text-leaf" : "bg-red-100 text-red-700"}`}
                  title="Changer la disponibilité"
                >
                  {p.in_stock ? "En stock" : "Épuisé"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {!!categories?.length && (
        <section className="card">
          <h2 className="font-bold">Catégories</h2>
          <p className="mb-3 text-xs text-stone-500">Supprimer une catégorie ne supprime pas ses produits.</p>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-1 rounded-full bg-stone-100 py-1 pr-1 pl-3 text-sm">
                {c.name}
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="grid size-6 place-items-center rounded-full text-stone-500 hover:bg-stone-200" aria-label={`Supprimer ${c.name}`}>×</button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
