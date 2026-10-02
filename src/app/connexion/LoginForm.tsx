"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/FormMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { signIn } from "./actions";

export function LoginForm() {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="phone">Ton numéro WhatsApp</label>
        <input id="phone" name="phone" type="tel" inputMode="tel" required className="input" placeholder="07 01 02 03 04" />
      </div>
      <div>
        <label className="label" htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" required className="input" />
      </div>
      <FormMessage state={state} />
      <SubmitButton pendingText="Connexion…">Me connecter</SubmitButton>
    </form>
  );
}
