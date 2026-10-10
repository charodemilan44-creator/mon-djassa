import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY, fcfa, Grain, Icon, ICONS, K, LogoMark, Phone, Photo, Reveal, SANS, tween, useSpring, WaIcon, Wordmark } from "./kit";
import { ShopScreen } from "./Shop";
import { VOIX, VOIX_FICHIER, VOIX_FICHIER_2 } from "./voix";

/*
 * Pub MonDjassa, 60 s, 1080×1920, 30 i/s.
 * Direction artistique : la douleur en noir encre (chaos, vitesse, bruit),
 * le basculement par un point orange qui avale l'écran,
 * la solution sur papier chaud (calme, net, ordonné), comme le site.
 */

// Durée des scènes, en images (30 = 1 seconde)
const S = {
  accroche: 105,
  statut: 210,
  combien: 216,
  perdue: 135,
  bascule: 185,
  produits: 195,
  lien: 165,
  commande: 240,
  atouts: 105,
  prix: 150,
  fin: 165,
};
export const PUB_DURATION = Object.values(S).reduce((a, b) => a + b, 0);

export const Pub = () => {
  let from = 0;
  const seq = (d: number, el: React.ReactNode) => {
    const s = from;
    from += d;
    return (
      <Sequence from={s} durationInFrames={d}>
        {el}
      </Sequence>
    );
  };
  return (
    <AbsoluteFill style={{ background: K.ink, fontFamily: SANS }}>
      {seq(S.accroche, <Accroche />)}
      {seq(S.statut, <Statut />)}
      {seq(S.combien, <Combien />)}
      {seq(S.perdue, <Perdue />)}
      {seq(S.bascule, <Bascule />)}
      {seq(S.produits, <Produits />)}
      {seq(S.lien, <Lien />)}
      {seq(S.commande, <Commande />)}
      {seq(S.atouts, <Atouts />)}
      {seq(S.prix, <Prix />)}
      {seq(S.fin, <Fin />)}
      <Grain />
      <Voix />
    </AbsoluteFill>
  );
};

/** Voix off : chaque phrase est posée au bon moment de sa scène */
function Voix() {
  const starts: Record<string, number> = {};
  let t = 0;
  for (const [k, d] of Object.entries(S)) {
    starts[k] = t;
    t += d;
  }
  return (
    <>
      {VOIX.map((v, i) => {
        const from = Math.round(starts[v.scene] + v.at * 30);
        const startFrom = Math.max(0, Math.round((v.from - 0.04) * 30));
        const endAt = Math.round((v.to + 0.1) * 30);
        return (
          <Sequence key={i} from={from} durationInFrames={endAt - startFrom} layout="none">
            <Audio src={staticFile(v.part2 ? VOIX_FICHIER_2 : VOIX_FICHIER)} startFrom={startFrom} endAt={endAt} />
          </Sequence>
        );
      })}
    </>
  );
}

/* ================= LA DOULEUR ================= */

function Dark({ children }: { children: React.ReactNode }) {
  return <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 30%, #23201d 0%, ${K.ink} 60%)` }}>{children}</AbsoluteFill>;
}

/** 1. Accroche */
function Accroche() {
  const frame = useCurrentFrame();
  const wa = useSpring(14, 9);
  const out = tween(frame, [88, S.accroche], [1, 0]);
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 50, opacity: out, transform: `scale(${1 + (1 - out) * 0.3})` }}>
        <div style={{ width: 170, height: 170, borderRadius: 48, background: K.wa, display: "grid", placeItems: "center", transform: `scale(${wa}) rotate(${(1 - wa) * -30}deg)`, boxShadow: "0 30px 80px rgba(37,211,102,.35)" }}>
          <WaIcon size={110} />
        </div>
        <Reveal text={"Tu vends\nsur WhatsApp ?"} size={150} color="#fff" delay={4} highlight={["WhatsApp"]} highlightColor={K.wa} />
        <div style={{ height: 90 }}>
          <Reveal text="Alors tu connais ça." size={60} color="rgba(255,255,255,.55)" font={SANS} weight={600} delay={48} />
        </div>
      </AbsoluteFill>
    </Dark>
  );
}

