// Produits d'exemple (photos Unsplash, libres d'utilisation) pour les aperçus de la page d'accueil
export function unsplash(id: string, width = 600) {
  return `https://images.unsplash.com/${id}?w=${width}&q=75&auto=format&fit=crop`;
}

export const DEMO_PRODUCTS = [
  { name: "Robe wax Akwaba", price: 15000, photo: "photo-1784160053632-6eddd51bda26" },
  { name: "Sac en cuir", price: 18500, photo: "photo-1590874103328-eac38a683ce7" },
  { name: "Mules en cuir", price: 6000, photo: "photo-1603487742131-4160ec999306" },
  { name: "Boucles dorées", price: 2500, photo: "photo-1701777892740-88419a701472" },
  { name: "Parfum Oud", price: 12000, photo: "photo-1588405748880-12d1d2a59f75" },
  { name: "Pagne wax 6 yards", price: 9000, photo: "photo-1768212565424-efa3a3852b81" },
  { name: "Montre cuir", price: 18000, photo: "photo-1524805444758-089113d48a6d" },
  { name: "Ensemble wax", price: 22000, photo: "photo-1696962701419-6f510910e838" },
];
