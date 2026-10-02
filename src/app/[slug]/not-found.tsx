import Link from "next/link";

export default function ShopNotFound() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 text-center">
      <div>
        <p className="text-5xl">🔎</p>
        <h1 className="mt-4 text-2xl font-extrabold">Boutique introuvable</h1>
        <p className="mt-2 text-stone-600">Vérifie le lien, il y a peut-être une petite faute.</p>
        <Link href="/inscription" className="btn-primary mt-6">Créer ma propre boutique</Link>
      </div>
    </main>
  );
}
