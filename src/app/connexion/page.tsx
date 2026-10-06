import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { SUPPORT_WHATSAPP, waLink } from "@/lib/utils";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <Logo />
      <h1 className="mt-8 font-display text-2xl font-bold tight">Content de te revoir</h1>
      <p className="mt-1 text-mute">Connecte-toi pour gérer ta boutique.</p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-mute">
        Pas encore de boutique ? <Link href="/inscription" className="font-semibold text-brand">Crée-la gratuitement</Link>
      </p>
      {SUPPORT_WHATSAPP && (
        <p className="mt-2 text-center text-sm text-mute">
          Mot de passe oublié ?{" "}
          <a className="font-semibold text-leaf" href={waLink(SUPPORT_WHATSAPP, "Bonjour MonDjassa, j'ai oublié mon mot de passe.")}>
            Écris-nous sur WhatsApp
          </a>
        </p>
      )}
    </main>
  );
}
