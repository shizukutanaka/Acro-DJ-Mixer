# ADR-0350: Dynamic titles stay live — no frozen aria-label snapshots

## Context
ADR-0236 mirrored every titled control's `title` into `aria-label` once at
boot so icon-only buttons announce a verb. The affordance audit found two
classes of drift from that one-time copy:

1. **Stale names on live controls.** Pads, the Reloop/Cue buttons, and
   keylock have titles that mutate at runtime (cue time, slot contents,
   loaded sample name, refusal feedback). A boot-time `aria-label`
   snapshot *overrides* the `title` in the accessible-name computation —
   so the snapshot is strictly worse than nothing: the label freezes
   while the title keeps updating.
2. **Missing gestures in documented titles.** `Rec` named the
   shift-pause but not `alt = lossless WAV` (ADR-0213); the JS-built
   hot-cue pad titles never named `alt-hold` slice audition (the markup
   already did); the help overlay's `alt` row predates several alt
   gestures.

## Decision
- The boot copy now skips elements whose titles are dynamic
  (`.pad`, `.smp`, `[data-act=reloop/cue/keylock]`) — `title` is the
  accessible-name fallback, so those controls announce the *live* title.
- `Rec` title names the alt+WAV take; set/empty pad titles name the
  alt-hold slice audition; the help `alt` row adds slice audition and
  WAV recording.
- Set-pad title phrasing aligned to the markup's `alt-hold` grammar.

## Consequences
Every titled control announces a current name — static via the snapshot,
dynamic via the live title — and every undocumented gesture users could
not discover from the surface is now discoverable.
