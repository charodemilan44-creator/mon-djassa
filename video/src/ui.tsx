import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily } from "./theme";

/** Valeur 0 → 1 en ressort, qui démarre à `delay` (en images). */
export function usePop(delay = 0, damping = 12) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.6 } });
}

/** Fondu d'entrée et de sortie d'une scène qui dure `duration` images. */
export function useSceneFade(duration: number, fadeIn = 8, fadeOut = 8) {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, fadeIn, duration - fadeOut, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function Title({ children, delay = 0, size = 92, color = C.ink, style }: {
  children: React.ReactNode;
  delay?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const p = usePop(delay, 14);
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -2,
        color,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StepBadge({ n, delay = 0 }: { n: number; delay?: number }) {
  const p = usePop(delay, 10);
  return (
    <div
      style={{
        width: 110,
        height: 110,
        borderRadius: 999,
        background: C.brand,
        color: "white",
        display: "grid",
        placeItems: "center",
        fontFamily,
        fontWeight: 800,
        fontSize: 64,
        transform: `scale(${p})`,
        boxShadow: "0 18px 40px rgba(247,127,0,.35)",
      }}
    >
      {n}
    </div>
  );
}

/** Icône boutique du logo */
export function ShopIcon({ size = 60, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1.5-5h15L21 9M3 9h18M3 9v1a3 3 0 006 0V9m0 1a3 3 0 006 0V9m0 1a3 3 0 006 0V9M5 13v7h14v-7" />
    </svg>
  );
}

export function Logo({ scale = 1 }: { scale?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 * scale, transform: `scale(${scale})` }}>
      <div style={{ width: 150, height: 150, borderRadius: 36, background: C.brand, display: "grid", placeItems: "center", boxShadow: "0 24px 60px rgba(247,127,0,.4)" }}>
        <ShopIcon size={96} />
      </div>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 120, letterSpacing: -4, color: C.ink }}>
        Mon<span style={{ color: C.brand }}>Djassa</span>
      </div>
    </div>
  );
}

export function WhatsAppIcon({ size = 64, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-2-1.2 7.4 7.4 0 01-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.2c0-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

/** Cadre de téléphone */
export function Phone({ children, width = 640, height = 1240, style }: {
  children: React.ReactNode;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 80,
        background: "#111",
        padding: 18,
        boxShadow: "0 50px 120px rgba(28,25,23,.35)",
        ...style,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 64, overflow: "hidden", background: "white", position: "relative" }}>
        <div style={{ position: "absolute", top: 18, left: "50%", width: 150, height: 34, marginLeft: -75, borderRadius: 999, background: "#111", zIndex: 10 }} />
        {children}
      </div>
    </div>
  );
}

export const formatF = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} F`;
