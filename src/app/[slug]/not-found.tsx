import Link from "next/link";

export default function ShopNotFound() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-ink text-white"><svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></svg></span>
        <h1 className="mt-4 font-display text-2xl font-bold tight">Boutique introuvable</h1>
        <p className="mt-2 text-mute">Vérifie le lien, il y a peut-être une petite faute.</p>
        <Link href="/inscription" className="btn-primary mt-6">Créer ma propre boutique</Link>
      </div>
    </main>
  );
}