/** 2. Trop de photos en statut */
function Statut() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const N = 47;
  // Les photos défilent de plus en plus vite
  const progress = interpolate(frame, [0, 120], [0, N], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const idx = Math.min(N - 1, Math.floor(progress));
  const count = Math.max(1, Math.min(N, Math.ceil(progress)));
  const phoneIn = spring({ frame, fps, config: { damping: 16 } });
  const phase2 = frame >= 112;
  const expire = tween(frame, [150, 190], [0, 1]);
  const shake = frame < 120 ? Math.sin(frame * 2.1) * progress * 0.12 : 0;

  return (
    <Dark>
      {/* Titre */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
        {!phase2 ? (
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 260, lineHeight: 0.9, color: K.brand, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" }}>{count}</div>
            <Reveal text="photos sur ton statut." size={78} color="#fff" delay={4} />
          </div>
        ) : frame < 150 ? (
          <Reveal key="a" text={"Tes clientes\nzappent."} size={120} color="#fff" highlight={["zappent"]} />
        ) : (
          <Reveal key="b" text={"24 h plus tard,\ntout disparaît."} size={112} color="#fff" highlight={["disparaît"]} delay={0} />
        )}
      </div>

      {/* Téléphone : visionneuse de statut */}
      <div style={{ position: "absolute", left: "50%", top: 760, transform: `translateX(-50%) translateY(${(1 - phoneIn) * 900}px) rotate(${shake}deg)` }}>
        <Phone w={600} h={1220} dark>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - expire }}>
            <Photo i={idx} style={{ position: "absolute", inset: 0, fontSize: 80, filter: phase2 && frame < 150 ? `blur(${tween(frame, [112, 140], [0, 18])}px)` : undefined }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0008, transparent 30%)" }} />
            {/* Barres de progression du statut */}
            <div style={{ position: "absolute", top: 76, left: 22, right: 22, display: "flex", gap: 3 }}>
              {Array.from({ length: N }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= idx ? "#fff" : "rgba(255,255,255,.3)" }} />
              ))}
            </div>
            <div style={{ position: "absolute", top: 100, left: 26, display: "flex", alignItems: "center", gap: 14, color: "#fff", fontFamily: SANS }}>
              <div style={{ width: 58, height: 58, borderRadius: 99, background: K.brand, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 22 }}>AC</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 24 }}>Awa Couture</div>
                <div style={{ fontSize: 19, opacity: 0.7 }}>il y a 23 h</div>
              </div>
            </div>
            {/* Geste « passer » */}
            {phase2 && frame < 150 && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                {[0, 1, 2].map((k) => {
                  const t = ((frame - 112 + k * 9) % 27) / 27;
                  return <div key={k} style={{ position: "absolute", right: 60 + t * 300, width: 90, height: 90, borderRadius: 99, border: "5px solid rgba(255,255,255,.9)", opacity: 1 - t }} />;
                })}
              </div>
            )}
          </div>
          {/* Statut expiré */}
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: expire }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,.6)", fontFamily: SANS }}>
              <svg width="220" height="220" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,.15)" strokeWidth="6" fill="none" />
                <circle cx="50" cy="50" r="44" stroke={K.alert} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={276} strokeDashoffset={276 * expire} transform="rotate(-90 50 50)" />
                <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff" fontFamily={DISPLAY}>24 h</text>
              </svg>
              <div style={{ fontSize: 30, fontWeight: 700, marginTop: 20 }}>Statut expiré</div>
            </div>
          </div>
        </Phone>
      </div>
    </Dark>
  );
}

/** 3. « C'est combien ? » */
const QUESTIONS = [
  "C'est combien ?", "Prix stp", "Ça reste ?", "Tu as en L ?", "Tu livres à Yopougon ?", "C'est combien la robe ?",
  "Prix ?", "Dispo ?", "Combien ?", "Envoie encore les photos", "Tu es où ?", "C'est combien ?", "La 3e photo ?",
  "Tu fais réduction ?", "Prix svp", "C'est combien ?", "Livraison c'est combien ?", "Ça reste encore ?",
];

