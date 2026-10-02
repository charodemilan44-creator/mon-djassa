import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: { default: "MonDjassa : ta boutique en ligne, commandes sur WhatsApp", template: "%s · MonDjassa" },
  description:
    "Crée ta boutique en ligne en 5 minutes depuis ton téléphone. Tes clientes choisissent, la commande arrive sur ton WhatsApp. 1 mois gratuit.",
};

export const viewport: Viewport = { themeColor: "#f77f00", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
