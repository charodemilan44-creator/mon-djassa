import { continueRender, delayRender, staticFile } from "remotion";

// Police embarquée dans le projet (public/fonts) : le rendu marche même sans accès à Google Fonts
export const fontFamily = "Plus Jakarta Sans";
const waitForFont = delayRender("Chargement de la police");
const font = new FontFace(fontFamily, `url(${staticFile("fonts/jakarta.woff2")}) format("woff2")`, { weight: "200 800" });
font
  .load()
  .then(() => {
    (document.fonts as unknown as { add: (f: FontFace) => void }).add(font);
    continueRender(waitForFont);
  })
  .catch(() => continueRender(waitForFont));

export const C = {
  brand: "#F77F00",
  brandDark: "#D96F00",
  leaf: "#009E60",
  cream: "#FFFAF3",
  ink: "#1C1917",
  muted: "#78716C",
  wa: "#25D366",
  waDark: "#075E54",
  waBg: "#ECE5DD",
  waBubble: "#DCF8C6",
};
