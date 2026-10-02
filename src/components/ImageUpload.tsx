"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Réduit la photo (moins de données mobiles) puis l'envoie dans Supabase Storage. */
async function resize(file: File, maxSize: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("conversion"))), "image/jpeg", 0.82),
  );
}

export function ImageUpload({
  name,
  userId,
  defaultUrl,
  label = "Photo",
  maxSize = 1200,
  shape = "square",
}: {
  name: string;
  userId: string;
  defaultUrl?: string | null;
  label?: string;
  maxSize?: number;
  shape?: "square" | "wide" | "round";
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await resize(file, maxSize);
      const path = `${userId}/${crypto.randomUUID()}.jpg`;
      const supabase = createClient();
      const { error } = await supabase.storage.from("shop-images").upload(path, blob, { contentType: "image/jpeg" });
      if (error) throw error;
      setUrl(supabase.storage.from("shop-images").getPublicUrl(path).data.publicUrl);
    } catch {
      setError("La photo n'a pas pu être envoyée. Vérifie ta connexion et réessaie.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const box =
    shape === "wide" ? "aspect-[3/1] w-full rounded-xl" : shape === "round" ? "size-24 rounded-full" : "aspect-square w-40 rounded-xl";

  return (
    <div>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={url} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`${box} relative grid place-items-center overflow-hidden border-2 border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="px-2">📷 Ajouter</span>
        )}
        {busy && <span className="absolute inset-0 grid place-items-center bg-white/80 font-semibold">Envoi…</span>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <div className="mt-1 flex gap-3 text-xs">
        {url && (
          <>
            <button type="button" className="font-semibold text-brand" onClick={() => inputRef.current?.click()}>Changer</button>
            <button type="button" className="text-stone-500" onClick={() => setUrl("")}>Retirer</button>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
