import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PRICE_MONTHLY, PRICE_YEARLY, SUPPORT_WHATSAPP, formatFCFA, waLink, SITE_HOST } from "@/lib/utils";

const steps = [
  { n: "1", title: "J'ajoute mes produits", text: "Une photo, un nom, un prix. Directement depuis ton téléphone." },
  { n: "2", title: "Je partage mon lien", text: `Sur ton statut, dans tes groupes, sur TikTok : ${SITE_HOST}/ta-boutique.` },
  { n: "3", title: "Je reçois les commandes sur WhatsApp", text: "La cliente choisit, le message arrive tout prêt avec les produits et le total." },
];

const benefits = [
  { title: "Fini les 200 photos sur le statut", text: "Tes clientes voient tous tes produits, rangés par catégorie, avec le prix." },
  { title: "Tu fais pro", text: "Un vrai site à ton nom, avec ton logo et ta couleur, comme les grandes boutiques." },
  { title: "Livraison par commune", text: "Cocody, Yopougon, Abobo… Tu fixes tes frais, le total se calcule tout seul." },
  { title: "Paiement comme tu veux", text: "À la livraison, par Wave ou par Orange Money. Rien à installer." },
];

const examples = [
  { name: "Awa Couture", kind: "Pagnes et robes wax", color: "#b45309", items: ["Robe wax", "Ensemble pagne", "Foulard"] },
  { name: "Glow by Fanta", kind: "Cosmétiques", color: "#be185d", items: ["Beurre de karité", "Savon noir", "Huile coco"] },
  { name: "Chez Tantie Mariam", kind: "Attiéké et plats", color: "#15803d", items: ["Garba", "Attiéké poisson", "Alloco"] },
];

const faqs = [
  { q: "Est-ce que je dois savoir coder ?", a: "Non. Tu remplis le nom de ta boutique, ton numéro WhatsApp et tes produits. Ton site est prêt tout de suite." },
  { q: "Combien ça coûte ?", a: `Le premier mois est gratuit. Ensuite c'est ${formatFCFA(PRICE_MONTHLY)} par mois, ou ${formatFCFA(PRICE_YEARLY)} pour toute l'année.` },
  { q: "Comment je paie l'abonnement ?", a: "Par Wave ou Orange Money. Pas besoin de carte bancaire." },
  { q: "Et si je ne paie pas après le mois gratuit ?", a: "Ta boutique est mise en pause. Tes produits restent enregistrés et tout revient dès que tu paies." },
  { q: "Comment mes clientes commandent ?", a: "Elles ajoutent les produits au panier, choisissent leur commune, puis le message de commande s'ouvre sur ton WhatsApp." },
  { q: "Je peux le faire depuis mon téléphone ?", a: "Oui, tout est pensé pour le téléphone : ajouter un produit prend moins d'une minute." },
];

