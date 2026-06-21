/* ============================================================
   EXPLORE SONDHEIM — data/assassins.js  (v0.1)
   "Assassins" (1990). The jukebox plays ORIGINAL snippets written
   in each American idiom to illustrate the pastiche — NOT the
   show's numbers.
   ============================================================ */
(function () {
  const NS = (window.Sondheim = window.Sondheim || {});
  NS.data = NS.data || {};
  NS.data.assassins = {
    meta: {
      title: "Assassins",
      year: 1990,
      credits: "Music & lyrics — Stephen Sondheim · Book — John Weidman (concept, Charles Gilbert Jr.) · Director — Jerry Zaks",
      premiere: "Playwrights Horizons, off-Broadway — December 18, 1990 · Broadway revival 2004 (5 Tony Awards, incl. Best Revival)",
      honor: "A revue of the men and women who shot, or shot at, U.S. presidents — set to the American songbook.",
      premise:
        "At a phantom carnival shooting gallery, the assassins of American history step up in turn. Their grievances are scored in the nation's own popular styles — the songbook turned against the dream.",
    },
    lenses: {
      music:
        "Pastiche as argument. Sondheim writes a museum of American idioms — the Sousa march, the folk ballad, barbershop, the soft-rock love song — then twists each with ironic lyrics, so the country's most comforting sounds carry its violence.",
      lyric:
        "The American Dream, read back as a threat: ‘everybody's got the right to be happy,’ to be a star, to be heard — even at the end of a gun. Bright tunes, cold logic.",
    },
    /* Each plays an ORIGINAL snippet in that idiom (see js). Mappings are hedged
       to what's well supported; the carnival strut is left general. */
    idioms: [
      { id: "march",      name: "The Sousa march",   desc: "Brassy, flag-waving, in step. Sondheim's vehicle for spectacle — as in “How I Saved Roosevelt.”" },
      { id: "folk",       name: "The folk ballad",   desc: "A plain Appalachian tune, the voice of the people — as in the Balladeer's “The Ballad of Booth.”" },
      { id: "cakewalk",   name: "The cakewalk strut", desc: "A syncopated grin, the carnival's swagger — vaudeville Americana with a sour aftertaste." },
      { id: "barbershop", name: "Barbershop",        desc: "Close four-part harmony, ringing and wholesome — turned uneasy, as in the “Gun Song.”" },
      { id: "softpop",    name: "1970s soft-pop",    desc: "A dreamy AM-radio love ballad — Sondheim's frame for obsession in “Unworthy of Your Love.”" },
    ],
  };
})();
