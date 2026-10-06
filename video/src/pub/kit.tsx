import { continueRender, delayRender, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "./photos";

/* ---------- Identité du site (src/app/globals.css) ---------- */

export const K = {
  brand: "#e8690b",
  brandDark: "#c95705",
  brandSoft: "#fff1e6",
  leaf: "#0a8f5a",
  wa: "#25d366",
  waDark: "#075e54",
  waBg: "#efeae2",
  waOut: "#d9fdd3",
  ink: "#121110",
  ink2: "#1c1a18",
  paper: "#faf8f5",
  sand: "#f1ece5",
  line: "#e9e4dd",
  mute: "#6b645c",
  alert: "#e5484d",
};

export const DISPLAY = "Bricolage";
export const SANS = "Manrope";

// Polices embarquées (public/fonts) : le rendu marche sans Internet
const fontsReady = delayRender("Polices");
Promise.all([
  new FontFace(DISPLAY, `url(${staticFile("fonts/bricolage.woff2")}) format("woff2")`, { weight: "200 800" }).load(),
  new FontFace(SANS, `url(${staticFile("fonts/manrope.woff2")}) format("woff2")`, { weight: "200 800" }).load(),
])
  .then((fonts) => {
    fonts.forEach((f) => (document.fonts as unknown as { add: (f: FontFace) => void }).add(f));
    continueRender(fontsReady);
  })
  .catch(() => continueRender(fontsReady));

/* ---------- Mouvement ---------- */

export function useSpring(delay = 0, damping = 14, mass = 0.7, stiffness = 120) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass, stiffness } });
}

