import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Créer ma boutique" };

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <Logo />
      <h1 className="mt-8 text-2xl font-extrabold">Crée ta boutique</h1>
      <p className="mt-1 text-stone-600">C&apos;est gratuit pendant 1 mois.</p>
      <div className="mt-6">
        <SignupForm withAccount={!user} />
      </div>
      {!user && (
        <p className="mt-6 text-center text-sm text-stone-600">
          Tu as déjà une boutique ? <Link href="/connexion" className="font-semibold text-brand">Connecte-toi</Link>
        </p>
      )}
    </main>
  );
}
