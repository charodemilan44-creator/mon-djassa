import Link from "next/link";
import { Logo, LogoMark } from "@/components/Logo";
import { DEMO_PRODUCTS, unsplash } from "@/lib/demo";
import { PRICE_MONTHLY, PRICE_YEARLY, SUPPORT_WHATSAPP, formatFCFA, waLink, SITE_HOST } from "@/lib/utils";
import { Pricing } from "./Pricing";

const CATEGORIES = ["Mode & pagne", "Perruques & mèches", "Cosmétiques", "Sneakers", "Bijoux", "Attiéké & plats", "Téléphones", "Déco maison", "Enfants", "Parfums"];

const FAQS = [
  { q: "Est-ce que je dois savoir coder ?", a: "Non. Tu remplis le nom de ta boutique, ton numéro WhatsApp et tes produits. Ta boutique est en ligne tout de suite." },
  { q: "Combien ça coûte ?", a: `Le premier mois est gratuit. Ensuite c'est ${formatFCFA(PRICE_MONTHLY)} par mois, ou ${formatFCFA(PRICE_YEARLY)} pour toute l'année.` },
  { q: "Comment je paie l'abonnement ?", a: "Par Wave ou Orange Money. Pas besoin de carte bancaire." },
  { q: "Et si je ne paie pas après le mois gratuit ?", a: "Ta boutique est mise en pause. Tes produits restent enregistrés et tout revient dès que tu paies." },
  { q: "Comment mes clientes commandent ?", a: "Elles remplissent leur panier, choisissent leur commune, et le message de commande s'ouvre sur ton WhatsApp avec les produits et le total." },
  { q: "Je peux tout faire depuis mon téléphone ?", a: "Oui. Ajouter un produit avec sa photo prend moins d'une minute." },
];

