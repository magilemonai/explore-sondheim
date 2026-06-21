# CLAUDE.md — Explore Sondheim

An interactive, cinematic website exploring Stephen Sondheim's musicals through two lenses —
**compositional** (how the music works) and **lyrical** (how the words work). Hands-on: hear the
motifs, manipulate them, trace one idea across a score. Built by Cody Wymore (composer, NYU MTW MFA),
so **accuracy and craft matter** and nothing should look or read as generic.

- **Live:** https://magilemonai.github.io/explore-sondheim/  ·  **Repo:** `magilemonai/explore-sondheim`
- Plain static site — **no build step, no framework.**

---

## Non-negotiable rules

1. **Never commit the score PDF or any `*.pdf`.** The full vocal scores are copyrighted. `.gitignore`
   excludes `*.pdf`; keep it that way. Scores live locally only, for transcription.
2. **Don't reproduce Sondheim's lyrics or music wholesale.** On the site, use only short analytical
   fragments, original demonstrations (clearly labeled), and **synthesized audio framed as an
   *evocation*** — never a recording or a full transcription of the original orchestrations. Example:
   the "A Little Priest" room teaches the pun device with *newly written* couplets, not the real lyrics.
3. **Musical material must come from the score, not memory.** Web/LLM transcriptions are unreliable.
   Transcribe from the score Cody provides; **note names are exact, octaves are a placement Cody
   verifies by ear.** Flag anything uncertain. Verified facts + REFUTED claims are in `SOURCES.md`
   (don't restate the refuted ones on the site).
4. **Every page is its own bespoke world — never the default shell.** The tell to avoid: dark bg +
   single gold accent + rounded cards in a grid + particle field + fade-up-on-scroll + chips. Cody
   rejected that twice. Each room gets its own typography, palette, layout system, texture, and a
   show-specific conceptual device. Vary light/dark so rooms don't all read as "dark site." Screenshot
   and redo if it looks templated.

---

## Architecture

Static files, opened directly or served by GitHub Pages. **Must run from `file://`** (double-click),
so:

- **Classic `<script>` tags only — no ES modules, no `fetch()`.** Data ships as JS that attaches to a
  global. Tone.js (14.8.49) and Google Fonts load from CDN (needs internet for audio/fonts).
- Shared globals: `window.Sondheim.audio` (the Tone.js wrapper) and `window.Sondheim.data.<show>`.

```
index.html              cinematic lobby (the entrance)
shows/<show>.html        one room per show
css/base.css             shared shell + design tokens (:root defaults)
css/lobby.css            lobby world (cinematic, photo-led)
css/<show>.css           that show's world (scoped via body[data-show="..."])
js/audio-engine.js       Tone.js wrapper → window.Sondheim.audio
js/room.js               shared room helpers → window.Sondheim.room
                         (reveal, topbar, sound, a cancelable player, note utils)
js/<show>.js             that show's interactions
data/<show>.js           content + transcribed motif/note data → window.Sondheim.data.<show>
assets/                  public-domain images only (credit in footer/colophon)
SOURCES.md               research record (verified + refuted), NOT linked from the site
.github/workflows/deploy.yml   GitHub Actions → Pages
```

### Theming
Design tokens (`--bg --ink --ink-soft --line --accent --serif --sans …`) are defined in `base.css`
`:root`, then **overridden per world** under `body[data-show="<show>"]`. Sunday goes further: a
`.gallery` wrapper **redefines the tokens to a light palette** so all shared components flip to light
automatically, while the interactive canvases stay as framed dark "screens." Prefer redefining tokens
over restyling each component.

### Audio engine (`js/audio-engine.js`)
- `await Sondheim.audio.start()` — must be called from a **user gesture** (browser autoplay rule).
- Voices: `dot` (staccato pluck), `pad` (warm), `bell` (music box), `choir` (organ-ish), `bass`.
- Helpers: `dot/chord/melody/choir/bassNote(note, dur, time, vel)`, generic `play(voice,…)`,
  `schedule(voice, events)`, `setMuted/toggleMute`, and **`hush()`** (silences everything).
- **Cancelable playback pattern:** schedule notes on `setTimeout` timers kept in a `pending[]` array;
  on replay, clear the timers and call `audio.hush()` so re-clicking restarts instead of layering.
  (Don't schedule far-future `triggerAttackRelease` calls — they can't be recalled.)

### Per-room identities (keep distinct)
- **Lobby** — cinematic, photo-led: full-bleed B&W Library-of-Congress portrait (split layout), film
  grain, letterbox + corner ticks, Fraunces display type, a film-index of rooms.
- **Sunday in the Park with George** — sunlit **gallery**: dark assembling-painting hero → "step into
  the light" → warm bone walls, wall-label headers, pointillist dotted rules, Seurat palette;
  interactive canvases hung as framed dark screens. (Cormorant + Inter.)
- **Sweeney Todd** — Victorian **penny-dreadful broadsheet**: steel & blood, IM Fell + Cinzel
  letterpress, newspaper rules, a razor-edge divider, ink grain, ash hero. Flagship = "Trace the
  *Dies Irae*" ledger; plus an inversion lab and the "A Little Priest" Bill-of-Fare pun engine.

---

## Run & verify

- **Locally:** open `index.html` in a browser (audio + fonts need internet). Deep-link
  `shows/sunday.html#snap` lands on the assembled painting; `?all` reveals all scroll sections (dev).
- **Screenshots (desktop):** headless Chrome `--headless=new --screenshot` (or `--print-to-pdf` +
  `pdftoppm` for full-page). Below-fold content needs `?all` since reveal-on-scroll hides it.
- **Mobile:** `--window-size` does **not** give a true mobile viewport on macOS (min window width
  clips it). Use **puppeteer-core driving system Chrome with device emulation** (see
  `/tmp/sondmob/m.js`: `setViewport({width:390,isMobile:true})`, `fullPage:true`) and scan for
  elements whose `right > clientWidth`. Watch `aspect-ratio` + `min-height` combos — they can force a
  child wider than the screen.
- **Reading the score:** poppler is installed; `pdftoppm -r 300 -f <pg> -l <pg> score.pdf out`, then
  crop with PIL and read the image. (PDF page = printed page + 2 for the Sunday score.)

## Deploy
Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to Pages
(Pages source = GitHub Actions). No manual step. Commit/push only when Cody asks.

## Status (roadmap)
All seven rooms exist, each its own bespoke world:
- **Sunday** & **Sweeney** — full, with motifs **transcribed from the real scores** Cody supplied.
- **Company, A Little Night Music, Into the Woods, Assassins, Merrily** — **v0.1**: bespoke hero +
  two-lens intro + one signature interactive each, built on the verified devices with **illustrative,
  original audio** (clearly labeled, not the scores). They share `js/room.js`.

To deepen a v0.1 room: get its score from Cody, transcribe the real motifs (octaves verified by ear),
and swap them in for the illustrative audio. Still to come: a cross-work **Connections** room
(motivic transformation, pastiche, "wanting vs. having"). Keep every room distinct — never the shell.
