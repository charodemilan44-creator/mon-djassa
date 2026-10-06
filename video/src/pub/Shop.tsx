import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { DISPLAY, fcfa, Icon, ICONS, K, Photo, PRODUITS, SANS } from "./kit";

/** Écran de la boutique « Awa Couture », copie de la vraie boutique du site (/exemple) */
export function ShopScreen({
  cardsFrom = -100,
  stagger = 7,
  tapAt,
  cartCount = 0,
  cartTotal = 0,
  scroll = 0,
}: {
  /** image où les cartes commencent à tomber (sinon déjà en place) */
  cardsFrom?: number;
  stagger?: number;
  /** image où le doigt touche « Ajouter » sur la 1re carte */
  tapAt?: number;
  cartCount?: number;
  cartTotal?: number;
  scroll?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tap = tapAt === undefined ? 0 : spring({ frame: frame - tapAt, fps, config: { damping: 10, mass: 0.4 } });
  const press = tapAt !== undefined && frame >= tapAt && frame < tapAt + 6;
  const bar = spring({ frame: frame - (tapAt ?? 1e6) - 4, fps, config: { damping: 14 } });

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: SANS, color: K.ink, background: K.paper }}>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {/* Barre du haut */}
        <div style={{ height: 150, display: "flex", alignItems: "flex-end", padding: "0 30px 18px", gap: 16, background: "rgba(255,255,255,.9)", borderBottom: `1px solid ${K.line}` }}>
          <div style={{ width: 64, height: 64, borderRadius: 99, background: K.brand, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 24 }}>AC</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: "-0.02em", flex: 1 }}>Awa Couture</div>
          <div style={{ width: 66, height: 66, borderRadius: 99, border: `2px solid ${K.line}`, display: "grid", placeItems: "center", position: "relative" }}>
            <Icon d={ICONS.bag} size={32} />
            {cartCount > 0 && (
              <div style={{ position: "absolute", top: -6, right: -6, width: 30, height: 30, borderRadius: 99, background: K.brand, color: "#fff", fontSize: 17, fontWeight: 800, display: "grid", placeItems: "center", transform: `scale(${bar})` }}>{cartCount}</div>
            )}
          </div>
        </div>
        {/* Bannière */}
        <div style={{ margin: "22px 26px 0", height: 150, borderRadius: 30, background: `linear-gradient(120deg, ${K.brand}, #b9480a)`, padding: 26, color: "#fff" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 32 }}>Nouvelle collection wax</div>
          <div style={{ fontSize: 20, opacity: 0.85, marginTop: 6 }}>Livraison à Cocody et Yopougon</div>
        </div>
        {/* Catégories */}
        <div style={{ display: "flex", gap: 12, padding: "22px 26px 6px" }}>
          {["Tout", "Vêtements", "Accessoires"].map((c, i) => (
            <div key={c} style={{ padding: "12px 24px", borderRadius: 99, fontSize: 21, fontWeight: 700, background: i === 0 ? K.ink : "#fff", color: i === 0 ? "#fff" : K.ink, border: `2px solid ${i === 0 ? K.ink : K.line}` }}>{c}</div>
          ))}
        </div>
        {/* Grille produits */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, padding: "18px 26px" }}>
          {PRODUITS.slice(0, 6).map((p, i) => {
            const s = spring({ frame: frame - cardsFrom - i * stagger, fps, config: { damping: 13, mass: 0.6 } });
            const first = i === 0;
            return (
              <div key={p.name} style={{ opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 260}px) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)` }}>
                <Photo i={i} style={{ height: 250, borderRadius: 24, fontSize: 26 }} />
                <div style={{ fontSize: 22, fontWeight: 600, marginTop: 12 }}>{p.name}</div>
                <div style={{ fontSize: 23, fontWeight: 800, marginTop: 4 }}>{fcfa(p.price)}</div>
                <div
                  style={{
                    marginTop: 12,
                    height: 58,
                    borderRadius: 99,
                    background: first && cartCount > 0 ? K.ink : K.brand,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 21,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transform: first && press ? "scale(.92)" : undefined,
                  }}
                >
                  {first && cartCount > 0 ? (
                    <>
                      <span style={{ opacity: 0.6 }}>−</span>
                      <span style={{ margin: "0 22px" }}>{cartCount}</span>
                      <span>+</span>
                    </>
                  ) : (
                    <>
                      <Icon d={ICONS.plus} size={24} stroke={3} /> Ajouter
                    </>
                  )}
                </div>
                {first && tapAt !== undefined && frame >= tapAt && (
                  <div style={{ position: "relative", height: 0 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: -42,
                        width: 160,
                        height: 160,
                        marginLeft: -80,
                        marginTop: -80,
                        borderRadius: 999,
                        border: `4px solid ${K.brand}`,
                        transform: `scale(${tap})`,
                        opacity: 1 - tap,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Barre « Commander » */}
      {cartCount > 0 && (
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 30, height: 100, borderRadius: 99, background: K.ink, color: "#fff", display: "flex", alignItems: "center", padding: "0 14px", gap: 18, transform: `translateY(${(1 - bar) * 200}px)`, boxShadow: "0 20px 40px rgba(0,0,0,.25)" }}>
          <div style={{ width: 72, height: 72, borderRadius: 99, background: K.brand, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 28 }}>{cartCount}</div>
          <div style={{ fontWeight: 800, fontSize: 26, flex: 1 }}>Commander sur WhatsApp</div>
          <div style={{ fontWeight: 800, fontSize: 24, paddingRight: 16 }}>{fcfa(cartTotal).replace(" FCFA", " F")}</div>
        </div>
      )}
    </div>
  );
}
