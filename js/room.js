/* ============================================================
   EXPLORE SONDHEIM — js/room.js
   Shared helpers for the show rooms (reveal, topbar, sound,
   a cancelable player, note utilities). Attaches to
   window.Sondheim.room. Load AFTER audio-engine.js.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let soundOn = false;

  function reveal(sel) {
    const els = $$(sel || ".reveal:not(.in)");
    const all = /[?&]all(?:[=&]|$)/.test(location.search);
    if (!("IntersectionObserver" in window) || reduced || all) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
  }
  function topbar() {
    const b = $("#topbar"); if (!b) return;
    const on = () => b.classList.toggle("scrolled", window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
  }
  function reflect() {
    const btn = $("#sound-toggle"); if (!btn) return;
    btn.classList.toggle("playing", soundOn);
    btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
    const l = $(".st-label", btn); if (l) l.textContent = soundOn ? "Sound on" : "Sound off";
  }
  function sound() {
    const btn = $("#sound-toggle"); if (!btn) return;
    const a = NS.audio;
    if (!a || !a.available) { const l = $(".st-label", btn); if (l) l.textContent = "No audio"; btn.disabled = true; return; }
    btn.addEventListener("click", async () => {
      if (!a.started) await a.start();
      if (!soundOn) { a.setMuted(false); soundOn = true; } else { soundOn = !a.toggleMute(); }
      reflect();
    });
  }
  async function ensureSound() {
    const a = NS.audio;
    if (!a || !a.available) return false;
    if (!a.started) await a.start();
    a.setMuted(false); soundOn = true; reflect();
    return a.started;
  }

  /* cancelable player: schedule notes on timers; stop() clears + hushes. */
  function player() {
    let pending = [];
    return {
      stop() { pending.forEach(clearTimeout); pending = []; const a = NS.audio; if (a && a.hush) a.hush(); },
      at(fn, sec) { pending.push(setTimeout(() => { const a = NS.audio; if (a && a.started) fn(); }, sec * 1000)); },
    };
  }

  const SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  function noteToMidi(n) {
    const m = /^([A-G])(#|b)?(-?\d)$/.exec(n); if (!m) return 60;
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
    const acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
    return base + acc + (parseInt(m[3], 10) + 1) * 12;
  }
  function midiToNote(m) { return SHARP[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }
  function pretty(n) { return String(n).replace("#", "♯").replace("b", "♭").replace(/-?\d/, ""); }

  NS.room = { $, $$, reduced, reveal, topbar, sound, ensureSound, player, noteToMidi, midiToNote, pretty, get soundOn() { return soundOn; } };
})();
