/* ============================================================
   EXPLORE SONDHEIM — js/merrily.js  (v0.1)
   Reverse-time hero + "run it backward": one ORIGINAL theme heard
   late (1976, minor/slow) then early (1957, major/bright).
   ============================================================ */
(function () {
  "use strict";
  const R = window.Sondheim && window.Sondheim.room;
  const A = window.Sondheim && window.Sondheim.audio;
  const D = (window.Sondheim && window.Sondheim.data && window.Sondheim.data.merrily) || {};
  if (!R) return;
  const { $, $$ } = R;

  document.addEventListener("DOMContentLoaded", () => {
    if (D.lenses) { setText("#lens-music", D.lenses.music); setText("#lens-lyric", D.lenses.lyric); }
    R.reveal(); R.topbar(); R.sound();
    buildReel();
    buildRewind();
  });
  function setText(s, t) { const el = $(s); if (el) el.textContent = t; }

  /* ---- hero: time running backward ---- */
  function buildReel() {
    const c = $("#reel"); if (!c) return;
    const x = c.getContext("2d");
    let dpr = 1, w = 0, h = 0, streaks = [], bulbs = [], raf = null;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      streaks = []; const n = Math.min(90, Math.floor(w * h / 16000));
      for (let i = 0; i < n; i++) streaks.push({ x: Math.random() * w, y: Math.random() * h, len: 20 + Math.random() * 90, sp: 0.6 + Math.random() * 2.2, a: 0.06 + Math.random() * 0.18, gold: Math.random() < 0.4 });
      bulbs = []; for (let i = 0; i < 26; i++) bulbs.push({ x: (i / 26) * w, y: h * 0.5, p: Math.random() * 6.28 });
    }
    function frame() {
      x.clearRect(0, 0, w, h);
      const t = (typeof performance !== "undefined" ? performance.now() : 0) * 0.001;
      for (const s of streaks) {                   // move LEFT (rewind)
        s.x -= s.sp; if (s.x + s.len < 0) { s.x = w + s.len; s.y = Math.random() * h; }
        x.globalAlpha = s.a; x.strokeStyle = s.gold ? "#d9b35a" : "#b56a5a"; x.lineWidth = 1.4;
        x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x + s.len, s.y); x.stroke();
      }
      x.globalAlpha = 1; raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size);
    if (!R.reduced) frame();
    $("#begin") && $("#begin").addEventListener("click", async () => { await R.ensureSound(); playTheme("late"); R.player(); });
  }

  /* ---- run it backward ---- */
  const play = R.player();
  function buildRewind() {
    const tl = $("#timeline");
    if (tl && D.timeline) D.timeline.forEach((s) => {
      const d = document.createElement("div"); d.className = "tl-stop";
      d.innerHTML = '<div class="yr">' + s.year + '</div><div class="wh">' + s.where + "</div>";
      tl.appendChild(d);
    });
    $("#play-late") && $("#play-late").addEventListener("click", async () => { await R.ensureSound(); playTheme("late"); setText("#rew-note", "1976: the theme, weary and in shadow. Now rewind to where it started…"); });
    $("#play-early") && $("#play-early").addEventListener("click", async () => { await R.ensureSound(); playTheme("early"); setText("#rew-note", "1957: the very same notes — young, major, certain. You only hear the hope after the cost."); });
  }
  function playTheme(mode) {
    const th = D.theme; if (!th || !A || !A.started) return;
    const m = th[mode]; play.stop();
    const dur = th.melody.length * m.sub;
    play.at(() => A.bassNote(m.bass, dur, undefined, 0.4), 0);
    play.at(() => A.chord(m.chord, dur, undefined, 0.26), 0);
    th.melody.forEach((n, i) => {
      const mi = R.noteToMidi(n) + (m.octave || 0);
      const note = R.midiToNote(mi);
      play.at(() => A.melody(note, m.sub * 0.95, undefined, m.vel), i * m.sub);
    });
  }
})();
