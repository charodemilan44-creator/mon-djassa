"use client";

import Link from "next/link";
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
  demo,
}: {
  shop: Shop;
  products: Product[];
  categories: Category[];
  zones: DeliveryZone[];
  demo?: boolean;
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
    if (demo) return;
    try {
      const seen = `mondjassa-vu-${shop.id}`;
      if (sessionStorage.getItem(seen)) return;
      sessionStorage.setItem(seen, "1");
    } catch {}
    createClient().rpc("log_shop_event", { p_shop_id: shop.id, p_type: "visit" }).then(() => {});
  }, [cartKey, shop.id, demo]);

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
  const initials = shop.name.split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("");

  return (
    <div style={{ "--accent": accent } as React.CSSProperties} className="min-h-dvh bg-paper pb-28">
      {demo && (
        <Link href="/inscription" className="block bg-ink px-4 py-2.5 text-center text-xs text-white/80">
          Ceci est une boutique exemple. <span className="font-semibold text-white underline underline-offset-2">Crée la tienne gratuitement</span>
        </Link>
      )}
      {/* Barre du haut, toujours visible */}
      <div className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <ShopAvatar shop={shop} initials={initials} className="size-8 text-xs" />
          <p className="min-w-0 flex-1 truncate font-display text-[15px] font-bold tight">{shop.name}</p>
          <button type="button" onClick={() => count > 0 && setOpen(true)} className="relative grid size-10 place-items-center rounded-full border border-line bg-white transition hover:border-ink/30" aria-label="Mon panier">
            <BagIcon className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold leading-5 text-white" style={{ background: accent }}>{count}</span>
            )}
          </button>
        </div>
      </div>

      {/* Présentation de la boutique */}
      <header className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative overflow-hidden rounded-3xl">
          {shop.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shop.banner_url} alt="" className="h-40 w-full object-cover sm:h-64" />
          ) : (
            <div className="relative h-32 sm:h-48" style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 55%, #121110))` }}>
              <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:18px_18px]" />
            </div>
          )}
        </div>
        <div className="relative -mt-10 px-2 sm:-mt-8 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <ShopAvatar shop={shop} initials={initials} className="size-20 border-4 border-paper text-2xl shadow-lg sm:size-24" />
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold tight sm:text-3xl">{shop.name}</h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-mute">
                <span className="size-2 rounded-full bg-leaf" /> Commandes sur WhatsApp
              </p>
            </div>
          </div>
        </div>
        {shop.description && <p className="mt-4 max-w-2xl px-2 text-[15px] leading-relaxed text-ink/75 sm:px-6">{shop.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2 px-2 text-xs sm:px-6">
          {shop.hours && <Pill icon={<ClockIcon />}>{shop.hours}</Pill>}
          {zones.length > 0 && (
            <Pill icon={<TruckIcon />}>
              Livraison {zones.length > 3 ? `dans ${zones.length} communes` : `à ${zones.map((z) => z.commune).join(", ")}`}
            </Pill>
          )}
          {shop.accepts_cash && <Pill>Paiement à la livraison</Pill>}
          {shop.accepts_wave && <Pill>Wave</Pill>}
          {shop.accepts_orange_money && <Pill>Orange Money</Pill>}
        </div>
      </header>

      {/* Recherche et catégories */}
      <div className="sticky top-14 z-10 mt-6 border-y border-line bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:px-6">
          {usedCategories.length > 0 && (
            <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
              <Chip active={filter === "all"} onClick={() => setFilter("all")}>Tout</Chip>
              {usedCategories.map((c) => (
                <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>{c.name}</Chip>
              ))}
            </div>
          )}
          {products.length > 6 && (
            <label className="relative sm:ml-auto sm:w-64">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher" className="w-full rounded-full border border-line bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-ink/40" />
            </label>
          )}
        </div>
      </div>

      {/* Produits */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="mb-4 text-sm text-mute">{visible.length} produit{visible.length > 1 ? "s" : ""}</p>
        {visible.length === 0 ? (
          <p className="py-16 text-center text-mute">{products.length ? "Aucun produit ne correspond." : "Les produits arrivent bientôt."}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {visible.map((p, i) => {
              const qty = cart[p.id] ?? 0;
              return (
                <li key={p.id} className="group animate-rise" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                  <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                    <button type="button" onClick={() => setZoom(p)} className="block w-full" aria-label={`Voir ${p.name}`}>
                      <ProductImage product={p} index={i} className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.04]" />
                    </button>
                    {!p.in_stock && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white">Épuisé</span>
                    )}
                    {p.in_stock && (
                      <div className="absolute bottom-2.5 right-2.5">
                        {qty === 0 ? (
                          <button type="button" onClick={() => setQty(p.id, 1)} className="grid size-10 place-items-center rounded-full bg-white text-ink shadow-lg shadow-ink/10 ring-1 ring-line transition hover:scale-105 active:scale-95" aria-label={`Ajouter ${p.name}`}>
                            <PlusIcon className="size-5" />
                          </button>
                        ) : (
                          <Stepper qty={qty} onChange={(n) => setQty(p.id, n)} floating />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5 px-0.5">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{p.name}</p>
                    <p className="mt-1 text-[15px] font-bold">{formatFCFA(p.price)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <a href={SITE_URL} className="mx-auto mt-16 flex w-fit items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-mute transition hover:text-ink">
          Boutique créée avec <span className="font-display font-bold text-ink">mon<span className="text-brand">djassa</span></span>
        </a>
      </main>

      {/* Barre panier */}
      {count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 z-20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={() => setOpen(true)} className="animate-rise mx-auto flex w-full max-w-md items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-5 text-white shadow-2xl shadow-ink/30">
            <span className="grid size-10 place-items-center rounded-full text-sm font-bold" style={{ background: accent }}>{count}</span>
            <span className="flex-1 text-left text-sm font-semibold">Voir mon panier</span>
            <span className="text-sm font-bold">{formatFCFA(subtotal)}</span>
          </button>
        </div>
      )}

      {open && <Checkout shop={shop} zones={zones} lines={lines} subtotal={subtotal} setQty={setQty} onClose={() => setOpen(false)} onSent={() => setCart({})} />}

      {zoom && (
        <Sheet onClose={() => setZoom(null)}>
          <ProductImage product={zoom} index={products.indexOf(zoom)} className="aspect-square max-h-[55vh] w-full" contain />
          <div className="space-y-2 p-5">
            <p className="font-display text-xl font-bold tight">{zoom.name}</p>
            <p className="text-lg font-bold" style={{ color: accent }}>{formatFCFA(zoom.price)}</p>
            {zoom.description && <p className="whitespace-pre-line text-sm leading-relaxed text-mute">{zoom.description}</p>}
            <div className="flex gap-2 pt-3">
              <button type="button" onClick={() => setZoom(null)} className="btn-ghost flex-1">Fermer</button>
              {zoom.in_stock && (
                <button type="button" className="btn flex-1 bg-ink text-white hover:bg-ink/90"
                  onClick={() => { setQty(zoom.id, (cart[zoom.id] ?? 0) + 1); setZoom(null); }}>
                  Ajouter au panier
                </button>
              )}
            </div>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// Photo du produit, ou un fond neutre avec l'initiale quand la vendeuse n'a pas encore mis de photo
function ProductImage({ product, className = "", contain }: { product: Product; index?: number; className?: string; contain?: boolean }) {
  if (product.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={product.image_url} alt={product.name} loading="lazy" className={`${contain ? "bg-paper object-contain" : "object-cover"} ${className}`} />
    );
  }
  return (
    <div className={`grid place-items-center bg-gradient-to-br from-[#f1ece5] to-[#e6dfd5] ${className}`}>
      <span className="font-display text-4xl font-bold text-ink/15">{product.name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function ShopAvatar({ shop, initials, className = "" }: { shop: Shop; initials: string; className?: string }) {
  return shop.logo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={shop.logo_url} alt="" className={`shrink-0 rounded-full bg-white object-cover ${className}`} />
  ) : (
    <span className={`grid shrink-0 place-items-center rounded-full font-display font-bold text-white ${className}`} style={{ background: shop.color }}>
      {initials}
    </span>
  );
}

function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="animate-rise max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
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
    <Sheet onClose={onClose}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/90 px-5 py-4 backdrop-blur">
        <h2 className="font-display text-lg font-bold tight">Mon panier</h2>
        <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full border border-line text-mute transition hover:text-ink" aria-label="Fermer">
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>

      <div className="p-5">
        <ul className="space-y-3">
          {lines.map((l, i) => (
            <li key={l.product.id} className="flex items-center gap-3">
              <ProductImage product={l.product} index={i} className="size-14 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.product.name}</p>
                <p className="text-sm font-bold">{formatFCFA(l.product.price * l.qty)}</p>
              </div>
              <Stepper qty={l.qty} onChange={(n) => setQty(l.product.id, n)} />
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-4 border-t border-line pt-5">
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

        <div className="mt-6 space-y-2 rounded-2xl bg-paper p-4 text-sm">
          <Row label="Sous-total" value={formatFCFA(subtotal)} />
          {zone && <Row label={`Livraison (${zone.commune})`} value={zone.fee ? formatFCFA(zone.fee) : "Gratuite"} />}
          <div className="border-t border-line pt-2">
            <Row label="Total" value={formatFCFA(total)} bold />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="button" onClick={send} className="btn-whatsapp mt-5 w-full py-3.5 text-base">
          Commander sur WhatsApp
        </button>
        <p className="mt-3 text-center text-xs text-mute">WhatsApp s&apos;ouvre avec ta commande déjà écrite. Tu n&apos;as plus qu&apos;à l&apos;envoyer.</p>
      </div>
    </Sheet>
  );
}

function Stepper({ qty, onChange, floating }: { qty: number; onChange: (n: number) => void; floating?: boolean }) {
  return (
    <div className={`flex h-10 items-center rounded-full ${floating ? "bg-ink text-white shadow-lg shadow-ink/20" : "border border-line bg-white"}`}>
      <button type="button" onClick={() => onChange(qty - 1)} className="grid size-10 place-items-center" aria-label="Retirer un">
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M5 10h10" /></svg>
      </button>
      <span className="min-w-4 text-center text-sm font-bold">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)} className="grid size-10 place-items-center" aria-label="Ajouter un">
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/70 hover:border-ink/30 hover:text-ink"}`}
    >
      {children}
    </button>
  );
}

function Pill({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-ink/70">
      {icon}
      {children}
    </span>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : "text-mute"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

const ico = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
function BagIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...ico} aria-hidden><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2" /></svg>;
}
function PlusIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" className={className} {...ico} strokeWidth={2.2} aria-hidden><path d="M10 4v12M4 10h12" /></svg>;
}
function SearchIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...ico} strokeWidth={2} aria-hidden><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></svg>;
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" className="size-3.5" {...ico} strokeWidth={2} aria-hidden><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
}
function TruckIcon() {
  return <svg viewBox="0 0 24 24" className="size-3.5" {...ico} strokeWidth={2} aria-hidden><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>;
}