function Combien() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const msgFrame = 124;
  const intensity = tween(frame, [0, 150], [0, 1], Easing.in(Easing.quad));
  const shakeX = (random(`x${frame}`) - 0.5) * 14 * intensity;
  const shakeY = (random(`y${frame}`) - 0.5) * 14 * intensity;
  const unread = Math.min(99, Math.floor(tween(frame, [0, 160], [1, 99], Easing.in(Easing.quad))));
  const textIn = frame >= msgFrame;
  const dim = tween(frame, [msgFrame - 6, msgFrame + 6], [0, 0.86]);
  const out = tween(frame, [S.combien - 14, S.combien], [1, 0]);

  return (
    <Dark>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, opacity: out }}>
        {QUESTIONS.map((q, i) => {
          const d = i * 8 - (i > 6 ? (i - 6) * 3 : 0);
          const p = spring({ frame: frame - d, fps, config: { damping: 11, mass: 0.5 } });
          const x = 60 + random(`qx${i}`) * 560;
          const y = 140 + ((i * 97) % 1600) + random(`qy${i}`) * 60;
          const r = (random(`qr${i}`) - 0.5) * 14;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `scale(${p}) rotate(${r}deg)`,
                transformOrigin: "left bottom",
                background: "#fff",
                color: K.ink,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 40,
                padding: "22px 30px",
                borderRadius: "30px 30px 30px 8px",
                boxShadow: "0 18px 40px rgba(0,0,0,.4)",
                whiteSpace: "nowrap",
              }}
            >
              {q}
              <span style={{ fontSize: 22, color: K.mute, fontWeight: 600, marginLeft: 16 }}>{`${10 + (i % 12)}:${10 + ((i * 7) % 49)}`}</span>
            </div>
          );
        })}
        <div style={{ position: "absolute", inset: 0, background: `rgba(18,17,16,${dim})` }} />
        {/* Compteur de messages non lus */}
        <div style={{ position: "absolute", top: 120, right: 70, display: "flex", alignItems: "center", gap: 16, background: K.wa, color: "#fff", padding: "16px 26px", borderRadius: 99, fontWeight: 800, fontSize: 40, transform: `scale(${1 + Math.sin(frame / 3) * 0.04 * intensity})` }}>
          <WaIcon size={46} /> {unread >= 99 ? "99+" : unread}
        </div>
        {textIn && (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
            <Reveal text={"Et tu réponds\nla même chose"} size={112} color="#fff" delay={msgFrame} />
            <div style={{ height: 30 }} />
            <Reveal text={"50 fois par jour."} size={130} color={K.brand} delay={msgFrame + 46} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </Dark>
  );
}

/** 4. La commande perdue */
function Perdue() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scroll = tween(frame, [10, 60], [0, 1400], Easing.in(Easing.cubic));
  const stamp = spring({ frame: frame - 70, fps, config: { damping: 9, mass: 0.6 } });
  const collapse = tween(frame, [112, S.perdue], [1, 0], Easing.in(Easing.cubic));
  const msgs = [
    { t: "Bonsoir, la robe noire est dispo ?", me: false },
    { t: "Oui ma chérie", me: true },
    { t: "Je prends. Je paie demain matin", me: false, key: true },
    { t: "Ok", me: true },
    { t: "C'est combien ?", me: false },
    { t: "Prix stp", me: false },
    { t: "Tu livres à Cocody ?", me: false },
    { t: "Dispo ?", me: false },
    { t: "C'est combien ?", me: false },
    { t: "Photo encore", me: false },
    { t: "Ça reste ?", me: false },
  ];
  return (
    <Dark>
      <AbsoluteFill style={{ transform: `scale(${collapse})`, borderRadius: (1 - collapse) * 900, overflow: "hidden", opacity: collapse > 0.02 ? 1 : 0 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, overflow: "hidden", WebkitMaskImage: "linear-gradient(transparent, #000 160px)" }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 340, transform: `translateY(${-scroll}px)` }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start", marginBottom: 22 }}>
              <div style={{ background: m.me ? "#1f5c4b" : "#2a2724", color: "#fff", fontSize: 40, fontWeight: 600, padding: "22px 30px", borderRadius: 30, outline: m.key ? `4px solid ${K.brand}` : undefined, maxWidth: 760 }}>{m.t}</div>
            </div>
          ))}
        </div>
        </div>
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, padding: "0 60px" }}>
          <Reveal text={"Une cliente oubliée,"} size={96} color="#fff" delay={2} />
          <div style={{ height: 14 }} />
          <Reveal text={"c'est une vente perdue."} size={96} color="rgba(255,255,255,.55)" delay={60} />
        </div>
        <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "grid", placeItems: "center" }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 110,
              color: K.alert,
              border: `10px solid ${K.alert}`,
              borderRadius: 26,
              padding: "16px 40px",
              letterSpacing: "-0.02em",
              transform: `rotate(-9deg) scale(${3 - 2 * stamp})`,
              opacity: Math.min(1, stamp * 2),
              background: "rgba(18,17,16,.85)",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            COMMANDE
            <br />
            PERDUE
          </div>
        </div>
      </AbsoluteFill>
      {/* Il ne reste qu'un point orange */}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 40, margin: -20, borderRadius: 99, background: K.brand, transform: `scale(${tween(frame, [118, S.perdue], [0, 1])})` }} />
    </Dark>
  );
}

