"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/FormMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { formatFCFA } from "@/lib/utils";
import { declarePayment } from "./actions";

export function DeclareForm({ monthly, yearly }: { monthly: number; yearly: number }) {
  const [state, action] = useActionState(declarePayment, undefined);
  return (
    <form action={action} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {[
          { v: "monthly", l: "Mensuel", p: monthly },
          { v: "yearly", l: "Annuel", p: yearly },
        ].map((o, i) => (
          <label key={o.v} className="cursor-pointer">
            <input type="radio" name="plan" value={o.v} defaultChecked={i === 0} className="peer sr-only" />
            <span className="block rounded-xl border border-line bg-white px-3 py-2.5 text-center text-sm transition peer-checked:border-ink peer-checked:ring-2 peer-checked:ring-ink/10">
              <span className="block font-semibold">{o.l}</span>
              <span className="block text-xs text-mute">{formatFCFA(o.p)}</span>
            </span>
          </label>
        ))}
      </div>
      <div>
        <label className="label" htmlFor="reference">Numéro de la transaction Wave</label>
        <input id="reference" name="reference" required maxLength={80} className="input" placeholder="Ex : T_ABC123XYZ" autoComplete="off" />
        <p className="mt-1 text-xs text-mute">Tu le trouves dans l&apos;historique Wave, en touchant le paiement.</p>
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Envoi…">J&apos;ai payé</SubmitButton>
    </form>
  );
}
