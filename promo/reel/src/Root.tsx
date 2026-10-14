import React from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { Reel } from "./Reel";
import { T } from "./theme";

// Load the brand fonts from public/ before any frame renders.
const FACES: [string, string, number, string][] = [
  ["Oswald", "oswald", 500, ""], ["Oswald", "oswald", 700, ""],
  ["Inter", "inter", 400, ""], ["Inter", "inter", 500, ""], ["Inter", "inter", 600, ""], ["Inter", "inter", 700, ""],
];
const CYR = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";
const LAT = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

if (typeof document !== "undefined") {
  const handle = delayRender("fonts");
  const faces: FontFace[] = [];
  for (const [family, file, weight] of FACES) {
    for (const [subset, range] of [["latin", LAT], ["cyrillic", CYR]] as const) {
      faces.push(new FontFace(family, `url(${staticFile(`fonts/${file}-${subset}-${weight}-normal.woff2`)})`, { weight: String(weight), unicodeRange: range }));
    }
  }
  for (const [subset, range] of [["latin", LAT], ["cyrillic", CYR]] as const) {
    faces.push(new FontFace("JetBrains Mono", `url(${staticFile(`fonts/jetbrains-mono-${subset}-500-normal.woff2`)})`, { weight: "500", unicodeRange: range }));
  }
  Promise.all(faces.map((f) => f.load().then((l) => document.fonts.add(l))))
    .then(() => continueRender(handle))
    .catch((e) => { console.error(e); continueRender(handle); });
}

export const Root: React.FC = () => (
  <Composition id="CoucouReel" component={Reel} durationInFrames={T.total} fps={T.fps} width={1080} height={1920} />
);
