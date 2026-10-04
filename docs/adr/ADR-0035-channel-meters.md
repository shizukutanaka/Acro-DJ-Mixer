# ADR-0035: Per-Deck Channel Meters

## Status
Accepted

## Context

The mixer had a master meter (post-limiter) and a cue-bus meter, but
no per-deck level indication. Gain staging — the whole point of
auto-gain (ADR-0019/0034) — is invisible without channel meters: the
DJ cannot see whether a deck is loud *before* the crossfader opens.

## Decision

- Each deck gets a 6 px meter under its waveform, fed by an
  `AnalyserNode` tapped **post-EQ/filter, pre-crossfader** — the
  channel-strip position on a hardware mixer, so it reflects the
  deck's own level regardless of the fader.
- Peak of the byte time-domain data, same cheap measurement as the
  existing master/cue meters; idle decks show an empty bar.

## Consequences

- The auto-gain result is now observable (a normalized deck sits near
  the same strip level as its partner), and EQ/filter moves are
  visible pre-fader.
- One extra `fftSize=512` analyser per deck — negligible cost.

## Rejected alternatives

- Post-fader tap: then a muted (crossfaded-out) deck reads zero and
  the meter can't serve its gain-staging purpose.
- RMS instead of peak: peak matches the existing meters' convention
  and the limiter's behavior.
