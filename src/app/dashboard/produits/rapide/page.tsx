import Link from "next/link";
import { requireShop } from "@/lib/shop";
import type { Category } from "@/lib/types";
import { BulkAdd } from "./BulkAdd";

export default async function BulkAddPage() {
  const { supabase, shop, user } = await requireShop();
  const { data: categories } = await supabase.from("categories").select("*").eq("shop_id", shop.id).order("name").returns<Category[]>();

  return (
    <div className="space-y-4">
      <Link href="/dashboard/produits" className="text-sm font-semibold text-mute">← Mes produits</Link>
      <div>
        <h1 className="font-display text-2xl font-bold tight">Ajout rapide</h1>
        <p className="mt-1 text-[15px] text-mute">Prends les photos de ton catalogue WhatsApp ou de ta galerie, et mets-les toutes en ligne d&apos;un coup.</p>
      </div>
      <BulkAdd userId={user.id} categories={categories ?? []} />
    </div>
  );
}
