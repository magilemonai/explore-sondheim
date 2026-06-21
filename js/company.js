/* ============================================================
   EXPLORE SONDHEIM — js/company.js  (v0.1)
   Hero city canvas + the busy-signal "callers" engine +
   ambivalence chords. Audio is illustrative, not the score.
   ============================================================ */
(function () {
  "use strict";
  const R = window.Sondheim && window.Sondheim.room;
  const A = window.Sondheim && window.Sondheim.audio;
  const D = (window.Sondheim && window.Sondheim.data && window.Sondheim.data.company) || {};
  if (!R) return;
  const { $, $$ } = R;

  document.addEventListener("DOMContentLoaded", () => {
    if (D.lenses) { setText("#lens-music", D.lenses.music); setText("#lens-lyric", D.lenses.lyric); }
    R.reveal(); R.topbar(); R.sound();
    buildCity();
    buildCallers();
    buildAmbivalence();
  });
  function setText(s, t) { const el = $(s); if (el) el.textContent = t; }

  /* ---- hero: a city of lit windows ---- */
  function buildCity() {
    const c = $("#city"); if (!c) return;
    const x = c.getContext("2d");
    let dpr = 1, w = 0, h = 0, cells = [], raf = null, t = 0;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = []; const gx = 26, gy = 20;
      for (let yy = 0; yy < h; yy += gy) for (let xx = 0; xx < w; xx += gx) {
        if (Math.random() < 0.55) continue;
        cells.push({ x: xx + 4, y: yy + 4, w: gx - 12, h: gy - 10, on: Math.random() < 0.5, p: Math.random() * 6.28, sig: Math.random() < 0.06 });
      }
    }
    function frame() {
      t += 0.016; x.clearRect(0, 0, w, h);
      for (const c2 of cells) {
        const flick = (Math.sin(t * 0.7 + c2.p) + 1) / 2;
        const lit = c2.on ? 0.18 + flick * 0.5 : 0.05 + flick * 0.08;
        x.globalAlpha = lit;
        x.fillStyle = c2.sig ? "#ff5a4d" : (c2.on ? "#d7e0ea" : "#3a4250");
        x.fillRect(c2.x, c2.y, c2.w, c2.h);
      }
      x.globalAlpha = 1; raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size);
    if (!R.reduced) frame();
    $("#begin") && $("#begin").addEventListener("click", async () => {
      await R.ensureSound(); ring(["C5", "D5"], 1);
    });
  }

  /* ---- callers / busy signal ---- */
  const play = R.player();
  let active = [];
  function buildCallers() {
    const wrap = $("#callers"); if (!wrap || !D.callers) return;
    D.callers.forEach((cl, i) => {
      const b = document.createElement("button");
      b.className = "caller"; b.type = "button"; b.setAttribute("aria-pressed", "false");
      b.textContent = cl.who;
      b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", on ? "false" : "true");
        active = D.callers.filter((_, j) => $$(".caller", wrap)[j].getAttribute("aria-pressed") === "true");
        meter();
        if (R.soundOn) ring(active.map((a) => a.note), 1); // preview as you add
      });
      wrap.appendChild(b);
    });
    meter();
    $("#call").addEventListener("click", async () => { await R.ensureSound(); ring(active.map((a) => a.note), 6); });
    $("#hangup").addEventListener("click", () => play.stop());
  }
  function meter() {
    const n = active.length, el = $("#crowd"); if (!el) return;
    el.innerHTML = "<b>" + n + "</b> caller" + (n === 1 ? "" : "s") + (n >= 4 ? " — it's getting crowded" : "");
  }
  // busy-signal pulse + each caller's clipped "Bob-by" stab, for `bars` seconds
  function ring(callerNotes, bars) {
    if (!A || !A.started) return;
    play.stop();
    const busy = D.busy || { notes: ["B3", "F4"], onSec: 0.5, offSec: 0.5 };
    const cycle = busy.onSec + busy.offSec;
    for (let b = 0; b < bars; b++) {
      const t0 = b * cycle;
      play.at(() => A.play("choir", busy.notes, busy.onSec, undefined, 0.18), t0);   // the busy tone
      (callerNotes || []).forEach((n, i) => {
        play.at(() => A.dot(n, undefined, 0.5), t0 + 0.06 + i * 0.11);                // "Bob-"
        play.at(() => A.dot(n, undefined, 0.45), t0 + 0.24 + i * 0.11);               // "-by"
      });
    }
  }

  /* ---- ambivalence ---- */
  function buildAmbivalence() {
    const a = D.ambivalence; if (!a) return;
    const hit = async (chord, vel) => { await R.ensureSound(); play.stop(); if (A && A.started) { A.chord(chord, "1n", undefined, vel || 0.5); A.bassNote(chord[0], "1n", undefined, 0.4); } };
    $("#b-grateful") && $("#b-grateful").addEventListener("click", () => hit(a.grateful.chord, 0.45));
    $("#b-sorry") && $("#b-sorry").addEventListener("click", () => hit(a.sorry.chord, 0.45));
    $("#b-alive") && $("#b-alive").addEventListener("click", () => hit(a.alive.chord, 0.55));
  }
})();
