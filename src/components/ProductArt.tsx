// Visuels produits en traits fins sur fonds doux, utilisés pour les aperçus et les produits sans photo
const TONES = [
  { bg: "#F3E7D8", fg: "#8A5A2B" },
  { bg: "#E6ECE3", fg: "#3F6B4E" },
  { bg: "#EFE3E3", fg: "#8E4A4A" },
  { bg: "#E3E8EF", fg: "#3E5878" },
  { bg: "#EEE8DD", fg: "#6F5B3E" },
  { bg: "#E9E3EE", fg: "#62507A" },
];

const SHAPES: Record<string, React.ReactNode> = {
  robe: <path d="M40 18h20l-3 14 15 50H28l15-50z M43 18c2 5 12 5 14 0" />,
  sac: <><path d="M38 44v-6a12 12 0 0 1 24 0v6" /><rect x="26" y="44" width="48" height="38" rx="6" /></>,
  basket: <path d="M18 66c0-8 6-12 14-14l14-4 8-14c2-3 6-3 8 0l4 8c6 2 16 6 16 16v8H18z M18 74h64" />,
  boucles: <><circle cx="38" cy="62" r="11" /><circle cx="62" cy="62" r="11" /><path d="M38 30v21M62 30v21" /></>,
  parfum: <><rect x="32" y="40" width="36" height="42" rx="8" /><path d="M44 40v-8h12v8M42 26h16" /></>,
  rouge: <><rect x="40" y="48" width="20" height="34" rx="3" /><path d="M42 48V34l16-8v22" /></>,
  montre: <><circle cx="50" cy="54" r="16" /><path d="M42 39l2-15h12l2 15M42 69l2 15h12l2-15M50 46v8l5 4" /></>,
  pagne: <><rect x="26" y="26" width="48" height="52" rx="4" /><path d="M26 44h48M26 60h48M42 26v52M58 26v52" /></>,
};

export const PRODUCT_SHAPES = Object.keys(SHAPES);

export function ProductArt({ shape, tone = 0, className = "" }: { shape: string; tone?: number; className?: string }) {
  const t = TONES[tone % TONES.length];
  return (
    <div className={`relative grid place-items-center overflow-hidden ${className}`} style={{ background: t.bg }}>
      <svg viewBox="0 0 100 100" className="size-[62%]" fill="none" stroke={t.fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {SHAPES[shape] ?? SHAPES.sac}
      </svg>
    </div>
  );
}
