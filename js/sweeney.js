/* ============================================================
   EXPLORE SONDHEIM — js/sweeney.js
   Interactions for the Sweeney Todd room.
   Depends: window.Sondheim.audio, window.Sondheim.data.sweeney, window.Tone.
   ============================================================ */
(function () {
  "use strict";
  const D = (window.Sondheim && window.Sondheim.data && window.Sondheim.data.sweeney) || {};
  const A = (window.Sondheim && window.Sondheim.audio) || null;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    injectCopy();
    setupReveal();
    setupTopbar();
    setupSound();
    buildAsh();
    buildCell();
    buildTrace();
    buildInversion();
    buildPriest();
  }

  /* ---------------- copy ---------------- */
  function injectCopy() {
    if (D.lenses) { setText("#lens-music", D.lenses.music); setText("#lens-lyric", D.lenses.lyric); }
    if (D.littlePriest) { setText("#priest-idea", D.littlePriest.idea); setText("#priest-engine", D.littlePriest.engine); }
    if (D.diesIrae) {
      setText("#cell-name", D.diesIrae.name);
      setText("#cell-source", D.diesIrae.source);
      setText("#cell-desc", D.diesIrae.desc);
      $("#cell-notes").innerHTML = "The cell: <b>" + D.diesIrae.notes.map(pretty).join(" · ") + "</b>";
    }
  }
  function setText(s, t) { const el = $(s); if (el) el.textContent = t; }

  /* ---------------- reveal + topbar ---------------- */
  function setupReveal() {
    const els = $$(".ink:not(.in)");
    const showAll = /[?&]all(?:[=&]|$)/.test(location.search);
    if (!("IntersectionObserver" in window) || reduced || showAll) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
  }
  function setupTopbar() {
    const bar = $("#topbar");
    const on = () => bar.classList.toggle("scrolled", window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
  }

  /* ---------------- sound ---------------- */
  let soundOn = false;
  function setupSound() {
    const btn = $("#sound-toggle"); if (!btn) return;
    if (!A || !A.available) { $(".st-label", btn).textContent = "No audio"; btn.disabled = true; return; }
    btn.addEventListener("click", async () => {
      if (!A.started) await A.start();
      if (!soundOn) { A.setMuted(false); soundOn = true; } else { soundOn = !A.toggleMute(); }
      reflect();
    });
  }
  async function ensureSound() { if (!A || !A.available) return false; if (!A.started) await A.start(); A.setMuted(false); soundOn = true; reflect(); return A.started; }
  function reflect() {
    const btn = $("#sound-toggle"); if (!btn) return;
    btn.classList.toggle("playing", soundOn); btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
    $(".st-label", btn).textContent = soundOn ? "Sound on" : "Sound off";
  }

  /* ================= playback (cancelable) ================= */
  let pending = [], curCanvas = null, curNotes = null;
  function stopAll() {
    pending.forEach(clearTimeout); pending = [];
    if (A && A.hush) A.hush();
    if (curCanvas && curNotes) drawStaff(curCanvas, curNotes, -1);
  }
  // schedule a motif starting at offsetMs; returns ms consumed
  function scheduleMotif(notes, opts, offsetMs) {
    opts = opts || {}; offsetMs = offsetMs || 0;
    const bpm = opts.bpm || 92, beat = 60 / bpm, gap = opts.gap || 1;
    const voice = opts.voice || "bell";
    const dur = opts.dur || (voice === "choir" ? beat * 0.95 : beat * 0.7);
    notes.forEach((n, i) => {
      const id = setTimeout(() => {
        if (!A || !A.started) return;
        A.play(voice, n, dur, undefined, opts.vel || 0.6);
        if (opts.bass && i === 0) A.bassNote(opts.bass, beat * notes.length * gap, undefined, 0.4);
        if (opts.canvas) { curCanvas = opts.canvas; curNotes = notes; drawStaff(opts.canvas, notes, i); }
      }, offsetMs + i * beat * 1000 * gap);
      pending.push(id);
    });
    const total = notes.length * beat * 1000 * gap;
    const end = setTimeout(() => { if (opts.canvas) drawStaff(opts.canvas, notes, -1); }, offsetMs + total + 180);
    pending.push(end);
    return total;
  }
  async function playMotif(notes, opts) { await ensureSound(); stopAll(); scheduleMotif(notes, opts, 0); }

  /* ================= notation renderer ================= */
  function drawStaff(canvas, notes, activeIdx) {
    if (!canvas || !notes || !notes.length) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || 520;
    const cssH = canvas.clientHeight || 180;
    canvas.width = cssW * dpr; canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const midis = notes.map(noteToMidi);
    let lo = Math.min.apply(null, midis), hi = Math.max.apply(null, midis);
    if (hi - lo < 5) { lo -= 3; hi += 3; }                // pad small ranges
    const padX = Math.max(46, cssW * 0.09), padTop = 34, padBot = 46;
    const xFor = (i) => notes.length < 2 ? cssW / 2 : lerp(padX, cssW - padX, i / (notes.length - 1));
    const yFor = (m) => lerp(cssH - padBot, padTop, (m - lo) / Math.max(1, hi - lo));

    // faint steel gridlines
    ctx.strokeStyle = "rgba(130,139,149,0.16)"; ctx.lineWidth = 1;
    for (let k = 0; k < 5; k++) { const y = lerp(padTop, cssH - padBot, k / 4); ctx.beginPath(); ctx.moveTo(padX * 0.5, y); ctx.lineTo(cssW - padX * 0.5, y); ctx.stroke(); }

    // connecting line
    ctx.strokeStyle = "rgba(168,29,24,0.35)"; ctx.lineWidth = 1.5; ctx.beginPath();
    notes.forEach((n, i) => { const x = xFor(i), y = yFor(midis[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke();

    // noteheads + labels
    notes.forEach((n, i) => {
      const x = xFor(i), y = yFor(midis[i]);
      const on = i === activeIdx;
      if (on) { ctx.beginPath(); ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath();
      ctx.fillStyle = on ? "#fff" : "#a81d18";
      ctx.arc(x, y, on ? 8 : 6, 0, Math.PI * 2); ctx.fill();
      // little stem (engraving flavor)
      ctx.strokeStyle = on ? "rgba(255,255,255,0.7)" : "rgba(168,29,24,0.6)"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x + 6, y); ctx.lineTo(x + 6, y - 20); ctx.stroke();
      // label
      ctx.fillStyle = on ? "#e9e4d8" : "rgba(130,139,149,0.85)";
      ctx.font = "600 12px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(pretty(n), x, cssH - 18);
    });
  }
  // redraw all static staves on resize
  function redrawStatic() {
    if (D.diesIrae) drawStaff($("#cell-canvas"), D.diesIrae.notes, -1);
    if (traceState.notes) drawStaff($("#trace-canvas"), traceState.notes, -1);
    drawStaff($("#invert-canvas"), invertState.up ? cellNotes() : invertedCell(), -1);
  }
  window.addEventListener("resize", () => { clearTimeout(window.__swrz); window.__swrz = setTimeout(redrawStatic, 150); });

  /* ================= hero ash ================= */
  function buildAsh() {
    const canvas = $("#ash"); if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = 1, w = 0, h = 0, parts = [], raf = null, hot = 0;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = []; const n = Math.min(160, Math.floor(w * h / 12000));
      for (let i = 0; i < n; i++) parts.push(mk());
    }
    function mk() {
      const ember = Math.random() < 0.16;
      return { x: Math.random() * w, y: Math.random() * h, r: (ember ? 1.4 : 1) + Math.random() * 1.8,
        vy: ember ? -(0.15 + Math.random() * 0.4) : (0.12 + Math.random() * 0.35),
        vx: (Math.random() - 0.5) * 0.25, a: 0.15 + Math.random() * 0.4, ember: ember };
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy * (p.ember ? (1 + hot) : 1);
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
        if (p.y > h + 6) { p.y = -6; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a * (p.ember ? (0.5 + 0.5 * hot) : 1);
        ctx.fillStyle = p.ember ? "rgba(176,30,26,1)" : "rgba(150,156,164,1)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (hot > 0) hot = Math.max(0, hot - 0.004);
      raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size);
    if (!reduced) frame(); else { for (const p of parts) { ctx.globalAlpha = p.a; ctx.fillStyle = p.ember ? "#b01e1a" : "#969ca4"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill(); } }

    $("#begin-btn") && $("#begin-btn").addEventListener("click", async () => {
      await ensureSound();
      hot = 1;                                    // embers flare
      if (D.diesIrae) playMotif(D.diesIrae.notes, { voice: "choir", bpm: 56, bass: "E2", vel: 0.5, canvas: $("#cell-canvas") });
      const hint = $(".sw-hint"); if (hint) hint.textContent = "scroll to trace the chant";
    });
  }

  /* ================= the cell ================= */
  function buildCell() {
    if (!D.diesIrae) return;
    drawStaff($("#cell-canvas"), D.diesIrae.notes, -1);
    $("#cell-play").addEventListener("click", () => playMotif(D.diesIrae.notes, { voice: "choir", bpm: 56, bass: "E2", vel: 0.55, canvas: $("#cell-canvas") }));
  }

  /* ================= trace engine ================= */
  const traceState = { notes: null, current: null };
  function buildTrace() {
    const ledger = $("#ledger"); if (!ledger || !D.leitmotifs) return;
    D.leitmotifs.forEach((m, i) => {
      const row = document.createElement("button");
      row.className = "sighting"; row.type = "button"; row.setAttribute("aria-pressed", "false");
      row.innerHTML =
        '<span class="no">' + (i + 1) + "</span>" +
        '<span class="meta"><span class="t">' + m.name + '</span><span class="w">“' + (m.words || "") + '”</span></span>' +
        '<span class="k">' + (m.key || "") + "</span>";
      row.addEventListener("click", () => select(i, row));
      ledger.appendChild(row);
    });
    function select(i, row) {
      const m = D.leitmotifs[i];
      traceState.notes = m.notes; traceState.current = m;
      $$(".sighting", ledger).forEach((r) => { r.classList.remove("active"); r.setAttribute("aria-pressed", "false"); });
      row.classList.add("active"); row.setAttribute("aria-pressed", "true");
      $("#trace-tag").textContent = m.name + (m.key ? " · " + m.key : "");
      $("#trace-rel").textContent = m.relation || "";
      $("#trace-play").disabled = false;
      drawStaff($("#trace-canvas"), m.notes, -1);
      playMotif(m.notes, { voice: "bell", bpm: 88, vel: 0.6, canvas: $("#trace-canvas") });
    }
    $("#trace-play").addEventListener("click", () => { if (traceState.notes) playMotif(traceState.notes, { voice: "bell", bpm: 88, vel: 0.6, canvas: $("#trace-canvas") }); });
    $("#trace-source").addEventListener("click", () => playMotif(D.diesIrae.notes, { voice: "choir", bpm: 56, bass: "E2", vel: 0.5, canvas: $("#trace-canvas") }));
    $("#trace-both").addEventListener("click", async () => {
      if (!traceState.notes) { playMotif(D.diesIrae.notes, { voice: "choir", bpm: 56, bass: "E2", canvas: $("#trace-canvas") }); return; }
      await ensureSound(); stopAll();
      const t1 = scheduleMotif(D.diesIrae.notes, { voice: "choir", bpm: 56, bass: "E2", vel: 0.5, canvas: $("#trace-canvas") }, 0);
      scheduleMotif(traceState.notes, { voice: "bell", bpm: 88, vel: 0.62, canvas: $("#trace-canvas") }, t1 + 500);
    });
  }

  /* ================= inversion ================= */
  const invertState = { up: true };
  function cellNotes() { return D.diesIrae ? D.diesIrae.notes : ["E4", "D#4", "E4", "C#4"]; }
  function invertedCell() {
    const ns = cellNotes().map(noteToMidi);
    const pivot = ns[0];
    return ns.map((m) => midiToNote(pivot - (m - pivot)));
  }
  function buildInversion() {
    if (!D.diesIrae) return;
    const render = () => {
      const notes = invertState.up ? cellNotes() : invertedCell();
      drawStaff($("#invert-canvas"), notes, -1);
      $("#invert-notes").innerHTML = "The cell: <b>" + notes.map(pretty).join(" · ") + "</b>";
      $("#invert-tag").textContent = invertState.up ? "Upright — the chant" : "Inverted — “my friends”";
      $("#inv-up").classList.toggle("on", invertState.up);
      $("#inv-down").classList.toggle("on", !invertState.up);
    };
    render();
    $("#inv-up").addEventListener("click", () => { invertState.up = true; render(); });
    $("#inv-down").addEventListener("click", () => { invertState.up = false; render(); });
    $("#invert-play").addEventListener("click", () => {
      const notes = invertState.up ? cellNotes() : invertedCell();
      playMotif(notes, { voice: invertState.up ? "choir" : "bell", bpm: invertState.up ? 56 : 76, bass: invertState.up ? "E2" : null, vel: 0.55, canvas: $("#invert-canvas") });
    });
  }

  /* ================= A Little Priest — the pun engine ================= */
  function buildPriest() {
    const lp = D.littlePriest, fare = $("#fare"); if (!lp || !fare) return;
    lp.trades.forEach((t) => {
      const b = document.createElement("button");
      b.className = "fare-item"; b.type = "button";
      b.innerHTML = '<span class="tname">' + esc(t.trade) + '</span><span class="leaddots"></span><span class="taste">tap to taste</span>';
      b.addEventListener("click", () => {
        $$(".fare-item", fare).forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        showCouplet(t);
        playWaltz();
      });
      fare.appendChild(b);
    });
    function showCouplet(t) {
      const el = $("#couplet"); if (!el) return;
      el.innerHTML =
        '<p class="lines">' + esc(t.line1) + "<br>" + esc(t.line2) + "</p>" +
        '<p class="anat"><span>Pun: <b>' + esc(t.pun) + "</b></span><span>Rhyme: <b>" + esc(t.rhyme) + "</b></span></p>" +
        '<p class="waltztag">in a genteel 3/4 — an evocation of the waltz meter, not the tune</p>';
    }
  }

  // genteel oom-pah-pah waltz (cancelable, shares the playback timers)
  function playWaltz() {
    ensureSound().then((ok) => {
      if (!ok) return;
      stopAll();
      const bpm = 168, beat = 60 / bpm;
      const prog = [
        { bass: "D2", ch: ["D4", "F#4", "A4"] },
        { bass: "A1", ch: ["E4", "A4", "C#5"] },
        { bass: "D2", ch: ["D4", "F#4", "A4"] },
        { bass: "A1", ch: ["C#4", "E4", "A4"] },
      ];
      let t = 0;
      prog.forEach((bar) => {
        schedAt(() => A.bassNote(bar.bass, beat * 0.9, undefined, 0.5), t);
        schedAt(() => A.chord(bar.ch, beat * 0.66, undefined, 0.26), t + beat);
        schedAt(() => A.chord(bar.ch, beat * 0.66, undefined, 0.24), t + 2 * beat);
        t += 3 * beat;
      });
    });
  }
  function schedAt(fn, sec) { pending.push(setTimeout(() => { if (A && A.started) fn(); }, sec * 1000)); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ================= note helpers ================= */
  const SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  function noteToMidi(n) {
    const m = /^([A-G])(#|b)?(-?\d)$/.exec(n); if (!m) return 60;
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
    const acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
    return base + acc + (parseInt(m[3], 10) + 1) * 12;
  }
  function midiToNote(m) { const o = Math.floor(m / 12) - 1; return SHARP[((m % 12) + 12) % 12] + o; }
  function pretty(n) { return n.replace("#", "♯").replace("b", "♭").replace(/-?\d/, ""); }
})();
