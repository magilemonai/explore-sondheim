/* ============================================================
   EXPLORE SONDHEIM — audio-engine.js
   A thin, friendly wrapper over Tone.js shared by every show.
   Loaded as a classic <script>; attaches to window.Sondheim.audio.
   All synthesized audio here is an EVOCATION of Sondheim's
   writing, not a transcription of the original orchestrations.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});

  const audio = {
    started: false,
    available: typeof window.Tone !== "undefined",
    _voices: {},
    _master: null,
    _muted: false,

    /* Must be called from a user gesture (click). */
    async start() {
      if (!this.available) return false;
      if (this.started) return true;
      try {
        await window.Tone.start();
        this._build();
        this.started = true;
        return true;
      } catch (e) {
        console.warn("Audio failed to start:", e);
        return false;
      }
    },

    _build() {
      const T = window.Tone;
      const master = new T.Gain(0.9).toDestination();
      const reverb = new T.Reverb({ decay: 4.5, wet: 0.32 }).connect(master);
      const lateReverb = new T.Reverb({ decay: 8, wet: 0.5 }).connect(master);
      this._master = master;

      // Pointillist "dot": short, bright, plucked — Seurat's dab as sound.
      const dot = new T.PolySynth(T.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.002, decay: 0.18, sustain: 0.02, release: 0.25 },
        volume: -10,
      }).connect(reverb);

      // Warm pad — sustained harmony / "light".
      const pad = new T.PolySynth(T.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.4, decay: 0.6, sustain: 0.7, release: 2.2 },
        volume: -16,
      }).connect(lateReverb);

      // Music-box / celeste melody.
      const bell = new T.PolySynth(T.Synth, {
        oscillator: { type: "sine", partials: [1, 0, 0.4, 0, 0.2] },
        envelope: { attack: 0.005, decay: 1.1, sustain: 0, release: 1.4 },
        volume: -12,
      }).connect(reverb);

      // Chorale voices — fuller, for "Sunday".
      const choir = new T.PolySynth(T.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.18, decay: 0.3, sustain: 0.8, release: 1.6 },
        volume: -22,
      }).connect(lateReverb);

      const bass = new T.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.6, release: 0.8 },
        volume: -14,
      }).connect(master);

      this._voices = { dot, pad, bell, choir, bass };
    },

    /* ---- Primitives ---- */
    now() { return this.available ? window.Tone.now() : 0; },

    play(voice, notes, dur = "8n", time, velocity = 0.9) {
      if (!this.started || this._muted) return;
      const v = this._voices[voice];
      if (!v) return;
      const t = time == null ? this.now() : time;
      try { v.triggerAttackRelease(notes, dur, t, velocity); } catch (e) { /* range guard */ }
    },

    dot(note, time, velocity = 0.9) { this.play("dot", note, "16n", time, velocity); },
    chord(notes, dur = "1n", time, velocity = 0.6) { this.play("pad", notes, dur, time, velocity); },
    melody(note, dur = "4n", time, velocity = 0.8) { this.play("bell", note, dur, time, velocity); },
    choir(notes, dur = "2n", time, velocity = 0.5) { this.play("choir", notes, dur, time, velocity); },
    bassNote(note, dur = "2n", time, velocity = 0.7) { this.play("bass", note, dur, time, velocity); },

    /* Schedule a list of {note, time(s from now), dur, velocity} events on a voice. */
    schedule(voice, events) {
      if (!this.started || this._muted) return;
      const base = this.now() + 0.06;
      events.forEach((e) => {
        this.play(voice, e.note, e.dur || "8n", base + (e.time || 0), e.velocity == null ? 0.85 : e.velocity);
      });
    },

    setMuted(m) {
      this._muted = m;
      if (this._master) this._master.gain.rampTo(m ? 0 : 0.9, 0.2);
    },
    toggleMute() { this.setMuted(!this._muted); return this._muted; },

    /* Silence anything currently sounding — used to restart a phrase cleanly. */
    hush() {
      if (!this.started) return;
      try {
        ["dot", "pad", "bell", "choir"].forEach((k) => {
          const v = this._voices[k];
          if (v && typeof v.releaseAll === "function") v.releaseAll();
        });
        const b = this._voices.bass;
        if (b && typeof b.triggerRelease === "function") b.triggerRelease();
      } catch (e) { /* no-op */ }
    },
  };

  NS.audio = audio;
})();
