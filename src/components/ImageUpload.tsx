"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload";

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
      setUrl(await uploadImage(file, userId, maxSize));
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
        className={`${box} relative grid place-items-center overflow-hidden border-2 border-dashed border-line bg-white text-sm text-mute`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 px-2"><svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>Ajouter une photo</span>
        )}
        {busy && <span className="absolute inset-0 grid place-items-center bg-white/80 font-semibold">Envoi…</span>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <div className="mt-1 flex gap-3 text-xs">
        {url && (
          <>
            <button type="button" className="font-semibold text-brand" onClick={() => inputRef.current?.click()}>Changer</button>
            <button type="button" className="text-mute" onClick={() => setUrl("")}>Retirer</button>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
