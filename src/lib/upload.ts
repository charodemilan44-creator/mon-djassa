import { createClient } from "./supabase/client";

/** Réduit la photo (moins de données mobiles) en JPEG. */
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

/** Envoie la photo dans le dossier de la vendeuse (Supabase Storage) et renvoie son lien public. */
export async function uploadImage(file: File, userId: string, maxSize = 1200): Promise<string> {
  const blob = await resize(file, maxSize);
  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const supabase = createClient();
  const { error } = await supabase.storage.from("shop-images").upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from("shop-images").getPublicUrl(path).data.publicUrl;
}
