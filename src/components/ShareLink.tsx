"use client";

import { useState } from "react";

export function ShareLink({ url, shopName }: { url: string; shopName: string }) {
  const [copied, setCopied] = useState(false);
  const message = `Découvre ma boutique ${shopName} ! Tous mes produits et mes prix sont ici, tu commandes directement sur WhatsApp : ${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie ton lien :", url);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl bg-sand px-3 py-2">
        <span className="min-w-0 flex-1 truncate font-mono text-sm">{url.replace(/^https?:\/\//, "")}</span>
        <button type="button" onClick={copy} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold shadow-sm">
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="btn-whatsapp text-sm">
          Partager sur WhatsApp
        </a>
        <a href={url} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
          Voir ma boutique
        </a>
      </div>
      <p className="text-xs text-mute">
        Astuce : « Partager sur WhatsApp » te permet d&apos;envoyer le lien à tes contacts ou de le copier dans ton statut.
      </p>
    </div>
  );
}
