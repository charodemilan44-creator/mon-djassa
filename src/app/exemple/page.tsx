import { ShopClient } from "../[slug]/ShopClient";
import type { Product, Shop } from "@/lib/types";
import type { Metadata } from "next";
import { DEMO_PRODUCTS, unsplash } from "@/lib/demo";
import { SUPPORT_WHATSAPP } from "@/lib/utils";

export const metadata: Metadata = { title: "Boutique exemple" };

const shop: Shop = { id: "s", owner_id: "o", slug: "awa-couture", name: "Awa Couture", whatsapp: SUPPORT_WHATSAPP || "2250768498648", description: "Robes en wax, sacs et accessoires faits à Abidjan. Livraison rapide dans tout Abidjan.", logo_url: null, banner_url: null, color: "#e8690b", hours: "Lun - Sam, 9h - 19h", accepts_cash: true, accepts_wave: true, accepts_orange_money: true, trial_ends_at: "", paid_until: null, created_at: "" };
const cats = ["c1", "c2", "c3", "c2", "c2", "c1", "c2", "c1"];
const products: Product[] = DEMO_PRODUCTS.map((d, i) => ({ id: "p" + i, shop_id: "s", category_id: cats[i], name: d.name, description: "Belle qualité.", price: d.price, image_url: unsplash(d.photo), in_stock: i !== 3, position: i, created_at: "" }));

export default function Page() {
  return <ShopClient demo shop={shop} products={products} categories={[{ id: "c1", shop_id: "s", name: "Vêtements", position: 0 }, { id: "c2", shop_id: "s", name: "Accessoires", position: 1 }, { id: "c3", shop_id: "s", name: "Chaussures", position: 2 }]} zones={[{ id: "z1", shop_id: "s", commune: "Cocody", fee: 1500 }, { id: "z2", shop_id: "s", commune: "Yopougon", fee: 2000 }]} />;
}
