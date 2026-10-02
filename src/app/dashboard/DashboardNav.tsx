"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Accueil", icon: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  { href: "/dashboard/produits", label: "Produits", icon: "M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 10L4 17V7m8 14V11M4 7l8 4" },
  { href: "/dashboard/boutique", label: "Boutique", icon: "M3 9l1.5-5h15L21 9M3 9h18M3 9v1a3 3 0 006 0m-6-1h18m-6 1a3 3 0 006 0V9m-12 1a3 3 0 006 0M5 13v7h14v-7" },
  { href: "/dashboard/abonnement", label: "Abonnement", icon: "M3 7h18v10H3zM3 11h18M7 15h3" },
  { href: "/dashboard/aide", label: "Aide", icon: "M12 22a10 10 0 100-20 10 10 0 000 20zm-2.5-13a2.5 2.5 0 114 2c-.8.6-1.5 1.1-1.5 2.5M12 17h.01" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href) || (href.endsWith("boutique") && pathname.startsWith("/dashboard/livraison"));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] md:static md:border-0 md:bg-transparent md:pb-0">
      <ul className="mx-auto flex max-w-3xl justify-around md:justify-start md:gap-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 text-[11px] font-semibold md:flex-row md:gap-2 md:rounded-lg md:px-3 md:text-sm ${
                isActive(it.href) ? "text-brand md:bg-brand/10" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <svg viewBox="0 0 24 24" className="size-6 md:size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={it.icon} />
              </svg>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
