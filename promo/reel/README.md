# Coucou — 15 s reel

A 15-second vertical (1080×1920, 30 fps) promo reel about Coucou, built with [Remotion](https://remotion.dev).
Everything is drawn in code: Mochi, the notch island, the phone. The sounds are synthesized by `scripts/sfx.mjs`.

Style: the @ysk_ai1 blog look (warm graphite background, orange glow, condensed all-caps headlines, avatar badge) with Mochi's cream body from `design/captures/`.

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
