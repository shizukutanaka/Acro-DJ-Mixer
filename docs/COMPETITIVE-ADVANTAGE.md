# Competitive Advantage — Acro DJ Mixer (2026-11-22)

Method: competitor survey (paid and free), money-flow decomposition, then the
Musk method + Socratic questioning repeated until a premise broke. Two full
rounds were run; each round records what was questioned, what was deleted, and
what survived.

## The market, and where the money goes

Pro desktop (the incumbents):

| Product | Model | Price signal |
|---|---|---|
| rekordbox (AlphaTheta) | Subscription only | Free prep tier; Core €12/mo, Creative €18/mo, Professional €36/mo |
| Serato DJ Pro | Subscription or lifetime | $11.99/mo or $299 lifetime; Suite $14.99/mo / $499 |
| Traktor Pro 4 (NI) | One-time | $149 |
| VirtualDJ | Free home + subscription | Home $4/mo, Pro $19/mo, Business $99/mo |
| djay Pro (Algoriddim) | Subscription | $6.99/mo or $49.99/yr |
| Engine DJ | Free, hardware-bound | Software free; value captured in Denon hardware |
| Mixxx | Free, open source | No revenue; community project |
| DJ.Studio | Subscription or one-time | ~$29/mo, or one-time from ~$99 (mix construction, not live) |

Browser DJ (the new crowd): TabDJ (YouTube as the catalogue), ClipCraft AI
(freemium token allowance), AudioToolz (ad-supported), Flashback Events DJ,
browserdj (MIT, open source, no account, single-page). Most are toy-grade:
no BPM detection, no real PFL cueing, no recording — but they open instantly.

Decomposing the money, a DJ pays for four things, and features are only one:

1. **Software rent** — subscriptions above; the industry's centre of gravity
   has moved from licences to rent (rekordbox is subscription-only).
2. **Hardware unlock** — controllers and mixers bundle or unlock software
   tiers, so the software price is partly hidden inside hardware margins.
3. **Catalogue access** — streaming integrations (Spotify, TIDAL, Beatport,
   SoundCloud) sell a second subscription on top, with personal-use-only
   terms, no offline storage, and stems disabled on streamed tracks.
4. **Their own preparation data** — this is the quiet one. Beat grids, hot
   cues and playlists represent hours of per-track work. That data lives in
   each vendor's proprietary library format, so leaving a platform means
   abandoning or imperfectly converting the prep. Switching costs are not a
   side effect of the incumbents' model; they are a load-bearing part of it.

## Round 1 — questioning the obvious premises

- *Premise: "DJ software competes on feature breadth."* Deleted. Every
  incumbent slices the same feature set (stems, FX, DVS, video) into paid
  tiers, and Acro already carries 427 ADRs of features. Breadth is table
  stakes, not the contest.
- *Premise: "Free is the advantage."* Deleted. Mixxx is free, VirtualDJ is
  free at home, browserdj is free and MIT. Free is not a differentiator.
- *Premise: "The browser is the wedge."* Weakened. Browser mixers are
  multiplying, and Acro's own signboard now leads with the desktop app.
  What survived: among browser-capable mixers, Acro's analysis depth
  (fractional BPM grid, Camelot key, EBU R128 auto-gain, WAV recording,
  real headphone cueing) is in a different class from the toy crowd.
- *Survived intact:* no account, no server, no telemetry, files never
  uploaded. Only browserdj is comparably strict, and Acro exceeds it in
  analysis and recording depth.

## Round 2 — the deletion test, and the premise that broke

Delete half the features: the product survives — ADR-0001's atomic unit is
two decks, tempo, gain, a crossfader and cueing. Delete the account, the
cloud, the licence: already deleted, nothing breaks.

Then delete "the DJ can take their preparation with them" — and it turned
out this is *already* effectively deleted. Library export/import (ADR-0072)
is Acro's own JSON (`acro-dj-library.json`): portable between machines, but
readable only by Acro. There is no rekordbox XML export, no M3U, no path
for a DJ's cues and grids to reach any other tool.

**The broken premise:** "Acro has no lock-in" is only half true. There is
no server-side lock-in, but there is format lock-in on the one asset a DJ
cannot quickly recreate — their preparation data.

**Why this is structural, not a missing feature:** the incumbents cannot
fix the equivalent problem on their side. Their revenue is rent, and rent
is defensible only while leaving is expensive. Full, standard-format prep
portability would dissolve the switching cost their subscriptions rest on,
so they offer export grudgingly and partially. Acro has no rent to defend:
it can give portability away unconditionally, forever, at zero marginal
cost. That asymmetry is the advantage.

A secondary finding: the moment of need — a borrowed or locked-down
laptop, a dead main rig mid-evening — is where install-free, account-free,
seconds-to-sound wins outright. Leading the signboard with a source-built
desktop app weakens exactly that wedge; the browser form is the front
door and the desktop shell is what is behind it.

## The structural advantage, in one statement

Acro is the serious mixer that never holds a DJ's preparation hostage:
no rent, no account, no server — and, once opportunity 1 below lands,
cues, grids and library exportable in standard formats any other tool
can read. Incumbents cannot match that promise without undermining the
subscription economics their businesses run on. Acro, having no revenue
and no operating cost, can keep the promise unconditionally.

## Opportunities, ranked

1. **Standard-format prep export (and import).** Export the library —
   cues, beat grids, tempo, key — as rekordbox XML, the de-facto
   exchange format other tools read, alongside the existing JSON;
   add M3U playlist export. This converts the structural advantage
   above from a claim into the product's headline. (Not yet built;
   this is the largest item on this list and the reason this document
   exists.)
2. **Signboard honesty at the top of the README.** The lead line said
   "shipped as a desktop app" while no prebuilt downloads exist and
   the desktop form must be built from source. Fixed in this change:
   the lead now says so, and names the browser form as the no-install
   way in.
3. **Restore the browser form as the front door in the README's
   ordering** (quickstart before desktop build instructions), without
   touching GitHub Pages settings, which are the owner's to enable.
4. **Say the quiet part in the README**: a short comparison of what
   Acro does that the toy browser mixers do not (real PFL cueing,
   fractional-BPM grids, EBU R128 auto-gain, lossless WAV takes), so a
   first-time visitor sees the class difference in ten seconds.
5. **Ten-seconds-to-sound path**: keep the built-in demo tracks one
   click from first open (already true via the quickstart bar) and
   state it in the first screenful of the README.

## What was implemented with this document

Opportunity 2 only: the README lead paragraph now matches reality
(desktop app is canonical but source-built, no prebuilt downloads yet;
the same file runs in a browser with no install). Everything else above
is recorded with its reasoning, deliberately unbuilt.
