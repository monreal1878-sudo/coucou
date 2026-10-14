import React from "react";
import { theme } from "../theme";
import { squircle, useFrame } from "../lib";

type Mood = "idle" | "happy" | "alert" | "gulp";

const BODY = squircle(100, 92, 92, 74, 3.4);

// Mochi redrawn in code: cream squircle, warm glowing belly, pink cheeks, dot eyes.
export const Mochi: React.FC<{
  size: number;
  mood?: Mood;
  look?: { x: number; y: number };
  tint?: string; // session mini-Mochis are colored
  glow?: boolean;
  id: string;
  style?: React.CSSProperties;
}> = ({ size, mood = "idle", look = { x: 0, y: 0 }, tint, glow = false, id, style }) => {
  const frame = useFrame();
  // Blink every ~2.7 s, 5 frames long.
  const cycle = (frame + id.length * 17) % 80;
  const blink = cycle < 5 ? Math.abs(Math.sin((cycle / 5) * Math.PI)) : 0;
  const eyeScaleY = 1 - blink * 0.9;
  const breathe = 1 + Math.sin(frame / 14) * 0.018;
  const ex = look.x * 9, ey = look.y * 6;
  const top = tint ?? theme.colors.mochiTop;
  const mid = tint ?? theme.colors.mochiMid;
  const bottom = tint ? tint : theme.colors.mochiBottom;

  return (
    <svg
      width={size}
      height={size * 0.86}
      viewBox="0 0 200 172"
      style={{
        overflow: "visible",
        filter: glow
          ? `drop-shadow(0 0 ${size * 0.18}px ${theme.colors.glow}) drop-shadow(0 ${size * 0.06}px ${size * 0.08}px rgba(0,0,0,0.5))`
          : `drop-shadow(0 ${size * 0.05}px ${size * 0.07}px rgba(0,0,0,0.45))`,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={`h-${id}`} cx="0.35" cy="0.22" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity={tint ? 0.45 : 0.9} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`s-${id}`} cx="0.5" cy="1" r="0.75">
          <stop offset="0" stopColor="#000" stopOpacity={tint ? 0.18 : 0.06} />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(100 166) scale(${(mood === "gulp" ? 1.08 : 1) * (2 - breathe)} ${breathe * (mood === "gulp" ? 0.9 : 1)}) translate(-100 -166)`}>
        <path d={BODY} fill={`url(#b-${id})`} />
        <path d={BODY} fill={`url(#s-${id})`} />
        <path d={BODY} fill={`url(#h-${id})`} />
        {/* cheeks */}
        <ellipse cx={46 + ex * 0.5} cy={116 + ey * 0.5} rx="13" ry="8" fill={theme.colors.cheek} opacity={tint ? 0.35 : 0.75} />
        <ellipse cx={154 + ex * 0.5} cy={116 + ey * 0.5} rx="13" ry="8" fill={theme.colors.cheek} opacity={tint ? 0.35 : 0.75} />
        {/* eyes */}
        {mood === "happy" ? (
          <g stroke={theme.colors.eye} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d={`M${72 + ex} ${120 + ey} q9 -12 18 0`} />
            <path d={`M${110 + ex} ${120 + ey} q9 -12 18 0`} />
          </g>
        ) : mood === "gulp" ? (
          <g stroke={theme.colors.eye} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d={`M${74 + ex} ${116 + ey} l14 6 l-14 6`} />
            <path d={`M${126 + ex} ${116 + ey} l-14 6 l14 6`} />
          </g>
        ) : (
          <g transform={`translate(0 ${118 + ey}) scale(1 ${eyeScaleY}) translate(0 ${-(118 + ey)})`}>
            <ellipse cx={81 + ex} cy={118 + ey} rx={mood === "alert" ? 8 : 7.5} ry={mood === "alert" ? 9.5 : 8.5} fill={theme.colors.eye} />
            <ellipse cx={119 + ex} cy={118 + ey} rx={mood === "alert" ? 8 : 7.5} ry={mood === "alert" ? 9.5 : 8.5} fill={theme.colors.eye} />
            <circle cx={83.5 + ex} cy={115 + ey} r="2.2" fill="#fff" opacity="0.85" />
            <circle cx={121.5 + ex} cy={115 + ey} r="2.2" fill="#fff" opacity="0.85" />
          </g>
        )}
      </g>
    </svg>
  );
};
