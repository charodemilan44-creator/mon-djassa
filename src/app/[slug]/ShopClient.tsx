"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category, DeliveryZone, Product, Shop } from "@/lib/types";
import { SITE_URL, formatFCFA, waLink } from "@/lib/utils";

type Cart = Record<string, number>;

function readCart(key: string): Cart {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}") as Cart;
  } catch {
    return {};
  }
}

export function ShopClient({
  shop,
  products,
  categories,
  zones,
}: {
  shop: Shop;
  products: Product[];
  categories: Category[];
  zones: DeliveryZone[];
}) {
  const cartKey = `mondjassa-panier-${shop.id}`;
  const [cart, setCart] = useState<Cart>({});
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<Product | null>(null);

  // Panier gardé sur le téléphone de la cliente + compteur de visites
  useEffect(() => {
    setCart(readCart(cartKey));
    setLoaded(true);
    try {
      const seen = `mondjassa-vu-${shop.id}`;
      if (sessionStorage.getItem(seen)) return;
      sessionStorage.setItem(seen, "1");
    } catch {}
    createClient().rpc("log_shop_event", { p_shop_id: shop.id, p_type: "visit" }).then(() => {});
  }, [cartKey, shop.id]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {}
  }, [cart, cartKey, loaded]);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ product: byId.get(id), qty }))
    .filter((l): l is { product: Product; qty: number } => !!l.product && l.product.in_stock && l.qty > 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);

  const usedCategories = categories.filter((c) => products.some((p) => p.category_id === c.id));
  const q = search.trim().toLowerCase();
  const visible = products.filter(
    (p) => (filter === "all" || p.category_id === filter) && (!q || p.name.toLowerCase().includes(q)),
  );

  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 99);
      return next;
    });

  const accent = shop.color;

  return (
    <div style={{ "--accent": accent } as React.CSSProperties} className="min-h-dvh bg-stone-50 pb-28">
      {/* En-tête de la boutique */}
      <header className="relative">
        {shop.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shop.banner_url} alt="" className="h-36 w-full object-cover md:h-52" />
        ) : (
          <div className="h-24 md:h-32" style={{ background: accent }} />
        )}
        <div className="mx-auto -mt-10 max-w-5xl px-4">
          <div className="flex items-end gap-3">
            {shop.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shop.logo_url} alt="" className="size-20 rounded-full border-4 border-white bg-white object-cover shadow" />
            ) : (
              <span className="grid size-20 place-items-center rounded-full border-4 border-white text-3xl font-extrabold text-white shadow" style={{ background: accent }}>
                {shop.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold">{shop.name}</h1>
          {shop.description && <p className="mt-1 text-stone-600">{shop.description}</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {shop.hours && <Pill>🕒 {shop.hours}</Pill>}
            {zones.length > 0 && <Pill>🛵 Livraison : {zones.length > 3 ? `${zones.length} communes` : zones.map((z) => z.commune).join(", ")}</Pill>}
            {shop.accepts_cash && <Pill>Paiement à la livraison</Pill>}
            {shop.accepts_wave && <Pill>Wave</Pill>}
            {shop.accepts_orange_money && <Pill>Orange Money</Pill>}
          </div>
        </div>
      </header>

      {/* Filtres */}
      <div className="sticky top-0 z-10 mt-4 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto max-w-5xl space-y-2 px-4 py-2">
          {products.length > 8 && (
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔎 Rechercher un produit" className="input py-2" />
          )}
          {usedCategories.length > 0 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip active={filter === "all"} onClick={() => setFilter("all")}>Tout</Chip>
              {usedCategories.map((c) => (
                <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>{c.name}</Chip>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Produits */}
      <main className="mx-auto max-w-5xl px-4 py-4">
        {visible.length === 0 ? (
          <p className="py-16 text-center text-stone-500">{products.length ? "Aucun produit ne correspond." : "Les produits arrivent bientôt."}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => {
              const qty = cart[p.id] ?? 0;
              return (
                <li key={p.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
                  <button type="button" onClick={() => setZoom(p)} className="relative aspect-square bg-stone-100">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} loading="lazy" className="size-full object-cover" />
                    ) : (
                      <span className="grid size-full place-items-center text-4xl">📦</span>
                    )}
                    {!p.in_stock && (
                      <span className="absolute top-2 left-2 rounded-full bg-stone-900/80 px-2 py-0.5 text-xs font-bold text-white">Épuisé</span>
                    )}
                  </button>
                  <div className="flex flex-1 flex-col p-2.5">
                    <p className="line-clamp-2 text-sm font-semibold">{p.name}</p>
                    <p className="mt-0.5 font-extrabold" style={{ color: accent }}>{formatFCFA(p.price)}</p>
                    <div className="mt-auto pt-2">
                      {!p.in_stock ? (
                        <span className="block rounded-xl bg-stone-100 py-2 text-center text-sm text-stone-400">Indisponible</span>
                      ) : qty === 0 ? (
                        <button type="button" onClick={() => setQty(p.id, 1)} className="w-full rounded-xl py-2 text-sm font-bold text-white" style={{ background: accent }}>
                          Ajouter
                        </button>
                      ) : (
                        <Stepper qty={qty} onChange={(n) => setQty(p.id, n)} />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-10 text-center text-xs text-stone-400">
          <a href={SITE_URL}>Boutique créée avec MonDjassa</a>
        </p>
      </main>

      {/* Barre panier */}
      {count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 z-20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={() => setOpen(true)} className="btn-whatsapp mx-auto flex w-full max-w-md justify-between shadow-lg">
            <span className="rounded-lg bg-white/25 px-2 py-0.5 text-sm">{count}</span>
            <span>Voir mon panier</span>
            <span>{formatFCFA(subtotal)}</span>
          </button>
        </div>
      )}

      {open && <Checkout shop={shop} zones={zones} lines={lines} subtotal={subtotal} setQty={setQty} onClose={() => setOpen(false)} onSent={() => setCart({})} />}

      {zoom && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setZoom(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {zoom.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={zoom.image_url} alt={zoom.name} className="max-h-[60vh] w-full object-contain bg-stone-100" />
            )}
            <div className="space-y-2 p-4">
              <p className="text-lg font-bold">{zoom.name}</p>
              <p className="text-xl font-extrabold" style={{ color: accent }}>{formatFCFA(zoom.price)}</p>
              {zoom.description && <p className="whitespace-pre-line text-sm text-stone-600">{zoom.description}</p>}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setZoom(null)} className="btn-ghost flex-1">Fermer</button>
                {zoom.in_stock && (
                  <button type="button" className="btn flex-1 text-white" style={{ background: accent }}
                    onClick={() => { setQty(zoom.id, (cart[zoom.id] ?? 0) + 1); setZoom(null); }}>
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkout({
  shop,
  zones,
  lines,
  subtotal,
  setQty,
  onClose,
  onSent,
}: {
  shop: Shop;
  zones: DeliveryZone[];
  lines: { product: Product; qty: number }[];
  subtotal: number;
  setQty: (id: string, qty: number) => void;
  onClose: () => void;
  onSent: () => void;
}) {
  const payments = [
    shop.accepts_cash && "À la livraison",
    shop.accepts_wave && "Wave",
    shop.accepts_orange_money && "Orange Money",
  ].filter(Boolean) as string[];

  const [zoneId, setZoneId] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [payment, setPayment] = useState(payments[0] ?? "");
  const [error, setError] = useState("");
  const zone = zones.find((z) => z.id === zoneId);
  const total = subtotal + (zone?.fee ?? 0);

  useEffect(() => {
    if (lines.length === 0) onClose();
  }, [lines.length, onClose]);

  function send() {
    if (zones.length && !zone) return setError("Choisis ta commune de livraison.");
    if (!name.trim()) return setError("Indique ton nom.");
    setError("");

    const msg = [
      `Bonjour ${shop.name} 👋`,
      "Je voudrais commander :",
      "",
      ...lines.map((l) => `• ${l.qty} x ${l.product.name} : ${formatFCFA(l.qty * l.product.price)}`),
      "",
      `Sous-total : ${formatFCFA(subtotal)}`,
      ...(zone ? [`Livraison (${zone.commune}) : ${zone.fee ? formatFCFA(zone.fee) : "gratuite"}`, `*Total : ${formatFCFA(total)}*`] : []),
      "",
      `Nom : ${name.trim()}`,
      ...(place.trim() ? [`Lieu de livraison : ${place.trim()}`] : []),
      ...(payment ? [`Paiement : ${payment}`] : []),
      "",
      `(Commande passée sur ${SITE_URL.replace(/^https?:\/\//, "")}/${shop.slug})`,
    ].join("\n");

    createClient().rpc("log_shop_event", { p_shop_id: shop.id, p_type: "order_click" }).then(() => {});
    window.location.href = waLink(shop.whatsapp, msg);
    onSent();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-4 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Mon panier</h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-stone-100" aria-label="Fermer">×</button>
        </div>

        <ul className="divide-y divide-stone-100">
          {lines.map((l) => (
            <li key={l.product.id} className="flex items-center gap-3 py-2">
              {l.product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.product.image_url} alt="" className="size-12 rounded-lg object-cover" />
              ) : (
                <span className="grid size-12 place-items-center rounded-lg bg-stone-100">📦</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{l.product.name}</p>
                <p className="text-sm text-stone-500">{formatFCFA(l.product.price * l.qty)}</p>
              </div>
              <div className="w-28">
                <Stepper qty={l.qty} onChange={(n) => setQty(l.product.id, n)} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-3">
          {zones.length > 0 && (
            <div>
              <label className="label" htmlFor="zone">Ta commune</label>
              <select id="zone" className="input" value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
                <option value="" disabled>Choisir…</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.commune} · {z.fee ? formatFCFA(z.fee) : "livraison gratuite"}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label" htmlFor="cname">Ton nom</label>
            <input id="cname" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="place">Quartier et repère (facultatif)</label>
            <input id="place" className="input" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ex : Riviera 2, près de la pharmacie" />
          </div>
          {payments.length > 1 && (
            <div>
              <span className="label">Paiement</span>
              <div className="flex flex-wrap gap-2">
                {payments.map((p) => (
                  <Chip key={p} active={payment === p} onClick={() => setPayment(p)}>{p}</Chip>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1 rounded-xl bg-stone-50 p-3 text-sm">
          <Row label="Sous-total" value={formatFCFA(subtotal)} />
          {zone && <Row label={`Livraison (${zone.commune})`} value={zone.fee ? formatFCFA(zone.fee) : "Gratuite"} />}
          <Row label="Total" value={formatFCFA(total)} bold />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="button" onClick={send} className="btn-whatsapp mt-4 w-full text-lg">
          Envoyer ma commande sur WhatsApp
        </button>
        <p className="mt-2 text-center text-xs text-stone-500">WhatsApp va s&apos;ouvrir avec ta commande déjà écrite. Tu n&apos;as plus qu&apos;à l&apos;envoyer.</p>
      </div>
    </div>
  );
}

function Stepper({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-stone-100">
      <button type="button" onClick={() => onChange(qty - 1)} className="grid size-9 place-items-center text-lg font-bold" aria-label="Retirer un">−</button>
      <span className="text-sm font-bold">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)} className="grid size-9 place-items-center text-lg font-bold" aria-label="Ajouter un">+</button>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${active ? "text-white ring-transparent" : "bg-white text-stone-700 ring-stone-200"}`}
      style={active ? { background: "var(--accent)" } : undefined}
    >
      {children}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">{children}</span>;
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "pt-1 text-base font-extrabold" : "text-stone-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
