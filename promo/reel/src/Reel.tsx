import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme, T } from "./theme";
import { exitP, sp } from "./lib";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { Stage } from "./components/Stage";
import { Headline } from "./components/Headline";
import { Cta } from "./components/Cta";
import { AvatarBadge, Chip } from "./components/Bits";

// SFX land 2–3 frames before the visual they belong to.
const SFX: [number, string, number][] = [
  [0, "whoosh", 0.45],
  [7, "pop", 0.8],
  [56, "whoosh", 0.5],
  [64, "tick", 0.45], [69, "tick", 0.45], [74, "tick", 0.45],
  [146, "whoosh", 0.5],
  [158, "pop", 0.35],
  [196, "click", 0.75],
  [223, "chime", 0.65],
  [250, "whoosh", 0.45],
  ...[258, 261, 264, 267, 270, 273].map((f) => [f, "tick", 0.18] as [number, string, number]),
  [276, "click", 0.6],
  [280, "whoosh", 0.4],
  [298, "pop", 0.8],
  [310, "whoosh", 0.45],
  [321, "pop", 0.4],
  [322, "riser", 0.55],
  [355, "impact", 0.72],
  [375, "tick", 0.3], [379, "tick", 0.3], [383, "tick", 0.3], [387, "tick", 0.3], [391, "tick", 0.3],
  [395, "whoosh", 0.35],
];

const AGENT_CHIPS = ["Claude Code", "Codex", "Gemini CLI", "Cursor", "Copilot", "Amp", "OpenCode", "Antigravity"];

const Agents: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.agents + 20 || frame > T.approve) return null;
  return (
    <div
      style={{
        position: "absolute", top: 1420, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 12,
        opacity: exitP(frame, T.approve - 2, 8),
      }}
    >
      {AGENT_CHIPS.map((c, i) => (
        <Chip key={c} label={c} delay={T.agents + 24 + i * 3} frame={frame} size={28} />
      ))}
    </div>
  );
};

// Brand badge in the corner during the story part, like in the blog's videos.
const CornerBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame > T.cta + 4) return null;
  const p = sp(frame, fps, 10, theme.spring.smooth);
  return (
    <div
      style={{
        position: "absolute", left: 64, top: 1610, display: "flex", alignItems: "center", gap: 22,
        opacity: Math.min(1, p) * exitP(frame, T.cta + 4, 8),
        transform: `translateY(${interpolate(p, [0, 1], [30, 0]) + Math.sin(frame / 30) * 3}px)`,
      }}
    >
      <AvatarBadge size={78} />
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 30, color: theme.colors.textDim }}>@ysk_ai1</div>
    </div>
  );
};

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  // Subtle push-in on every cut keeps the frame alive.
  const cuts = [T.agents, T.approve, T.features, T.cta];
  const kick = cuts.reduce((acc, c) => acc + Math.max(0, 1 - Math.abs(frame - c - 2) / 6) * 0.012, 0);
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <BgMesh />
      <AbsoluteFill style={{ transform: `scale(${1 + kick})`, perspective: 1600 }}>
        <Stage />
        <Headline from={4} to={T.agents} kicker="Coucou · open source" lines={["Claude Code", "прямо в чёлке"]} accent="ЧЁЛКЕ" />
        <Headline from={T.agents + 2} to={T.approve} kicker="Все сессии вживую" lines={["Все агенты —", "одним взглядом"]} accent="ВЗГЛЯДОМ" size={118} />
        <Agents />
        <Headline from={T.approve + 2} to={T.features} kicker="Без переключения в терминал" lines={["Одобряй", "в один клик"]} accent="КЛИК" />
        <Headline from={T.features + 1} to={T.features + 30} kicker="Фишка 01" lines={["Чат с Claude", "из чёлки"]} accent="CLAUDE" size={118} fast />
        <Headline from={T.features + 30} to={T.features + 60} kicker="Фишка 02" lines={["Кидай файлы", "прямо в Mochi"]} accent="ФАЙЛЫ" size={118} fast />
        <Headline from={T.features + 60} to={T.cta + 2} kicker="Фишка 03" lines={["И даже", "на телефоне"]} accent="ТЕЛЕФОНЕ" size={118} fast />
        <CornerBadge />
        <Cta />
      </AbsoluteFill>
      <Grade />
      <Grain />
      <Vignette />

      <Audio src={staticFile("sfx/music.wav")} volume={0.34} />
      {SFX.map(([f, name, v], i) => (
        <Sequence key={i} from={f} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
