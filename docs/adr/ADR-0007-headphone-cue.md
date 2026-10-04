# ADR-0007: Headphone Cue via a MediaStream Cue Bus

## Status
Accepted

## Context

A mixer without pre-fader listen can't actually be DJed with — you cannot
beat-match or preview the next track before the audience hears it. This
is the last P1 mixer control. The browser constraint: one `AudioContext`
renders to exactly one output device, and `AudioContext.setSinkId` can
only retarget the *whole* context — so master and cue can't share a
context when they need different devices.

Options:

1. **`MediaStreamAudioDestinationNode` → hidden `<audio>` →
   `HTMLMediaElement.setSinkId`** — a Web Audio node hands PCM to a media
   element, which *does* support per-element sink selection
   (Chrome/Edge). One extra element, no second context, works on both
   engines.
2. **Second `AudioContext` with `setSinkId`** — duplicates the graph or
   needs a `MediaStreamSource` bridge; heavier and adds resample drift.
3. **`AudioContext.setSinkId` on the main context** — moves *all* output,
   defeating the purpose.

## Decision

Option 1:

- `cueBus()` lazily creates `MediaStreamAudioDestinationNode` + a hidden
  `<audio srcObject>` playing that stream; `setSinkId(id)` applies the
  selected device.
- Each deck gets a **pre-fader tap**: `cueSend` gain node connected from
  the engine output (both worklet node and BufferSource) → `cueBus()`.
  The `Phones` button toggles `cueSend.gain` 0↔1; master routing is
  untouched (cue adds, doesn't solo — standard PFL behavior).
- A `Cue out` `<select>` in the mixer lists `audiooutput` devices via
  `enumerateDevices`, refreshed on `devicechange`. Without a mic-permission
  grant, labels are blank → shown as "Output N"; device ids still work.
- All APIs guard-degraded: no `setSinkId` (Firefox/Safari) → the send
  still sums onto the default output; `mediaDevices` absent (some
  `file://` contexts) → select stays on "System output".

## Consequences

- Cue latency is the MediaStream pipeline (≈ tens of ms) — fine for
  previewing; the cue bus intentionally carries no metering this round.
- Pre-fader means EQ/fader moves don't reach the cue ear — matches
  hardware PFL, where the engineer hears the raw channel.
- Arming Phones before a track loads is supported (gain applied when the
  graph is built).

## Rejected alternatives

- Second AudioContext per cue: duplicated node graph + drift.
- Ask for mic permission to get device labels: unjustified permission
  prompt for a DJ app; unnamed devices are acceptable.
