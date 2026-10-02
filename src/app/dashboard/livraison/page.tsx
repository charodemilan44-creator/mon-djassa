import Link from "next/link";
import { requireShop } from "@/lib/shop";
import type { DeliveryZone } from "@/lib/types";
import { formatFCFA } from "@/lib/utils";
import { deleteZone } from "./actions";
import { ZoneForm } from "./ZoneForm";

export default async function DeliveryPage() {
  const { supabase, shop } = await requireShop();
  const { data: zones } = await supabase.from("delivery_zones").select("*").eq("shop_id", shop.id).order("commune").returns<DeliveryZone[]>();

  return (
    <div className="space-y-4">
      <Link href="/dashboard/boutique" className="text-sm font-semibold text-stone-500">← Ma boutique</Link>
      <h1 className="text-2xl font-extrabold">Livraison</h1>
      <p className="text-stone-600">Tes clientes choisiront leur commune et les frais s&apos;ajouteront au total de la commande.</p>

      {!!zones?.length && (
        <ul className="card divide-y divide-stone-100 p-0">
          {zones.map((z) => (
            <li key={z.id} className="flex items-center justify-between px-4 py-3">
              <span className="font-medium">{z.commune}</span>
              <span className="flex items-center gap-3">
                <span className="text-sm text-stone-600">{z.fee ? formatFCFA(z.fee) : "Gratuit"}</span>
                <form action={deleteZone}>
                  <input type="hidden" name="id" value={z.id} />
                  <button className="grid size-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100" aria-label={`Retirer ${z.commune}`}>×</button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      )}

      <ZoneForm existing={(zones ?? []).map((z) => z.commune)} />
    </div>
  );
}
