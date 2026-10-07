# ADR-0333: One audition at a time on the cue bus

## Context

Three independent preview voices share the headphone cue bus:

- `previewSrc` — the library row ▶ audition (ADR-0080)
- `padPrev` — a deck's hot-cue right-click audition (ADR-0161)
- `smpPrev` — a sampler pad's right-click audition (ADR-0147)

Each kill was scoped to its own handle: the library preview stopped only
`previewSrc`, a new hot-cue audition stopped only this deck's `padPrev`
(ADR-0266's owner doctrine), and a sampler preview stopped only `smpPrev`.
Starting one audition never touched the other two, so up to three
sources could layer onto the same phones channel.

Worse, the handle itself could be lost. Auditioning deck A's hot cue
then right-clicking a pad on deck B called `killPadPrev(B)`, which
refuses to touch A's voice — the new source then overwrote
`padPrev`/`padPrevOwner`, leaving A's source playing the rest of the
track with no live reference: unstoppable, undisconnected, invisible.

## Decision

`killAllPreviews()` stops all three voices and bumps `previewToken` so a
library preview whose decode is still in flight aborts too. Every
audition-start path calls it before creating its source:

- hot-cue pad contextmenu (replacing the owner-scoped kill — the owner
  check stays on `killPadPrev` for load/eject/play teardown)
- sampler pad contextmenu
- `previewTrack`

Adjacent fix: the second-click-stop check now requires `padPrev` to be
non-null, so a right-click after an audition's natural end starts a new
audition instead of being swallowed as a "stop".

## Consequences

- No overlapping auditions and no orphaned voices; whatever the DJ last
  asked to check is the only thing in the phones.
- The owner doctrine is preserved for lifecycle teardown: loading or
  ejecting deck A still kills only A's audition.
- Firing a pad (a PGM event, not a phones check) still doesn't touch
  running previews.
