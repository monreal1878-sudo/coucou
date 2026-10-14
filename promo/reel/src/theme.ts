// theme.ts — single source of truth for the reel.
// Palette: @ysk_ai1 brand (warm graphite, orange glow, a touch of violet)
// meets Mochi's cream body from the Coucou captures.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#0A0A0A",
    bgAlt: "#171310",
    primary: "#FF8A00", // THE hero color
    primaryLight: "#FFC24B",
    accent: "#8B5CF6", // secondary, for minor elements
    text: "#FFFFFF",
    textDim: "#A8A29E",
    textFaint: "#6B635D",
    island: "#000000",
    card: "#16130F",
    cardBorder: "rgba(255,255,255,0.08)",
    chip: "#1F1B17",
    glow: "rgba(255, 138, 0, 0.45)",
    green: "#34D399",
    red: "#F87171",
    mochiTop: "#FFFDF8",
    mochiMid: "#FBEFE0",
    mochiBottom: "#F4B868",
    cheek: "#F6A3A3",
    eye: "#141010",
  },
  fonts: {
    display: "Oswald",
    body: "Inter",
    mono: "JetBrains Mono",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    island: { damping: 17, stiffness: 140, mass: 0.8 },
  },
} as const;

// Timeline (30 fps, 120 BPM => 15 frames per beat). Cuts land on beats.
export const T = {
  fps: 30,
  total: 450,
  hook: 0,
  agents: 60,
  approve: 150,
  features: 255,
  cta: 345,
} as const;