/* ================= LE BASCULEMENT ================= */

function Bascule() {
  const frame = useCurrentFrame();
  const grow = tween(frame, [0, 22], [1, 70], Easing.bezier(0.7, 0, 0.2, 1));
  const toPaper = tween(frame, [98, 120], [0, 1], Easing.bezier(0.7, 0, 0.2, 1));
  const logo = useSpring(116, 12, 0.8);
  const draw = tween(frame, [116, 146], [0, 1]);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 40, margin: -20, borderRadius: 99, background: K.brand, transform: `scale(${grow})` }} />
      {frame < 122 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70 }}>
          <Reveal text={"Et si toute\nta boutique"} size={124} color="#fff" delay={16} out={102} />
          <div style={{ height: 24 }} />
          <Reveal text={"tenait dans\nun seul lien ?"} size={124} color={K.ink} delay={44} out={102} />
        </AbsoluteFill>
      )}
      {/* Volet papier */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${toPaper * 100}%`, background: K.paper, borderRadius: `${(1 - toPaper) * 300}px ${(1 - toPaper) * 300}px 0 0` }} />
      {frame >= 112 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 46 }}>
          <div style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -25}deg)`, filter: `drop-shadow(0 30px 50px rgba(232,105,11,.35))` }}>
            <LogoMark size={260} draw={draw} />
          </div>
          <Wordmark size={150} delay={124} />
          <div style={{ marginTop: 10 }}>
            <Reveal text={"Ta boutique en ligne.\nTes commandes sur WhatsApp."} size={50} font={SANS} weight={700} color={K.mute} delay={144} stagger={2} lineHeight={1.3} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}

/* ================= LA SOLUTION ================= */

function Paper({ children }: { children: React.ReactNode }) {
  return <AbsoluteFill style={{ background: K.paper }}>{children}</AbsoluteFill>;
}

function Etape({ n, title, sub, delay = 0 }: { n: number; title: string; sub?: string; delay?: number }) {
  const p = useSpring(delay, 11);
  return (
    <div style={{ position: "absolute", top: 120, left: 80, right: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 84, height: 84, borderRadius: 26, background: K.ink, color: "#fff", display: "grid", placeItems: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 48, transform: `scale(${p}) rotate(${(1 - p) * 90}deg)` }}>{n}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "0.12em", color: K.brand, opacity: p }}>ÉTAPE {n}</div>
      </div>
      <div style={{ marginTop: 26 }}>
        <Reveal text={title} size={104} align="left" delay={delay + 4} />
      </div>
      {sub && (
        <div style={{ marginTop: 18 }}>
          <Reveal text={sub} size={44} font={SANS} weight={600} color={K.mute} align="left" delay={delay + 16} stagger={2} />
        </div>
      )}
    </div>
  );
}

/** 5. Étape 1 : ajouter ses produits */
function Produits() {
  const frame = useCurrentFrame();
  const phone = useSpring(10, 16);
  const out = tween(frame, [S.produits - 12, S.produits], [0, 1], Easing.in(Easing.cubic));
  return (
    <Paper>
      <div style={{ opacity: 1 - out }}>
        <Etape n={1} title={"Ajoute tes\nproduits."} sub="Une photo, un nom, un prix. C'est tout." />
      </div>
      <div style={{ position: "absolute", left: "50%", top: 700, transform: `translateX(-50%) translateY(${(1 - phone) * 1200 - out * 300}px) rotate(${(1 - phone) * 6}deg)` }}>
        <Phone w={640} h={1300}>
          <ShopScreen cardsFrom={34} stagger={9} scroll={tween(frame, [120, 175], [0, 220])} />
        </Phone>
      </div>
      {/* Petite étiquette « Ajout rapide » */}
      <Chip at={96} x={70} y={1150} text="Jusqu'à 30 photos d'un coup" icon={ICONS.plus} />
    </Paper>
  );
}

