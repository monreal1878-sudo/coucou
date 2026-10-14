import React from "react";
import {interpolate} from "remotion";
import { theme, T } from "../theme";
import { ease, exitP, mix, sp, useFrame } from "../lib";
import { Mochi } from "./Mochi";
import { Cursor } from "./Bits";
import { Trail } from "@remotion/motion-blur";

// The Mac screen: a bezel, a warm wallpaper, a terminal running Claude Code,
// and the notch that grows into Coucou's island.
const SCREEN = { x: 50, y: 250, w: 980, h: 760, r: 46 };

// Island size keyframes: [frame, width, height, radius]. Each step springs.
const KEYS: [number, number, number, number][] = [
  [0, 300, 62, 30],
  [6, 600, 200, 64],
  [58, 940, 470, 56],
  [222, 640, 200, 64],
  [252, 940, 250, 56],
  [282, 680, 250, 60],
  [312, 560, 150, 60],
  [340, 300, 62, 30],
];

const islandGeom = (frame: number) => {
  let [, w, h, r] = KEYS[0];
  for (let i = 1; i < KEYS.length; i++) {
    const p = sp(frame, KEYS[i][0], theme.spring.island);
    w += p * (KEYS[i][1] - KEYS[i - 1][1]);
    h += p * (KEYS[i][2] - KEYS[i - 1][2]);
    r += p * (KEYS[i][3] - KEYS[i - 1][3]);
  }
  return { w, h, r };
};

// Content block visibility inside the island: enter after `a`, fast exit before `b`.
const useBlock = (a: number, b: number, delay = 7) => {
  const frame = useFrame();
  const p = sp(frame, a + delay, theme.spring.smooth);
  const o = Math.min(p * 1.3, 1) * exitP(frame, b, 6);
  const visible = frame >= a && frame < b;
  return { visible, o, y: interpolate(p, [0, 1], [26, 0]) + (1 - exitP(frame, b, 6)) * -20, s: interpolate(p, [0, 1], [0.96, 1]), p };
};

const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 500, ...style }}>{children}</span>
);

const HookContent: React.FC = () => {
  const frame = useFrame();
  const b = useBlock(6, 58, 4);
  if (!b.visible) return null;
  const pop = sp(frame, 9, theme.spring.bouncy);
  const look = { x: Math.sin(frame / 9) * 0.6, y: 0.3 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%", padding: "0 44px", opacity: exitP(frame, 58, 6) }}>
      <div style={{ transform: `translateY(${interpolate(pop, [0, 1], [-150, 0])}px) scale(${interpolate(pop, [0, 1], [0.5, 1])})` }}>
        <Mochi id="hook" size={150} look={look} glow />
      </div>
      <div style={{ opacity: b.o, transform: `translateY(${b.y}px)` }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 52, color: theme.colors.text }}>Coucou!</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 27, color: theme.colors.textDim, marginTop: 4 }}>
          3 агента работают
        </div>
      </div>
    </div>
  );
};

const SESSIONS = [
  { name: "Claude Code", tint: undefined, actions: [["Read", "App.swift", ""], ["Edit", "App.swift", "+12 −3"], ["Bash", "swift test", ""]] },
  { name: "Codex", tint: "#A78BFA", actions: [["Run", "npm test", ""], ["Edit", "api.ts", "+4 −1"], ["Read", "schema.prisma", ""]] },
  { name: "Gemini CLI", tint: "#5EC9A6", actions: [["Search", "auth flow", ""], ["Read", "README.md", ""], ["Edit", "auth.ts", "+21 −8"]] },
];

