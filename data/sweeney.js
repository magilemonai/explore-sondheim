/* ============================================================
   EXPLORE SONDHEIM — data/sweeney.js
   Material for "Sweeney Todd, the Demon Barber of Fleet Street."
   Pitches supplied by the score (Cody) — note names exact; OCTAVES are
   my placement for playback and should be verified by ear, as in Sunday.
   The room's spine: the medieval Dies Irae stalking the score as a
   transformed death-leitmotif. Loaded as a classic <script>.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  NS.data = NS.data || {};

  NS.data.sweeney = {
    meta: {
      title: "Sweeney Todd, the Demon Barber of Fleet Street",
      year: 1979,
      composer: "Music & lyrics — Stephen Sondheim",
      book: "Book — Hugh Wheeler, from Christopher Bond's play",
      director: "Original direction — Harold Prince",
      premiere: "Uris Theatre, Broadway — March 1, 1979",
      leads: "Len Cariou (Todd) · Angela Lansbury (Mrs. Lovett)",
      honor: "Winner of the 1979 Tony Award for Best Musical (among eight).",
      premise:
        "A wronged barber returns to London for revenge and, with his landlady, turns murder into a meat-pie enterprise. Sondheim scores it like a horror film — and threads a 13th-century chant of death through the entire evening.",
    },

    lenses: {
      music:
        "One cell does the haunting. Sondheim quotes the Dies Irae — the plainchant 'Day of Wrath' from the Mass for the Dead — once, plainly, then hides it everywhere: inverted, fragmented, harmonized, slowed. Learn the cell, then hunt it through the score.",
      lyric:
        "Gallows wit at high speed: dense internal rhyme, the list, and the patter — the genteel waltz of 'A Little Priest' itemizing cannibalism without ever dropping the manners.",
    },

    /* The source: Sondheim's plain statement of the chant (organ prelude, m.37). */
    diesIrae: {
      name: "Dies Irae — the source cell",
      source: "Opening organ prelude, m. 37",
      desc: "A half-step sigh (E–D♯–E) dropping a minor third to C♯ — the seed of the whole score's dread.",
      notes: ["E4", "D#4", "E4", "C#4"],
    },

    /* The leitmotif chain — each entry is a transformation/relative of the chant. */
    leitmotifs: [
      {
        id: "ballad",
        name: "“The Ballad of Sweeney Todd” — the frame",
        words: "Attend the tale of Sweeney Todd",
        key: "F♯ minor",
        notes: ["C#4", "F#4", "G#4", "A4", "F#4", "G#4", "E4", "F#4"],
        relation: "The recurring narrator's theme that opens and closes the show — the frame the chant haunts.",
      },
      {
        id: "razor",
        name: "“Swing your razor wide, Sweeney!”",
        words: "Swing your razor wide, Sweeney",
        key: "F♯ minor",
        notes: ["C#5", "B4", "C#5", "A4", "B4", "F#4", "G#4"],
        relation: "Inside the Ballad, the chorus's marcato cry where the chant's contour surfaces in the vocal line.",
      },
      {
        id: "alms",
        name: "The Beggar Woman’s “Alms” motif",
        words: "Alms… alms… for a miserable woman",
        key: "12/8",
        notes: ["D#4", "D4", "A#3", "B3", "C#4", "B3", "A#3", "D4", "C#4"],
        relation: "The descending half-steps (D♯–D, B–A♯) are the chant's sigh — a hidden tell that the Beggar Woman is Lucy.",
      },
      {
        id: "friends",
        name: "“These are my friends” (the razors)",
        words: "These are my friends",
        key: "sempre dolce",
        notes: ["Bb3", "C4", "Bb3", "Db4"],
        relation: "Todd serenades his razors with the chant's neighbor-note shape — tenderness built from the death cell.",
      },
      {
        id: "epiphany",
        name: "“Epiphany” — Never see Johanna",
        words: "Never see Johanna",
        key: "transposed to C",
        notes: ["Bb3", "A3", "G3", "F3", "Bb3", "A3", "G3", "F3"],
        relation: "The chant's descending phrase, sung twice — the moment Todd's grief curdles into universal murder.",
      },
    ],

    /* Lyrical lens to build next: "A Little Priest" (the patter waltz) — pending score. */
    lyricalToCome: ["A Little Priest (waltz patter)", "Pretty Women", "Not While I'm Around"],
  };
})();
