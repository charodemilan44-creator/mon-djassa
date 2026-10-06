import { SUPPORT_WHATSAPP, waLink } from "@/lib/utils";

const tips = [
  { q: "Comment ajouter un produit ?", a: "Va dans Produits, puis « + Ajouter ». Mets une photo, un nom et un prix, puis enregistre." },
  { q: "Comment partager ma boutique sur mon statut ?", a: "Sur l'accueil, touche « Partager sur WhatsApp ». Tu peux l'envoyer à tes contacts ou copier le lien pour ton statut." },
  { q: "Comment je reçois les commandes ?", a: "Quand une cliente valide son panier, WhatsApp s'ouvre chez elle avec un message tout prêt : produits, quantités, commune et total. Elle te l'envoie, tu n'as plus qu'à répondre." },
  { q: "Un produit est épuisé, je fais comment ?", a: "Dans Produits, touche « En stock » à côté du produit : il passe en « Épuisé » et les clientes ne peuvent plus le commander." },
  { q: "Comment changer mes frais de livraison ?", a: "Va dans Boutique, puis Livraison. Ajoute une commune avec ses frais, ou remets-la avec un nouveau prix pour le modifier." },
  { q: "Que se passe-t-il après le mois gratuit ?", a: "Si tu ne prends pas d'abonnement, ta boutique est mise en pause. Rien n'est effacé : dès que tu paies, tout revient." },
];

export default function HelpPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold tight">Aide</h1>
      {/* TODO : ajouter les tutoriels vidéo (TikTok / YouTube) quand ils seront tournés. */}
      <div className="space-y-3">
        {tips.map((t) => (
          <details key={t.q} className="card group">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              {t.q}
              <span className="text-brand transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-mute">{t.a}</p>
          </details>
        ))}
      </div>
      {SUPPORT_WHATSAPP && (
        <a href={waLink(SUPPORT_WHATSAPP, "Bonjour MonDjassa, j'ai besoin d'aide.")} target="_blank" rel="noreferrer" className="btn-whatsapp w-full">
          Discuter avec nous sur WhatsApp
        </a>
      )}
    </div>
  );
}
