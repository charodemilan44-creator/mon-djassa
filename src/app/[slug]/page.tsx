import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createClient as createSupabase } from "@supabase/supabase-js";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { Category, DeliveryZone, Product, Shop } from "@/lib/types";
import { RESERVED_SLUGS } from "@/lib/utils";
import { ShopClient } from "./ShopClient";

// Page publique mise en cache, rafraîchie à chaque modification de la vendeuse (et au plus toutes les minutes)
export const revalidate = 60;

function publicClient() {
  return createSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}

const getShop = cache(async (slug: string) => {
  if (RESERVED_SLUGS.has(slug)) return null;
  const { data } = await publicClient().from("shops").select("*").eq("slug", slug).maybeSingle<Shop>();
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const shop = await getShop((await params).slug);
  if (!shop) return { title: "Boutique introuvable" };
  const description = shop.description || `Découvre les produits de ${shop.name} et commande sur WhatsApp.`;
  const images = shop.banner_url || shop.logo_url ? [shop.banner_url || shop.logo_url!] : undefined;
  return { title: { absolute: shop.name }, description, openGraph: { title: shop.name, description, images } };
}

export default async function PublicShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = await getShop(slug);

  if (!shop) {
    // La boutique existe peut-être mais elle est en pause (essai fini sans paiement)
    const { data: paused } = RESERVED_SLUGS.has(slug)
      ? { data: null }
      : await createServiceClient().from("shops").select("name").eq("slug", slug).maybeSingle<{ name: string }>();
    if (!paused) notFound();
    return (
      <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 text-center">
        <div>
          <p className="text-5xl">🛍️</p>
          <h1 className="mt-4 text-2xl font-extrabold">{paused.name}</h1>
          <p className="mt-2 text-stone-600">Cette boutique est momentanément indisponible. Reviens bientôt !</p>
          <Link href="/" className="mt-6 inline-block text-sm text-stone-400">Propulsé par MonDjassa</Link>
        </div>
      </main>
    );
  }

  const supabase = publicClient();
  const [{ data: products }, { data: categories }, { data: zones }] = await Promise.all([
    supabase.from("products").select("*").eq("shop_id", shop.id).order("position").order("created_at", { ascending: false }).returns<Product[]>(),
    supabase.from("categories").select("*").eq("shop_id", shop.id).order("position").order("name").returns<Category[]>(),
    supabase.from("delivery_zones").select("*").eq("shop_id", shop.id).order("commune").returns<DeliveryZone[]>(),
  ]);

  return <ShopClient shop={shop} products={products ?? []} categories={categories ?? []} zones={zones ?? []} />;
}
