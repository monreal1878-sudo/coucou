import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { ease, exitP, sp } from "../lib";

// Brand headline: dim kicker with an orange tick, then a huge condensed
// all-caps hook. Words rise out of masks, staggered; one accent word glows.
export const Headline: React.FC<{
  from: number;
  to: number;
  kicker: string;
  lines: string[];
  accent: string;
  size?: number;
  top?: number;
  fast?: boolean;
}> = ({ from, to, kicker, lines, accent, size = 128, top = 1085, fast = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from - 1 || frame > to) return null;
  const f = frame - from;
  const out = exitP(frame, to, 8);
  const outY = (1 - out) * -50;

  const kp = sp(f, fps, 0, theme.spring.snappy);
  let w = 0;
  return (
    <div
      style={{
        position: "absolute", left: 60, right: 60, top,
        opacity: out, transform: `translateY(${outY}px)`,
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 18, marginBottom: 18,
          opacity: kp, transform: `translateX(${interpolate(kp, [0, 1], [-30, 0])}px)`,
          fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 30,
          letterSpacing: "0.14em", color: theme.colors.textDim, textTransform: "uppercase",
        }}
      >
        <div style={{ width: 46 * kp, height: 5, borderRadius: 3, background: theme.colors.primary }} />
        {kicker}
      </div>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex", flexWrap: "wrap", gap: 26,
            fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size,
            lineHeight: 1.04, letterSpacing: "-0.01em", textTransform: "uppercase",
            color: theme.colors.text,
          }}
        >
          {line.split(" ").map((word, wi) => {
            const delay = fast ? 1 + li * 2 + w++ * 2 : 3 + li * 5 + w++ * 3;
            const p = sp(f, fps, delay, theme.spring.snappy);
            const isAccent = word.replace(/[—,.!]/g, "").toUpperCase() === accent.toUpperCase();
            const bar = ease(f, [delay + 6, delay + (fast ? 14 : 20)], [0, 1]);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block", overflow: p < 0.985 ? "hidden" : "visible",
                  padding: "0.14em 0.04em 0.02em", margin: "-0.14em -0.04em -0.02em",
                }}
              >
                <span
                  style={{
                    display: "inline-block", position: "relative",
                    opacity: Math.min(1, p * 1.4),
                    transform: `translateY(${interpolate(p, [0, 1], [105, 0])}%) rotate(${interpolate(p, [0, 1], [5, 0])}deg)`,
                    color: isAccent ? theme.colors.primary : undefined,
                    textShadow: isAccent && p >= 0.985 ? `0 0 40px ${theme.colors.primary}88, 0 0 90px ${theme.colors.primary}44` : undefined,
                  }}
                >
                  {word}
                  {isAccent && (
                    <span
                      style={{
                        position: "absolute", left: 0, bottom: "0.02em", height: 8, borderRadius: 4,
                        width: `${bar * 100}%`,
                        background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
                      }}
                    />
                  )}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
