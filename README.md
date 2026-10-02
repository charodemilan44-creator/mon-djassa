# MonDjassa

Ton djassa en ligne, commandes sur WhatsApp.

Une vendeuse crée sa boutique avec son numéro WhatsApp, ajoute ses produits depuis son téléphone et partage son lien
`mondjassa.ci/nom-de-sa-boutique`. Les clientes remplissent un panier, choisissent leur commune, et la commande part
sur le WhatsApp de la vendeuse avec un message tout prêt.

Stack : Next.js 16 (App Router) + Supabase (base de données, connexion, photos) + Tailwind CSS 4.

## Ce qui est prêt

| Page | Adresse | Contenu |
| --- | --- | --- |
| Accueil | `/` | Accroche, 3 étapes, avantages, exemples, prix, FAQ, support WhatsApp |
| Inscription | `/inscription` | Nom de la boutique, lien, numéro WhatsApp, mot de passe |
| Connexion | `/connexion` | Numéro WhatsApp + mot de passe |
| Dashboard : accueil | `/dashboard` | Lien à copier / partager, visites et commandes de la semaine, jours d'essai, liste « pour bien démarrer » |
| Dashboard : produits | `/dashboard/produits` | Ajouter / modifier / supprimer, photo, prix, catégorie, en stock / épuisé en un clic |
| Dashboard : ma boutique | `/dashboard/boutique` | Logo, bannière, couleur, présentation, horaires, numéro, lien, paiements acceptés |
| Dashboard : livraison | `/dashboard/livraison` | Communes livrées et frais |
| Dashboard : abonnement | `/dashboard/abonnement` | Statut, offres 5 000 / 25 000 FCFA, historique des paiements |
| Dashboard : aide | `/dashboard/aide` | Questions fréquentes + WhatsApp du support |
| Boutique publique | `/[nom-boutique]` | Produits par catégorie, recherche, panier, choix de la commune, envoi de la commande sur WhatsApp |

Règles d'essai et d'abonnement :
- Chaque boutique a **30 jours gratuits** à partir de sa création (`trial_ends_at`).
- Après l'essai, sans paiement : la boutique publique affiche « momentanément indisponible » et le dashboard ne garde que
  l'accueil et la page abonnement. Rien n'est effacé.
- La vendeuse ne peut pas modifier elle-même son essai ni son abonnement (protégé dans la base).

## Mise en route

1. **Créer un projet Supabase** sur https://supabase.com (gratuit pour commencer).
2. Dans Supabase, ouvrir **SQL Editor**, coller tout le contenu de `supabase/schema.sql` et cliquer sur **Run**.
   Cela crée les tables, la sécurité et l'espace de stockage des photos.
3. Copier `.env.example` en `.env.local` et remplir les valeurs (Supabase : *Project Settings > API*).
4. Installer et lancer :
   ```bash
   npm install
   npm run dev
   ```
   puis ouvrir http://localhost:3000

### Mettre en ligne (Vercel)

1. Pousser ce dossier sur un dépôt GitHub.
2. Sur https://vercel.com, importer le dépôt et ajouter les mêmes variables que dans `.env.local`
   (avec `NEXT_PUBLIC_SITE_URL=https://mondjassa.ci` une fois le domaine acheté).
3. Brancher le nom de domaine dans Vercel.

## Activer un abonnement (en attendant le paiement automatique)

Pour l'instant, les boutons « Payer avec Wave / Orange Money » ouvrent un message WhatsApp vers le support.
Quand la vendeuse a payé, l'équipe lance dans le SQL Editor de Supabase :

```sql
-- 'monthly' (5 000 FCFA, 1 mois) ou 'yearly' (25 000 FCFA, 1 an) ; méthode : 'wave', 'orange_money' ou 'autre'
select public.admin_record_payment('nom-de-la-boutique', 'monthly', 'wave', 'référence de la transaction');
```

L'abonnement démarre à la fin de l'essai (ou de la période déjà payée) : la vendeuse ne perd aucun jour.
Le paiement apparaît dans son historique et sa boutique se réactive tout de suite.

## Choix techniques à connaître

- **Connexion par numéro, sans email ni SMS.** Supabase Auth a besoin d'un identifiant : le numéro est transformé en
  identifiant interne `2250701020304@tel.mondjassa.ci` (jamais affiché, aucun email envoyé). Le compte est créé côté
  serveur avec la clé `service_role`, donc il n'y a rien à régler dans les options email de Supabase.
  Plus tard, on pourra passer au code par SMS (Supabase Phone Auth + un fournisseur SMS).
- **Mot de passe oublié** : pour l'instant, le lien envoie vers le WhatsApp du support. L'équipe peut changer le mot de
  passe dans Supabase (*Authentication > Users*).
- **Photos** : réduites dans le téléphone avant l'envoi (moins de données mobiles), stockées dans le bucket
  `shop-images`, chaque vendeuse dans son propre dossier.
- **Statistiques** : une visite est comptée une fois par session de navigation ; un clic « Envoyer ma commande »
  compte comme une commande envoyée.

## Prochaines étapes possibles

- Paiement automatique Wave / Orange Money (via CinetPay, PayDunya ou l'API Wave Business).
- Code de connexion par SMS.
- Import de produits depuis un fichier Excel.
- Tutoriels vidéo dans l'aide, témoignages sur l'accueil.
- Un petit espace admin pour activer les abonnements sans passer par le SQL Editor.
