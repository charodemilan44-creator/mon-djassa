import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./theme";
import { formatF, Logo, Phone, ShopIcon, StepBadge, Title, usePop, useSceneFade, WhatsAppIcon } from "./ui";

// Durée de chaque scène, en images (30 images = 1 seconde)
const S = { probleme: 120, solution: 120, produits: 180, lien: 150, commande: 180, prix: 120, cta: 150 };
export const PROMO_DURATION = Object.values(S).reduce((a, b) => a + b, 0);

export const Promo = () => {
  let from = 0;
  const at = (d: number) => {
    const start = from;
    from += d;
    return start;
  };
  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily }}>
      <Sequence from={at(S.probleme)} durationInFrames={S.probleme}><Probleme /></Sequence>
      <Sequence from={at(S.solution)} durationInFrames={S.solution}><Solution /></Sequence>
      <Sequence from={at(S.produits)} durationInFrames={S.produits}><Produits /></Sequence>
      <Sequence from={at(S.lien)} durationInFrames={S.lien}><Lien /></Sequence>
      <Sequence from={at(S.commande)} durationInFrames={S.commande}><Commande /></Sequence>
      <Sequence from={at(S.prix)} durationInFrames={S.prix}><Prix /></Sequence>
      <Sequence from={at(S.cta)} durationInFrames={S.cta}><Cta /></Sequence>
    </AbsoluteFill>
  );
};

/* ---------------- Visuels produits (formes simples, pas de vraies photos) ---------------- */

const PRODUITS = [
  { name: "Robe wax", price: 15000, bg: "#FDE68A", fg: "#B45309", shape: "robe" },
  { name: "Sac en raphia", price: 8500, bg: "#FECACA", fg: "#B91C1C", shape: "sac" },
  { name: "Sandales", price: 6000, bg: "#BBF7D0", fg: "#15803D", shape: "sandale" },
  { name: "Boucles", price: 2500, bg: "#BFDBFE", fg: "#1D4ED8", shape: "boucles" },
] as const;

function ProduitVisuel({ shape, fg, size = 120 }: { shape: string; fg: string; size?: number }) {
  const common = { fill: fg, opacity: 0.85 };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {shape === "robe" && <path d="M38 12h24l-4 18 18 58H24l18-58z" {...common} />}
      {shape === "sac" && (
        <>
          <path d="M34 40c0-14 32-14 32 0" fill="none" stroke={fg} strokeWidth={6} />
          <rect x={20} y={38} width={60} height={46} rx={10} {...common} />
        </>
      )}
      {shape === "sandale" && <path d="M20 70c0-20 20-46 40-46s20 16 20 30-12 26-30 26H30c-6 0-10-4-10-10z" {...common} />}
      {shape === "boucles" && (
        <>
          <circle cx={34} cy={60} r={16} {...common} />
          <circle cx={66} cy={60} r={16} {...common} />
          <rect x={32} y={20} width={4} height={26} fill={fg} />
          <rect x={64} y={20} width={4} height={26} fill={fg} />
        </>
      )}
    </svg>
  );
}

/* ---------------- 1. Le problème ---------------- */

const STATUT_COULEURS = ["#FDE68A", "#FECACA", "#BBF7D0", "#BFDBFE", "#E9D5FF", "#FED7AA", "#A7F3D0", "#FBCFE8"];

function Probleme() {
  const frame = useCurrentFrame();
  const fade = useSceneFade(S.probleme, 1, 10);
  // Défilement très rapide, de plus en plus vite
  const scroll = interpolate(frame, [0, S.probleme], [0, 5200], { easing: Easing.in(Easing.quad) });
  const bubbles = [
    { x: 60, y: 560, d: 30, r: -8 },
    { x: 520, y: 820, d: 40, r: 6 },
    { x: 80, y: 1180, d: 50, r: 4 },
    { x: 500, y: 1420, d: 58, r: -5 },
  ];
  const partie2 = frame > 70;

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 120, width: "100%" }}>
        {!partie2 ? (
          <Title size={86}>200 photos<br />sur ton statut…</Title>
        ) : (
          <Title size={80} delay={70}>…et ta cliente<br />ne trouve <span style={{ color: C.brand }}>pas le prix</span></Title>
        )}
      </div>
      <div style={{ position: "absolute", top: 460, filter: partie2 ? "blur(3px)" : undefined }}>
        <Phone width={560} height={1100}>
          <div style={{ transform: `translateY(${-scroll}px)`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 10 }}>
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} style={{ height: 250, borderRadius: 16, background: STATUT_COULEURS[i % 8], display: "grid", placeItems: "center" }}>
                <ProduitVisuel shape={PRODUITS[i % 4].shape} fg={PRODUITS[(i + 1) % 4].fg} size={110} />
              </div>
            ))}
          </div>
        </Phone>
      </div>
      {bubbles.map((b, i) => (
        <Bulle key={i} {...b} />
      ))}
    </AbsoluteFill>
  );
}

