"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/FormMessage";
import { ImageUpload } from "@/components/ImageUpload";
import { SubmitButton } from "@/components/SubmitButton";
import type { Shop } from "@/lib/types";
import { displayPhone } from "@/lib/utils";
import { saveShop } from "./actions";

const COLORS = ["#F77F00", "#009E60", "#B45309", "#BE185D", "#7C3AED", "#2563EB", "#0F766E", "#1C1917"];

export function ShopForm({ shop, userId }: { shop: Shop; userId: string }) {
  const [state, action] = useActionState(saveShop, undefined);

  return (
    <form action={action} className="space-y-5">
      <div className="card space-y-4">
        <h2 className="font-bold">Identité</h2>
        <div className="flex items-start gap-4">
          <ImageUpload name="logo_url" userId={userId} defaultUrl={shop.logo_url} label="Logo" shape="round" maxSize={400} />
          <div className="flex-1">
            <label className="label" htmlFor="name">Nom</label>
            <input id="name" name="name" required className="input" defaultValue={shop.name} />
          </div>
        </div>
        <ImageUpload name="banner_url" userId={userId} defaultUrl={shop.banner_url} label="Bannière (facultatif)" shape="wide" maxSize={1600} />
        <div>
          <label className="label" htmlFor="description">Présentation</label>
          <textarea id="description" name="description" rows={3} maxLength={500} className="input" defaultValue={shop.description ?? ""}
            placeholder="Ex : Robes et ensembles en wax, cousus main à Yopougon." />
        </div>
        <fieldset>
          <legend className="label">Couleur de ta boutique</legend>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="color" value={c} defaultChecked={shop.color.toUpperCase() === c} className="peer sr-only" />
                <span className="block size-10 rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-stone-900" style={{ background: c }} />
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="card space-y-4">
        <h2 className="font-bold">Contact et lien</h2>
        <div>
          <label className="label" htmlFor="whatsapp">Numéro WhatsApp des commandes</label>
          <input id="whatsapp" name="whatsapp" type="tel" required className="input" defaultValue={displayPhone(shop.whatsapp)} />
        </div>
        <div>
          <label className="label" htmlFor="slug">Lien de la boutique</label>
          <div className="flex items-center rounded-xl border border-stone-300 bg-white">
            <span className="pl-4 text-stone-500">mondjassa.ci/</span>
            <input id="slug" name="slug" required className="w-full rounded-r-xl bg-transparent py-3 pr-4 outline-none" defaultValue={shop.slug} />
          </div>
          <p className="mt-1 text-xs text-stone-500">Attention : si tu changes ton lien, l&apos;ancien ne marchera plus.</p>
        </div>
        <div>
          <label className="label" htmlFor="hours">Horaires (facultatif)</label>
          <input id="hours" name="hours" maxLength={120} className="input" defaultValue={shop.hours ?? ""} placeholder="Lun–Sam, 8h–20h" />
        </div>
      </div>

      <div className="card space-y-2">
        <h2 className="font-bold">Paiements acceptés</h2>
        <Check name="accepts_cash" label="Paiement à la livraison" checked={shop.accepts_cash} />
        <Check name="accepts_wave" label="Wave" checked={shop.accepts_wave} />
        <Check name="accepts_orange_money" label="Orange Money" checked={shop.accepts_orange_money} />
      </div>

      <FormMessage state={state} />
      <SubmitButton pendingText="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}

function Check({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-3 py-1">
      <input type="checkbox" name={name} defaultChecked={checked} className="size-5 accent-[var(--color-brand)]" />
      {label}
    </label>
  );
}
