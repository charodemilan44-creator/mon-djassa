"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/components/FormMessage";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { RESERVED_SLUGS, normalizePhone, phoneToAuthEmail, slugify, SITE_HOST } from "@/lib/utils";

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const shopName = String(formData.get("shop_name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") || shopName));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (shopName.length < 2) return { error: "Donne un nom à ta boutique." };
  if (slug.length < 3) return { error: "Le lien de ta boutique doit faire au moins 3 lettres." };
  if (RESERVED_SLUGS.has(slug)) return { error: "Ce lien n'est pas disponible, choisis-en un autre." };
  if (!phone) return { error: "Ce numéro WhatsApp ne semble pas valide. Exemple : 07 01 02 03 04" };

  const supabase = await createClient();
  const {
    data: { user: current },
  } = await supabase.auth.getUser();

  const { data: taken } = await supabase.from("shops").select("id").eq("slug", slug).maybeSingle();
  if (taken) return { error: `Le lien ${SITE_HOST}/${slug} est déjà pris. Essaie une autre variante.` };

  let userId = current?.id;
  let createdNow = false;

  if (!userId) {
    if (password.length < 6) return { error: "Le mot de passe doit faire au moins 6 caractères." };
    // Compte créé avec le numéro (sans email ni SMS pour l'instant)
    const admin = createServiceClient();
    const { data, error } = await admin.auth.admin.createUser({
      email: phoneToAuthEmail(phone),
      password,
      email_confirm: true,
      user_metadata: { phone },
    });
    if (error || !data.user) {
      if (error?.message?.toLowerCase().includes("already")) {
        return { error: "Ce numéro a déjà un compte. Connecte-toi plutôt." };
      }
      return { error: "Impossible de créer le compte pour le moment. Réessaie." };
    }
    userId = data.user.id;
    createdNow = true;

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: phoneToAuthEmail(phone), password });
    if (signInError) return { error: "Compte créé, mais la connexion a échoué. Essaie de te connecter." };
  }

  const { error: shopError } = await supabase.from("shops").insert({ owner_id: userId, slug, name: shopName, whatsapp: phone });
  if (shopError) {
    if (createdNow) {
      await supabase.auth.signOut();
      await createServiceClient().auth.admin.deleteUser(userId);
    }
    if (shopError.code === "23505") return { error: `Le lien ${SITE_HOST}/${slug} est déjà pris.` };
    return { error: "Impossible de créer la boutique pour le moment. Réessaie." };
  }

  redirect("/dashboard?bienvenue=1");
}
