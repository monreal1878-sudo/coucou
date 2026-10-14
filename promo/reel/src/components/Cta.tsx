import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme, T } from "../theme";
import { ease, sp } from "../lib";
import { Mochi } from "./Mochi";
import { AvatarBadge, Chip } from "./Bits";

// Payoff: Mochi bursts out with the wordmark, platforms, then the author CTA.
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = T.cta + 12; // lands on the impact, beat 24
  if (frame < start - 2) return null;
  const f = frame - start;

  const m = sp(f, fps, 0, theme.spring.bouncy);
  const halo = sp(f, fps, 2, theme.spring.smooth);
  const pulse = 1 + Math.sin(f / 9) * 0.04;
  const rays = 14;
  const word = "COUCOU";
  const sub = sp(f, fps, 22, theme.spring.snappy);
  const author = sp(f, fps, 48, theme.spring.smooth);
  const link = sp(f, fps, 58, theme.spring.snappy);
  const hop = f > 24 ? Math.abs(Math.sin(f / 7)) * 8 : 0;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* rays + halo behind Mochi */}
      <div style={{ position: "absolute", left: 540, top: 630, transform: `rotate(${interpolate(halo, [0, 1], [-90, 0]) + f * 0.3}deg)` }}>
        {Array.from({ length: rays }).map((_, i) => {
          const p = sp(f, fps, 2 + i * 1.2, theme.spring.snappy);
          return (
            <div
              key={i}
              style={{
                position: "absolute", left: -5, top: 0, width: 10, height: 120 * p, borderRadius: 10,
                background: `linear-gradient(180deg, ${theme.colors.primaryLight}AA, transparent)`,
                transformOrigin: "50% 0%", transform: `rotate(${(360 / rays) * i}deg) translateY(${250 + (1 - p) * -60}px)`,
                opacity: 0.55,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute", left: 540 - 380, top: 630 - 380, width: 760, height: 760, borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.primary}66, ${theme.colors.primary}11 45%, transparent 68%)`,
          transform: `scale(${halo * pulse})`, opacity: halo,
        }}
      />
      <div
        style={{
          position: "absolute", left: 540 - 190, top: 630 - 165 - hop,
          transform: `scale(${interpolate(m, [0, 1], [0.2, 1])}) rotate(${interpolate(m, [0, 1], [-25, 0])}deg)`,
          opacity: Math.min(1, m * 2),
        }}
      >
        <Mochi id="hero" size={380} mood={f > 20 ? "happy" : "idle"} look={{ x: 0, y: 0.2 }} glow />
      </div>

      {/* wordmark */}
      <div
        style={{
          position: "absolute", top: 890, width: "100%", display: "flex", justifyContent: "center", gap: 6,
          fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 230, lineHeight: 1, color: theme.colors.text, letterSpacing: "0.01em",
        }}
      >
        {word.split("").map((ch, i) => {
          const p = sp(f, fps, 8 + i * 3, theme.spring.bouncy);
          return (
            <span
              key={i}
              style={{
                display: "inline-block", opacity: Math.min(1, p * 1.5),
                transform: `translateY(${interpolate(p, [0, 1], [90, 0])}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute", top: 1148, width: "100%", textAlign: "center",
          fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 36, letterSpacing: "0.16em", color: theme.colors.textDim,
          opacity: sub, transform: `translateY(${interpolate(sub, [0, 1], [24, 0])}px)`,
        }}
      >
        БЕСПЛАТНО · OPEN SOURCE · MIT
      </div>

      <div style={{ position: "absolute", top: 1230, left: 70, right: 70, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {["macOS", "Windows", "Linux", "iPhone", "Android"].map((p, i) => (
          <Chip key={p} label={p} delay={30 + i * 4} frame={f} size={30} />
        ))}
      </div>

      {/* author + CTA */}
      <div
        style={{
          position: "absolute", top: 1400, left: 90, right: 90, padding: "28px 34px", borderRadius: 40,
          display: "flex", alignItems: "center", gap: 30,
          background: "rgba(23,19,16,0.85)", border: `1.5px solid ${theme.colors.cardBorder}`,
          opacity: author, transform: `translateY(${interpolate(author, [0, 1], [60, 0])}px) scale(${interpolate(author, [0, 1], [0.94, 1])})`,
        }}
      >
        <AvatarBadge size={120} />
        <div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 38, color: theme.colors.text }}>@ysk_ai1</div>
          <div
            style={{
              fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, textTransform: "uppercase", marginTop: 4,
              color: theme.colors.primary, textShadow: `0 0 30px ${theme.colors.primary}77`,
              opacity: link, transform: `translateX(${interpolate(link, [0, 1], [-30, 0])}px)`,
            }}
          >
            Ссылка в описании
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 22, color: theme.colors.textFaint, marginTop: 6, opacity: ease(f, [62, 74], [0, 1]) }}>
            github.com/Louis-CFM/coucou
          </div>
        </div>
      </div>
    </div>
  );
};
