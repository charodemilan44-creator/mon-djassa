import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/shop";
import { createServiceClient } from "@/lib/supabase/server";
import { displayPhone, formatDate, formatFCFA, shopAccess, SITE_HOST } from "@/lib/utils";
import { approveRequest, rejectRequest } from "./actions";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  plan: "monthly" | "yearly";
  amount: number;
  reference: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  shops: { name: string; slug: string; whatsapp: string; trial_ends_at: string; paid_until: string | null } | null;
};

export default async function AdminPage() {
  await requireAdmin();
  const db = createServiceClient();
  const [{ data: rows }, { count: shopsCount }] = await Promise.all([
    db
      .from("payment_requests")
      .select("id, plan, amount, reference, status, created_at, shops(name, slug, whatsapp, trial_ends_at, paid_until)")
      .order("created_at", { ascending: false })
      .limit(60)
      .returns<Row[]>(),
    db.from("shops").select("id", { count: "exact", head: true }),
  ]);
  const pending = (rows ?? []).filter((r) => r.status === "pending");
  const done = (rows ?? []).filter((r) => r.status !== "pending").slice(0, 20);
  const cashed = (rows ?? []).filter((r) => r.status === "approved").reduce((n, r) => n + r.amount, 0);

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Logo />
          <Link href="/dashboard" className="text-sm font-semibold text-mute hover:text-ink">Mon espace</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <div>
          <h1 className="font-display text-2xl font-bold tight">Paiements à vérifier</h1>
          <p className="mt-1 text-sm text-mute">Ces abonnements sont déjà actifs. Vérifie chaque paiement dans ton appli Wave.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat label="En attente" value={String(pending.length)} />
          <Stat label="Boutiques" value={String(shopsCount ?? 0)} />
          <Stat label="Encaissé (récent)" value={formatFCFA(cashed)} />
        </div>

        {pending.length === 0 ? (
          <p className="card py-8 text-center text-sm text-mute">Aucun paiement en attente.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <li key={r.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.shops?.name ?? "Boutique supprimée"}</p>
                    <p className="text-xs text-mute">
                      {SITE_HOST}/{r.shops?.slug} · {r.shops ? displayPhone(r.shops.whatsapp) : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="block font-display text-lg font-bold">{formatFCFA(r.amount)}</span>
                    <span className="block text-xs text-mute">{r.plan === "yearly" ? "Annuel" : "Mensuel"}</span>
                  </p>
                </div>
                <div className="rounded-xl bg-paper px-3 py-2 text-sm">
                  <span className="text-mute">Transaction Wave : </span>
                  <span className="font-mono font-semibold break-all">{r.reference}</span>
                  <span className="block text-xs text-mute">Déclaré le {formatDate(r.created_at)}</span>
                </div>
                <p className="text-xs text-mute">Trouvé dans Wave : touche Confirmer. Introuvable : touche Refuser, la période offerte est retirée.</p>
                <div className="grid grid-cols-2 gap-2">
                  <form action={rejectRequest}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn-ghost w-full text-sm text-red-700">Refuser</button>
                  </form>
                  <form action={approveRequest}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn-primary w-full text-sm">Confirmer</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        {done.length > 0 && (
          <section className="card">
            <h2 className="mb-2 font-semibold">Déjà traités</h2>
            <ul className="divide-y divide-line text-sm">
              {done.map((r) => {
                const access = r.shops ? shopAccess(r.shops) : null;
                return (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="min-w-0 truncate">
                      {r.shops?.name} · {formatFCFA(r.amount)}
                      {access?.status === "active" && <span className="text-mute"> · actif jusqu&apos;au {formatDate(access.until)}</span>}
                    </span>
                    <span className={`shrink-0 text-xs font-semibold ${r.status === "approved" ? "text-leaf" : "text-red-700"}`}>
                      {r.status === "approved" ? "Confirmé" : "Refusé"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3 text-center">
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[11px] text-mute">{label}</p>
    </div>
  );
}
