# ADR-0152: Sampler pitch knob

## Context
Pads played every shot at unity rate — a resampled loop or a jingle
couldn't be tuned to the mix. A one-shot at the wrong key or tempo
sits wrong no matter how well it's choked.

## Decision
A `0.5–2×` slider on the Smpl row sets `src.playbackRate` at fire
time — read once when the voice is created, like the Loop flag, so
mid-ring wiggles never retune a playing pad. Double-click resets to
unity; the delegated wheel handler gives fine steps for free.

## Consequences
- Pads are tunable: pitch a resampled loop to sit on the key of the
  mix, or slow a stab into a fill — creative rate play on top of
  gate, choke, and loop.
- Fire-time read keeps each voice's rate honest to what you heard
  at launch; no live-coupled wobble unless you retrigger.
