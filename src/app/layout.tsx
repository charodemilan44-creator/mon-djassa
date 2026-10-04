import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", weight: ["600", "700", "800"] });
const body = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: { default: "MonDjassa : ta boutique en ligne, commandes sur WhatsApp", template: "%s · MonDjassa" },
  description:
    "Crée ta boutique en ligne en 5 minutes depuis ton téléphone. Tes clientes choisissent, la commande arrive sur ton WhatsApp. 1 mois gratuit.",
};

export const viewport: Viewport = { themeColor: "#121110", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
