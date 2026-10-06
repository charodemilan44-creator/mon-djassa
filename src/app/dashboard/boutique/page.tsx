import Link from "next/link";
import { requireShop } from "@/lib/shop";
import { ShopForm } from "./ShopForm";

export default async function ShopSettingsPage() {
  const { shop, user } = await requireShop();
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold tight">Ma boutique</h1>
      <Link href="/dashboard/livraison" className="card flex items-center justify-between">
        <span>
          <span className="block font-bold">Livraison</span>
          <span className="text-sm text-mute">Communes livrées et frais de livraison</span>
        </span>
        <span className="text-mute">›</span>
      </Link>
      <ShopForm shop={shop} userId={user.id} />
    </div>
  );
}