const AgentsContent: React.FC = () => {
  const frame = useFrame();
  const b = useBlock(58, 148, 6);
  if (!b.visible) return null;
  return (
    <div style={{ padding: "34px 40px", opacity: exitP(frame, 148, 6) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: b.o, marginBottom: 14 }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 26, color: theme.colors.textDim }}>3 сессии</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: theme.colors.green }}>
          <div style={{ width: 12, height: 12, borderRadius: 9, background: theme.colors.green, opacity: 0.6 + 0.4 * Math.sin(frame / 4) }} />
          LIVE
        </div>
      </div>
      {SESSIONS.map((s, i) => {
        const d = 66 + i * 5;
        const p = sp(frame, d, theme.spring.snappy);
        const step = Math.min(s.actions.length - 1, Math.max(0, Math.floor((frame - d - 14 + i * 7) / 22)));
        const [verb, file, diff] = s.actions[step];
        const tickP = ease(frame, [d + 14 + step * 22 - i * 7, d + 22 + step * 22 - i * 7], [0, 1]);
        const progress = ease(frame, [d, 148], [0.08, 0.55 + i * 0.15], theme.ease.inOut);
        return (
          <div
            key={s.name}
            style={{
              display: "flex", alignItems: "center", gap: 26, height: 116,
              borderTop: i ? `1.5px solid ${theme.colors.cardBorder}` : undefined,
              opacity: Math.min(1, p * 1.4),
              transform: `translateX(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
            }}
          >
            <Mochi id={`s${i}`} size={78} tint={s.tint} look={{ x: Math.sin(frame / 12 + i) * 0.5, y: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 32, color: theme.colors.text }}>{s.name}</div>
              <div style={{ fontSize: 25, color: theme.colors.textDim, marginTop: 4, opacity: 0.4 + tickP * 0.6, transform: `translateY(${(1 - tickP) * 8}px)` }}>
                <Mono style={{ color: theme.colors.text }}>{verb}</Mono>{"  "}
                <Mono>{file}</Mono>{"  "}
                {diff && (
                  <Mono>
                    <span style={{ color: theme.colors.green }}>{diff.split(" ")[0]}</span>{" "}
                    <span style={{ color: theme.colors.red }}>{diff.split(" ")[1]}</span>
                  </Mono>
                )}
              </div>
            </div>
            <div style={{ width: 120, height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 6, background: s.tint ?? theme.colors.mochiMid }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Btn: React.FC<{ label: string; k?: string; kind: "dark" | "light" | "hot"; scale?: number }> = ({ label, k, kind, scale = 1 }) => (
  <div
    style={{
      display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", borderRadius: 999,
      fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 28,
      background: kind === "dark" ? "#2A2622" : kind === "light" ? "#F7F5F2" : theme.colors.primary,
      color: kind === "dark" ? theme.colors.text : "#111",
      transform: `scale(${scale})`,
      boxShadow: kind === "hot" ? `0 0 40px ${theme.colors.primary}99` : undefined,
    }}
  >
    {label}
    {k && (
      <span style={{ fontSize: 20, padding: "1px 8px", borderRadius: 7, border: `2px solid ${kind === "dark" ? "#77706A" : "#555"}`, color: kind === "dark" ? "#B7B0AA" : "#333" }}>
        {k}
      </span>
    )}
  </div>
);

const CLICK = 198;

const ApproveContent: React.FC = () => {
  const frame = useFrame();
  const b = useBlock(148, 222, 6);
  if (!b.visible) return null;
  const st = (n: number) => {
    const p = sp(frame, 154 + n * 4, theme.spring.snappy);
    return { opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)` };
  };
  const press = ease(frame, [CLICK - 3, CLICK], [0, 1]) * (1 - ease(frame, [CLICK + 2, CLICK + 8], [0, 1]));
  const hot = frame >= CLICK;
  const badge = sp(frame, 160, theme.spring.bouncy);
  const shake = frame > 158 && frame < 172 ? Math.sin(frame * 2.2) * 4 * (1 - (frame - 158) / 14) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 34, height: "100%", padding: "0 44px", opacity: exitP(frame, 222, 6) }}>
      <div style={{ position: "relative", opacity: b.o, transform: `translateY(${b.y}px) rotate(${shake}deg)` }}>
        <Mochi id="appr" size={150} mood="alert" look={{ x: 0.6, y: 0.2 }} glow={false} />
        <div
          style={{
            position: "absolute", left: -8, top: -14, width: 46, height: 46, borderRadius: 30,
            background: theme.colors.primaryLight, border: "4px solid #000", transform: `scale(${badge})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, color: "#111",
          }}
        >
          !
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...st(0), display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.body, fontSize: 30 }}>
          <div style={{ width: 16, height: 16, borderRadius: 9, background: theme.colors.red }} />
          <span style={{ fontWeight: 700, color: theme.colors.text }}>Claude Code</span>
          <span style={{ color: theme.colors.textDim, fontWeight: 500 }}>просит разрешение</span>
        </div>
        <div
          style={{
            ...st(1), marginTop: 22, display: "inline-block", padding: "18px 24px", borderRadius: 18,
            background: "#1C1916", border: `1.5px solid ${theme.colors.cardBorder}`,
          }}
        >
          <Mono style={{ fontSize: 31, color: theme.colors.text }}>npx prisma migrate deploy</Mono>
        </div>
        <div style={{ ...st(2), display: "flex", gap: 14, marginTop: 26 }}>
          <Btn label="Отклонить" k="N" kind="dark" />
          <Btn label="Всегда" kind="dark" />
          <Btn label="Разрешить" k="Y" kind={hot ? "hot" : "light"} scale={1 - press * 0.08 + (hot ? ease(frame, [CLICK, CLICK + 10], [0.08, 0], theme.ease.out) : 0)} />
        </div>
      </div>
    </div>
  );
};

const DoneContent: React.FC = () => {
  const frame = useFrame();
  const b = useBlock(222, 252, 3);
  if (!b.visible) return null;
  const hopT = Math.max(0, frame - 226);
  const hop = hopT < 22 ? Math.abs(Math.sin((hopT / 11) * Math.PI)) * 34 * (1 - hopT / 30) : 0;
  const pop = sp(frame, 224, theme.spring.bouncy);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%", padding: "0 44px", opacity: exitP(frame, 252, 5) }}>
      <div style={{ transform: `translateY(${-hop}px) scale(${interpolate(pop, [0, 1], [0.6, 1])})` }}>
        <Mochi id="done" size={140} mood="happy" glow />
      </div>
      <div style={{ opacity: b.o, transform: `translateY(${b.y}px)` }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 48, color: theme.colors.text }}>Готово!</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 26, color: theme.colors.textDim, marginTop: 4 }}>
          Миграция применена · 12 с
        </div>
      </div>
    </div>
  );
};

const PROMPT = "Почему упал билд?";

const ChatContent: React.FC = () => {
  const frame = useFrame();
  const b = useBlock(252, 282, 4);
  if (!b.visible) return null;
  const chars = Math.floor(ease(frame, [258, 274], [0, PROMPT.length], theme.ease.inOut));
  const caret = Math.floor(frame / 4) % 2 === 0;
  const sendP = ease(frame, [274, 280], [0, 1]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%", padding: "0 40px", opacity: Math.min(b.o, exitP(frame, 282, 5)) * 1, transform: `translateY(${b.y}px)` }}>
      <Mochi id="chat" size={110} look={{ x: 0.7, y: 0.1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: theme.colors.textDim, marginBottom: 14 }}>Чат с Claude</div>
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 18px 28px",
            borderRadius: 999, background: "#1C1916", border: `1.5px solid ${theme.colors.cardBorder}`,
          }}
        >
          <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 32, color: theme.colors.text }}>
            {PROMPT.slice(0, chars)}
            <span style={{ opacity: caret ? 1 : 0, color: theme.colors.primaryLight }}>|</span>
          </span>
          <div
            style={{
              width: 58, height: 58, borderRadius: 40, background: theme.colors.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${1 + Math.sin(sendP * Math.PI) * 0.18})`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileContent: React.FC = () => {
  const frame = useFrame();
  const b = useBlock(282, 312, 3);
  if (!b.visible) return null;
  const gulp = frame >= 298 && frame < 306;
  const gotIt = ease(frame, [300, 308], [0, 1]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%", padding: "0 44px", opacity: Math.min(b.o, exitP(frame, 312, 5)) }}>
      <div style={{ transform: `scale(${gulp ? 1.1 : 1})` }}>
        <Mochi id="file" size={140} mood={gulp ? "gulp" : frame >= 306 ? "happy" : "alert"} look={{ x: 0.5, y: 0.8 }} glow={frame >= 298} />
      </div>
      <div style={{ position: "relative", transform: `translateY(${b.y}px)` }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 40, color: theme.colors.text, opacity: gotIt }}>brief.pdf</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 25, color: theme.colors.textDim, marginTop: 6, maxWidth: 380, opacity: gotIt }}>
          Спроси о файле или отправь письмом
        </div>
        <div style={{ position: "absolute", top: 20, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 30, color: theme.colors.textDim, opacity: 1 - gotIt }}>
          Отпусти файл сюда
        </div>
      </div>
    </div>
  );
};

const PhoneTeaser: React.FC = () => {
  const frame = useFrame();
  const b = useBlock(312, 340, 3);
  if (!b.visible) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, height: "100%", padding: "0 34px", opacity: Math.min(b.o, exitP(frame, 340, 5)), transform: `translateY(${b.y}px)` }}>
      <Mochi id="tease" size={84} mood="happy" />
      <div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 22, color: theme.colors.textDim }}>Отошёл от Mac?</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 31, color: theme.colors.text }}>Mochi уже в телефоне</div>
      </div>
    </div>
  );
};

