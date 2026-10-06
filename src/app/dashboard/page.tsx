import Link from "next/link";
import { ShareLink } from "@/components/ShareLink";
import { requireShop } from "@/lib/shop";
import { SITE_URL, formatDate } from "@/lib/utils";

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ bienvenue?: string }> }) {
  const { bienvenue } = await searchParams;
  const { supabase, shop, access } = await requireShop({ allowExpired: true });
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const count = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0);
  const [visits, orderClicks, products, zones] = await Promise.all([
    count(supabase.from("shop_events").select("id", { count: "exact", head: true }).eq("shop_id", shop.id).eq("type", "visit").gte("created_at", weekAgo)),
    count(supabase.from("shop_events").select("id", { count: "exact", head: true }).eq("shop_id", shop.id).eq("type", "order_click").gte("created_at", weekAgo)),
    count(supabase.from("products").select("id", { count: "exact", head: true }).eq("shop_id", shop.id)),
    count(supabase.from("delivery_zones").select("id", { count: "exact", head: true }).eq("shop_id", shop.id)),
  ]);

  const url = `${SITE_URL}/${shop.slug}`;
  const todo = [
    { done: products > 0, label: "Ajouter ton premier produit", href: "/dashboard/produits/nouveau" },
    { done: zones > 0, label: "Indiquer les communes où tu livres", href: "/dashboard/livraison" },
    { done: !!shop.logo_url, label: "Mettre ton logo et ta couleur", href: "/dashboard/boutique" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tight">{bienvenue ? `Bienvenue, ${shop.name}` : shop.name}</h1>
        <p className="text-mute">
          {access.status === "trial" && <>Essai gratuit : encore <b>{access.daysLeft} jour{access.daysLeft > 1 ? "s" : ""}</b> (jusqu&apos;au {formatDate(access.until)}).</>}
          {access.status === "active" && <>Abonnement actif jusqu&apos;au {formatDate(access.until)}.</>}
          {access.status === "expired" && <>Ta boutique est en pause.</>}
        </p>
      </div>

      <section className="card">
        <h2 className="mb-3 font-bold">Ton lien à partager</h2>
        <ShareLink url={url} shopName={shop.name} />
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Stat label="Visites (7 jours)" value={visits} />
        <Stat label="Commandes envoyées" value={orderClicks} />
        <Stat label="Produits" value={products} />
      </section>

      {todo.some((t) => !t.done) && (
        <section className="card">
          <h2 className="mb-3 font-bold">Pour bien démarrer</h2>
          <ul className="space-y-2">
            {todo.map((t) => (
              <li key={t.label}>
                <Link href={t.href} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-paper">
                  <span className={`grid size-6 place-items-center rounded-full text-white ${t.done ? "bg-leaf" : "bg-line"}`}><svg viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 10.5 3 3 7-7" /></svg></span>
                  <span className={t.done ? "text-mute line-through" : "font-medium"}>{t.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-3 text-center">
      <p className="font-display text-2xl font-bold tight text-brand">{value}</p>
      <p className="text-xs text-mute">{label}</p>
    </div>
  );
}
