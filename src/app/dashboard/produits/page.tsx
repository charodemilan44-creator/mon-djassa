import Link from "next/link";
import { requireShop } from "@/lib/shop";
import type { Category, Product } from "@/lib/types";
import { formatFCFA } from "@/lib/utils";
import { deleteCategory, toggleStock } from "./actions";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ ajoutes?: string }> }) {
  const { ajoutes } = await searchParams;
  const { supabase, shop } = await requireShop();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("shop_id", shop.id).order("created_at", { ascending: false }).returns<Product[]>(),
    supabase.from("categories").select("*").eq("shop_id", shop.id).order("name").returns<Category[]>(),
  ]);
  const catName = new Map((categories ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tight">Mes produits</h1>
        <Link href="/dashboard/produits/nouveau" className="btn-primary px-4 py-2 text-sm">Ajouter</Link>
      </div>

      {ajoutes && <p className="rounded-xl bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">{ajoutes} produit{Number(ajoutes) > 1 ? "s" : ""} ajouté{Number(ajoutes) > 1 ? "s" : ""} à ta boutique.</p>}

      <Link href="/dashboard/produits/rapide" className="card flex items-center gap-3 p-3.5 transition hover:border-ink/30">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-dark">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="5" width="14" height="14" rx="2" /><path d="M7 5V3h14v14h-2M3 15l4-4 4 4 2-2 4 4" /></svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Ajout rapide de plusieurs photos</span>
          <span className="block text-xs text-mute">Idéal pour reprendre ton catalogue WhatsApp</span>
        </span>
        <span className="text-mute" aria-hidden>›</span>
      </Link>

      {!products?.length ? (
        <div className="card py-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-sand text-ink/60"><svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2" /></svg></span>
          <p className="mt-2 font-semibold">Aucun produit pour l&apos;instant</p>
          <p className="text-sm text-mute">Ajoute ton premier produit, ça prend moins d&apos;une minute.</p>
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
                  <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-sand font-display text-xl font-bold text-ink/25">{p.name.charAt(0).toUpperCase()}</span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{p.name}</span>
                  <span className="block text-sm text-mute">{formatFCFA(p.price)}</span>
                  {p.category_id && <span className="block text-xs text-mute">{catName.get(p.category_id)}</span>}
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
          <p className="mb-3 text-xs text-mute">Supprimer une catégorie ne supprime pas ses produits.</p>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-1 rounded-full bg-sand py-1 pr-1 pl-3 text-sm">
                {c.name}
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="grid size-6 place-items-center rounded-full text-mute hover:bg-line" aria-label={`Supprimer ${c.name}`}>×</button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
