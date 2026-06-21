/* ============================================================
   EXPLORE SONDHEIM — js/assassins.js  (v0.1)
   Shooting-gallery hero + the "American jukebox." Each idiom plays
   a short ORIGINAL snippet in that style — illustrative of the
   pastiche, NOT the show's numbers.
   ============================================================ */
(function () {
  "use strict";
  const R = window.Sondheim && window.Sondheim.room;
  const A = window.Sondheim && window.Sondheim.audio;
  const D = (window.Sondheim && window.Sondheim.data && window.Sondheim.data.assassins) || {};
  if (!R) return;
  const { $, $$ } = R;

  document.addEventListener("DOMContentLoaded", () => {
    if (D.lenses) { setText("#lens-music", D.lenses.music); setText("#lens-lyric", D.lenses.lyric); }
    R.reveal(); R.topbar(); R.sound();
    buildGallery();
    buildJukebox();
  });
  function setText(s, t) { const el = $(s); if (el) el.textContent = t; }

  /* ---- hero: a sliding shooting gallery ---- */
  function buildGallery() {
    const c = $("#gallery"); if (!c) return;
    const x = c.getContext("2d");
    let dpr = 1, w = 0, h = 0, rows = [], stars = [], raf = null;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      rows = []; for (let r = 0; r < 4; r++) rows.push({ y: h * (0.3 + r * 0.16), sp: (r % 2 ? -1 : 1) * (0.2 + r * 0.12), off: Math.random() * 200, gap: 150 + r * 20, rad: 16 - r * 1.5 });
      stars = []; for (let i = 0; i < 40; i++) stars.push({ x: Math.random() * w, y: Math.random() * h * 0.5, r: 1 + Math.random() * 1.5, a: 0.2 + Math.random() * 0.4 });
    }
    function target(cx, cy, rad) {
      x.strokeStyle = "rgba(194,59,52,0.5)"; x.lineWidth = 2;
      x.beginPath(); x.arc(cx, cy, rad, 0, 6.3); x.stroke();
      x.fillStyle = "rgba(194,59,52,0.32)"; x.beginPath(); x.arc(cx, cy, rad * 0.4, 0, 6.3); x.fill();
    }
    function frame() {
      x.clearRect(0, 0, w, h);
      for (const s of stars) { x.globalAlpha = s.a; x.fillStyle = "#4a6b9a"; x.fillRect(s.x, s.y, s.r, s.r); }
      x.globalAlpha = 1;
      const t = (typeof performance !== "undefined" ? performance.now() : 0) * 0.001;
      for (const r of rows) {
        for (let i = -1; i * r.gap < w + r.gap; i++) {
          let cx = (i * r.gap + r.off + t * r.sp * 60) % (w + r.gap);
          if (cx < -r.gap) cx += w + r.gap; if (r.sp < 0) cx = w - cx;
          target(cx, r.y, r.rad);
        }
      }
      raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size);
    if (!R.reduced) frame();
    $("#begin") && $("#begin").addEventListener("click", async () => { await R.ensureSound(); playStyle("march"); });
  }

  /* ---- jukebox ---- */
  const play = R.player();
  function buildJukebox() {
    const wrap = $("#idioms"); if (!wrap || !D.idioms) return;
    D.idioms.forEach((id) => {
      const b = document.createElement("button");
      b.className = "idiom"; b.type = "button";
      b.innerHTML = '<div class="target"></div><div class="ttl">' + id.name + "</div>";
      b.addEventListener("click", async () => {
        $$(".idiom", wrap).forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        $("#nowplaying").innerHTML = '<p class="np-name">' + id.name + '</p><p class="np-desc">' + id.desc + "</p>";
        await R.ensureSound(); playStyle(id.id);
      });
      wrap.appendChild(b);
    });
  }

  // ORIGINAL snippets in each idiom (generic demonstrations of the style)
  function playStyle(id) {
    if (!A || !A.started) return;
    play.stop();
    if (id === "march") {
      const beat = 0.3;
      for (let b = 0; b < 2; b++) { const t = b * beat * 4;
        play.at(() => A.bassNote("Bb2", beat * 0.9, undefined, 0.5), t);
        play.at(() => A.chord(["D4", "F4"], beat * 0.6, undefined, 0.3), t + beat);
        play.at(() => A.bassNote("F2", beat * 0.9, undefined, 0.5), t + 2 * beat);
        play.at(() => A.chord(["D4", "F4"], beat * 0.6, undefined, 0.3), t + 3 * beat);
      }
      ["Bb4", "D5", "F5", "D5", "Bb4", "C5", "D5", "Bb4"].forEach((n, i) => play.at(() => A.choir(n, beat * 0.8, undefined, 0.42), i * beat));
    } else if (id === "folk") {
      play.at(() => A.bassNote("D2", 3.4, undefined, 0.28), 0);
      ["D4", "E4", "G4", "A4", "G4", "E4", "D4"].forEach((n, i) => play.at(() => A.melody(n, 0.42, undefined, 0.55), i * 0.45));
    } else if (id === "cakewalk") {
      const beat = 0.28;
      for (let b = 0; b < 2; b++) { const t = b * beat * 4;
        play.at(() => A.bassNote("C2", beat * 0.9, undefined, 0.45), t);
        play.at(() => A.chord(["E4", "G4"], beat * 0.5, undefined, 0.28), t + beat);
        play.at(() => A.bassNote("G2", beat * 0.9, undefined, 0.45), t + 2 * beat);
        play.at(() => A.chord(["E4", "G4"], beat * 0.5, undefined, 0.28), t + 3 * beat);
      }
      [["C5", 0.14], ["E5", 0.42], ["G5", 0.62], ["E5", 0.9], ["C5", 1.18], ["A4", 1.4], ["C5", 1.6], ["G4", 1.96]].forEach(([n, t]) => play.at(() => A.dot(n, undefined, 0.5), t));
    } else if (id === "barbershop") {
      play.at(() => A.choir(["G3", "B3", "D4", "F4"], 1.4, undefined, 0.32), 0);   // ringing dominant 7
      play.at(() => A.choir(["G3", "C4", "E4", "G4"], 1.8, undefined, 0.4), 1.5);   // resolve to tonic
      play.at(() => A.melody("E4", 0.5, undefined, 0.4), 1.55);
    } else if (id === "softpop") {
      const prog = [["C3", ["E4", "G4", "C5"]], ["A2", ["C4", "E4", "A4"]], ["F2", ["A3", "C4", "F4"]], ["G2", ["B3", "D4", "G4"]]];
      prog.forEach((p, i) => { play.at(() => A.bassNote(p[0], 0.95, undefined, 0.3), i); play.at(() => A.chord(p[1], 0.9, undefined, 0.26), i); });
      [["E4", 0.2], ["G4", 1.2], ["A4", 2.2], ["G4", 3.2]].forEach(([n, t]) => play.at(() => A.melody(n, 0.7, undefined, 0.45), t));
    }
  }
})();
