# ADR-0139: Master loudness readout — momentary LU next to GR

## Context
Auto-gain already K-weights every loaded track (ADR-0024), and the
limiter shows gain reduction — but the one number a broadcaster
actually watches, *how loud is the program right now*, had no meter.
Streaming targets (−14 LUFS Spotify/YouTube, −16 podcast) are
meaningless without a live readout.

## Decision
A `LU` readout beside the limiter's GR text: the same 38 Hz HPF +
4 dB high-shelf K-weighting as `kWeight()`, but run live on the
post-limiter analyser tap as two persistent biquads at the real
sample rate. Each render tick K-filters the 256-sample float block,
adds its mean-square energy to a 24-tick (~400 ms) ring — the R128
momentary window — and displays `−0.691 + 10·log10(ms)`, the LUFS
definition minus channel weights (mono program → weight 1).

## Consequences
- The number tracks the limiter output, so GR clamping is visible in
  loudness terms: push into the limiter and LU saturates while GR
  grows — the two readouts tell the same story from both sides.
- Empty readout on silence (below the measurement floor).
- ~30 lines, no extra nodes — reuses the existing analyser tap and
  the offline filter math already proven by auto-gain.
