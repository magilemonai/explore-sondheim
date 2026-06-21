/* ============================================================
   EXPLORE SONDHEIM — data/company.js   (v0.1)
   "Company" (1970). Audio here is ILLUSTRATIVE — original
   demonstrations of the documented devices (the busy-signal
   pulse, the clipped name-calls), not the show's actual music.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  NS.data = NS.data || {};
  NS.data.company = {
    meta: {
      title: "Company",
      year: 1970,
      credits: "Music & lyrics — Stephen Sondheim · Book — George Furth · Director — Harold Prince",
      premiere: "Alvin Theatre, Broadway — April 26, 1970 (705 performances)",
      honor: "Won six 1971 Tony Awards, including Best Musical — Broadway's first true 'concept musical.'",
      premise:
        "On his 35th birthday, the bachelor Bobby is surrounded by five married couples — his ‘good and crazy people’ — all asking why he won't marry. A plotless mosaic about intimacy, in the key of the modern city.",
    },
    lenses: {
      music:
        "The whole score grows from one nervous cell — a motif born from a telephone's busy signal — and the couples' clipped, overlapping calls of ‘Bobby… Bobby baby…’. Astringent, vamping, urban: the sound of being surrounded and alone.",
      lyric:
        "Ambivalence as a craft. The list-patter of ‘Getting Married Today’ sprints toward panic; ‘Sorry-Grateful’ holds two opposite feelings in one breath; ‘Being Alive’ finally lets the wish through.",
    },
    /* The five couples who orbit Bobby (character names). */
    callers: [
      { who: "Sarah & Harry",  note: "C5" },
      { who: "Susan & Peter",  note: "D5" },
      { who: "Jenny & David",  note: "Bb4" },
      { who: "Amy & Paul",     note: "F5" },
      { who: "Joanne & Larry", note: "G4" },
    ],
    /* Busy-signal pulse: two clashing pitches (the US busy signal is a real-world
       tone, not Sondheim's). Used to evoke the motif's origin. */
    busy: { notes: ["B3", "F4"], onSec: 0.5, offSec: 0.5 },
    /* Ambivalence: one word warm, one cool — "Sorry-Grateful." */
    ambivalence: {
      grateful: { label: "Grateful", chord: ["C3", "E4", "G4", "B4"] },   // major 7 — open, warm
      sorry:    { label: "Sorry",    chord: ["C3", "Eb4", "G4", "Bb4"] },  // minor 7 — shadowed
      alive:    { label: "Being Alive", chord: ["C3", "G3", "E4", "G4", "C5", "D5"] }, // resolved, full
    },
  };
})();
