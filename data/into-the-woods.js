/* ============================================================
   EXPLORE SONDHEIM — data/into-the-woods.js  (v0.1)
   "Into the Woods" (1987). Audio is ILLUSTRATIVE — a generic
   staccato ostinato + rising-second "I wish" entrances, not
   the score.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  NS.data = NS.data || {};
  NS.data.woods = {
    meta: {
      title: "Into the Woods",
      year: 1987,
      credits: "Music & lyrics — Stephen Sondheim · Book & direction — James Lapine",
      premiere: "Martin Beck Theatre, Broadway — November 5, 1987 (765 performances)",
      honor: "Won 1988 Tonys for Best Score and Best Book (and Best Actress, Joanna Gleason).",
      premise:
        "Fairy tales braided together by a childless baker's quest. Act One grants every wish; Act Two sends the bill. Underneath it all, one tiny musical cell — a wish — keeps returning.",
    },
    lenses: {
      music:
        "Everyone enters on the same two notes — a rising second, “I wish” — over a restless staccato ostinato that climbs to the tonic. From that single cell Sondheim weaves the great clockwork Act One finale, where every character's motif locks together.",
      lyric:
        "Storybook surfaces over grown-up dread. The princes' duet “Agony” preens; the morals rhyme like nursery rhymes with teeth; “Last Midnight” curses; “No One Is Alone” consoles.",
    },
    /* The restless staccato ostinato — last four notes of a scale climbing to tonic. */
    ostinato: { notes: ["D5", "E5", "F#5", "G5"], sub: 0.16 },
    /* Each character enters on a rising major second ("I wish") from their pitch. */
    wishers: [
      { who: "Cinderella",   note: "G4" },
      { who: "The Baker",    note: "D4" },
      { who: "Jack",         note: "B4" },
      { who: "Little Red",   note: "E5" },
      { who: "Rapunzel",     note: "D5" },
      { who: "The Witch",    note: "A3" },
    ],
    key: "G major",
  };
})();
