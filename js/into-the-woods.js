/* ============================================================
   EXPLORE SONDHEIM — js/into-the-woods.js  (v0.1)
   Forest hero + the "I wish" interweave. Illustrative ostinato +
   rising-second entrances, not the score.
   ============================================================ */
(function () {
  "use strict";
  const R = window.Sondheim && window.Sondheim.room;
  const A = window.Sondheim && window.Sondheim.audio;
  const D = (window.Sondheim && window.Sondheim.data && window.Sondheim.data.woods) || {};
  if (!R) return;
  const { $, $$ } = R;

  document.addEventListener("DOMContentLoaded", () => {
    if (D.lenses) { setText("#lens-music", D.lenses.music); setText("#lens-lyric", D.lenses.lyric); }
    R.reveal(); R.topbar(); R.sound();
    buildForest();
    buildWishers();
  });
  function setText(s, t) { const el = $(s); if (el) el.textContent = t; }

  /* ---- hero: a moonlit forest ---- */
  function buildForest() {
    const c = $("#forest"); if (!c) return;
    const x = c.getContext("2d");
    let dpr = 1, w = 0, h = 0, trunks = [], motes = [], raf = null, t = 0;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      trunks = []; for (let i = 0; i < 9; i++) trunks.push({ x: Math.random() * w, wd: 18 + Math.random() * 60, a: 0.1 + Math.random() * 0.25 });
      motes = []; const n = Math.min(120, Math.floor(w * h / 13000));
      for (let i = 0; i < n; i++) motes.push({ x: Math.random() * w, y: Math.random() * h, r: 0.7 + Math.random() * 1.8, vy: 0.08 + Math.random() * 0.25, p: Math.random() * 6.28, gold: Math.random() < 0.3 });
    }
    function frame() {
      t += 0.016; x.clearRect(0, 0, w, h);
      for (const tr of trunks) { x.fillStyle = "rgba(8,16,10," + tr.a + ")"; x.fillRect(tr.x - tr.wd / 2, 0, tr.wd, h); }
      for (const m of motes) {
        m.y -= m.vy; m.x += Math.sin(t + m.p) * 0.2; if (m.y < -4) { m.y = h + 4; m.x = Math.random() * w; }
        x.globalAlpha = 0.3 + 0.5 * (Math.sin(t * 1.5 + m.p) + 1) / 2;
        x.fillStyle = m.gold ? "#d99a3a" : "#7fae6a";
        x.beginPath(); x.arc(m.x, m.y, m.r, 0, 6.3); x.fill();
      }
      x.globalAlpha = 1; raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size);
    if (!R.reduced) frame();
    $("#begin") && $("#begin").addEventListener("click", async () => { await R.ensureSound(); playWoods([D.wishers[0]]); });
  }

  /* ---- wishers / interweave ---- */
  const play = R.player();
  let active = [];
  function buildWishers() {
    const wrap = $("#wishers"); if (!wrap || !D.wishers) return;
    D.wishers.forEach((wsh) => {
      const b = document.createElement("button");
      b.className = "wisher"; b.type = "button"; b.setAttribute("aria-pressed", "false");
      b.innerHTML = wsh.who + '<span class="iw">I wish ♪</span>';
      b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", on ? "false" : "true");
        active = D.wishers.filter((_, j) => $$(".wisher", wrap)[j].getAttribute("aria-pressed") === "true");
        count();
        if (!on && R.soundOn) wish(wsh, 0); // preview the new entrance
      });
      wrap.appendChild(b);
    });
    count();
    $("#start").addEventListener("click", async () => { await R.ensureSound(); playWoods(active.length ? active : [D.wishers[0]]); });
    $("#stop").addEventListener("click", () => play.stop());
  }
  function count() {
    const n = active.length, el = $("#count"); if (!el) return;
    el.innerHTML = "<b>" + n + "</b> wishing" + (n >= 4 ? " — the woods are full" : "");
  }
  function wish(wsh, t0) {
    if (!A || !A.started) return;
    const m = R.noteToMidi(wsh.note), up = R.midiToNote(m + 2), sub = (D.ostinato && D.ostinato.sub) || 0.16;
    play.at(() => A.melody(wsh.note, 0.3, undefined, 0.5), t0);
    play.at(() => A.melody(up, 0.5, undefined, 0.5), t0 + sub * 1.6);
  }
  function playWoods(wishers) {
    if (!A || !A.started) return;
    play.stop();
    const ost = D.ostinato, sub = ost.sub, cyc = ost.notes.length * sub, cycles = 12;
    for (let c = 0; c < cycles; c++) {
      const t0 = c * cyc;
      ost.notes.forEach((n, i) => play.at(() => A.dot(n, undefined, 0.32), t0 + i * sub));
    }
    (wishers || []).forEach((wsh, wi) => {
      for (let c = wi % 2; c < cycles; c += 2) wish(wsh, c * cyc + wi * 0.05);
    });
  }
})();
