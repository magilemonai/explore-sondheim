/* ============================================================
   EXPLORE SONDHEIM — data/merrily.js  (v0.1)
   "Merrily We Roll Along" (1981). The theme below is ORIGINAL —
   written to demonstrate reverse-chronology transformation, not
   the show's music.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  NS.data = NS.data || {};
  NS.data.merrily = {
    meta: {
      title: "Merrily We Roll Along",
      year: 1981,
      credits: "Music & lyrics — Stephen Sondheim · Book — George Furth · Director — Harold Prince",
      premiere: "Alvin Theatre, Broadway — November 16, 1981 (16 performances)",
      honor: "A legendary fast flop, since reborn — its score now counted among Sondheim's richest.",
      premise:
        "Three friends in the theatre, told in reverse: it opens in 1976 at their bitter end and rewinds to 1957, when they were young and sure. You meet the cost before the dream.",
    },
    lenses: {
      music:
        "The form runs backward — and so does the score. Reprises arrive before their ‘originals,’ a handful of themes recombining so that, played in reverse, each tune means something new by the time you hear where it came from.",
      lyric:
        "The same words turn over. A line sung in disappointment returns, earlier, full of hope — the wording unchanged, the meaning inverted by everything you now know is coming.",
    },
    /* an ORIGINAL theme, played two ways to show the transformation */
    theme: {
      melody: ["G4", "A4", "B4", "D5", "B4", "A4", "G4", "E4"],
      late:  { sub: 0.42, octave: -12, minor: true,  vel: 0.5,  bass: "E2",  chord: ["E3", "G3", "B3"] },  // 1976 — slower, lower, minor
      early: { sub: 0.3,  octave: 0,   minor: false, vel: 0.6,  bass: "G2",  chord: ["G3", "B3", "D4"] },  // 1957 — brighter, major
    },
    /* a few stops along the rewind */
    timeline: [
      { year: "1976", where: "the end — old friends, estranged." },
      { year: "1968", where: "success curdles; the partnership cracks." },
      { year: "1962", where: "the first big break — and the first compromise." },
      { year: "1957", where: "a rooftop, all of it still ahead." },
    ],
  };
})();
