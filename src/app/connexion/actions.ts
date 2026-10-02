"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/components/FormMessage";
import { createClient } from "@/lib/supabase/server";
import { normalizePhone, phoneToAuthEmail } from "@/lib/utils";

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (!phone) return { error: "Ce numéro ne semble pas valide. Exemple : 07 01 02 03 04" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: phoneToAuthEmail(phone), password });
  if (error) return { error: "Numéro ou mot de passe incorrect." };

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
