// Voix off découpée phrase par phrase et calée sur les scènes.
// scene : scène où la phrase démarre ; at : secondes après le début de cette scène ;
// from / to : morceau du fichier audio (en secondes).
export const VOIX_FICHIER = "audio/voix.wav"; // le problème
export const VOIX_FICHIER_2 = "audio/voix2.wav"; // la solution

export const VOIX: { scene: string; at: number; from: number; to: number; part2?: boolean }[] = [
  { scene: "accroche", at: 0.2, from: 0.29, to: 1.35 }, // Tu vends sur WhatsApp ?
  { scene: "accroche", at: 1.5, from: 1.86, to: 2.94 }, // Alors écoute bien.
  { scene: "statut", at: 0.1, from: 4.03, to: 6.41 }, // Tu postes quarante-sept photos sur ton statut...
  { scene: "statut", at: 3.73, from: 7.16, to: 8.34 }, // Tes clientes zappent.
  { scene: "statut", at: 5.0, from: 9.19, to: 10.27 }, // Et vingt-quatre heures après,
  { scene: "statut", at: 6.25, from: 10.99, to: 11.6 }, // tout disparaît.
  { scene: "combien", at: 0.1, from: 13.2, to: 14.55 }, // Et toute la journée, c'est :
  { scene: "combien", at: 1.55, from: 15.0, to: 15.6 }, // C'est combien ?
  { scene: "combien", at: 2.3, from: 16.34, to: 16.87 }, // Ça reste ?
  { scene: "combien", at: 3.0, from: 17.8, to: 18.86 }, // Tu livres à Yopougon ?
  { scene: "combien", at: 4.15, from: 20.45, to: 23.43 }, // Tu réponds la même chose, cinquante fois par jour.
  { scene: "perdue", at: 0.25, from: 26.06, to: 26.56 }, // Pendant ce temps,
  { scene: "perdue", at: 0.85, from: 27.1, to: 28.17 }, // une cliente est oubliée...
  { scene: "perdue", at: 2.1, from: 29.96, to: 31.25 }, // et c'est une vente perdue.
  { scene: "bascule", at: 0.5, from: 36.61, to: 39.49 }, // Et si toute ta boutique tenait dans un seul lien ?
  { scene: "bascule", at: 3.73, from: 42.19, to: 44.02 }, // Voici MonDjassa.
  { scene: "produits", at: 0.15, from: 0.26, to: 5.04, part2: true }, // Un : ajoute tes produits. Une photo, un nom, un prix. C'est tout.
  { scene: "lien", at: 0.15, from: 5.73, to: 10.2, part2: true }, // Deux : partage ton lien. Un seul statut, et toute ta boutique est dedans.
  { scene: "commande", at: 0.15, from: 10.99, to: 16.82, part2: true }, // Trois : ta cliente choisit, et la commande arrive...
  { scene: "atouts", at: 0.05, from: 17.1, to: 17.73, part2: true }, // Prix clairs.
  { scene: "atouts", at: 0.85, from: 18.25, to: 19.85, part2: true }, // Stock à jour. Livraison par commune.
  { scene: "prix", at: 0.1, from: 20.12, to: 21.25, part2: true }, // Essaie un mois gratuit.
  { scene: "prix", at: 1.45, from: 21.96, to: 25.15, part2: true }, // Ensuite, c'est cinq mille francs par mois.
  { scene: "fin", at: 0.1, from: 25.82, to: 26.4, part2: true }, // MonDjassa.
  { scene: "fin", at: 0.75, from: 26.81, to: 28.54, part2: true }, // Crée ta boutique en cinq minutes,
  { scene: "fin", at: 2.55, from: 28.8, to: 29.79, part2: true }, // depuis ton téléphone.
];
