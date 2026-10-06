"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import { saveProductsBulk } from "../actions";

type Item = { key: string; preview: string; url: string; status: "envoi" | "ok" | "erreur"; name: string; price: string };

const MAX = 30;

export function BulkAdd({ userId, categories }: { userId: string; categories: Category[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [saving, startSaving] = useTransition();

  const patch = (key: string, data: Partial<Item>) => setItems((list) => list.map((it) => (it.key === key ? { ...it, ...data } : it)));

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX - items.length);
    if (inputRef.current) inputRef.current.value = "";
    const added = files.map((file) => ({ file, item: { key: crypto.randomUUID(), preview: URL.createObjectURL(file), url: "", status: "envoi" as const, name: "", price: "" } }));
    setItems((list) => [...list, ...added.map((a) => a.item)]);

    // Envoi 3 par 3 pour ne pas saturer la connexion mobile
    for (let i = 0; i < added.length; i += 3) {
      await Promise.all(
        added.slice(i, i + 3).map(async ({ file, item }) => {
          try {
            patch(item.key, { url: await uploadImage(file, userId), status: "ok" });
          } catch {
            patch(item.key, { status: "erreur" });
          }
        }),
      );
    }
  }

  const uploading = items.some((it) => it.status === "envoi");
  const ready = items.filter((it) => it.status === "ok");

  function save() {
    setError("");
    const missing = ready.find((it) => !it.name.trim() || !it.price.trim());
    if (missing) return setError("Mets un nom et un prix à chaque produit, ou retire ceux que tu ne veux pas.");
    startSaving(async () => {
      const res = await saveProductsBulk(
        ready.map((it) => ({ name: it.name, price: Number(it.price.replace(/\s/g, "")), image_url: it.url })),
        categoryId,
      );
      if (res.error) return setError(res.error);
      router.push(`/dashboard/produits?ajoutes=${res.count}`);
    });
  }

  return (
    <div className="space-y-4">
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPick} />

      {items.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line bg-white px-6 py-10 text-center transition hover:border-ink/30"
        >
          <span className="grid size-12 place-items-center rounded-full bg-ink text-white">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="5" width="14" height="14" rx="2" /><path d="M7 5V3h14v14h-2M3 15l4-4 4 4 2-2 4 4" />
            </svg>
          </span>
          <span className="font-semibold">Choisir les photos dans ma galerie</span>
          <span className="text-sm text-mute">Jusqu&apos;à {MAX} photos d&apos;un coup. Ensuite tu mets juste le nom et le prix.</span>
        </button>
      ) : (
        <>
          <ul className="space-y-2.5">
            {items.map((it, i) => (
              <li key={it.key} className="card flex gap-3 p-2.5">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.preview} alt="" className="size-full object-cover" />
                  {it.status === "envoi" && <span className="absolute inset-0 grid place-items-center bg-white/70 text-[11px] font-semibold">Envoi…</span>}
                  {it.status === "erreur" && <span className="absolute inset-0 grid place-items-center bg-red-50/90 px-1 text-center text-[11px] font-semibold text-red-700">Échec</span>}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    value={it.name}
                    onChange={(e) => patch(it.key, { name: e.target.value })}
                    maxLength={80}
                    placeholder={`Nom du produit ${i + 1}`}
                    aria-label={`Nom du produit ${i + 1}`}
                    className="w-full rounded-lg border border-line px-3 py-2 text-base outline-none focus:border-ink"
                  />
                  <div className="flex gap-2">
                    <input
                      value={it.price}
                      onChange={(e) => patch(it.key, { price: e.target.value.replace(/[^0-9 ]/g, "") })}
                      inputMode="numeric"
                      placeholder="Prix en FCFA"
                      aria-label={`Prix du produit ${i + 1}`}
                      className="w-full min-w-0 rounded-lg border border-line px-3 py-2 text-base outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setItems((list) => list.filter((x) => x.key !== it.key))}
                      className="grid size-[42px] shrink-0 place-items-center rounded-lg border border-line text-mute hover:text-ink"
                      aria-label="Retirer ce produit"
                    >
                      <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M5 5l10 10M15 5L5 15" /></svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {items.length < MAX && (
            <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost w-full">
              Ajouter d&apos;autres photos
            </button>
          )}

          {categories.length > 0 && (
            <div>
              <label className="label" htmlFor="bulk-cat">Catégorie pour tous (facultatif)</label>
              <select id="bulk-cat" className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Sans catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="button" onClick={save} disabled={uploading || saving || ready.length === 0} className="btn-primary w-full py-3.5">
            {uploading ? "Envoi des photos…" : saving ? "Enregistrement…" : `Enregistrer ${ready.length} produit${ready.length > 1 ? "s" : ""}`}
          </button>
        </>
      )}
    </div>
  );
}
