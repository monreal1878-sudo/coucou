import React from "react";
import {AbsoluteFill} from "remotion";
import { useFrame } from "../lib";
import { theme } from "../theme";

// Layer 1: warm graphite mesh with a drifting orange glow and a faint violet one.
export const BgMesh: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.colors.bg} 0%, ${theme.colors.bgAlt} 55%, ${theme.colors.bg} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute", width: 1400, height: 1400, borderRadius: "50%",
          top: -380, left: -160 + d1, filter: "blur(60px)", opacity: intensity,
          background: `radial-gradient(circle, ${theme.colors.primary}38, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 1100, height: 1100, borderRadius: "50%",
          bottom: -420, right: -380 - d2, filter: "blur(80px)",
          background: `radial-gradient(circle, ${theme.colors.accent}26, transparent 64%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Layer 4: color grade, unifies everything into the warm brand look.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 18%, transparent 80%, rgba(0,0,0,0.45))",
      }}
    />
  </AbsoluteFill>
);

// Layer 5a: procedural film grain.
export const Grain: React.FC = () => {
  const frame = useFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
        backgroundPosition: `${(Math.floor(frame) * 7) % 220}px ${(Math.floor(frame) * 13) % 220}px`,
        opacity: 0.07, mixBlendMode: "overlay",
      }}
    />
  );
};

// Layer 5b: vignette, topmost.
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);
