"use client";

import { useActionState, useState } from "react";
import { FormMessage } from "@/components/FormMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { slugify, SITE_HOST } from "@/lib/utils";
import { signUp } from "./actions";

export function SignupForm({ withAccount }: { withAccount: boolean }) {
  const [state, action] = useActionState(signUp, undefined);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const shownSlug = slugEdited ? slug : slugify(name);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="shop_name">Nom de ta boutique</label>
        <input id="shop_name" name="shop_name" required className="input" placeholder="Ex : Awa Couture"
          value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="slug">Ton lien</label>
        <div className="flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
          <span className="pl-4 text-stone-500">{SITE_HOST}/</span>
          <input id="slug" name="slug" required className="w-full rounded-r-xl bg-transparent py-3 pr-4 outline-none"
            value={shownSlug} onChange={(e) => { setSlugEdited(true); setSlug(slugify(e.target.value)); }} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="phone">Ton numéro WhatsApp</label>
        <input id="phone" name="phone" type="tel" inputMode="tel" required className="input" placeholder="07 01 02 03 04" />
        <p className="mt-1 text-xs text-stone-500">Les commandes arriveront sur ce numéro. Il sert aussi à te connecter.</p>
      </div>
      {withAccount && (
        <div>
          <label className="label" htmlFor="password">Choisis un mot de passe</label>
          <input id="password" name="password" type="password" required minLength={6} className="input" placeholder="6 caractères minimum" />
        </div>
      )}
      <FormMessage state={state} />
      <SubmitButton pendingText="Création de ta boutique…">Créer ma boutique</SubmitButton>
      <p className="text-center text-xs text-stone-500">1 mois gratuit, sans carte bancaire.</p>
    </form>
  );
}
