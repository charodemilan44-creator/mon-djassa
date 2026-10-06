import Link from "next/link";
import { Logo } from "@/components/Logo";
import { isAdmin, requireShop } from "@/lib/shop";
import { signOut } from "../connexion/actions";
import { DashboardNav } from "./DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [{ shop, access }, admin] = await Promise.all([requireShop({ allowExpired: true }), isAdmin()]);

  return (
    <div className="min-h-dvh pb-24 md:pb-10">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-4">
          {admin && <Link href="/admin" className="text-sm font-semibold text-brand">Admin</Link>}
          <form action={signOut}>
            <button className="text-sm font-semibold text-mute hover:text-ink">Déconnexion</button>
          </form>
          </div>
        </div>
        <div className="mx-auto hidden max-w-3xl px-4 pb-2 md:block">
          <DashboardNav />
        </div>
      </header>

      {access.status === "trial" && access.daysLeft <= 7 && (
        <Banner tone="warn">
          Il te reste {access.daysLeft} jour{access.daysLeft > 1 ? "s" : ""} d&apos;essai.{" "}
          <Link href="/dashboard/abonnement" className="underline">Choisir un abonnement</Link>
        </Banner>
      )}
      {access.status === "expired" && (
        <Banner tone="danger">
          Ton essai est terminé : ta boutique <b>{shop.name}</b> est en pause.{" "}
          <Link href="/dashboard/abonnement" className="underline">Payer pour la réactiver</Link>
        </Banner>
      )}

      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>

      <div className="md:hidden">
        <DashboardNav />
      </div>
    </div>
  );
}

function Banner({ tone, children }: { tone: "warn" | "danger"; children: React.ReactNode }) {
  return (
    <div className={tone === "warn" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900"}>
      <p className="mx-auto max-w-3xl px-4 py-2 text-sm font-medium">{children}</p>
    </div>
  );
}