function Bulle({ x, y, d, r }: { x: number; y: number; d: number; r: number }) {
  const p = usePop(d, 9);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${p}) rotate(${r}deg)`,
        background: "white",
        borderRadius: 40,
        padding: "26px 40px",
        fontWeight: 800,
        fontSize: 54,
        whiteSpace: "nowrap",
        color: C.ink,
        boxShadow: "0 20px 50px rgba(0,0,0,.18)",
      }}
    >
      C&apos;est combien ?
    </div>
  );
}

/* ---------------- 2. La solution ---------------- */

function Solution() {
  const frame = useCurrentFrame();
  const fade = useSceneFade(S.solution, 1, 10);
  const wipe = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const back = interpolate(frame, [18, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const logo = usePop(26, 10);

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center", justifyContent: "center" }}>
      {/* Rideau orange qui traverse l'écran */}
      <AbsoluteFill style={{ background: C.brand, transform: `translateX(${(1 - wipe) * -100 + back * 100}%)` }} />
      <div style={{ transform: `scale(${0.6 + 0.4 * logo})`, opacity: logo }}>
        <Logo scale={0.95} />
      </div>
      <div style={{ position: "absolute", top: 1120, width: "100%", padding: "0 80px" }}>
        <Title size={64} delay={44} color={C.muted} style={{ fontWeight: 700, letterSpacing: -1 }}>
          Ton djassa en ligne,<br /><span style={{ color: C.leaf }}>commandes sur WhatsApp</span>
        </Title>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------- 3. J'ajoute mes produits ---------------- */

function Produits() {
  const fade = useSceneFade(S.produits);
  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <StepBadge n={1} />
        <Title delay={4} size={84}>J&apos;ajoute<br />mes produits</Title>
      </div>
      <div style={{ position: "absolute", top: 560 }}>
        <Phone width={640} height={1240}>
          <div style={{ background: C.brand, padding: "80px 36px 30px", color: "white" }}>
            <div style={{ fontSize: 26, opacity: 0.85, fontWeight: 500 }}>mondjassa.ci/awa-couture</div>
            <div style={{ fontSize: 50, fontWeight: 800 }}>Awa Couture</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, padding: 24 }}>
            {PRODUITS.map((p, i) => (
              <CarteProduit key={p.name} p={p} delay={24 + i * 18} />
            ))}
          </div>
        </Phone>
      </div>
    </AbsoluteFill>
  );
}

function CarteProduit({ p, delay }: { p: (typeof PRODUITS)[number]; delay: number }) {
  const pop = usePop(delay, 11);
  return (
    <div
      style={{
        borderRadius: 24,
        border: "2px solid #eee",
        padding: 12,
        transform: `scale(${pop}) translateY(${(1 - pop) * 40}px)`,
        opacity: pop,
      }}
    >
      <div style={{ aspectRatio: "1", borderRadius: 18, background: p.bg, display: "grid", placeItems: "center" }}>
        <ProduitVisuel shape={p.shape} fg={p.fg} size={150} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 10, color: C.ink }}>{p.name}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: C.brand }}>{formatF(p.price)}</div>
      <div style={{ marginTop: 8, background: C.brand, color: "white", borderRadius: 14, textAlign: "center", padding: "10px 0", fontSize: 24, fontWeight: 700 }}>
        Ajouter
      </div>
    </div>
  );
}

/* ---------------- 4. Je partage mon lien ---------------- */

function Lien() {
  const frame = useCurrentFrame();
  const fade = useSceneFade(S.lien);
  const url = "mondjassa.ci/awa-couture";
  const chars = Math.floor(interpolate(frame, [20, 62], [0, url.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cursor = frame % 16 < 8 && chars < url.length;
  const cibles = [
    { label: "Statut", angle: -150, color: C.leaf },
    { label: "Groupes", angle: -30, color: C.wa },
    { label: "TikTok", angle: 90, color: C.ink },
  ];

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <StepBadge n={2} />
        <Title delay={4} size={84}>Je partage<br />mon lien</Title>
      </div>

      {/* Ondes */}
      {[0, 1, 2].map((i) => {
        const t = ((frame - 64 - i * 14) % 42) / 42;
        const visible = frame > 64 + i * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 1080 - 260,
              left: 540 - 260,
              width: 520,
              height: 520,
              borderRadius: 999,
              border: `6px solid ${C.brand}`,
              opacity: visible ? (1 - t) * 0.6 : 0,
              transform: `scale(${0.4 + t * 1.3})`,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          top: 1030,
          background: "white",
          borderRadius: 999,
          padding: "30px 50px",
          fontSize: 54,
          fontWeight: 800,
          color: C.ink,
          boxShadow: "0 24px 60px rgba(0,0,0,.15)",
          minWidth: 300,
          textAlign: "center",
        }}
      >
        {url.slice(0, chars)}
        <span style={{ color: C.brand, opacity: cursor ? 1 : 0 }}>|</span>
      </div>

      {cibles.map((c, i) => (
        <Cible key={c.label} {...c} delay={74 + i * 10} />
      ))}
    </AbsoluteFill>
  );
}

function Cible({ label, angle, color, delay }: { label: string; angle: number; color: string; delay: number }) {
  const p = usePop(delay, 11);
  const rad = (angle * Math.PI) / 180;
  const dist = 380 * Math.min(p, 1);
  return (
    <div
      style={{
        position: "absolute",
        left: 540 + Math.cos(rad) * dist - 140,
        top: 1080 + Math.sin(rad) * dist - 50,
        width: 280,
        height: 100,
        borderRadius: 999,
        background: color,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontSize: 42,
        fontWeight: 800,
        opacity: p,
        transform: `scale(${p})`,
      }}
    >
      {label === "Groupes" && <WhatsAppIcon size={44} />}
      {label}
    </div>
  );
}

/* ---------------- 5. Je reçois la commande sur WhatsApp ---------------- */

const LIGNES = [
  "Bonjour Awa Couture,",
  "je voudrais commander :",
  "• 1 x Robe wax : 15 000 F",
  "• 1 x Sac en raphia : 8 500 F",
  "Livraison (Cocody) : 1 500 F",
  "Total : 25 000 F",
  "Paiement : Wave",
];

function Commande() {
  const frame = useCurrentFrame();
  const fade = useSceneFade(S.commande);
  const bubble = usePop(26, 12);
  const notif = usePop(128, 11);

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <StepBadge n={3} />
        <Title delay={4} size={76}>Je reçois la commande<br /><span style={{ color: C.leaf }}>sur WhatsApp</span></Title>
      </div>

      <div style={{ position: "absolute", top: 560 }}>
        <Phone width={640} height={1240}>
          <div style={{ background: C.waDark, color: "white", padding: "80px 30px 26px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: 999, background: C.brand, display: "grid", placeItems: "center" }}>
              <ShopIcon size={40} />
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800 }}>Awa Couture</div>
              <div style={{ fontSize: 22, opacity: 0.8 }}>en ligne</div>
            </div>
          </div>
          <div style={{ background: C.waBg, height: "100%", padding: 26 }}>
            <div
              style={{
                marginLeft: "auto",
                width: "88%",
                background: C.waBubble,
                borderRadius: 26,
                borderTopRightRadius: 6,
                padding: "22px 26px",
                fontSize: 30,
                lineHeight: 1.45,
                color: C.ink,
                transform: `scale(${bubble})`,
                transformOrigin: "top right",
                boxShadow: "0 4px 10px rgba(0,0,0,.08)",
              }}
            >
              {LIGNES.map((l, i) => {
                const o = interpolate(frame, [34 + i * 10, 42 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const total = l.startsWith("Total");
                return (
                  <div key={i} style={{ opacity: o, fontWeight: total ? 800 : 500, color: total ? C.leaf : C.ink, marginTop: i === 2 || i === 4 ? 10 : 0 }}>
                    {l}
                  </div>
                );
              })}
              <div style={{ textAlign: "right", fontSize: 20, color: C.muted, marginTop: 6 }}>10:42 ✓✓</div>
            </div>
          </div>
        </Phone>
      </div>

      {/* Notification */}
      <div
        style={{
          position: "absolute",
          top: 600,
          width: 820,
          background: "white",
          borderRadius: 36,
          padding: "26px 30px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: "0 30px 80px rgba(0,0,0,.25)",
          transform: `translateY(${(1 - notif) * -260}px)`,
          opacity: notif,
        }}
      >
        <div style={{ width: 90, height: 90, borderRadius: 24, background: C.wa, display: "grid", placeItems: "center" }}>
          <WhatsAppIcon size={58} />
        </div>
        <div>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.ink }}>Nouvelle commande !</div>
          <div style={{ fontSize: 30, color: C.muted, fontWeight: 500 }}>Total : 25 000 F · Cocody</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------- 6. Le prix ---------------- */

function Prix() {
  const fade = useSceneFade(S.prix);
  const big = usePop(4, 9);
  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center", justifyContent: "center", background: C.brand }}>
      <div style={{ textAlign: "center", color: "white", transform: `scale(${big})` }}>
        <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -3 }}>1 mois</div>
        <div style={{ fontSize: 190, fontWeight: 800, letterSpacing: -6, lineHeight: 1, color: C.ink, background: "white", borderRadius: 40, padding: "10px 50px", marginTop: 10 }}>
          GRATUIT
        </div>
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 90 }}>
        <PrixCarte delay={30} montant="5 000 F" periode="/ mois" />
        <PrixCarte delay={40} montant="25 000 F" periode="/ an" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginTop: 70, width: 900 }}>
        {["Wave", "Orange Money", "Paiement à la livraison"].map((t, i) => (
          <Chip key={t} delay={56 + i * 8}>{t}</Chip>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function PrixCarte({ delay, montant, periode }: { delay: number; montant: string; periode: string }) {
  const p = usePop(delay, 11);
  return (
    <div style={{ background: "rgba(255,255,255,.18)", border: "3px solid rgba(255,255,255,.5)", borderRadius: 36, padding: "30px 40px", color: "white", textAlign: "center", transform: `scale(${p})` }}>
      <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: -2 }}>{montant}</div>
      <div style={{ fontSize: 38, fontWeight: 700, opacity: 0.9 }}>{periode}</div>
    </div>
  );
}

function Chip({ children, delay }: { children: React.ReactNode; delay: number }) {
  const p = usePop(delay, 12);
  return (
    <div style={{ background: "white", color: C.ink, borderRadius: 999, padding: "18px 34px", fontSize: 38, fontWeight: 700, transform: `scale(${p})` }}>
      {children}
    </div>
  );
}

/* ---------------- 7. Appel à l'action ---------------- */

function Cta() {
  const frame = useCurrentFrame();
  const fade = useSceneFade(S.cta, 8, 1);
  const logo = usePop(0, 11);
  const btn = usePop(30, 10);
  const pulse = 1 + Math.sin(Math.max(0, frame - 50) / 6) * 0.04 * (frame > 50 ? 1 : 0);

  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${logo})` }}>
        <Logo scale={0.9} />
      </div>
      <Title delay={12} size={80} style={{ marginTop: 90 }}>
        Crée ta boutique<br />en <span style={{ color: C.brand }}>5 minutes</span>
      </Title>
      <div
        style={{
          marginTop: 80,
          background: C.brand,
          color: "white",
          borderRadius: 40,
          padding: "40px 70px",
          fontSize: 60,
          fontWeight: 800,
          transform: `scale(${btn * pulse})`,
          boxShadow: "0 30px 70px rgba(247,127,0,.45)",
        }}
      >
        Commencer gratuitement
      </div>
      <Title delay={44} size={58} color={C.leaf} style={{ marginTop: 70, fontWeight: 800, letterSpacing: -1 }}>
        mondjassa.netlify.app
      </Title>
    </AbsoluteFill>
  );
}
