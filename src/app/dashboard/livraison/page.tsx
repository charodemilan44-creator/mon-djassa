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
      <Link href="/dashboard/boutique" className="text-sm font-semibold text-mute">← Ma boutique</Link>
      <h1 className="font-display text-2xl font-bold tight">Livraison</h1>
      <p className="text-mute">Tes clientes choisiront leur commune et les frais s&apos;ajouteront au total de la commande.</p>

      {!!zones?.length && (
        <ul className="card divide-y divide-line p-0">
          {zones.map((z) => (
            <li key={z.id} className="flex items-center justify-between px-4 py-3">
              <span className="font-medium">{z.commune}</span>
              <span className="flex items-center gap-3">
                <span className="text-sm text-mute">{z.fee ? formatFCFA(z.fee) : "Gratuit"}</span>
                <form action={deleteZone}>
                  <input type="hidden" name="id" value={z.id} />
                  <button className="grid size-8 place-items-center rounded-full text-mute hover:bg-sand" aria-label={`Retirer ${z.commune}`}>×</button>
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
