# Coucou — 15 s reel

A 15-second vertical (1080×1920, 60 fps) promo reel about Coucou, built with [Remotion](https://remotion.dev).
Everything is drawn in code: Mochi, the notch island, the phone. The sounds are synthesized by `scripts/sfx.mjs`.

Style: the @ysk_ai1 blog look (warm graphite background, orange accents, all-caps Google Sans headlines) with Mochi's cream body from `design/captures/`.

The timeline is written in ticks of 1/30 s (`src/theme.ts`, 15 ticks per beat at 120 BPM) and rendered at 60 fps: `useFrame()` converts the real frame to ticks, so every spring is sampled twice per tick. Fast moves (the phone, the dragged file, Mochi's final pop) get motion blur via `@remotion/motion-blur`.

| Time | Beat |
|------|------|
| 0–2 s | Hook: the notch opens, Mochi pops out — "Claude Code прямо в чёлке" |
| 2–5 s | Every agent at a glance: Claude Code, Codex, Gemini CLI live |
| 5–8.5 s | Approve in one click: permission card, cursor clicks "Разрешить", Mochi celebrates |
| 8.5–11.5 s | Three quick features: chat with Claude, drop a file, Mochi on the phone |
| 11.5–15 s | Payoff: COUCOU wordmark, platforms, @ysk_ai1 CTA |

The rendered video is `coucou-reel.mp4`.

## Render

```
npm install
npm run sfx      # regenerate public/sfx/*.wav
npm run studio   # preview
npm run render   # add --browser-executable=<chromium> if Remotion can't download one
```

The Coucou name, Mochi and the original sounds stay © Louis Raillé (see `LICENSE-ASSETS.md`): this reel is a review of the app, not a derivative app.