/** interpolate borné, avec une courbe douce par défaut */
export function tween(frame: number, input: [number, number], output: [number, number], easing = Easing.bezier(0.2, 0.7, 0.1, 1)) {
  return interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

/** Phrase qui sort d'un masque, mot par mot */
export function Reveal({
  text,
  delay = 0,
  size = 120,
  color = K.ink,
  weight = 700,
  stagger = 3,
  font = DISPLAY,
  align = "center",
  lineHeight = 1.02,
  highlight,
  highlightColor = K.brand,
  out,
}: {
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  weight?: number;
  stagger?: number;
  font?: string;
  align?: "center" | "left";
  lineHeight?: number;
  highlight?: string[];
  highlightColor?: string;
  /** image (locale) où la phrase repart vers le haut */
  out?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  let w = 0;
  return (
    <div style={{ fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight, letterSpacing: "-0.035em", textAlign: align }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24 }}>
          {line.split(" ").map((word, i) => {
            const idx = w++;
            const p = spring({ frame: frame - delay - idx * stagger, fps, config: { damping: 16, mass: 0.6, stiffness: 140 } });
            const o = out === undefined ? 0 : tween(frame, [out + idx * 1.5, out + idx * 1.5 + 10], [0, 1], Easing.in(Easing.cubic));
            const hl = highlight?.some((h) => word.toLowerCase().startsWith(h.toLowerCase()));
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
                <span
                  style={{
                    display: "inline-block",
                    transform: `translateY(${(1 - p) * 110 - o * 110}%) rotate(${(1 - p) * 6}deg)`,
                    color: hl ? highlightColor : undefined,
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Grain de film léger, qui bouge à chaque image */
export function Grain({ opacity = 0.07 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 8;
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id={`g${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${seed})`} />
    </svg>
  );
}

/* ---------- Logo ---------- */

export function LogoMark({ size = 160, draw = 1 }: { size?: number; draw?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size}>
      <rect width="48" height="48" rx="13" fill={K.brand} />
      <g transform="translate(0 -1.5)">
        <path d="M18.5 17.5v-1.8a5.5 5.5 0 0 1 11 0v1.8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="20" strokeDashoffset={20 * (1 - draw)} />
        <path
          d="M14.6 17.5h18.8a2 2 0 0 1 2 2.1l-.9 13.6a3.2 3.2 0 0 1-3.2 3H20.2l-5.4 4.3v-4.6a3.2 3.2 0 0 1-1.8-2.7l-.4-13.6a2 2 0 0 1 2-2.1z"
          fill="#fff"
          style={{ transformOrigin: "24px 28px", transform: `scale(${draw})` }}
        />
        {[19.2, 24, 28.8].map((cx, i) => (
          <circle key={cx} cx={cx} cy="27" r={1.7 * Math.min(1, Math.max(0, draw * 3 - i * 0.6 - 1))} fill={K.brand} />
        ))}
      </g>
    </svg>
  );
}

export function Wordmark({ size = 120, color = K.ink, delay = 0 }: { size?: number; color?: string; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = "mondjassa".split("");
  return (
    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: "-0.04em", color, display: "flex" }}>
      {letters.map((l, i) => {
        const p = spring({ frame: frame - delay - i * 2, fps, config: { damping: 13, mass: 0.5 } });
        return (
          <span key={i} style={{ display: "inline-block", color: i >= 3 ? K.brand : undefined, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.6 + 0.4 * p})` }}>
            {l}
          </span>
        );
      })}
    </div>
  );
}

/* ---------- Icônes (SVG, pas d'emoji) ---------- */

export function WaIcon({ size = 64, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-2-1.2 7.4 7.4 0 01-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.2c0-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

export function Icon({ d, size = 48, color = "currentColor", stroke = 2 }: { d: string; size?: number; color?: string; stroke?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export const ICONS = {
  bag: "M6 7h12l1 13H5L6 7zM9 7a3 3 0 016 0",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
  tag: "M3 12V4h8l9 9-8 8-9-9zM7.5 7.5h.01",
  box: "M4 8l8-4 8 4v8l-8 4-8-4V8zM4 8l8 4 8-4M12 12v8",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  check: "M5 12.5l4.5 4.5L19 7",
  cart: "M3 4h2l2.4 11h10.2L20 8H6.2M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  plus: "M12 5v14M5 12h14",
  phone: "M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2",
};

/* ---------- Photos produits ---------- */

export const PRODUITS = [
  { name: "Robe noire lacée", price: 15000 },
  { name: "Robe sirène rouge", price: 25000 },
  { name: "Grand boubou brodé", price: 18000 },
  { name: "Veste bomber", price: 12000 },
  { name: "Ensemble t-shirt short", price: 8500 },
];

// Tons de repli quand il n'y a pas encore de photo (fond neutre, comme sur le site)
const TONES = [
  ["#efe4d6", "#d9c3a5"],
  ["#e8ddd3", "#bfa58c"],
  ["#ece7e1", "#c9bfb4"],
  ["#f2e6d8", "#e0b98a"],
  ["#e6e1da", "#b8ab9b"],
  ["#efe2d9", "#cf9f7d"],
];

export function Photo({ i, style, zoom = 1 }: { i: number; style?: React.CSSProperties; zoom?: number }) {
  const base: React.CSSProperties = { position: "relative", overflow: "hidden", ...style };
  if (PHOTOS.length) {
    return (
      <div style={base}>
        <Img src={staticFile(PHOTOS[i % PHOTOS.length])} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
      </div>
    );
  }
  const [a, b] = TONES[i % TONES.length];
  const name = PRODUITS[i % PRODUITS.length].name;
  return (
    <div style={{ ...base, background: `linear-gradient(150deg, ${a}, ${b})`, display: "grid", placeItems: "center" }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "3em", color: "rgba(255,255,255,.75)" }}>{name.charAt(0)}</span>
    </div>
  );
}

export const fcfa = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
export const rnd = (s: string) => random(s);

/* ---------- Téléphone ---------- */

export function Phone({ children, w = 620, h = 1260, style, dark = false }: { children: React.ReactNode; w?: number; h?: number; style?: React.CSSProperties; dark?: boolean }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 86, background: "#0c0b0a", padding: 16, boxShadow: "0 60px 140px rgba(0,0,0,.45), inset 0 0 0 2px #2a2725", ...style }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 72, overflow: "hidden", background: dark ? "#000" : K.paper, position: "relative" }}>
        <div style={{ position: "absolute", top: 20, left: "50%", width: 150, height: 40, marginLeft: -75, borderRadius: 999, background: "#000", zIndex: 50 }} />
        {children}
      </div>
    </div>
  );
}
