"use client";

import Link from "next/link";
import { useState } from "react";
import { formatFCFA } from "@/lib/utils";

const FEATURES = [
  "Ta boutique avec ton propre lien",
  "Produits, photos et catégories illimités",
  "Commandes prêtes sur WhatsApp",
  "Frais de livraison par commune",
  "Statistiques de visites et de commandes",
  "Aide sur WhatsApp",
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-leaf" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export function Pricing({ monthly, yearly }: { monthly: number; yearly: number }) {
  const [annual, setAnnual] = useState(true);
  const saving = Math.round((1 - yearly / (monthly * 12)) * 100);

  return (
    <div className="mt-12">
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full border border-line bg-white p-1 text-sm font-semibold">
        <button type="button" onClick={() => setAnnual(false)} className={`rounded-full px-5 py-2 transition ${annual ? "text-mute hover:text-ink" : "bg-ink text-white"}`}>
          Mensuel
        </button>
        <button type="button" onClick={() => setAnnual(true)} className={`flex items-center gap-2 rounded-full px-5 py-2 transition ${annual ? "bg-ink text-white" : "text-mute hover:text-ink"}`}>
          Annuel
          <span className={`rounded-full px-2 py-0.5 text-xs ${annual ? "bg-brand text-white" : "bg-brand-soft text-brand-dark"}`}>-{saving}%</span>
        </button>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
        <div className="card p-8">
          <p className="text-sm font-semibold text-mute">Essai</p>
          <p className="mt-3 font-display text-5xl font-bold tight">0 F</p>
          <p className="mt-1 text-sm text-mute">pendant 1 mois, sans carte ni paiement</p>
          <ul className="mt-8 space-y-3 text-sm">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3"><Check />{f}</li>
            ))}
          </ul>
          <Link href="/inscription" className="btn-ghost mt-8 w-full">Commencer l&apos;essai</Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white shadow-2xl shadow-ink/20">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/70">Pro</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Le plus choisi</span>
            </div>
            <p className="mt-3 font-display text-5xl font-bold tight">
              {formatFCFA(annual ? yearly : monthly)}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {annual ? `par an, soit ${formatFCFA(Math.round(yearly / 12))} par mois` : "par mois, sans engagement"}
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/90">
              {FEATURES.map((f) => (
                <li key={f} className="flex gap-3"><Check />{f}</li>
              ))}
            </ul>
            <Link href="/inscription" className="btn-accent mt-8 w-full">Créer ma boutique</Link>
            <p className="mt-4 text-center text-xs text-white/50">Wave · Orange Money</p>
          </div>
        </div>
      </div>
    </div>
  );
}
