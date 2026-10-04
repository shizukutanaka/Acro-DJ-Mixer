# ADR-0020: Auto-Mix Filter Sweep

## Status
Accepted

## Context

ADR-0016 shipped the color filter and deferred one coupling: riding
the filter during an auto-mix transition. A crossfade alone is a flat
hand-off; DJs "filter out" the leaving track — the LP sweep is half the
transition's musical content.

## Decision

- During the auto-mix fade, `autoMixTick` drives `f.from.filter`
  directly: `lowpass`, `freq = 20000 * 10^(-1.7k)` — 20 kHz → ~400 Hz
  across the 8-beat fade, mirroring the xfader's `k` progress.
- The knob does **not** move — automation rides the node, not the
  user's hand position. On fade completion *or* mid-fade cancel,
  `f.from.setFilter(parseFloat(f.from.filterEl.value))` restores the
  node from the slider.
- `filterOut` shows the live `LP x.xkHz` sweep during the fade so the
  automation is legible, then returns to the knob's readout.

## Consequences

- Auto transitions now sound like a hand transition: crossfade + a
  filter pulling the outgoing track under.
- If the user grabs the filter knob mid-fade, `setFilter` simply
  overrides the sweep — no fight, no hidden state.

## Rejected alternatives

- Moving the slider itself: fights the user's hand and pollutes the
  persisted "hand position" semantics of ADR-0015/0016.
- Sweeping the *incoming* deck (HP-in): a second sweep adds motion for
  little gain; the filter-out is the audible gesture.