// The dragged file flying from the desktop into the island.
const FlyingFile: React.FC = () => {
  const frame = useFrame();
  if (frame < 284 || frame > 302) return null;
  const t = ease(frame, [285, 300], [0, 1], theme.ease.inOut);
  const x = mix(t, 620, 330);
  const y = mix(t, 560, 120) - Math.sin(t * Math.PI) * 60;
  const s = mix(t, 1, 0.25);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${mix(t, -8, 20)}deg)`, opacity: ease(frame, [284, 288], [0, 1]) }}>
      <svg width="130" height="160" viewBox="0 0 130 160">
        <path d="M10 6 h78 l32 32 v110 a8 8 0 0 1 -8 8 h-102 a8 8 0 0 1 -8 -8 v-134 a8 8 0 0 1 8 -8z" fill="#EDE9FE" />
        <path d="M88 6 v24 a8 8 0 0 0 8 8 h24" fill="#C4B5FD" />
        <rect x="22" y="86" width="56" height="26" rx="6" fill={theme.colors.accent} />
        <text x="50" y="105" textAnchor="middle" fontFamily="Inter" fontWeight="700" fontSize="17" fill="#fff">PDF</text>
        <rect x="22" y="124" width="80" height="8" rx="4" fill="#C4B5FD" />
      </svg>
      <Cursor x={86} y={110} press={0.6} opacity={1} />
    </div>
  );
};

const Phone: React.FC = () => {
  const frame = useFrame();
  if (frame < 312 || frame > 346) return null;
  const p = sp(frame, 313, theme.spring.smooth);
  const out = exitP(frame, 345, 7);
  const di = sp(frame, 322, theme.spring.bouncy);
  const card = sp(frame, 326, theme.spring.snappy);
  return (
    <div
      style={{
        position: "absolute", left: 670, top: 236, width: 290, height: 580,
        opacity: Math.min(1, p * 1.3) * out,
        transform: `translateX(${interpolate(p, [0, 1], [420, 0])}px) rotate(${interpolate(p, [0, 1], [14, -5])}deg) translateY(${Math.sin(frame / 10) * 6}px)`,
        borderRadius: 58, background: "#050505", border: "7px solid #2E2925",
        boxShadow: "0 50px 90px -20px rgba(0,0,0,0.8)", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 20%, ${theme.colors.primary}55, transparent 55%), radial-gradient(circle at 80% 90%, ${theme.colors.accent}55, transparent 55%), #120E0B` }} />
      <div
        style={{
          position: "absolute", left: "50%", top: 16, height: mix(di, 34, 56), width: mix(di, 100, 236),
          transform: "translateX(-50%)", borderRadius: 40, background: "#000",
          display: "flex", alignItems: "center", gap: 10, padding: "0 14px", overflow: "hidden",
        }}
      >
        <div style={{ opacity: di }}><Mochi id="di" size={44} mood="happy" /></div>
        <div style={{ opacity: di, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 18, color: theme.colors.text, whiteSpace: "nowrap" }}>Шаг 4 из 6</div>
      </div>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 84, color: "#fff" }}>9:41</div>
      <div
        style={{
          position: "absolute", left: 18, right: 18, top: 300, padding: 18, borderRadius: 28,
          background: "rgba(255,255,255,0.13)", border: "1px solid rgba(255,255,255,0.12)",
          opacity: card, transform: `translateY(${interpolate(card, [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Mochi id="notif" size={54} mood="alert" />
          <div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 20, color: "#fff" }}>Claude Code</div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 17, color: "#D6D0CB" }}>Нужно разрешение</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 14, background: "rgba(255,255,255,0.14)", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 17, color: "#fff" }}>Отклонить</div>
          <div style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 14, background: "#F7F5F2", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 17, color: "#111" }}>Разрешить</div>
        </div>
      </div>
    </div>
  );
};

const Wallpaper: React.FC = () => {
  const frame = useFrame();
  const lines = ["› claude", "* Разбираю задачу…", "  Read  App.swift", "  Edit  App.swift  +12 −3", "  Bash  swift test"];
  return (
    <>
      <div
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at ${70 + Math.sin(frame / 60) * 6}% 85%, ${theme.colors.primary}40, transparent 50%), radial-gradient(circle at 15% 30%, ${theme.colors.accent}38, transparent 50%), linear-gradient(160deg, #1C1612, #0E0B09)`,
        }}
      />
      <div
        style={{
          position: "absolute", left: 50, top: 420, width: 640, height: 270, borderRadius: 22,
          background: "rgba(14,12,10,0.88)", border: `1.5px solid ${theme.colors.cardBorder}`,
          transform: `translateY(${Math.sin(frame / 30) * 4}px)`, overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 10, padding: "16px 18px" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 9, background: c, opacity: 0.8 }} />)}
        </div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: theme.fonts.mono, fontSize: 22, color: i === 0 ? theme.colors.primaryLight : theme.colors.textFaint, padding: "3px 26px", whiteSpace: "pre", opacity: frame > 10 + i * 14 ? 0.9 : 0 }}>
            {l}
          </div>
        ))}
      </div>
    </>
  );
};

