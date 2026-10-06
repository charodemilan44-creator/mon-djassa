import { requireShop } from "@/lib/shop";
import type { Payment } from "@/lib/types";
import { PRICE_MONTHLY, PRICE_YEARLY, SUPPORT_WHATSAPP, formatDate, formatFCFA, waLink, wavePayUrl } from "@/lib/utils";
import { DeclareForm } from "./DeclareForm";

const METHOD = { wave: "Wave", orange_money: "Orange Money", autre: "Autre" } as const;

export default async function SubscriptionPage() {
  const { supabase, shop, access } = await requireShop({ allowExpired: true });
  const { data: payments } = await supabase
    .from("payments")
    .select("id, plan, amount, method, reference, created_at")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false })
    .returns<Payment[]>();

  const { data: requests } = await supabase
    .from("payment_requests")
    .select("id, plan, amount, reference, status, created_at")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<{ id: string; plan: string; amount: number; reference: string; status: "pending" | "approved" | "rejected"; created_at: string }[]>();
  const pending = (requests ?? []).filter((r) => r.status === "pending");
  const helpLink = SUPPORT_WHATSAPP ? waLink(SUPPORT_WHATSAPP, `Bonjour MonDjassa, j'ai une question sur l'abonnement de ma boutique « ${shop.name} ».`) : "";

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold tight">Abonnement</h1>

      <div className={`card ${access.open ? "" : "border-red-300 bg-red-50"}`}>
        <p className="text-sm text-mute">Statut</p>
        <p className="text-lg font-bold">
          {access.status === "trial" && `Essai gratuit : ${access.daysLeft} jour${access.daysLeft > 1 ? "s" : ""} restant${access.daysLeft > 1 ? "s" : ""}`}
          {access.status === "active" && "Abonnement actif"}
          {access.status === "expired" && "Boutique en pause"}
        </p>
        <p className="text-sm text-mute">
          {access.open
            ? `Ta boutique est en ligne jusqu'au ${formatDate(access.until)}.`
            : "Tes clientes ne peuvent plus voir ta boutique. Tes produits sont gardés : paie pour tout réactiver."}
        </p>
      </div>

      <section className="card space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold tight">1. Paie avec Wave</h2>
          <p className="text-sm text-mute">L&apos;argent est envoyé directement à MonDjassa.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Plan title="Mensuel" price={PRICE_MONTHLY} per="par mois" href={wavePayUrl(PRICE_MONTHLY)} />
          <Plan title="Annuel" price={PRICE_YEARLY} per="par an, plus de 7 mois offerts" href={wavePayUrl(PRICE_YEARLY)} highlight />
        </div>
      </section>

      <section className="card space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold tight">2. Confirme ton paiement</h2>
          <p className="text-sm text-mute">Ton abonnement est activé tout de suite.</p>
        </div>
        {pending.length > 0 && (
          <ul className="space-y-2">
            {pending.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-leaf/10 px-3 py-2.5 text-sm text-leaf">
                <span>{r.plan === "yearly" ? "Annuel" : "Mensuel"} · {formatFCFA(r.amount)} · {r.reference}</span>
                <span className="shrink-0 font-semibold">Activé</span>
              </li>
            ))}
          </ul>
        )}
        <DeclareForm monthly={PRICE_MONTHLY} yearly={PRICE_YEARLY} />
      </section>

      <p className="text-xs text-mute">
        Si tu paies pendant l&apos;essai, ton abonnement commence à la fin du mois gratuit : tu ne perds aucun jour.
        {helpLink && (
          <>
            {" "}Un souci ? <a href={helpLink} target="_blank" rel="noreferrer" className="font-semibold text-ink underline">Écris au support</a>.
          </>
        )}
      </p>

      <section className="card">
        <h2 className="mb-2 font-bold">Historique</h2>
        {!payments?.length ? (
          <p className="text-sm text-mute">Aucun paiement pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex justify-between py-2">
                <span>
                  {formatDate(p.created_at)} · {p.plan === "yearly" ? "Annuel" : "Mensuel"} · {METHOD[p.method]}
                </span>
                <span className="font-semibold">{formatFCFA(p.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Plan(props: { title: string; price: number; per: string; href: string; highlight?: boolean }) {
  return (
    <div className={`space-y-3 rounded-2xl border p-4 ${props.highlight ? "border-ink" : "border-line"}`}>
      <div>
        <p className="text-sm font-semibold text-mute">{props.title}</p>
        <p className="font-display text-2xl font-bold tight">{formatFCFA(props.price)}</p>
        <p className="text-xs text-mute">{props.per}</p>
      </div>
      {props.href ? (
        <a href={props.href} target="_blank" rel="noreferrer" className="btn w-full bg-[#1DC3F0] text-white hover:opacity-90">Payer avec Wave</a>
      ) : (
        <span className="btn w-full cursor-not-allowed bg-sand text-mute">Paiement bientôt disponible</span>
      )}
    </div>
  );
}
