import type { Shop } from "./types";

export const PRICE_MONTHLY = 5000;
export const PRICE_YEARLY = 25000;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
/** Adresse affichée aux vendeuses, sans https:// (ex : mondjassa.netlify.app) */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
export const SUPPORT_WHATSAPP = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "";
/** Lien de paiement Wave de MonDjassa : les vendeuses y paient leur abonnement. */
export const WAVE_PAY_LINK = process.env.NEXT_PUBLIC_WAVE_PAY_LINK || "https://pay.wave.com/m/M_ci_No3HGRDDC3YB/c/ci/";

/** Ajoute le montant au lien Wave quand le lien l'accepte (liens pay.wave.com). */
export function wavePayUrl(amount: number) {
  if (!WAVE_PAY_LINK) return "";
  if (!/pay\.wave\.com/.test(WAVE_PAY_LINK)) return WAVE_PAY_LINK;
  const url = new URL(WAVE_PAY_LINK);
  url.searchParams.set("amount", String(amount));
  return url.toString();
}

export const ABIDJAN_COMMUNES = [
  "Abobo", "Adjamé", "Anyama", "Attécoubé", "Bingerville", "Cocody", "Grand-Bassam",
  "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Songon", "Treichville", "Yopougon",
  "Intérieur du pays",
];

// Adresses déjà utilisées par l'application : une boutique ne peut pas les prendre
export const RESERVED_SLUGS = new Set([
  "api", "aide", "admin", "auth", "connexion", "inscription", "deconnexion", "dashboard",
  "tarifs", "prix", "exemple", "support", "mondjassa", "boutique", "boutiques", "static", "public",
  "favicon-ico", "robots-txt", "sitemap-xml", "_next",
]);

/** 30000 -> "30 000 FCFA" (espaces simples, lisibles sur WhatsApp) */
export function formatFCFA(n: number) {
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

/** "Chez Awa Couture !" -> "chez-awa-couture" */
export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

/**
 * Normalise un numéro ivoirien au format WhatsApp (2250701020304).
 * Accepte "07 01 02 03 04", "+225 0701020304", "002250701020304"…
 * Renvoie null si le numéro n'est pas valide.
 */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10) d = "225" + d;
  if (/^225\d{10}$/.test(d)) return d;
  // Autres pays (diaspora, pays voisins) : on accepte un numéro international plausible
  if (/^[1-9]\d{7,14}$/.test(d) && !d.startsWith("225")) return d;
  return null;
}

/** "2250701020304" -> "+225 07 01 02 03 04" */
export function displayPhone(d: string) {
  if (/^225\d{10}$/.test(d)) return `+225 ${d.slice(3).replace(/(\d{2})(?=\d)/g, "$1 ")}`;
  return `+${d}`;
}

/** La connexion se fait avec le numéro : on le transforme en identifiant interne pour Supabase Auth. */
export function phoneToAuthEmail(phone: string) {
  return `${phone}@tel.mondjassa.ci`;
}

export function shopAccess(shop: Pick<Shop, "trial_ends_at" | "paid_until">, now = new Date()) {
  const trialEnd = new Date(shop.trial_ends_at);
  const paidUntil = shop.paid_until ? new Date(shop.paid_until) : null;
  const day = 24 * 60 * 60 * 1000;
  if (paidUntil && paidUntil > now) {
    return { status: "active" as const, open: true, until: paidUntil, daysLeft: Math.ceil((+paidUntil - +now) / day) };
  }
  if (trialEnd > now) {
    return { status: "trial" as const, open: true, until: trialEnd, daysLeft: Math.ceil((+trialEnd - +now) / day) };
  }
  return { status: "expired" as const, open: false, until: paidUntil ?? trialEnd, daysLeft: 0 };
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Abidjan" });
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
