# Vidéo promo MonDjassa (Remotion)

Vidéo verticale 1080×1920 de 34 secondes, pour le statut WhatsApp, TikTok et les Reels.
Le scénario et le prompt sont dans [PROMPT.md](PROMPT.md).

```bash
cd video
npm install
npm run studio   # aperçu et modification dans le navigateur
npm run render   # crée out/mondjassa-promo.mp4
```

- Les durées des scènes sont dans `src/Promo.tsx`, dans l'objet `S` (30 images = 1 seconde).
- Les couleurs sont dans `src/theme.ts`.
- La police Plus Jakarta Sans est incluse dans `public/fonts`.
- Il n'y a pas de musique : ajoute un son tendance au montage (CapCut, TikTok).
