import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { Shop } from "./types";
import { shopAccess } from "./utils";

/** Vendeuse connectée + sa boutique. Redirige vers la connexion sinon. */
export async function requireShop(opts: { allowExpired?: boolean } = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: shop } = await supabase.from("shops").select("*").eq("owner_id", user.id).maybeSingle<Shop>();
  if (!shop) redirect("/inscription?etape=boutique");

  const access = shopAccess(shop);
  // Après l'essai sans paiement, seules l'accueil et la page abonnement restent accessibles
  if (!access.open && !opts.allowExpired) redirect("/dashboard/abonnement");

  return { supabase, user, shop, access };
}

/** Numéros des admins MonDjassa (ADMIN_PHONES, sinon le numéro du support). */
function adminPhones() {
  return (process.env.ADMIN_PHONES || process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "")
    .split(",")
    .map((p) => p.replace(/\D/g, ""))
    .filter(Boolean);
}

/** Admin connecté (compte créé avec le numéro du support). Redirige sinon. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const phone = user.email?.split("@")[0] ?? "";
  if (!adminPhones().includes(phone)) redirect("/dashboard");
  return { user };
}

export async function isAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user && adminPhones().includes(user.email?.split("@")[0] ?? "");
}
