/* ============================================================
   EXPLORE SONDHEIM — js/sunday.js
   Interactions for the "Sunday in the Park with George" flagship.
   Depends (globals): window.Sondheim.audio, window.Sondheim.data.sunday,
   window.Tone (optional — page degrades to visuals if absent).
   ============================================================ */
(function () {
  "use strict";
  const D = (window.Sondheim && window.Sondheim.data && window.Sondheim.data.sunday) || {};
  const A = (window.Sondheim && window.Sondheim.audio) || null;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    injectCopy();
    setupReveal();
    setupTopbar();
    setupSound();
    buildHeroField();
    buildPointillismLab();
    buildThirds();
    buildLayers();
    buildLyric();
    buildChorale();
    buildSongList();
  }

  /* ---------------------------------------------------------
     Copy injection from data
  --------------------------------------------------------- */
  function injectCopy() {
    if (D.lenses) {
      setText("#lens-music", D.lenses.music);
      setText("#lens-lyric", D.lenses.lyric);
    }
    if (D.colorThirds) setText("#thirds-idea", D.colorThirds.idea);
    if (D.quotes && D.quotes[1]) {
      setText("#pq-text", D.quotes[1].text);
      setText("#pq-src", "— " + D.quotes[1].src);
    }
  }
  function setText(sel, txt) { const el = $(sel); if (el) el.textContent = txt; }

  /* ---------------------------------------------------------
     Scroll reveal + sticky topbar
  --------------------------------------------------------- */
  function setupReveal() {
    const els = $$(".reveal:not(.in)");
    const showAll = /[?&]all(?:[=&]|$)/.test(location.search);   // debug: reveal everything at once
    if (!("IntersectionObserver" in window) || reduced || showAll) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  }
  function setupTopbar() {
    const bar = $("#topbar");
    const onScroll = () => bar.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Sound toggle (shared)
  --------------------------------------------------------- */
  let soundOn = false;
  function setupSound() {
    const btn = $("#sound-toggle");
    if (!btn) return;
    if (!A || !A.available) { $(".st-label", btn).textContent = "No audio"; btn.disabled = true; return; }
    btn.addEventListener("click", async () => {
      if (!A.started) await A.start();
      if (!soundOn) { A.setMuted(false); soundOn = true; }
      else { const m = A.toggleMute(); soundOn = !m; }
      reflectSound();
    });
  }
  async function ensureSound() {
    if (!A || !A.available) return false;
    if (!A.started) await A.start();
    A.setMuted(false);
    soundOn = true;
    reflectSound();
    return A.started;
  }
  function reflectSound() {
    const btn = $("#sound-toggle"); if (!btn) return;
    btn.classList.toggle("playing", soundOn);
    btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
    $(".st-label", btn).textContent = soundOn ? "Sound on" : "Sound off";
  }

  /* =========================================================
     HERO — procedural La Grande Jatte assembled from points
  ========================================================= */
  function buildHeroField() {
    const canvas = $("#dotfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const overlay = $("#easel-overlay");
    const SW = 560, SH = 374;            // offscreen "painting" resolution
    const STEP = 5;                       // sample grid
    let dpr = 1, cw = 0, ch = 0, dotPx = 2;
    let dots = [];                        // {ox,oy,r,g,b,col, x,y, tx,ty, sp, sz}
    let mode = "drift";                   // drift | assembling | settled
    let raf = null;

    // --- paint a stylized La Grande Jatte to an offscreen canvas ---
    const off = document.createElement("canvas");
    off.width = SW; off.height = SH;
    paintScene(off.getContext("2d"), SW, SH);
    const img = off.getContext("2d").getImageData(0, 0, SW, SH).data;

    // sample to dots
    for (let y = 0; y < SH; y += STEP) {
      for (let x = 0; x < SW; x += STEP) {
        if (Math.random() < 0.04) continue;            // thin slightly for organic texture
        const i = (y * SW + x) * 4;
        const r = img[i], g = img[i + 1], b = img[i + 2];
        dots.push({
          ox: x + (Math.random() - 0.5) * STEP,
          oy: y + (Math.random() - 0.5) * STEP,
          col: "rgb(" + r + "," + g + "," + b + ")",
          x: 0, y: 0, tx: 0, ty: 0,
          sp: 0.02 + Math.random() * 0.05,
          szf: 0.7 + Math.random() * 0.55,   // size factor relative to grid spacing
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = canvas.clientWidth; ch = canvas.clientHeight;
      canvas.width = cw * dpr; canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // fit painting to fill the framed easel
      const scale = Math.min(cw / SW, ch / SH);
      const offX = (cw - SW * scale) / 2;
      const offY = (ch - SH * scale) / 2;
      dotPx = Math.max(1.6, STEP * scale * 0.98);
      dots.forEach((d) => { d.tx = offX + d.ox * scale; d.ty = offY + d.oy * scale; });
    }

    function scatter() {
      dots.forEach((d) => { d.x = Math.random() * cw; d.y = Math.random() * ch; });
      mode = "drift";
      loop();
    }
    function assemble() {
      mode = "assembling";
      if (overlay) overlay.classList.add("gone");
      loop();
    }
    function snap() {
      for (let k = 0; k < dots.length; k++) { dots[k].x = dots[k].tx; dots[k].y = dots[k].ty; }
      mode = "settled";
      if (overlay) overlay.classList.add("gone");
      const cr = $("#canvas-credit"); if (cr) cr.classList.add("show");
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, cw, ch);
      let moving = 0;
      for (let k = 0; k < dots.length; k++) {
        const d = dots[k];
        if (mode === "drift") {
          // slow ambient drift
          d.x += Math.sin((d.oy + performance.now() * 0.0004)) * 0.15;
          d.y += Math.cos((d.ox + performance.now() * 0.0004)) * 0.15;
        } else {
          const dx = d.tx - d.x, dy = d.ty - d.y;
          d.x += dx * d.sp; d.y += dy * d.sp;
          if (Math.abs(dx) + Math.abs(dy) > 0.6) moving++;
        }
        ctx.globalAlpha = mode === "drift" ? 0.55 : 0.95;
        ctx.fillStyle = d.col;
        const s = d.szf * dotPx;
        ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      if (mode === "assembling" && moving < dots.length * 0.01) {
        mode = "settled";
        $("#canvas-credit") && $("#canvas-credit").classList.add("show");
      }
    }

    function loop() {
      if (raf) cancelAnimationFrame(raf);
      // animate while drifting or assembling; stop the loop once settled
      const run = () => {
        draw();
        if (mode === "settled") { raf = null; return; }
        raf = requestAnimationFrame(run);
      };
      run();
    }

    // init
    resize();
    scatter();
    let rz; window.addEventListener("resize", () => {
      clearTimeout(rz);
      rz = setTimeout(() => {
        resize();
        if (mode !== "drift") { mode = "assembling"; }   // re-settle to new targets
        loop();
      }, 150);
    });

    // controls
    const assembleBtn = $("#assemble-btn");
    const scatterBtn = $("#scatter-btn");
    const hint = $("#hero-hint");
    assembleBtn && assembleBtn.addEventListener("click", async () => {
      await ensureSound();
      assemble();
      heroBuildAudio();
      assembleBtn.hidden = true;
      if (scatterBtn) scatterBtn.hidden = false;
      if (hint) hint.textContent = "scroll to read the score";
    });
    scatterBtn && scatterBtn.addEventListener("click", () => { scatter(); setTimeout(assemble, 350); heroBuildAudio(); });

    // deep-link: open ...sunday.html#auto to land on the assembled canvas (no audio)
    if (/auto|assembled|snap/i.test(location.hash)) {
      setTimeout(() => {
        snap();
        if (assembleBtn) assembleBtn.hidden = true;
        if (scatterBtn) scatterBtn.hidden = false;
        if (hint) hint.textContent = "scroll to read the score";
      }, 350);
    }
  }

  // soundtrack for the assembly: a flurry of dots resolving to a warm chord
  function heroBuildAudio() {
    if (!A || !A.started) return;
    const notes = (D.motifs && D.motifs.pointillist && D.motifs.pointillist.notes) || ["Bb4", "Eb5", "D5", "Bb4"];
    const t0 = A.now() + 0.05;
    let t = 0;
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < notes.length; i++) {
        A.dot(notes[i], t0 + t, 0.4 + pass * 0.18);
        t += 0.085 - pass * 0.012;
      }
    }
    // resolve in the pointillist figure's key — B♭ minor
    A.chord(["Bb2", "F3", "Db4", "F4", "Bb4"], "2n", t0 + t + 0.1, 0.5);
    A.bassNote("Bb2", "2n", t0 + t + 0.1, 0.6);
  }

  /* ----- the stylized painting ----- */
  function paintScene(g, W, H) {
    // sky
    g.fillStyle = "#c6cdac"; g.fillRect(0, 0, W, H * 0.36);
    // water (upper left)
    g.fillStyle = "#6f93bf"; g.fillRect(0, H * 0.10, W * 0.60, H * 0.22);
    // far bank
    g.fillStyle = "#9aac72"; g.fillRect(0, H * 0.30, W, H * 0.07);
    // sunlit lawn
    g.fillStyle = "#bcc66c"; g.fillRect(0, H * 0.34, W, H * 0.66);
    // cool foreground shadow (the painting's big diagonal shade)
    g.fillStyle = "#5c6d63";
    tri(g, 0, H * 0.50, W * 0.74, H, 0, H);
    g.fillStyle = "rgba(124,118,162,0.40)";
    tri(g, 0, H * 0.64, W * 0.52, H, 0, H);

    // trees
    tree(g, W * 0.87, H * 0.04, H * 0.70, W * 0.05, "#52702f", "#7d9a45");
    tree(g, W * 0.31, H * 0.12, H * 0.30, W * 0.022, "#4c6a33", "#76914a");
    tree(g, W * 0.05, H * 0.09, H * 0.34, W * 0.02, "#4c6a33", "#76914a");

    // sailboats
    g.fillStyle = "#efe8d2";
    tri(g, W * 0.17, H * 0.13, W * 0.205, H * 0.13, W * 0.188, H * 0.20);
    tri(g, W * 0.30, H * 0.17, W * 0.325, H * 0.17, W * 0.312, H * 0.23);

    // figures (silhouettes) — right-hand couple
    parasol(g, W * 0.905, H * 0.50, W * 0.085, "#e8dcc0");
    figure(g, W * 0.90, H * 0.88, H * 0.34, W * 0.085, "#2b2838", true);
    figure(g, W * 0.815, H * 0.88, H * 0.31, W * 0.062, "#22202e", false);
    hat(g, W * 0.815, H * 0.595, W * 0.05, "#1c1a26");

    // reclining man, lower left
    g.fillStyle = "#2e2a3a";
    rrect(g, W * 0.03, H * 0.90, W * 0.22, H * 0.05, H * 0.02);
    circle(g, W * 0.255, H * 0.905, H * 0.028, "#2e2a3a");

    // central woman + child in white
    figure(g, W * 0.47, H * 0.90, H * 0.24, W * 0.055, "#33304a", false);
    parasol(g, W * 0.47, H * 0.66, W * 0.07, "#cdd2da");
    figure(g, W * 0.415, H * 0.92, H * 0.12, W * 0.03, "#efe9d6", false);

    // mid seated woman with orange parasol
    parasol(g, W * 0.57, H * 0.60, W * 0.085, "#d98a3a");
    figure(g, W * 0.585, H * 0.86, H * 0.17, W * 0.05, "#2c2940", false);

    // scattered smaller figures
    figure(g, W * 0.67, H * 0.86, H * 0.16, W * 0.04, "#322d44", false);
    figure(g, W * 0.24, H * 0.81, H * 0.13, W * 0.035, "#2c2940", false);
    figure(g, W * 0.355, H * 0.78, H * 0.10, W * 0.03, "#34304a", false);

    // Seurat "vibration": scattered complementary dabs over the lawn
    const dabs = ["#d98a3a", "#c25b56", "#5b7fb4", "#efe6c2", "#8a6fb0"];
    for (let i = 0; i < 380; i++) {
      const x = Math.random() * W;
      const y = H * 0.34 + Math.random() * H * 0.64;
      g.fillStyle = dabs[(Math.random() * dabs.length) | 0];
      g.globalAlpha = 0.18 + Math.random() * 0.18;
      g.fillRect(x, y, 2, 2);
    }
    g.globalAlpha = 1;
  }

  // scene helpers
  function tri(g, x1, y1, x2, y2, x3, y3) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3); g.closePath(); g.fill(); }
  function circle(g, x, y, r, c) { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
  function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); g.fill(); }
  function tree(g, cx, topY, h, trunkW, dark, light) {
    g.fillStyle = "#6b5436"; g.fillRect(cx - trunkW / 2, topY + h * 0.25, trunkW, h * 0.78);
    const cy = topY + h * 0.22, rx = h * 0.26, ry = h * 0.30;
    g.fillStyle = dark; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = light; g.beginPath(); g.ellipse(cx - rx * 0.3, cy - ry * 0.3, rx * 0.6, ry * 0.55, 0, 0, Math.PI * 2); g.fill();
  }
  function figure(g, baseX, baseY, h, w, color, bustle) {
    const headR = h * 0.13;
    g.fillStyle = color;
    // body: tapering skirt/coat
    g.beginPath();
    g.moveTo(baseX - w * 0.35, baseY - h * 0.74);
    g.lineTo(baseX + w * 0.35, baseY - h * 0.74);
    g.lineTo(baseX + w * (bustle ? 0.95 : 0.62), baseY);
    g.lineTo(baseX - w * 0.62, baseY);
    g.closePath(); g.fill();
    if (bustle) { g.beginPath(); g.ellipse(baseX + w * 0.7, baseY - h * 0.25, w * 0.4, h * 0.16, 0, 0, Math.PI * 2); g.fill(); }
    // neck + head
    g.fillRect(baseX - w * 0.12, baseY - h * 0.86, w * 0.24, h * 0.12);
    circle(g, baseX, baseY - h * 0.92, headR, color);
  }
  function parasol(g, cx, cy, r, color) {
    g.fillStyle = "rgba(40,38,52,0.8)"; g.fillRect(cx - 0.8, cy, 1.6, r * 1.5); // stick
    g.fillStyle = color; g.beginPath(); g.ellipse(cx, cy, r, r * 0.62, 0, Math.PI, 0); g.fill();
  }
  function hat(g, cx, topY, w, color) {
    g.fillStyle = color;
    g.fillRect(cx - w * 0.55, topY + w * 0.42, w * 1.1, w * 0.18); // brim
    g.fillRect(cx - w * 0.34, topY, w * 0.68, w * 0.5);            // crown
  }

  /* =========================================================
     LAB 02 — Pointillism in sound (dots <-> line)
  ========================================================= */
  function buildPointillismLab() {
    const canvas = $("#dotlab-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const notes = (D.motifs && D.motifs.pointillist && D.motifs.pointillist.notes) || [];
    const articEl = $("#artic"), tempoEl = $("#tempo");
    const articVal = $("#artic-val"), tempoVal = $("#tempo-val"), readout = $("#dotlab-readout");
    let dpr = 1, w = 0, h = 0, playStart = -1, dur = 0, raf = null, pending = [];

    // pitch range for vertical mapping
    const semis = notes.map(noteToMidi);
    const lo = Math.min.apply(null, semis), hi = Math.max.apply(null, semis);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStatic();
    }
    function xFor(i) { return lerp(w * 0.07, w * 0.93, notes.length < 2 ? 0.5 : i / (notes.length - 1)); }
    function yFor(i) { const t = (semis[i] - lo) / Math.max(1, hi - lo); return lerp(h * 0.78, h * 0.22, t); }

    function drawStatic(active) {
      const artic = +articEl.value / 100; // 0 staccato -> 1 legato
      ctx.clearRect(0, 0, w, h);
      // connecting line grows with legato
      if (artic > 0.02) {
        ctx.strokeStyle = "rgba(230,199,90," + (0.15 + artic * 0.7) + ")";
        ctx.lineWidth = 1 + artic * 3;
        ctx.lineJoin = "round";
        ctx.beginPath();
        for (let i = 0; i < notes.length; i++) { const x = xFor(i), y = yFor(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      }
      for (let i = 0; i < notes.length; i++) {
        const x = xFor(i), y = yFor(i);
        const base = 3.2, grow = lerp(base, 7.5, artic);
        const on = active === i;
        ctx.beginPath();
        ctx.fillStyle = on ? "#fff" : (artic < 0.5 ? "#e6c75a" : "#6fa86a");
        ctx.globalAlpha = on ? 1 : 0.85;
        ctx.arc(x, y, on ? grow + 4 : grow, 0, Math.PI * 2);
        ctx.fill();
        if (on) { ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(x, y, grow + 12, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    }

    function updateLabels() {
      const artic = +articEl.value;
      articVal.textContent = artic < 25 ? "staccato" : artic < 60 ? "détaché" : artic < 88 ? "legato" : "sostenuto";
      tempoVal.textContent = tempoEl.value + " bpm";
      readout.textContent = artic < 30 ? "staccato · separate dabs" : artic < 70 ? "blending · dabs into strokes" : "legato · a single line";
      drawStatic();
    }

    // cancel any in-progress playback (timers, playhead, sounding notes)
    function stopPlay() {
      pending.forEach(clearTimeout); pending = [];
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (A && A.hush) A.hush();
    }
    async function play() {
      if (!notes.length) return;
      await ensureSound();
      stopPlay();                         // restart cleanly instead of layering
      const bpm = +tempoEl.value;
      const beat = 60 / bpm / 2;          // sixteenth feel
      const artic = +articEl.value / 100;
      dur = beat * notes.length;
      // schedule each note on a cancelable timer (staccato 'dot'; legato 'bell'+'pad')
      for (let i = 0; i < notes.length; i++) {
        const len = lerp(0.06, beat * 1.25, artic);
        const vel = 0.55 + (i % 2 ? 0.1 : 0.2);
        const note = notes[i];
        const id = setTimeout(() => {
          if (!A || !A.started) return;
          if (artic < 0.55) A.play("dot", note, len, undefined, vel);
          else { A.play("bell", note, len, undefined, vel * 0.8); A.play("pad", note, len, undefined, 0.18); }
        }, i * beat * 1000);
        pending.push(id);
      }
      // visual playhead
      playStart = performance.now();
      const run = () => {
        const el = (performance.now() - playStart) / 1000;
        const idx = Math.floor(el / beat);
        if (idx >= notes.length) { drawStatic(); raf = null; return; }
        drawStatic(idx);
        raf = requestAnimationFrame(run);
      };
      run();
    }

    resize();
    window.addEventListener("resize", () => resize());
    articEl.addEventListener("input", updateLabels);
    tempoEl.addEventListener("input", updateLabels);
    $("#dotlab-play").addEventListener("click", play);
    updateLabels();
  }

  /* =========================================================
     LAB 03 — Color = Harmony (major vs minor third)
  ========================================================= */
  function buildThirds() {
    const ct = D.colorThirds; if (!ct) return;
    const stack = $("#swatch-stack");
    const verdict = $("#thirds-verdict");
    const bMaj = $("#key-major"), bMin = $("#key-minor"), bBoth = $("#key-both");
    // note glyphs are set in the HTML (F♯ / F♮) to keep naturals legible
    $(".swatch.major").style.background = ct.major.swatch;
    $(".swatch.minor").style.background = ct.minor.swatch;
    if (ct.quote) {
      const q = $("#thirds-quote");
      if (q) { q.textContent = "“" + ct.quote + "”"; const c = document.createElement("cite"); c.textContent = "— " + ct.quoteSrc; q.appendChild(c); }
    }
    $(".swatch.minor").style.background = ct.minor.swatch;

    async function hit(mode) {
      await ensureSound();
      [bMaj, bMin, bBoth].forEach((b) => b.setAttribute("aria-pressed", "false"));
      stack.setAttribute("data-mode", mode);
      const root = [ct.bass, ct.root, ct.fifth];
      if (mode === "major") {
        bMaj.setAttribute("aria-pressed", "true");
        verdict.textContent = "Bright. Resolved. The chord agrees with itself.";
        if (A && A.started) { A.bassNote(ct.bass, "1n", undefined, 0.5); A.chord([ct.root, ct.major.note, ct.fifth], "1n", undefined, 0.5); }
      } else if (mode === "minor") {
        bMin.setAttribute("aria-pressed", "true");
        verdict.textContent = "Shadowed. The same picture, one degree cooler.";
        if (A && A.started) { A.bassNote(ct.bass, "1n", undefined, 0.5); A.chord([ct.root, ct.minor.note, ct.fifth], "1n", undefined, 0.5); }
      } else {
        bBoth.setAttribute("aria-pressed", "true");
        verdict.textContent = "Unsettled, but poignant — the ear blends the two, like yellow beside yellow-orange.";
        if (A && A.started) { A.bassNote(ct.bass, "1n", undefined, 0.5); A.chord([ct.root, ct.minor.note, ct.major.note, ct.fifth], "1n", undefined, 0.55); }
      }
    }
    bMaj.addEventListener("click", () => hit("major"));
    bMin.addEventListener("click", () => hit("minor"));
    bBoth.addEventListener("click", () => hit("both"));
  }

  /* =========================================================
     LAB 04 — Putting It Together (layer sequencer)
  ========================================================= */
  function buildLayers() {
    const wrap = $("#layerlab"); if (!wrap || !D.layers) return;
    const state = {};
    D.layers.forEach((L, idx) => {
      state[L.id] = idx === 1; // start with the dots on
      const row = document.createElement("div");
      row.className = "layer-row" + (state[L.id] ? " on" : "");
      row.setAttribute("role", "switch");
      row.setAttribute("aria-checked", state[L.id] ? "true" : "false");
      row.tabIndex = 0;
      row.innerHTML =
        '<span class="dotmark"></span>' +
        '<span class="meta"><b>' + L.label + "</b><span>" + L.desc + "</span></span>" +
        '<span class="layer-viz">' + "<i></i>".repeat(8) + "</span>";
      const toggle = () => {
        state[L.id] = !state[L.id];
        row.classList.toggle("on", state[L.id]);
        row.setAttribute("aria-checked", state[L.id] ? "true" : "false");
        count();
      };
      row.addEventListener("click", toggle);
      row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
      wrap.appendChild(row);
    });
    function count() {
      const n = Object.values(state).filter(Boolean).length;
      $("#layers-count").textContent = n + (n === 1 ? " layer" : " layers");
    }
    count();

    const playBtn = $("#layers-play");
    let playing = false, step = 0, repeatId = null;
    playBtn.addEventListener("click", async () => {
      const ok = await ensureSound();
      if (!ok || !window.Tone) { $("#layers-count").textContent = "audio unavailable"; return; }
      const T = window.Tone;
      if (!playing) {
        playing = true; step = 0;
        playBtn.classList.add("playing"); playBtn.textContent = "■ Stop";
        T.Transport.bpm.value = 100;
        repeatId = T.Transport.scheduleRepeat((time) => {
          const s = step % 8;
          D.layers.forEach((L) => {
            if (!state[L.id]) return;
            const cell = L.pattern[s % L.pattern.length];
            if (cell == null) return;
            const vel = L.voice === "dot" ? 0.5 : 0.45;
            A.play(L.voice, cell, L.voice === "bass" ? "8n" : "8n", time, vel);
          });
          // pulse active rows visually (next frame)
          T.Draw.schedule(() => pulseStep(s), time);
          step++;
        }, "8n");
        T.Transport.start();
      } else {
        stop();
      }
    });
    function stop() {
      playing = false;
      if (window.Tone) { window.Tone.Transport.clear(repeatId); window.Tone.Transport.stop(); }
      playBtn.classList.remove("playing"); playBtn.textContent = "▶ Play the assembly";
    }
    function pulseStep(s) {
      $$(".layer-row").forEach((row, i) => {
        const bars = $$(".layer-viz i", row);
        bars.forEach((b, bi) => (b.style.opacity = bi === s ? "1" : "0.4"));
      });
    }
  }

  /* =========================================================
     LAB 05 — The lyric as pointillism
  ========================================================= */
  function buildLyric() {
    const cl = D.colorLyric; if (!cl) return;
    const wordsEl = $("#lyric-words");
    const cap = $("#lyric-cap");
    const canvas = $("#lyric-canvas");
    const ctx = canvas.getContext("2d");
    let dpr = 1, w = 0, h = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0a0f0c"; ctx.fillRect(0, 0, w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    // build the fragment with color words as interactive spans
    const map = {}; cl.words.forEach((w) => (map[w.word.toLowerCase()] = w.hex));
    const frag = cl.fragment;
    const html = frag.replace(/([A-Za-z]+)/g, (m) => {
      const hex = map[m.toLowerCase()];
      if (!hex) return m;
      return '<span class="cw" data-hex="' + hex + '" tabindex="0" role="button">' + m + "</span>";
    });
    wordsEl.innerHTML = html;
    cap.innerHTML = "<em>" + cl.attribution + "</em> — " + cl.note;

    const noteFor = { blue: "D4", purple: "F#4", yellow: "A4", red: "B4", green: "E4" };
    function spray(hex, word) {
      ctx.fillStyle = hex;
      const cx = Math.random() * w, cy = Math.random() * h;
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * Math.PI * 2, r = Math.random() * Math.min(w, h) * 0.32;
        ctx.globalAlpha = 0.10 + Math.random() * 0.35;
        ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.4, 2.4);
      }
      ctx.globalAlpha = 1;
      if (A && A.started && word && noteFor[word]) A.dot(noteFor[word], undefined, 0.5);
    }
    $$(".cw", wordsEl).forEach((span) => {
      const hex = span.dataset.hex;
      const word = span.textContent.toLowerCase();
      const act = async () => { await ensureSound(); span.style.background = hex; span.classList.add("lit"); spray(hex, word); };
      span.addEventListener("mouseenter", act);
      span.addEventListener("click", act);
      span.addEventListener("focus", act);
      span.addEventListener("mouseleave", () => { span.style.background = ""; span.classList.remove("lit"); });
    });
  }

  /* =========================================================
     LAB 06 — The "Sunday" chorale
  ========================================================= */
  function buildChorale() {
    const seq = D.chorale; if (!seq) return;
    const word = $("#chorale-word"), sub = $("#chorale-sub"), btn = $("#chorale-play");
    btn.addEventListener("click", async () => {
      const ok = await ensureSound();
      if (!ok) { sub.textContent = "(audio unavailable — read on)"; return; }
      btn.disabled = true; btn.textContent = "…gathering";
      const t0 = A.now() + 0.1;
      const beatSec = 0.79;   // Maestoso e non rubato (♩=76)
      let t = 0;
      seq.forEach((c) => {
        const d = c.beats * beatSec;            // duration in seconds
        A.choir(c.voices, d, t0 + t, 0.5);
        A.bassNote(c.bass, d, t0 + t, 0.5);
        if (c.mel) A.melody(c.mel, Math.min(d, 1.3), t0 + t, 0.5);
        setTimeout(() => {
          word.classList.add("glow");
          if (c.label) sub.textContent = c.label;
        }, t * 1000);
        t += d;
      });
      setTimeout(() => { btn.disabled = false; btn.textContent = "▶ Again"; sub.textContent = "“Sunday.” The blank page made full."; }, t * 1000 + 400);
    });
  }

  /* =========================================================
     SONG LIST
  ========================================================= */
  function buildSongList() {
    const wrap = $("#songlist"); if (!wrap || !D.songs) return;
    D.songs.forEach((s) => {
      const el = document.createElement("div");
      el.className = "song";
      el.innerHTML = '<span class="act">Act ' + s.act + "</span><span class=\"t\">" + s.title + '</span><span class="n">' + s.note + "</span>";
      wrap.appendChild(el);
    });
  }

  /* ---------------------------------------------------------
     small music helpers
  --------------------------------------------------------- */
  function noteToMidi(n) {
    const m = /^([A-G])(#|b)?(-?\d)$/.exec(n);
    if (!m) return 60;
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
    const acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
    return base + acc + (parseInt(m[3], 10) + 1) * 12;
  }
  function pretty(n) { return n.replace("#", "♯").replace("b", "♭").replace(/\d/, ""); }
})();