export default function Home() {
  const supportLink = SUPPORT_WHATSAPP ? waLink(SUPPORT_WHATSAPP, "Bonjour MonDjassa, j'ai une question.") : "#faq";

  return (
    <main className="overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-mute md:flex">
            <a href="#fonctionnalites" className="hover:text-ink">Fonctionnalités</a>
            <a href="#comment" className="hover:text-ink">Comment ça marche</a>
            <a href="#tarifs" className="hover:text-ink">Tarifs</a>
            <a href="#faq" className="hover:text-ink">Questions</a>
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/connexion" className="hidden rounded-full px-4 py-2 font-semibold hover:bg-black/5 sm:inline-flex">Connexion</Link>
            <Link href="/inscription" className="btn-primary px-3.5 py-2 text-[13px] sm:px-4 sm:text-sm">Créer ma boutique</Link>
          </div>
        </div>
      </header>

      {/* Accroche */}
      <section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(232,105,11,0.12),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-8 pb-12 sm:gap-14 sm:px-6 sm:pt-14 sm:pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-mute">
              <span className="size-1.5 rounded-full bg-leaf" /> Fait pour les vendeuses de Côte d&apos;Ivoire
            </span>
            <h1 className="mt-5 font-display text-[2.1rem] leading-[1.06] font-bold tight sm:mt-6 sm:text-6xl sm:leading-[1.02] lg:text-[4.2rem]">
              Ta boutique en ligne.
              <br />
              <span className="text-brand">Tes commandes sur WhatsApp.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mute sm:mt-6 sm:text-lg">
              Mets tes produits, tes prix et tes communes de livraison. Tu reçois un vrai site à ton nom, et chaque
              commande arrive toute prête sur ton WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
              <Link href="/inscription" className="btn-primary px-6 py-3.5 text-[15px] sm:px-7 sm:py-4 sm:text-base">Essayer gratuitement 1 mois</Link>
              <Link href="/exemple" className="btn-ghost px-6 py-3.5 text-[15px] sm:px-7 sm:py-4 sm:text-base">Voir une boutique exemple</Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-mute sm:mt-8 sm:gap-x-6 sm:text-sm">
              <span className="flex items-center gap-2"><Check /> Sans carte bancaire</span>
              <span className="flex items-center gap-2"><Check /> Paiement Wave et Orange Money</span>
              <span className="flex items-center gap-2"><Check /> Prête en 5 minutes</span>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Catégories qui défilent */}
      <section className="border-y border-line bg-white py-3.5 sm:py-5" aria-label="Pour tous les commerces">
        <div className="flex w-max animate-marquee gap-7 pr-7 sm:gap-10 sm:pr-10">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-base font-semibold whitespace-nowrap text-ink/70 sm:text-xl">
              {c} <span className="size-1.5 rounded-full bg-brand" />
            </span>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14 sm:px-6 sm:py-24">
        <SectionHead kicker="Fonctionnalités" title="Tout ce qu'il faut pour vendre, rien de compliqué" />
        <div className="mt-8 grid gap-3 sm:mt-14 sm:gap-4 md:grid-cols-6">
          <Feature className="md:col-span-4" title="Une vraie boutique à ton nom" text={`Tes produits rangés par catégorie, avec photo et prix. Ta couleur, ton logo, ton lien ${SITE_HOST}/ta-boutique.`}>
            <div className="mt-5 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-3">
              {[DEMO_PRODUCTS[0], DEMO_PRODUCTS[1], DEMO_PRODUCTS[4], DEMO_PRODUCTS[3]].map((p) => (
                <div key={p.name} className="overflow-hidden rounded-xl border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={unsplash(p.photo, 300)} alt={p.name} loading="lazy" className="aspect-square w-full bg-line object-cover" />
                  <div className="p-1.5 sm:p-2">
                    <div className="truncate text-[10px] text-mute sm:text-[11px]">{p.name}</div>
                    <div className="mt-0.5 text-[10px] font-bold sm:text-xs">{formatFCFA(p.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Feature>
          <Feature className="md:col-span-2" title="Commandes sur WhatsApp" text="Pas d'appli en plus. La cliente envoie son panier, tu réponds comme d'habitude.">
            <div className="mt-6 rounded-2xl bg-[#EFEAE2] p-3">
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-[#D9FDD3] p-3 text-[13px] leading-relaxed shadow-sm">
                <p>Bonjour, je voudrais commander :</p>
                <p>• 1 x Robe wax : 15 000 FCFA</p>
                <p className="mt-1 font-bold">Total : 16 500 FCFA</p>
              </div>
            </div>
          </Feature>
          <Feature className="md:col-span-2" title="Livraison par commune" text="Tu fixes tes frais, le total se calcule tout seul.">
            <ul className="mt-6 divide-y divide-line rounded-2xl border border-line text-sm">
              {[["Cocody", 1500], ["Yopougon", 2000], ["Marcory", 1000]].map(([c, f]) => (
                <li key={c} className="flex justify-between px-4 py-2.5"><span>{c}</span><span className="font-semibold tabular-nums">{formatFCFA(f as number)}</span></li>
              ))}
            </ul>
          </Feature>
          <Feature className="md:col-span-2" title="Tes chiffres de la semaine" text="Combien de visites, combien de commandes envoyées.">
            <MiniChart />
          </Feature>
          <Feature className="md:col-span-2" title="Stock en un clic" text="Un produit est fini ? Touche « Épuisé », il ne peut plus être commandé.">
            <div className="mt-6 flex flex-col gap-2">
              <StockRow name="Sac en raphia" inStock />
              <StockRow name="Sandales cuir" />
            </div>
          </Feature>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" className="scroll-mt-16 bg-ink py-14 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead kicker="Comment ça marche" title="De ton téléphone à ta première commande" dark />
          <ol className="mt-8 grid gap-6 sm:mt-14 sm:gap-10 md:grid-cols-3 md:gap-6">
            {[
              { t: "Tu ajoutes tes produits", d: "Une photo, un nom, un prix. Moins d'une minute par produit, directement depuis ton téléphone." },
              { t: "Tu partages ton lien", d: "Sur ton statut, dans tes groupes, sur TikTok. Tes clientes voient tout, avec les prix." },
              { t: "Tu reçois la commande", d: "Le message arrive sur ton WhatsApp avec les produits, la commune et le total. Tu n'as plus qu'à livrer." },
            ].map((s, i) => (
              <li key={s.t} className="border-t border-white/15 pt-5 sm:pt-6">
                <span className="font-display text-3xl font-bold text-brand sm:text-5xl">{i + 1}</span>
                <h3 className="mt-2 font-display text-xl font-semibold sm:mt-4 sm:text-2xl">{s.t}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white/65 sm:mt-2 sm:text-base">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14 sm:px-6 sm:py-24">
        <SectionHead kicker="Tarifs" title="Un mois offert, puis un prix simple" sub="Paiement par Wave ou Orange Money. Tu peux arrêter quand tu veux." />
        <Pricing monthly={PRICE_MONTHLY} yearly={PRICE_YEARLY} />
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 border-t border-line bg-white py-14 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead kicker="Questions" title="Tu te poses une question ?" align="left" />
            <a href={supportLink} target="_blank" rel="noreferrer" className="btn-whatsapp mt-6 sm:mt-8">Écris-nous sur WhatsApp</a>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-4 sm:py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold sm:gap-6 sm:text-lg">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-mute sm:mt-3 sm:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Appel final */}
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-brand px-5 py-12 text-center sm:rounded-[2rem] sm:py-16 text-white sm:px-12">
          <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-32 -left-16 size-80 rounded-full bg-black/10" />
          <h2 className="relative font-display text-[1.75rem] leading-tight font-bold tight sm:text-5xl">Ta boutique peut être en ligne ce soir</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-[15px] text-white/85 sm:mt-4 sm:text-lg">1 mois gratuit, sans carte bancaire. Tu ajoutes tes produits et tu partages ton lien.</p>
          <Link href="/inscription" className="btn relative mt-6 bg-white px-6 py-3.5 text-[15px] text-ink hover:bg-paper sm:mt-8 sm:px-8 sm:py-4 sm:text-base">Créer ma boutique gratuitement</Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-mute sm:flex-row sm:px-6">
          <div className="flex items-center gap-3"><LogoMark className="size-7" /> Fait à Abidjan, pour les vendeuses de Côte d&apos;Ivoire.</div>
          <div className="flex gap-6">
            <Link href="/connexion" className="hover:text-ink">Connexion</Link>
            <a href={supportLink} target="_blank" rel="noreferrer" className="hover:text-ink">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 text-leaf" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  );
}

function SectionHead({ kicker, title, sub, dark, align = "center" }: { kicker: string; title: string; sub?: string; dark?: boolean; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <p className={`text-xs font-bold tracking-[0.18em] uppercase ${dark ? "text-brand" : "text-brand"}`}>{kicker}</p>
      <h2 className="mt-2.5 font-display text-[1.75rem] leading-[1.12] font-bold tight sm:mt-3 sm:text-5xl sm:leading-tight">{title}</h2>
      {sub && <p className={`mt-3 text-[15px] sm:mt-4 sm:text-lg ${dark ? "text-white/65" : "text-mute"}`}>{sub}</p>}
    </div>
  );
}

function Feature({ title, text, className = "", children }: { title: string; text: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-3xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(18,17,16,0.18)] sm:p-7 ${className}`}>
      <h3 className="font-display text-lg font-semibold tight sm:text-2xl">{title}</h3>
      <p className="mt-1.5 text-[14px] leading-relaxed text-mute sm:mt-2 sm:text-base">{text}</p>
      {children}
    </div>
  );
}

function StockRow({ name, inStock }: { name: string; inStock?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm">
      <span className="font-medium">{name}</span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${inStock ? "bg-leaf/10 text-leaf" : "bg-red-50 text-red-700"}`}>
        {inStock ? "En stock" : "Épuisé"}
      </span>
    </div>
  );
}

function MiniChart() {
  const pts = [22, 30, 26, 38, 35, 52, 61];
  const max = 70;
  const w = 280;
  const h = 90;
  const step = w / (pts.length - 1);
  const line = pts.map((p, i) => `${i * step},${h - (p / max) * h}`).join(" ");
  return (
    <div className="mt-6">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tabular-nums">264</span>
        <span className="text-sm text-mute">visites cette semaine</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h + 4}`} className="mt-3 w-full" aria-hidden>
        <polygon points={`0,${h} ${line} ${w},${h}`} fill="rgba(232,105,11,0.12)" />
        <polyline points={line} fill="none" stroke="#e8690b" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={w} cy={h - (pts[pts.length - 1] / max) * h} r="4.5" fill="#e8690b" />
      </svg>
      <p className="mt-1 text-xs text-mute">Exemple de statistiques</p>
    </div>
  );
}

/** Aperçu animé : la boutique sur téléphone, une carte de stats et une notification de commande */
function HeroVisual() {
  const items = [
    DEMO_PRODUCTS[0],
    DEMO_PRODUCTS[1],
    DEMO_PRODUCTS[7],
    DEMO_PRODUCTS[3],
  ];
  return (
    <div className="relative mx-auto h-[540px] w-full max-w-[520px] sm:h-[600px] animate-rise [animation-delay:150ms]" aria-label="Aperçu d'une boutique MonDjassa" role="img">
      {/* Carte statistiques, derrière */}
      <div className="absolute top-10 left-0 hidden w-60 rounded-3xl border border-line bg-white p-5 shadow-[0_30px_60px_-25px_rgba(18,17,16,0.25)] sm:block animate-float [animation-delay:-2s]">
        <p className="text-xs font-semibold text-mute">Cette semaine</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="font-display text-3xl font-bold tabular-nums">264</p>
            <p className="text-xs text-mute">visites</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-leaf tabular-nums">31</p>
            <p className="text-xs text-mute">commandes</p>
          </div>
        </div>
        <div className="mt-4 flex h-12 items-end gap-1.5">
          {[30, 45, 38, 60, 52, 78, 92].map((v, i) => (
            <span key={i} className={`flex-1 rounded-t ${i === 6 ? "bg-brand" : "bg-brand/25"}`} style={{ height: `${v}%` }} />
          ))}
        </div>
      </div>

      {/* Téléphone */}
      <div className="absolute top-0 right-1/2 w-[290px] translate-x-1/2 rounded-[2.8rem] bg-ink p-2.5 shadow-[0_50px_100px_-30px_rgba(18,17,16,0.5)] sm:right-4 sm:translate-x-0">
        <div className="relative overflow-hidden rounded-[2.3rem] bg-white">
          <div className="absolute top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
          <div className="bg-[#2C2420] px-4 pt-10 pb-4 text-white">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-brand font-display text-xs font-bold">AC</span>
              <div>
                <p className="font-display text-base font-bold">Awa Couture</p>
                <p className="text-[10px] text-white/60">{SITE_HOST}/awa-couture</p>
              </div>
            </div>
            <div className="mt-3 flex gap-1.5 text-[10px] font-semibold">
              <span className="rounded-full bg-white px-2.5 py-1 text-ink">Tout</span>
              <span className="rounded-full bg-white/15 px-2.5 py-1">Robes</span>
              <span className="rounded-full bg-white/15 px-2.5 py-1">Sacs</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 p-3">
            {items.map((it) => (
              <div key={it.name}>
                <div className="relative overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={unsplash(it.photo, 300)} alt={it.name} className="aspect-[4/5] w-full bg-line object-cover" />
                                  </div>
                <p className="mt-1.5 truncate text-[11px] font-medium">{it.name}</p>
                <p className="text-[11px] font-bold">{formatFCFA(it.price)}</p>
              </div>
            ))}
          </div>
          <div className="px-3 pb-4">
            <div className="flex items-center justify-between rounded-full bg-wa px-4 py-2.5 text-[11px] font-bold text-white">
              <span>2 articles</span>
              <span>Commander sur WhatsApp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification de commande qui arrive en boucle */}
      <div className="absolute right-0 bottom-6 left-0 mx-auto w-[290px] sm:bottom-16 sm:w-[300px] sm:right-auto sm:left-0 sm:mx-0">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-3.5 shadow-[0_30px_60px_-20px_rgba(18,17,16,0.35)] backdrop-blur [animation:notif_6s_ease-in-out_infinite]">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-wa text-white">
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.4-2.9c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z" /></svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold">Nouvelle commande</p>
            <p className="truncate text-xs text-mute">2 articles · Cocody · 25 000 FCFA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
