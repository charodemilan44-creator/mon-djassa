import Link from "next/link";
import { requireShop } from "@/lib/shop";
import { ShopForm } from "./ShopForm";

export default async function ShopSettingsPage() {
  const { shop, user } = await requireShop();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Ma boutique</h1>
      <Link href="/dashboard/livraison" className="card flex items-center justify-between">
        <span>
          <span className="block font-bold">🛵 Livraison</span>
          <span className="text-sm text-stone-500">Communes livrées et frais de livraison</span>
        </span>
        <span className="text-stone-400">›</span>
      </Link>
      <ShopForm shop={shop} userId={user.id} />
    </div>
  );
}
