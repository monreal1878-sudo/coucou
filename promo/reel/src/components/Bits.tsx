import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { sp } from "../lib";

export const Chip: React.FC<{ label: string; delay: number; frame: number; dot?: string; size?: number }> = ({
  label, delay, frame, dot, size = 28,
}) => {
  const p = sp(frame, delay, theme.spring.bouncy);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: `${size * 0.5}px ${size * 0.8}px`, borderRadius: 999,
        background: theme.colors.chip, border: `1.5px solid ${theme.colors.cardBorder}`,
        fontFamily: theme.fonts.body, fontWeight: 500, fontSize: size, color: theme.colors.text,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
      }}
    >
      {dot && <div style={{ width: size * 0.36, height: size * 0.36, borderRadius: 99, background: dot }} />}
      {label}
    </div>
  );
};

export const Cursor: React.FC<{ x: number; y: number; press: number; opacity: number }> = ({ x, y, press, opacity }) => (
  <svg
    width="64" height="64" viewBox="0 0 24 24"
    style={{
      position: "absolute", left: x, top: y, opacity,
      transform: `scale(${1 - press * 0.15})`, transformOrigin: "4px 3px",
      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))",
    }}
  >
    <path d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 21.8 L14.4 20.5 L11.4 14.3 L17.6 14.1 Z" fill="#fff" stroke="#000" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
