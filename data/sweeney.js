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

    /* "A LITTLE PRIEST" — the lyrical-lens room. The interactive teaches the
       PUN ENGINE. The couplets below are NEWLY WRITTEN to demonstrate the device
       (trade → culinary pun → internal rhyme → genteel manners) — they are NOT
       Sondheim's lyrics, which are not reproduced anywhere on the site. */
    littlePriest: {
      title: "A Little Priest",
      meter: "Waltz · 3/4",
      idea:
        "The Act 1 finale turns cannibalism into a parlour game. Mrs. Lovett and Todd price out all of London by trade, matching each man to how he would taste — every pairing a pun, rhymed at a sprint, the whole grisly business carried on a genteel waltz. The horror is in three-quarter time.",
      engine:
        "Every joke is built the same way: take a trade, find the pun that fits its character, land a rhyme, and never drop the manners. Tap a customer to watch the engine run. (These couplets are written fresh to show the mechanism — the show's own lyrics are not reproduced.)",
      trades: [
        { trade: "The Lawyer",      line1: "So smooth he fairly slides down the throat —", line2: "a slippery customer; savour the gloat.", pun: "slippery customer", rhyme: "throat / gloat" },
        { trade: "The Poet",        line1: "All airy and light, if a trifle unread —",     line2: "he melts on the tongue like the lines in his head.", pun: "airy and light", rhyme: "unread / head" },
        { trade: "The Politician",  line1: "Two-faced, naturally, so you get double the meat —", line2: "and gamey enough that he'll never taste sweet.", pun: "two-faced → double the meat", rhyme: "meat / sweet" },
        { trade: "The Critic",      line1: "Bitter to start, with a long, sour finish —",  line2: "the portion is meagre, the bile won't diminish.", pun: "bitter… sour", rhyme: "finish / diminish" },
        { trade: "The Banker",      line1: "Fat, and he flaunts it — a rich, heavy cut —", line2: "spreads lovely on toast, sits like brick in the gut.", pun: "rich / fat cut", rhyme: "cut / gut" },
        { trade: "The Actor",       line1: "Hammy and ripe, and he won't drop the pose —", line2: "overdone, obviously, clear down to the toes.", pun: "hammy / overdone", rhyme: "pose / toes" },
        { trade: "The Vicar",       line1: "Lean from the fasting, a whisper of holy —",   line2: "goes down with a blessing; digests rather slowly.", pun: "holy / a blessing", rhyme: "holy / slowly" },
      ],
    },
  };
})();
