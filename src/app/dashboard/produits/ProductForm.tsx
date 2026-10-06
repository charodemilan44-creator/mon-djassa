"use client";

import { useActionState, useState } from "react";
import { FormMessage } from "@/components/FormMessage";
import { ImageUpload } from "@/components/ImageUpload";
import { SubmitButton } from "@/components/SubmitButton";
import type { Category, Product } from "@/lib/types";
import { saveProduct } from "./actions";

export function ProductForm({ userId, categories, product }: { userId: string; categories: Category[]; product?: Product }) {
  const [state, action] = useActionState(saveProduct, undefined);
  const [cat, setCat] = useState(product?.category_id ?? (categories.length ? "" : "new"));

  return (
    <form action={action} className="space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}
      <ImageUpload name="image_url" userId={userId} defaultUrl={product?.image_url} label="Photo du produit" />
      <div>
        <label className="label" htmlFor="name">Nom du produit</label>
        <input id="name" name="name" required maxLength={80} className="input" defaultValue={product?.name} placeholder="Ex : Robe wax manches longues" />
      </div>
      <div>
        <label className="label" htmlFor="price">Prix (FCFA)</label>
        <input id="price" name="price" required inputMode="numeric" pattern="[0-9 ]*" className="input" defaultValue={product?.price} placeholder="15000" />
      </div>
      <div>
        <label className="label" htmlFor="category_id">Catégorie</label>
        <select id="category_id" name="category_id" className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Sans catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          <option value="new">+ Nouvelle catégorie</option>
        </select>
        {cat === "new" && (
          <input name="new_category" className="input mt-2" maxLength={40} placeholder="Ex : Robes, Chaussures, Sacs…" autoFocus={!!categories.length} />
        )}
      </div>
      <div>
        <label className="label" htmlFor="description">Description (facultatif)</label>
        <textarea id="description" name="description" rows={3} maxLength={600} className="input" defaultValue={product?.description ?? ""} placeholder="Tailles, couleurs, matière…" />
      </div>
      <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-line">
        <input type="checkbox" name="in_stock" defaultChecked={product?.in_stock ?? true} className="size-5 accent-[var(--color-leaf)]" />
        <span className="font-medium">Disponible (en stock)</span>
      </label>
      <FormMessage state={state} />
      <SubmitButton pendingText="Enregistrement…">{product ? "Enregistrer" : "Ajouter le produit"}</SubmitButton>
      {!product && (
        <button type="submit" name="again" value="1" className="btn-ghost w-full">
          Ajouter et en mettre un autre
        </button>
      )}
    </form>
  );
}
