"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/FormMessage";
import { createClient } from "@/lib/supabase/server";

/** La vendeuse déclare son paiement Wave ; l'admin le valide ensuite. */
export async function declarePayment(_prev: FormState, formData: FormData): Promise<FormState> {
  const plan = formData.get("plan") === "yearly" ? "yearly" : "monthly";
  const reference = String(formData.get("reference") ?? "").trim();
  if (reference.length < 3) return { error: "Colle le numéro de la transaction Wave (il est dans le reçu Wave)." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("request_payment", { p_plan: plan, p_reference: reference });
  if (error) {
    return { error: error.message.includes("trop de demandes") ? "Tu as déjà des paiements en attente de vérification." : "Ta déclaration n'a pas pu être envoyée. Réessaie." };
  }
  revalidatePath("/dashboard/abonnement");
  return { ok: "Merci ! Ton paiement est en cours de vérification. Ta boutique sera activée dès qu'il est confirmé." };
}
