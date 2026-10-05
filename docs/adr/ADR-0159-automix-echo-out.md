# ADR-0159: Auto-mix echo-out

## Context
Auto-mix fades ended flat — the outgoing deck's fader closed and it
just stopped. The classic send-off is an echo-out: lift the delay
send in the fade's last beats so the tail rings past the fader.

## Decision
Inside the fade's final 2 beats, `f.from.delayWet` rises to 0.5
(fxSel-independent — the delay line always exists; the fade borrows
its send). On completion or cancel, `setEcho` restores the wet
paths to knob truth. The fade object now carries its beat length.

## Bug found and fixed in passing
`delayWet.gain` initialized to the raw knob at chain build — with
fxSel ≠ echo or FX off, echo leaked into the mix on every track
load (surfaced via ADR-0158 restoring a non-echo selection with a
non-zero knob). Now parked at 0 and normalized by `setEcho` at the
end of the build.

## Consequences
- Auto-mix transitions end with a ringing tail instead of a cut —
  the same move a human DJ makes, automatic.
- Wet paths are always setEcho-normalized at build; no FX can leak
  at load time again.
