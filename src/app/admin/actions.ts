"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/shop";
import { createServiceClient } from "@/lib/supabase/server";

type Request = { id: string; plan: string; reference: string; status: string; shops: { slug: string } | null };

/** Paiement vérifié dans l'appli Wave : on prolonge l'abonnement de la boutique. */
export async function approveRequest(formData: FormData) {
  await requireAdmin();
  const db = createServiceClient();
  const { data: req } = await db
    .from("payment_requests")
    .select("id, plan, reference, status, shops(slug)")
    .eq("id", String(formData.get("id")))
    .maybeSingle<Request>();
  if (!req || req.status !== "pending" || !req.shops) return;

  // On marque d'abord la demande pour ne jamais compter deux fois le même paiement
  const { data: claimed } = await db
    .from("payment_requests")
    .update({ status: "approved", decided_at: new Date().toISOString() })
    .eq("id", req.id)
    .eq("status", "pending")
    .select("id");
  if (!claimed?.length) return;

  const { error } = await db.rpc("admin_record_payment", { p_slug: req.shops.slug, p_plan: req.plan, p_method: "wave", p_reference: req.reference });
  if (error) await db.from("payment_requests").update({ status: "pending", decided_at: null }).eq("id", req.id);

  revalidatePath("/admin");
  revalidatePath(`/${req.shops.slug}`);
}

export async function rejectRequest(formData: FormData) {
  await requireAdmin();
  await createServiceClient()
    .from("payment_requests")
    .update({ status: "rejected", decided_at: new Date().toISOString() })
    .eq("id", String(formData.get("id")))
    .eq("status", "pending");
  revalidatePath("/admin");
}
