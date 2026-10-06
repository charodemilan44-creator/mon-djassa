import { requireShop } from "@/lib/shop";
import type { Payment } from "@/lib/types";
import { PRICE_MONTHLY, PRICE_YEARLY, SUPPORT_WHATSAPP, formatDate, formatFCFA, waLink } from "@/lib/utils";

const METHOD = { wave: "Wave", orange_money: "Orange Money", autre: "Autre" } as const;

export default async function SubscriptionPage() {
  const { supabase, shop, access } = await requireShop({ allowExpired: true });
  const { data: payments } = await supabase
    .from("payments")
    .select("id, plan, amount, method, reference, created_at")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false })
    .returns<Payment[]>();

  // Paiement en ligne Wave / Orange Money à brancher plus tard.
  // Pour l'instant : la vendeuse paie, envoie la preuve sur WhatsApp, et l'équipe active
  // l'abonnement avec admin_record_payment() (voir README).
  const payLink = (plan: string, amount: number, method: string) =>
    SUPPORT_WHATSAPP
      ? waLink(
          SUPPORT_WHATSAPP,
          `Bonjour MonDjassa, je veux payer l'abonnement ${plan} (${formatFCFA(amount)}) par ${method} pour ma boutique « ${shop.name} » (mondjassa.ci/${shop.slug}).`,
        )
      : "#";

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

      <div className="grid gap-4 sm:grid-cols-2">
        <Plan title="Mensuel" price={PRICE_MONTHLY} per="par mois"
          wave={payLink("mensuel", PRICE_MONTHLY, "Wave")} om={payLink("mensuel", PRICE_MONTHLY, "Orange Money")} />
        <Plan title="Annuel" price={PRICE_YEARLY} per="par an, plus de 7 mois offerts" highlight
          wave={payLink("annuel", PRICE_YEARLY, "Wave")} om={payLink("annuel", PRICE_YEARLY, "Orange Money")} />
      </div>
      <p className="text-xs text-mute">
        Si tu paies pendant l&apos;essai, ton abonnement commence à la fin du mois gratuit : tu ne perds aucun jour.
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

function Plan(props: { title: string; price: number; per: string; wave: string; om: string; highlight?: boolean }) {
  return (
    <div className={`card space-y-3 ${props.highlight ? "border-2 border-brand" : ""}`}>
      <div>
        <p className="font-semibold text-mute">{props.title}</p>
        <p className="text-3xl font-bold">{formatFCFA(props.price)}</p>
        <p className="text-sm text-mute">{props.per}</p>
      </div>
      <a href={props.wave} target="_blank" rel="noreferrer" className="btn w-full bg-[#1DC3F0] text-white">Payer avec Wave</a>
      <a href={props.om} target="_blank" rel="noreferrer" className="btn w-full bg-[#FF7900] text-white">Payer avec Orange Money</a>
    </div>
  );
}
