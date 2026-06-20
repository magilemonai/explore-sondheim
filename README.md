# Explore Sondheim

An interactive, cinematic study of Stephen Sondheim's musicals through two lenses — **compositional** and **lyrical**. Hear the motifs, move them with your hands, and trace one idea through an entire score.

**Live site:** https://magilemonai.github.io/explore-sondheim/

## The gallery
- **Sunday in the Park with George** — the pointillist score *(open)*
- Sweeney Todd · Company · A Little Night Music · Into the Woods · Assassins · Merrily We Roll Along *(in progress)*

## Notes on honesty & rights
- All audio is **synthesized in your browser** (Tone.js) as an *evocation* of Sondheim's writing — not a recording, and not a transcription of the original orchestrations.
- Photographs are **public domain** (Library of Congress / Bernard Gotfryd; Wikimedia Commons).
- Short musical examples are **transcribed from the published score for study/analysis**.
- The full score is **not** included in this repository (copyright).

## Run locally
Open `index.html` in a browser — no build step. Audio and fonts load from a CDN, so stay online.

## Structure
- `index.html` — the cinematic lobby
- `shows/` — per-show rooms (each its own visual world)
- `css/` — `base.css` (shared shell), per-show worlds, `lobby.css`
- `js/` — `audio-engine.js` (shared Tone.js wrapper) + per-show interaction scripts
- `data/` — content + transcribed motif data per show

Built with care for the work of Stephen Sondheim (1930–2021).
