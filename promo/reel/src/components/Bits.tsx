import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { sp } from "../lib";

export const Chip: React.FC<{ label: string; delay: number; frame: number; dot?: string; size?: number }> = ({
  label, delay, frame, dot, size = 28,
}) => {
  const { fps } = useVideoConfig();
  const p = sp(frame, fps, delay, theme.spring.bouncy);
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

// The @ysk_ai1 avatar badge: orange disc, glowing ring with a progress arc on top.
export const AvatarBadge: React.FC<{ size: number; arc?: number }> = ({ size, arc = 0.22 }) => {
  const frame = useCurrentFrame();
  const r = size / 2 + 9;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size + 24} height={size + 24}
        style={{ position: "absolute", left: -12, top: -12, overflow: "visible", transform: `rotate(${-120 + frame * 1.2}deg)` }}
      >
        <circle cx={size / 2 + 12} cy={size / 2 + 12} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          cx={size / 2 + 12} cy={size / 2 + 12} r={r} fill="none" stroke={theme.colors.primaryLight}
          strokeWidth="4" strokeLinecap="round" strokeDasharray={`${c * arc} ${c}`}
        />
      </svg>
      <div
        style={{
          width: size, height: size, borderRadius: "50%", overflow: "hidden",
          boxShadow: `0 0 ${size * 0.3}px ${theme.colors.primary}55`,
        }}
      >
        <Img src={staticFile("img/avatar.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.14)" }} />
      </div>
    </div>
  );
};
