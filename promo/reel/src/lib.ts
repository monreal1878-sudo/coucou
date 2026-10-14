import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, TICKS } from "./theme";

// Time in ticks (1/30 s), derived from the real fps. At 60 fps a tick advances
// by 0.5 per frame, so every spring and curve is sampled twice as often.
export const useFrame = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (frame * TICKS) / fps;
};

// Ticks -> real frames, for <Sequence from> and other frame-based APIs.
export const toFrames = (ticks: number, fps: number) => Math.round((ticks * fps) / TICKS);

type Ease = (t: number) => number;

// Clamped, eased interpolation. Linear is never used.
export const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: Ease = theme.ease.out,
) =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const sp = (
  frame: number,
  delay = 0,
  config: { damping: number; stiffness: number; mass: number } = theme.spring.smooth,
) => spring({ frame: frame - delay, fps: TICKS, config });

export const mix = (p: number, a: number, b: number) => a + (b - a) * p;

// Fast exit window: 1 -> 0 over `len` frames ending at `end`.
export const exitP = (frame: number, end: number, len = 9) =>
  ease(frame, [end - len, end], [1, 0], theme.ease.in);

// Superellipse path, the squircle Mochi is made of.
export const squircle = (cx: number, cy: number, a: number, b: number, n = 3.4, steps = 96) => {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const c = Math.cos(t), s = Math.sin(t);
    const x = cx + a * Math.sign(c) * Math.abs(c) ** (2 / n);
    const y = cy + b * Math.sign(s) * Math.abs(s) ** (2 / n);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d + "Z";
};