function Chip({ at, x, y, text, icon, dark = true }: { at: number; x: number; y: number; text: string; icon: string; dark?: boolean }) {
  const p = useSpring(at, 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${p})`, transformOrigin: "left center", display: "flex", alignItems: "center", gap: 14, background: dark ? K.ink : "#fff", color: dark ? "#fff" : K.ink, padding: "20px 30px", borderRadius: 99, fontWeight: 800, fontSize: 32, boxShadow: "0 24px 50px rgba(0,0,0,.25)" }}>
      <div style={{ width: 46, height: 46, borderRadius: 99, background: K.brand, display: "grid", placeItems: "center" }}>
        <Icon d={icon} size={28} color="#fff" stroke={2.6} />
      </div>
      {text}
    </div>
  );
}

/** 6. Étape 2 : partager son lien */
function Lien() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const url = "mondjassa.netlify.app/awa-couture";
  const typed = Math.floor(tween(frame, [40, 82], [0, url.length], Easing.linear));
  const collapse = tween(frame, [18, 40], [0, 1], Easing.bezier(0.7, 0, 0.2, 1));
  const pill = useSpring(34, 12);
  const sendOut = tween(frame, [S.lien - 12, S.lien], [0, 1], Easing.in(Easing.cubic));
  const places = ["Statut WhatsApp", "Groupes", "TikTok", "Facebook"];

  return (
    <Paper>
      <div style={{ opacity: 1 - sendOut }}>
        <Etape n={2} title={"Partage\nton lien."} sub="Un seul statut au lieu de 47 photos." />
      </div>

      {/* 47 vignettes qui se rassemblent en un lien */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, height: 600 }}>
        {Array.from({ length: 47 }).map((_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const x0 = 95 + col * 115;
          const y0 = row * 100;
          const x = interpolate(collapse, [0, 1], [x0, 540 - 45]);
          const y = interpolate(collapse, [0, 1], [y0, 250]);
          const s = spring({ frame: frame - i * 0.5, fps, config: { damping: 14 } });
          return <Photo key={i} i={i} style={{ position: "absolute", left: x, top: y, width: 90, height: 90, borderRadius: 16, fontSize: 18, transform: `scale(${s * (1 - collapse)})` }} />;
        })}
      </div>

      {/* Le lien */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "grid", placeItems: "center", transform: `translateY(${-sendOut * 400}px) scale(${1 - sendOut * 0.3})`, opacity: 1 - sendOut }}>
        <div style={{ transform: `scale(${pill})`, display: "flex", alignItems: "center", gap: 18, background: "#fff", border: `3px solid ${K.ink}`, padding: "26px 36px", borderRadius: 99, boxShadow: "0 30px 60px rgba(0,0,0,.12)" }}>
          <div style={{ width: 60, height: 60, borderRadius: 99, background: K.brand, display: "grid", placeItems: "center" }}>
            <Icon d={ICONS.link} size={34} color="#fff" stroke={2.6} />
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: K.ink, minWidth: 700 }}>
            {url.slice(0, typed)}
            <span style={{ opacity: frame % 16 < 8 && typed < url.length ? 1 : 0, color: K.brand }}>|</span>
          </div>
        </div>
        {/* Ondes vers les réseaux */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, marginTop: 60, width: 900 }}>
          {places.map((p, i) => {
            const s = spring({ frame: frame - 90 - i * 6, fps, config: { damping: 10 } });
            return (
              <div key={p} style={{ transform: `scale(${s})`, display: "flex", alignItems: "center", gap: 12, background: i === 0 ? K.wa : K.ink, color: "#fff", padding: "18px 28px", borderRadius: 99, fontWeight: 800, fontSize: 30 }}>
                {i === 0 && <WaIcon size={34} />}
                {p}
              </div>
            );
          })}
        </div>
      </div>
    </Paper>
  );
}

/** 7. Étape 3 : la commande arrive sur WhatsApp */
function Commande() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tapAt = 40;
  const cart = frame >= tapAt + 2 ? 1 : 0;
  const toChat = tween(frame, [84, 104], [0, 1], Easing.bezier(0.7, 0, 0.2, 1));
  const phone = useSpring(4, 16);
  const notif = spring({ frame: frame - 196, fps, config: { damping: 12 } });
  const lines = [
    "Bonjour Awa Couture,",
    "Je voudrais commander :",
    "",
    `• 1 x Robe noire lacée : ${fcfa(15000)}`,
    "",
    `Sous-total : ${fcfa(15000)}`,
    `Livraison (Cocody) : ${fcfa(1500)}`,
    `*Total : ${fcfa(16500)}*`,
    "",
    "Nom : Fatou",
    "Paiement : Wave",
  ];
  const bubble = spring({ frame: frame - 108, fps, config: { damping: 14 } });

  return (
    <Paper>
      <Etape n={3} title={"Reçois la\ncommande."} sub="Toute prête, sur ton WhatsApp." />
      <div style={{ position: "absolute", left: "50%", top: 700, transform: `translateX(-50%) translateY(${(1 - phone) * 1200}px)` }}>
        <Phone w={640} h={1300}>
          {/* Boutique côté cliente */}
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-toChat * 100}%)` }}>
            <ShopScreen cartCount={cart} cartTotal={15000} tapAt={tapAt} />
            {/* Doigt sur « Commander » */}
            {frame >= 66 && frame < 92 && (
              <div style={{ position: "absolute", left: 300, bottom: 50, width: 120, height: 120, marginLeft: -60, marginBottom: -10, borderRadius: 99, border: `5px solid ${K.brand}`, transform: `scale(${spring({ frame: frame - 66, fps, config: { damping: 10, mass: 0.4 } })})`, opacity: 1 - tween(frame, [72, 90], [0, 1]) }} />
            )}
          </div>
          {/* WhatsApp côté vendeuse */}
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - toChat) * 100}%)`, background: K.waBg, fontFamily: SANS }}>
            <div style={{ height: 160, background: K.waDark, display: "flex", alignItems: "flex-end", gap: 16, padding: "0 26px 22px", color: "#fff" }}>
              <div style={{ width: 66, height: 66, borderRadius: 99, background: "#c9b8a6", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 26, color: K.ink }}>F</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 30 }}>Fatou</div>
                <div style={{ fontSize: 20, opacity: 0.75 }}>en ligne</div>
              </div>
            </div>
            <div style={{ padding: 26 }}>
              <div style={{ background: "#fff", borderRadius: "8px 26px 26px 26px", padding: "22px 26px", fontSize: 25, lineHeight: 1.45, color: "#111", boxShadow: "0 2px 2px rgba(0,0,0,.08)", transform: `scale(${bubble})`, transformOrigin: "left top", width: 540 }}>
                {lines.map((l, i) => {
                  const show = frame >= 112 + i * 5;
                  const bold = l.startsWith("*");
                  return (
                    <div key={i} style={{ minHeight: l ? undefined : 14, opacity: show ? 1 : 0, transform: `translateY(${show ? 0 : 10}px)`, fontWeight: bold || i === 0 ? 800 : 500 }}>
                      {l.replace(/\*/g, "")}
                    </div>
                  );
                })}
                <div style={{ fontSize: 18, color: K.mute, textAlign: "right", marginTop: 6 }}>14:32</div>
              </div>
            </div>
          </div>
          {/* Notification */}
          <div style={{ position: "absolute", top: 26, left: 18, right: 18, transform: `translateY(${(1 - notif) * -220}px)`, background: "rgba(255,255,255,.96)", borderRadius: 34, padding: "22px 24px", display: "flex", gap: 18, alignItems: "center", boxShadow: "0 20px 50px rgba(0,0,0,.25)", zIndex: 60 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: K.wa, display: "grid", placeItems: "center" }}>
              <WaIcon size={44} />
            </div>
            <div style={{ fontFamily: SANS }}>
              <div style={{ fontWeight: 800, fontSize: 26 }}>Nouvelle commande</div>
              <div style={{ fontSize: 22, color: K.mute }}>Fatou · Cocody · {fcfa(16500)}</div>
            </div>
          </div>
        </Phone>
      </div>
      <Chip at={150} x={600} y={1520} text="Total calculé" icon={ICONS.check} />
    </Paper>
  );
}

/* ================= ATOUTS, PRIX, FIN ================= */

function Atouts() {
  const frame = useCurrentFrame();
  const items = [
    { t: "Prix clairs.", i: ICONS.tag },
    { t: "Stock à jour.", i: ICONS.box },
    { t: "Livraison\npar commune.", i: ICONS.truck },
    { t: "Tes visites\net commandes.", i: ICONS.chart },
  ];
  const step = Math.floor(S.atouts / items.length);
  const k = Math.min(items.length - 1, Math.floor(frame / step));
  const local = frame - k * step;
  const it = items[k];
  const bg = k % 2 === 0 ? K.ink : K.brand;
  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center", gap: 50 }}>
      <Sequence from={k * step} durationInFrames={step} layout="none">
        <Inner icon={it.i} text={it.t} local={local} />
      </Sequence>
      <div style={{ position: "absolute", bottom: 160, display: "flex", gap: 14 }}>
        {items.map((_, i) => (
          <div key={i} style={{ width: i === k ? 60 : 16, height: 16, borderRadius: 99, background: i === k ? "#fff" : "rgba(255,255,255,.35)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Inner({ icon, text, local }: { icon: string; text: string; local: number }) {
  const p = useSpring(0, 10);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 50 }}>
      <div style={{ width: 190, height: 190, borderRadius: 56, background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center", transform: `scale(${p}) rotate(${(1 - p) * -40}deg)` }}>
        <Icon d={icon} size={110} color="#fff" stroke={1.8} />
      </div>
      <Reveal key={text} text={text} size={130} color="#fff" delay={2} />
      <div style={{ opacity: local < 0 ? 0 : 1 }} />
    </AbsoluteFill>
  );
}

function Prix() {
  const frame = useCurrentFrame();
  const big = useSpring(0, 9, 0.7);
  const then = useSpring(46, 12);
  return (
    <Paper>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Reveal text="Essaie" size={90} color={K.mute} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 330, lineHeight: 0.9, letterSpacing: "-0.06em", color: K.ink, transform: `scale(${big})`, marginTop: 10 }}>1 mois</div>
        <div style={{ transform: `scale(${big}) rotate(-4deg)`, background: K.brand, color: "#fff", fontFamily: DISPLAY, fontWeight: 800, fontSize: 130, padding: "6px 50px", borderRadius: 34, marginTop: 20, boxShadow: "0 30px 60px rgba(232,105,11,.35)" }}>gratuit</div>
        <div style={{ marginTop: 80, opacity: then, transform: `translateY(${(1 - then) * 40}px)`, textAlign: "center", fontFamily: SANS }}>
          <div style={{ fontSize: 50, fontWeight: 700, color: K.ink }}>
            Ensuite <b style={{ fontWeight: 800 }}>5 000 F</b> par mois
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: K.mute, marginTop: 14 }}>ou 25 000 F par an</div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 34, opacity: tween(frame, [66, 80], [0, 1]) }}>
            {["Sans carte", "Sans engagement"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px", borderRadius: 99, border: `2px solid ${K.line}`, background: "#fff", fontSize: 30, fontWeight: 700, color: K.ink }}>
                <Icon d={ICONS.check} size={30} color={K.leaf} stroke={3} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Paper>
  );
}

function Fin() {
  const frame = useCurrentFrame();
  const logo = useSpring(0, 12);
  const btn = useSpring(100, 10);
  const pulse = 1 + Math.max(0, Math.sin((frame - 120) / 6)) * 0.04 * (frame > 120 ? 1 : 0);
  return (
    <AbsoluteFill style={{ background: K.ink, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: 999, background: `radial-gradient(circle, rgba(232,105,11,.35), transparent 60%)`, transform: `scale(${0.6 + logo * 0.5})` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `scale(${logo})` }}>
        <LogoMark size={130} />
        <Wordmark size={110} color="#fff" delay={4} />
      </div>
      <div style={{ marginTop: 90 }}>
        <Reveal text={"Crée ta boutique\nen 5 minutes."} size={118} color="#fff" delay={14} />
      </div>
      <div style={{ marginTop: 34 }}>
        <Reveal text="Depuis ton téléphone." size={46} font={SANS} weight={600} color="rgba(255,255,255,.6)" delay={76} />
      </div>
      <div style={{ marginTop: 80, transform: `scale(${btn * pulse})`, background: K.brand, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 50, padding: "36px 70px", borderRadius: 99, boxShadow: "0 30px 70px rgba(232,105,11,.45)" }}>
        Commencer gratuitement
      </div>
      <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 42, color: "#fff", opacity: tween(frame, [112, 126], [0, 1]) }}>
        <Icon d={ICONS.link} size={40} color={K.brand} stroke={2.6} />
        mondjassa.netlify.app
      </div>
    </AbsoluteFill>
  );
}

