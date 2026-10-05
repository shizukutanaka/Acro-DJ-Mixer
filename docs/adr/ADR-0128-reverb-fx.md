# ADR-0128: Reverb FX — generated-IR convolver send

## Status
Accepted (2026-10-04)

## Context
Five FX shipped — echo, flanger, trans gate, noise riser, crush —
but the workhorse that glues a transition (space/reverb wash) was
the last DJM staple still missing.

## Decision
`rev` joins `fxSel` as the sixth option: `filter` →
`ConvolverNode` → `verbWet` → `xfGain`, a wet send on the same
pattern as the echo path. The impulse response is generated in
code — 1.5 s of stereo exponentially-decaying noise
(`(1−t)^2.2`), no external IR file needed. The knob sets wet
level (v·0.8); tails keep ringing after re-park because the
convolver lives on the send, not the dry path.

## Consequences
- Transition glue and ambient wash on one knob.
- Zero assets — the IR is ~20 lines of noise, mono-fold and
  limiter handle the rest.