export const Stage: React.FC = () => {
  const frame = useFrame();
  const enter = sp(frame, 0, theme.spring.smooth);
  const leave = ease(frame, [T.cta + 2, T.cta + 16], [0, 1], theme.ease.in);
  if (frame > T.cta + 18) return null;
  const g = islandGeom(frame);
  return (
    <div
      style={{
        position: "absolute", left: SCREEN.x, top: SCREEN.y, width: SCREEN.w, height: SCREEN.h,
        opacity: Math.min(1, enter * 1.4) * (1 - leave),
        transform: `translateY(${interpolate(enter, [0, 1], [90, 0]) - leave * 120}px) scale(${interpolate(enter, [0, 1], [0.9, 1]) - leave * 0.12}) rotateX(${interpolate(enter, [0, 1], [14, 0])}deg)`,
        filter: leave > 0 ? `blur(${leave * 14}px)` : undefined,
        transformOrigin: "50% 0%",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: SCREEN.r, overflow: "hidden",
          border: "12px solid #0B0908", outline: "2px solid #3A322B",
          boxShadow: `0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03)`,
        }}
      >
        <Wallpaper />
      </div>
      {/* the island, hanging from the top bezel */}
      <div
        style={{
          position: "absolute", left: "50%", top: 10, width: g.w, height: g.h,
          transform: "translateX(-50%)",
          borderRadius: `${Math.min(g.r * 0.4, 22)}px ${Math.min(g.r * 0.4, 22)}px ${g.r}px ${g.r}px`,
          background: theme.colors.island, overflow: "hidden",
          boxShadow: g.h > 80 ? `0 30px 60px -10px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(255,255,255,0.06)` : undefined,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: g.w, height: g.h }}>
          <HookContent />
          <AgentsContent />
          <ApproveContent />
          <DoneContent />
          <ChatContent />
          <FileContent />
          <PhoneTeaser />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: `linear-gradient(0deg, ${theme.colors.primary}22, transparent)`, pointerEvents: "none" }} />
      </div>
      {/* motion blur on the fast moves */}
      <Trail layers={4} lagInFrames={0.5} trailOpacity={0.45}>
        <FlyingFile />
        <Phone />
      </Trail>
      <ApproveCursor />
    </div>
  );
};

// Cursor that travels to "Разрешить" and clicks it.
const ApproveCursor: React.FC = () => {
  const frame = useFrame();
  if (frame < 166 || frame > 222) return null;
  const t = ease(frame, [168, CLICK - 4], [0, 1], theme.ease.inOut);
  const x = mix(t, 900, 776);
  const y = mix(t, 700, 322);
  const press = ease(frame, [CLICK - 3, CLICK], [0, 1]) * (1 - ease(frame, [CLICK + 2, CLICK + 8], [0, 1]));
  const ring = ease(frame, [CLICK, CLICK + 14], [0, 1]);
  return (
    <>
      {frame >= CLICK && (
        <div
          style={{
            position: "absolute", left: x + 11 - 50 * ring - 4, top: y + 7 - 50 * ring - 4, width: 100 * ring + 8, height: 100 * ring + 8,
            borderRadius: "50%", border: `4px solid ${theme.colors.primaryLight}`, opacity: 1 - ring,
          }}
        />
      )}
      <Cursor x={x} y={y} press={press} opacity={ease(frame, [166, 172], [0, 1]) * exitP(frame, 222, 6)} />
    </>
  );
};
