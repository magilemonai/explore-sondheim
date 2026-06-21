/* ============================================================
   EXPLORE SONDHEIM — data/night-music.js  (v0.1)
   "A Little Night Music" (1973). Audio is an ILLUSTRATIVE waltz
   vamp demonstrating triple/compound meter — not the score.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  NS.data = NS.data || {};
  NS.data.nightMusic = {
    meta: {
      title: "A Little Night Music",
      year: 1973,
      credits: "Music & lyrics — Stephen Sondheim · Book — Hugh Wheeler · Director — Harold Prince",
      premiere: "Shubert Theatre, Broadway — February 25, 1973 (601 performances)",
      honor: "Won six 1973 Tony Awards including Best Musical; gave the world “Send in the Clowns.”",
      premise:
        "A Swedish summer weekend of mismatched lovers, after Bergman's Smiles of a Summer Night. The night smiles three times — and the whole score is written in three.",
    },
    lenses: {
      music:
        "Sondheim set himself a rule: write it all in three. The score is a theme-and-variations on the waltz — 3/4 opening out into 6/8, 9/8, 12/8 — its lilt of pursuit and retreat mirroring the lovers, the three-ness reaching even the trios and triangles.",
      lyric:
        "Rueful, adult wit. “Send in the Clowns” lands its heartbreak on held silences; “The Miller's Son” races through a maid's whole imagined life; “A Weekend in the Country” stacks every voice into one giddy invitation.",
    },
    /* Meter playground — all built from groups of three. */
    meters: [
      { sig: "3/4",  groups: 1, desc: "the waltz itself — one swing of three per bar." },
      { sig: "6/8",  groups: 2, desc: "compound duple — two groups of three; a faster lilt." },
      { sig: "9/8",  groups: 3, desc: "compound triple — three groups of three." },
      { sig: "12/8", groups: 4, desc: "compound quadruple — four groups of three, broad and rolling." },
    ],
    /* generic, elegant waltz harmony (D major) for the vamp */
    waltz: {
      sub: 0.2,                                  // eighth-note seconds
      tonicBass: "D2", domBass: "A2",
      tonic: ["D4", "F#4", "A4"], dom: ["C#4", "E4", "A4"],
    },
  };
})();
