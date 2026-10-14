// Synthesizes the reel's sound kit as 16-bit WAVs into public/sfx/.
// Zero downloads, fully deterministic. Run: node scripts/sfx.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const out = new URL("../public/sfx/", import.meta.url);
mkdirSync(out, { recursive: true });

let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function wav(name, left, right = left) {
  const n = left.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    const l = Math.max(-1, Math.min(1, left[i]));
    const r = Math.max(-1, Math.min(1, right[i]));
    buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
  }
  writeFileSync(new URL(name, out), buf);
}

const arr = (sec) => new Float32Array(Math.round(sec * SR));

// One-pole low-pass, cutoff may vary per sample.
function lowpass(x, cutoff) {
  const y = new Float32Array(x.length);
  let z = 0;
  for (let i = 0; i < x.length; i++) {
    const fc = typeof cutoff === "function" ? cutoff(i / x.length) : cutoff;
    const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
    z += a * (x[i] - z);
    y[i] = z;
  }
  return y;
}

// --- whoosh: filtered noise sweep up then down
{
  const x = arr(0.45);
  for (let i = 0; i < x.length; i++) x[i] = rand();
  const y = lowpass(lowpass(x, (t) => 300 + 5200 * Math.sin(Math.PI * t) ** 2), (t) => 400 + 6000 * Math.sin(Math.PI * t));
  for (let i = 0; i < y.length; i++) {
    const t = i / y.length;
    y[i] *= 2.6 * Math.sin(Math.PI * t) ** 1.6;
  }
  const r = new Float32Array(y.length);
  for (let i = 0; i < y.length; i++) r[i] = y[Math.max(0, i - 220)];
  wav("whoosh.wav", y, r);
}

// --- pop: sine with fast pitch drop (Mochi popping out)
{
  const x = arr(0.22);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 180 + 900 * Math.exp(-t * 38);
    ph += (2 * Math.PI * f) / SR;
    x[i] = Math.sin(ph) * Math.exp(-t * 18) * 0.9;
  }
  wav("pop.wav", x);
}

// --- click: UI tap
{
  const x = arr(0.06);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = (Math.sin(2 * Math.PI * 2400 * t) * 0.6 + rand() * 0.4) * Math.exp(-t * 140) * 0.8;
  }
  wav("click.wav", x);
}

// --- chime: two-note happy arpeggio (task finished)
{
  const x = arr(0.9);
  const notes = [[1046.5, 0], [1568, 0.09], [2093, 0.18]];
  for (const [f, st] of notes) {
    for (let i = Math.round(st * SR); i < x.length; i++) {
      const t = i / SR - st;
      x[i] += (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t)) * Math.exp(-t * 6) * 0.22;
    }
  }
  wav("chime.wav", x);
}

// --- impact: sub thump + noise transient (scene cut / logo)
{
  const x = arr(1.1);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 42 + 110 * Math.exp(-t * 22);
    ph += (2 * Math.PI * f) / SR;
    x[i] = Math.sin(ph) * Math.exp(-t * 3.2) * 0.95 + rand() * Math.exp(-t * 40) * 0.35;
  }
  wav("impact.wav", lowpass(x, 2400));
}

// --- riser: noise + rising sine into the final reveal
{
  const x = arr(1.2);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / x.length;
    ph += (2 * Math.PI * (200 + 1400 * t * t)) / SR;
    x[i] = (rand() * 0.5 + Math.sin(ph) * 0.25) * t ** 2.2;
  }
  wav("riser.wav", lowpass(x, (t) => 800 + 7000 * t));
}

// --- tick: tiny blip for list items / typing
{
  const x = arr(0.04);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = Math.sin(2 * Math.PI * 1760 * t) * Math.exp(-t * 160) * 0.5;
  }
  wav("tick.wav", x);
}

// --- music: 120 BPM, 15 s, A minor. Kick, offbeat hats, bass, soft pad.
{
  const BPM = 120, beat = 60 / BPM, dur = 15.4;
  const L = arr(dur), R = arr(dur);
  const add = (buf, i, v) => { if (i >= 0 && i < buf.length) buf[i] += v; };
  const beats = Math.floor(15 / beat);
  // A2, F2, C3, G2 roots, two beats per... one bar (4 beats) per chord
  const roots = [110, 87.31, 130.81, 98];
  for (let b = 0; b < beats; b++) {
    const start = Math.round(b * beat * SR);
    const drop = b >= 23 && b < 24; // breath before the reveal
    // kick
    if (!drop) {
      let ph = 0;
      for (let i = 0; i < 0.35 * SR; i++) {
        const t = i / SR;
        ph += (2 * Math.PI * (48 + 120 * Math.exp(-t * 30))) / SR;
        const v = Math.sin(ph) * Math.exp(-t * 9) * 0.55;
        add(L, start + i, v); add(R, start + i, v);
      }
    }
    // hat on the offbeat
    const hs = start + Math.round((beat / 2) * SR);
    for (let i = 0; i < 0.05 * SR; i++) {
      const t = i / SR;
      const v = rand() * Math.exp(-t * 90) * (b < 4 ? 0.05 : 0.09);
      add(L, hs + i, v * 0.8); add(R, hs + i, v);
    }
    // bass pluck, 8th notes
    if (b >= 4 && !drop) {
      const f = roots[Math.floor(b / 4) % 4] / 2;
      for (const off of [0, 0.5]) {
        const s = start + Math.round(off * beat * SR);
        for (let i = 0; i < beat * 0.48 * SR; i++) {
          const t = i / SR;
          const saw = 2 * ((f * t) % 1) - 1;
          const v = (Math.sin(2 * Math.PI * f * t) * 0.7 + saw * 0.18) * Math.exp(-t * 5) * 0.32;
          add(L, s + i, v); add(R, s + i, v);
        }
      }
    }
  }
  // pad: detuned triads, one chord per bar
  for (let bar = 0; bar < Math.ceil(beats / 4); bar++) {
    const root = roots[bar % 4] * 2;
    const third = bar % 4 === 0 ? 1.189 : 1.26; // minor on Am, major otherwise
    const s = Math.round(bar * 4 * beat * SR);
    const len = Math.round(4 * beat * SR);
    for (const ratio of [1, third, 1.498]) {
      for (const det of [-0.6, 0.6]) {
        const f = root * ratio + det;
        for (let i = 0; i < len; i++) {
          const t = i / len;
          const env = Math.min(1, t * 6) * Math.min(1, (1 - t) * 8);
          const v = Math.sin((2 * Math.PI * f * i) / SR) * env * 0.022;
          add(det < 0 ? L : R, s + i, v);
        }
      }
    }
  }
  // fade out last half second
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    const g = t > dur - 0.9 ? Math.max(0, (dur - t) / 0.9) : 1;
    L[i] *= g; R[i] *= g;
  }
  wav("music.wav", lowpass(L, 9000), lowpass(R, 9000));
}

console.log("sfx written to public/sfx/");
