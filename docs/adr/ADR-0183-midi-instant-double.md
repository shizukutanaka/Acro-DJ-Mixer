# ADR-0183: MIDI notes 40/41 run instant doubles

## Context
The MIDI map covered pads, sampler, transport, kills, FX and the
fader CCs, but instant doubles — the ×2 clone that sets up
spinbacks and switch tricks — was mouse-only.

## Decision
Note 40 clones deck A into B, note 41 clones B into A, via the same
`instantDouble()` the ×2 button calls. No note-off action: the clone
is a one-shot verb like Cue. Notes 40–43 sit between the sampler
block (36–39) and the transport block (44+), mirroring a typical
controller's "load to deck" row.

## Consequences
- A pad layer switch on common controllers reaches the doubles
  gesture; the whole "play it, clone it, cut it" pattern is
  hardware-only now.
- No new code path — the method is already shared with the button.
