"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/shop";
import { createServiceClient } from "@/lib/supabase/server";

/** Paiement trouvé dans l'appli Wave : il passe dans l'historique. */
export async function approveRequest(formData: FormData) {
  await requireAdmin();
  await createServiceClient().rpc("admin_approve_payment", { p_id: String(formData.get("id")) });
  revalidatePath("/admin");
}

/** Paiement introuvable dans Wave : la période accordée est retirée à la boutique. */
export async function rejectRequest(formData: FormData) {
  await requireAdmin();
  await createServiceClient().rpc("admin_reject_payment", { p_id: String(formData.get("id")) });
  revalidatePath("/admin");
}
