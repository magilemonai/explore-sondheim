/* ============================================================
   EXPLORE SONDHEIM — data/sunday.js
   Content + musical material for "Sunday in the Park with George."
   Loaded as a classic <script>; attaches to window.Sondheim.data.sunday.
   Pitches are in scientific notation for Tone.js.
   Lyric fragments are short and used for analysis/commentary.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  NS.data = NS.data || {};

  NS.data.sunday = {
    meta: {
      title: "Sunday in the Park with George",
      year: 1984,
      composer: "Music & lyrics — Stephen Sondheim",
      book: "Book & direction — James Lapine",
      premiere: "Booth Theatre, Broadway — May 2, 1984 (604 performances)",
      leads: "Mandy Patinkin (George) · Bernadette Peters (Dot / Marie)",
      honor: "Winner of the 1985 Pulitzer Prize for Drama — the sixth musical ever to receive it. Nominated for 10 Tony Awards; won two (Scenic and Lighting Design).",
      painting: {
        title: "A Sunday on La Grande Jatte — 1884",
        artist: "Georges Seurat (1859–1891)",
        made: "Oil on canvas, 1884–1886",
        home: "The Art Institute of Chicago",
        technique: "Pointillism / divisionism — pure color applied in countless small dots that the eye blends from a distance.",
      },
      premise:
        "Act One imagines the painter Georges Seurat composing his masterpiece, dot by dot, while neglecting the woman who loves him. Act Two leaps a century to his fictional descendant, a contemporary artist also named George, asking how — and whether — to keep making new work.",
    },

    /* The two analytical lenses, stated plainly. */
    lenses: {
      music:
        "Sondheim scores the act of painting itself. Accompaniments shimmer in rapid, detached figures — musical dots — that the ear fuses into shapes, exactly as Seurat's color does for the eye.",
      lyric:
        "The words are built the way the canvas is: from small, repeated units. In the title number the lyric does little more than name colors — and that naming is the painting.",
    },

    songs: [
      { act: 1, title: "Sunday in the Park with George", note: "Dot poses in the heat while George sketches. The pointillist accompaniment is established at once." },
      { act: 1, title: "No Life", note: "Two gallery-goers dismiss George's work — the first of the show's verdicts on art." },
      { act: 1, title: "Color and Light", note: "George at the canvas at night; Dot at her mirror. Staccato notes sound each dab of paint and each dab of powder." },
      { act: 1, title: "Gossip", note: "Park figures chatter; counterpoint as social texture." },
      { act: 1, title: "The Day Off", note: "A panorama of the park's Sunday characters (with 'The Dog Song' and 'The One on the Left'), each with a musical fingerprint." },
      { act: 1, title: "Everybody Loves Louis", note: "Dot reasons her way toward the easy, kind baker over the difficult artist." },
      { act: 1, title: "Finishing the Hat", note: "The creed of the obsessed maker: the world disappears and only the work remains." },
      { act: 1, title: "We Do Not Belong Together", note: "Dot tells George what he cannot give. The harmony refuses to resolve where she wants it to." },
      { act: 1, title: "Beautiful", note: "George and his mother; the park changes, the art preserves." },
      { act: 1, title: "Sunday", note: "The Act One finale. George arranges every figure into the painting; the company resolves into a luminous chorale as the canvas comes whole." },
      { act: 2, title: "It's Hot Up Here", note: "The painted figures, frozen forever in the frame, complain from inside the art." },
      { act: 2, title: "Chromolume #7", note: "The modern George unveils a machine of light — invention a century on." },
      { act: 2, title: "Putting It Together", note: "Art as assembly and self-promotion: 'bit by bit, putting it together.' Networking as composition." },
      { act: 2, title: "Children and Art", note: "Marie's testament: what we truly leave behind." },
      { act: 2, title: "Lesson #8", note: "George, blocked, reads Dot's old grammar primer and learns to begin again." },
      { act: 2, title: "Move On", note: "Dot returns to give George permission to keep going. The emotional resolution of both acts." },
      { act: 2, title: "Sunday (reprise)", note: "The chorale returns — the blank page made full once more." },
    ],

    /* ---------- Musical material (evocations, key of D major) ---------- */
    motifs: {
      // THE POINTILLIST FIGURE — "Color and Light" (No. 8), opening: B-flat minor
      // (five flats), Moderato ♩=126, sempre staccato / détaché. The figure flickers
      // its third between D-flat (minor) and D-natural (major) — Sondheim's major/
      // minor-third "color" idea built right into the obsessive accompaniment.
      // (Best read of the score; verify inner pitches by ear.)
      pointillist: {
        name: "The pointillist figure",
        source: "“Color and Light,” opening (No. 8)",
        key: "B♭ minor", tempo: 126,
        desc: "A détaché B♭ figure — E♭ leaning onto a third that flickers between minor (D♭) and major (D♮), the painter's color trick in miniature.",
        notes: ["Bb4","Eb5","D5","Bb4","Bb4","Db5","Db5","Bb4","Bb4","Eb5","D5","Bb4","Db5","D5"],
      },
      // THE "SUNDAY" THEME — Act 1 finale "Sunday" (No. 24), sung statement:
      // G major, Maestoso e non rubato ♩=76. "Sun" = B natural, leaping up a sixth
      // to a held "day" on G; then a gentle, mostly-stepwise descent.
      // (The leap is confirmed; the continuation is my best read — verify by ear.)
      sundayTheme: {
        name: "The “Sunday” theme",
        source: "“Sunday,” Act 1 finale (No. 24), the sung statement",
        key: "G major", tempo: 76,
        desc: "The hymn-like melody as the painting comes whole — a soaring leap on “Sun-day,” B up to G.",
        melody: ["B3","G4","D4","E4","D4","E4","A4","G4","E4","D4"],
      },
    },

    /* Sondheim's color analogy (verified, Art Institute of Chicago): setting a
       major third beside a minor third is like juxtaposing two ADJACENT hues —
       yellow with yellow-orange — which the ear blends into one poignant chord.
       Note: adjacent/analogous colors, NOT complementary. */
    colorThirds: {
      idea:
        "Sondheim heard harmony the way Seurat saw color. Setting a major third beside a minor third, he said, is like putting two close hues side by side — and the ear blends them into one unsettled, poignant chord.",
      quote:
        "If you listen to the alternation between a major third and a minor third, if you juxtapose them, it's exactly like juxtaposing yellow with yellow-orange, or red with red-orange. The ear blends those two things and it comes out to be this unsettled, but very poignant chord.",
      quoteSrc: "Stephen Sondheim, quoted by The Art Institute of Chicago",
      // Rooted on G to match the "Sunday" theme's key.
      root: "G3",
      bass: "G2",
      major: { note: "B4",  label: "Major third", swatch: "#e9cf63" },   // yellow
      minor: { note: "Bb4", label: "Minor third", swatch: "#e0a23f" },   // yellow-orange (adjacent)
      fifth: "D4",
    },

    /* "Color and Light" — harmony built like light, one layer at a time. */
    harmonyStack: [
      { label: "Bare fifth",      sub: "open, uncolored",        notes: ["D3","A3"],                       hue: 210, sat: 12 },
      { label: "Add the third",   sub: "a major triad — a subject appears", notes: ["D3","A3","F#4"],      hue: 145, sat: 40 },
      { label: "Add the 7th",     sub: "warmth — the light comes up",       notes: ["D3","A3","F#4","C#5"], hue: 95,  sat: 55 },
      { label: "Add the 9th",     sub: "air, openness",          notes: ["D3","A3","F#4","C#5","E5"],      hue: 55,  sat: 70 },
      { label: "Add the 6th / shimmer", sub: "Sondheim's signature glow",  notes: ["D3","A3","F#4","B4","C#5","E5"], hue: 35, sat: 85 },
    ],

    /* "Putting It Together" — stack layers to assemble the texture, in G major
       (the Sunday material): tonic pedal, staccato dabs, sustained light, theme, voices. */
    layers: [
      { id: "bass",  label: "Bass",          voice: "bass",  pattern: ["G2", null, "D2", null, "C2", null, "D2", null], desc: "The ground — a tonic pedal." },
      { id: "dots",  label: "Pointillist dots", voice: "dot", pattern: ["D5","B4","G4","B4","D5","B4","A4","B4"],        desc: "The shimmer — staccato dabs." },
      { id: "pad",   label: "Sustained light", voice: "pad",  pattern: [["G4","B4","D5"], null, null, null, ["E4","G4","C5"], null, null, null], desc: "The wash of color." },
      { id: "melody",label: "Melody",        voice: "bell",  pattern: [null,"A4", null,"G4", null,"E4", null,"D4"],      desc: "The subject — the Sunday theme." },
      { id: "choir", label: "Voices",        voice: "choir", pattern: [["B4","D5"], null, null, null, ["A4","C5"], null, null, null], desc: "The crowd." },
    ],

    /* The Act 1 finale build, in the theme's key (G major): the real "Sunday"
       melodic motif over the tonic-pedal harmony heard under the sung statement,
       rising to a radiant G(add9). An evocation of the chorale, not a full transcription. */
    chorale: [
      { bass: "G2", voices: ["G3","B3","D4"],        mel: "B3", beats: 2, label: "" },                  // Sun (B natural)
      { bass: "G2", voices: ["G3","B3","D4"],        mel: "G4", beats: 2, label: "…day" },              // day (G, held — a rising sixth)
      { bass: "C2", voices: ["G3","C4","E4"],        mel: "D4", beats: 2, label: "" },                  // IV color
      { bass: "E2", voices: ["G3","B3","E4"],        mel: "E4", beats: 2, label: "the figures gather" },// vi
      { bass: "C2", voices: ["E3","G3","C4"],        mel: "A4", beats: 2, label: "" },                  // IV
      { bass: "D2", voices: ["F#3","A3","D4"],       mel: "G4", beats: 2, label: "the light" },         // V
      { bass: "G2", voices: ["G3","B3","D4","A4"],   mel: "D5", beats: 4, label: "Sunday." },           // I add9, radiant
    ],

    /* The title-song lyric names colors — language as pointillism.
       Short fragment, presented for commentary. */
    colorLyric: {
      fragment: "By the blue purple yellow red water / On the green purple yellow red grass…",
      attribution: "from “Sunday,” Act One finale",
      note: "Five color-words, repeated and recombined. Sondheim paints the canvas in adjectives the way Seurat paints it in dots — no scene, just hues, laid side by side.",
      words: [
        { word: "blue",   hex: "#5b7fb4" },
        { word: "purple", hex: "#8a6fb0" },
        { word: "yellow", hex: "#e6c75a" },
        { word: "red",    hex: "#c25b56" },
        { word: "green",  hex: "#6fa86a" },
      ],
    },

    /* Pull-quotes used through the page (paraphrase / short fragment). */
    quotes: [
      { text: "Order. Design. Tension. Composition. Balance. Light. Harmony.", src: "the artist's vocabulary, drawn from the score" },
      { text: "Look, I made a hat… where there never was a hat.", src: "“Finishing the Hat” (fragment)" },
      { text: "White. A blank page or canvas. The challenge: bring order to the whole.", src: "the opening, paraphrased" },
    ],
  };
})();
