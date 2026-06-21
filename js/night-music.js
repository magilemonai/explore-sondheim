/* ============================================================
   EXPLORE SONDHEIM — js/night-music.js  (v0.1)
   Moonlit hero + the "everything in three" meter playground.
   Audio is an illustrative waltz, not the score.
   ============================================================ */
(function () {
  "use strict";
  const R = window.Sondheim && window.Sondheim.room;
  const A = window.Sondheim && window.Sondheim.audio;
  const D = (window.Sondheim && window.Sondheim.data && window.Sondheim.data.nightMusic) || {};
  if (!R) return;
  const { $, $$ } = R;

  document.addEventListener("DOMContentLoaded", () => {
    if (D.lenses) { setText("#lens-music", D.lenses.music); setText("#lens-lyric", D.lenses.lyric); }
    R.reveal(); R.topbar(); R.sound();
    buildNight();
    buildMeters();
  });
  function setText(s, t) { const el = $(s); if (el) el.textContent = t; }

  /* ---- hero: moonlit night ---- */
  function buildNight() {
    const c = $("#night"); if (!c) return;
    const x = c.getContext("2d");
    let dpr = 1, w = 0, h = 0, stars = [], raf = null, t = 0;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = []; const n = Math.min(160, Math.floor(w * h / 9000));
      for (let i = 0; i < n; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.7, p: Math.random() * 6.28, vy: 0.04 + Math.random() * 0.12, gold: Math.random() < 0.18 });
    }
    function frame() {
      t += 0.016; x.clearRect(0, 0, w, h);
      // moon glow
      const mx = w * 0.8, my = h * 0.18, g = x.createRadialGradient(mx, my, 0, mx, my, 220);
      g.addColorStop(0, "rgba(216,195,138,0.22)"); g.addColorStop(1, "rgba(216,195,138,0)");
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.y -= s.vy; if (s.y < -4) s.y = h + 4;
        const tw = 0.4 + 0.6 * (Math.sin(t * 1.2 + s.p) + 1) / 2;
        x.globalAlpha = tw * 0.8; x.fillStyle = s.gold ? "#d8c38a" : "#cdd6ea";
        x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.3); x.fill();
      }
      x.globalAlpha = 1; raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size);
    if (!R.reduced) frame();
    $("#begin") && $("#begin").addEventListener("click", () => playMeter(0));
  }

  /* ---- meter playground ---- */
  const play = R.player();
  const meters = D.meters || [];
  function buildMeters() {
    const btns = $("#meter-btns"); if (!btns) return;
    meters.forEach((m, i) => {
      const b = document.createElement("button");
      b.className = "meter-btn"; b.type = "button"; b.textContent = m.sig; b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => playMeter(i));
      btns.appendChild(b);
    });
    if (meters[0]) renderBeats(meters[0].groups);
    $("#stop") && $("#stop").addEventListener("click", () => { play.stop(); $$(".beat").forEach((d) => d.classList.remove("lit", "down")); });
  }
  function renderBeats(groups) {
    const wrap = $("#beats"); if (!wrap) return; wrap.innerHTML = "";
    for (let g = 0; g < groups; g++) {
      const bg = document.createElement("div"); bg.className = "bargroup";
      for (let s = 0; s < 3; s++) { const d = document.createElement("div"); d.className = "beat"; bg.appendChild(d); }
      wrap.appendChild(bg);
    }
  }
  function lightDot(idx, down) {
    const all = $$(".beat"); all.forEach((d) => d.classList.remove("lit", "down"));
    const el = all[idx]; if (el) el.classList.add(down ? "down" : "lit");
  }
  async function playMeter(i) {
    const m = meters[i]; if (!m) return;
    $$(".meter-btn").forEach((b, j) => b.setAttribute("aria-pressed", j === i ? "true" : "false"));
    setText("#meter-desc", m.sig + " — " + m.desc);
    renderBeats(m.groups);
    await R.ensureSound(); play.stop();
    if (!A || !A.started) return;
    const W = D.waltz, sub = W.sub, group = sub * 3, total = 8;
    for (let g = 0; g < total; g++) {
      const isDown = g % m.groups === 0, t0 = g * group, barPos = g % m.groups;
      play.at(() => A.bassNote(isDown ? W.tonicBass : W.domBass, group * 0.9, undefined, isDown ? 0.55 : 0.4), t0);
      play.at(() => A.chord(isDown ? W.tonic : W.dom, sub * 0.8, undefined, 0.28), t0 + sub);
      play.at(() => A.chord(isDown ? W.tonic : W.dom, sub * 0.8, undefined, 0.26), t0 + 2 * sub);
      for (let s = 0; s < 3; s++) play.at(() => lightDot(barPos * 3 + s, isDown && s === 0), t0 + s * sub);
    }
    play.at(() => $$(".beat").forEach((d) => d.classList.remove("lit", "down")), total * group + 0.25);
  }
})();
