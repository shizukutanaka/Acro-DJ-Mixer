# ADR-0202: Resampled loops get auto-gain too

## Context
ADR-0197 normalized pads loaded through the file picker, but the
shift+empty-pad path — resampling an armed deck loop straight into
a slot — kept `gain: 1`. The pad row ended up half-normalized: file
shots evened out, resampled loops at raw deck level.

## Decision
The resample path runs `smpAutoGain(nb)` on the copied loop buffer
and writes the result into `slot.gain` asynchronously (guarded by a
buffer-identity check so a re-sample in the meantime isn't
clobbered). One normalization rule, every load path.

## Consequences
- A pad row holds comparable loudness regardless of how the slot
  was filled — file, drop, or resample.
- The async write only lands if the slot still holds that buffer,
  so re-sampling before the scan finishes can't produce a stale
  gain on new audio.
