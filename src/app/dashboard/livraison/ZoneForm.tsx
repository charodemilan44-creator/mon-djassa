"use client";

import { useActionState, useState } from "react";
import { FormMessage } from "@/components/FormMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { ABIDJAN_COMMUNES } from "@/lib/utils";
import { addZone } from "./actions";

export function ZoneForm({ existing }: { existing: string[] }) {
  const [state, action] = useActionState(addZone, undefined);
  const [commune, setCommune] = useState("");
  const options = ABIDJAN_COMMUNES.filter((c) => !existing.includes(c));

  return (
    <form action={action} className="card space-y-3">
      <h2 className="font-bold">Ajouter une commune</h2>
      <select name="commune" required className="input" value={commune} onChange={(e) => setCommune(e.target.value)}>
        <option value="" disabled>Choisir…</option>
        {options.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value="autre">Autre (préciser)</option>
      </select>
      {commune === "autre" && <input name="other" required className="input" placeholder="Ex : Bouaké, Riviera 3…" maxLength={60} />}
      <div>
        <label className="label" htmlFor="fee">Frais de livraison (FCFA)</label>
        <input id="fee" name="fee" inputMode="numeric" className="input" placeholder="1500 (0 si gratuit)" />
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Ajout…">Ajouter</SubmitButton>
    </form>
  );
}
