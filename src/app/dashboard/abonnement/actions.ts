"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/FormMessage";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

/** La vendeuse déclare son paiement Wave ; l'admin le valide ensuite. */
export async function declarePayment(_prev: FormState, formData: FormData): Promise<FormState> {
  const plan = formData.get("plan") === "yearly" ? "yearly" : "monthly";
  const reference = String(formData.get("reference") ?? "").trim();
  if (reference.length < 3) return { error: "Colle le numéro de la transaction Wave (il est dans le reçu Wave)." };

  const supabase = await createClient();
  const { data: until, error } = await supabase.rpc("request_payment", { p_plan: plan, p_reference: reference });
  if (error) {
    if (error.message.includes("deja en verification")) return { error: "Ton paiement précédent est encore en vérification. Réessaie un peu plus tard." };
    if (error.message.includes("deja utilisee")) return { error: "Ce numéro de transaction a déjà été utilisé." };
    return { error: "Ta déclaration n'a pas pu être envoyée. Réessaie." };
  }
  revalidatePath("/dashboard", "layout");
  return { ok: `Merci ! Ton abonnement est activé jusqu'au ${formatDate(until as string)}.` };
}