export default function Home() {
  const supportLink = SUPPORT_WHATSAPP ? waLink(SUPPORT_WHATSAPP, "Bonjour MonDjassa, j'ai une question.") : "#faq";

  return (
    <main>
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-[#fffaf3]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/connexion" className="rounded-lg px-3 py-2 font-semibold text-stone-700 hover:bg-stone-100">
              Connexion
            </Link>
            <Link href="/inscription" className="btn-primary px-4 py-2 text-sm">
              Commencer
            </Link>
          </nav>
        </div>
      </header>

      {/* Accroche */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pt-10 pb-16 md:grid-cols-2 md:pt-16">
        <div>
          <p className="mb-3 inline-block rounded-full bg-leaf/10 px-3 py-1 text-sm font-semibold text-leaf">
            1 mois gratuit · sans carte bancaire
          </p>
          <h1 className="text-4xl leading-tight font-extrabold md:text-5xl">
            Ton djassa en ligne, <span className="text-brand">commandes sur WhatsApp</span>
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            Crée ta boutique en 5 minutes, sur ton téléphone. Tes clientes voient tous tes produits avec les prix, et la
            commande arrive directement sur ton WhatsApp.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/inscription" className="btn-primary text-lg">
              Créer ma boutique gratuitement
            </Link>
            <a href="#comment" className="btn-ghost">
              Comment ça marche ?
            </a>
          </div>
        </div>
        <PhoneMockup />
      </section>

      {/* 3 étapes */}
      <section id="comment" className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-extrabold">Simple comme bonjour</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card">
                <span className="grid size-10 place-items-center rounded-full bg-brand text-lg font-bold text-white">{s.n}</span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-stone-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold">Pensé pour vendre à Abidjan</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-3">
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-leaf text-white">✓</span>
              <div>
                <h3 className="font-bold">{b.title}</h3>
                <p className="text-stone-600">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exemples */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-extrabold">Pour tous les commerces</h2>
          <p className="mt-2 text-center text-stone-600">Mode, beauté, cuisine, électronique… chaque boutique a son style.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {examples.map((e) => (
              <div key={e.name} className="overflow-hidden rounded-2xl border border-stone-200">
                <div className="p-4 text-white" style={{ background: e.color }}>
                  <p className="font-bold">{e.name}</p>
                  <p className="text-sm opacity-90">{e.kind}</p>
                </div>
                <ul className="divide-y divide-stone-100">
                  {e.items.map((i) => (
                    <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span>{i}</span>
                      <span className="rounded-lg px-2 py-1 text-xs font-semibold text-white" style={{ background: e.color }}>
                        Ajouter
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-stone-400">Exemples d&apos;illustration</p>
        </div>
      </section>

      {/* Prix */}
      <section id="prix" className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold">Un prix simple</h2>
        <p className="mt-2 text-center text-stone-600">Essaie tout gratuitement pendant 1 mois. Paiement par Wave ou Orange Money.</p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <p className="font-semibold text-stone-500">Mensuel</p>
            <p className="mt-2 text-4xl font-extrabold">{formatFCFA(PRICE_MONTHLY)}</p>
            <p className="text-stone-500">par mois</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Produits illimités</li>
              <li>✓ Commandes sur WhatsApp</li>
              <li>✓ Livraison par commune</li>
              <li>✓ Statistiques de visites</li>
            </ul>
          </div>
          <div className="card relative border-2 border-brand p-6">
            <span className="absolute -top-3 right-4 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
              Le plus avantageux
            </span>
            <p className="font-semibold text-stone-500">Annuel</p>
            <p className="mt-2 text-4xl font-extrabold">{formatFCFA(PRICE_YEARLY)}</p>
            <p className="text-stone-500">par an, soit environ {formatFCFA(Math.round(PRICE_YEARLY / 12 / 100) * 100)} par mois</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ Tout le mensuel</li>
              <li>✓ Plus de 7 mois offerts</li>
              <li>✓ Tu paies une fois et tu es tranquille</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/inscription" className="btn-primary text-lg">
            Commencer mon mois gratuit
          </Link>
        </div>
      </section>

      {/* TODO : ajouter ici les témoignages des premières vendeuses quand on les aura. */}

      {/* FAQ */}
      <section id="faq" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-extrabold">Questions fréquentes</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {f.q}
                  <span className="text-brand transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-4 py-10 text-center">
        <Logo />
        <p className="mt-3 text-sm text-stone-500">Fait à Abidjan, pour les vendeuses de Côte d&apos;Ivoire.</p>
        <a href={supportLink} className="btn-whatsapp mt-4 text-sm">
          Une question ? Écris-nous sur WhatsApp
        </a>
      </footer>
    </main>
  );
}

function PhoneMockup() {
  const products = [
    { name: "Robe wax", price: "15 000", bg: "#fde68a" },
    { name: "Sac en raphia", price: "8 500", bg: "#fecaca" },
    { name: "Sandales", price: "6 000", bg: "#bbf7d0" },
    { name: "Boucles", price: "2 500", bg: "#bfdbfe" },
  ];
  return (
    <div className="mx-auto w-64 rounded-[2.5rem] border-8 border-stone-900 bg-white shadow-2xl" aria-hidden>
      <div className="rounded-t-[1.8rem] bg-brand px-4 pt-6 pb-4 text-white">
        <p className="text-xs opacity-80">{SITE_HOST}/awa-couture</p>
        <p className="text-lg font-bold">Awa Couture</p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {products.map((p) => (
          <div key={p.name} className="rounded-xl border border-stone-100 p-1.5">
            <div className="aspect-square rounded-lg" style={{ background: p.bg }} />
            <p className="mt-1 truncate text-[11px] font-semibold">{p.name}</p>
            <p className="text-[11px] text-stone-500">{p.price} F</p>
          </div>
        ))}
      </div>
      <div className="px-3 pb-5">
        <div className="rounded-xl bg-[#25D366] py-2 text-center text-xs font-bold text-white">Commander sur WhatsApp (2)</div>
      </div>
    </div>
  );
}
