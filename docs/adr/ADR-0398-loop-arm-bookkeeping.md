# ADR-0398: Whoever arms loopOn owns all three slip fields — and the clock only runs while playing

## Status

Accepted (2026-10-04, round 399)

## Context

ADR-0390 folded slip dead-reckoning into a parked clock: `stopPlayback()`
folds elapsed into the anchor and parks `t = null`, `play()` re-arms it.
That fix covered clocks that already existed — but the loop-arm sites
each stamp their own bookkeeping, and three drift classes survived the
fold/unfold design:

1. **Clock stamped on a stopped deck.** `toggleLoop` (both arms),
   `reloop`, and the emergency loop all did `_loopT = ctx.currentTime`
   unconditionally. Arm a loop while stopped, wait, press Play, exit
   with Slip on: `_unfoldReckon` sees `_loopT` already non-null and
   does not re-stamp, so the stopped gap between arm and play is
   counted as slip time — the exit teleports **forward** by exactly
   the stopped duration. The ghost playhead likewise crawls across a
   stopped deck's waveform in real time.

2. **Missing `_loopEnterRate`.** `reloop` and the emergency loop never
   stamped the entry-time effective rate. A stale value from a
   previous arm (e.g. 1.3 left by a bent loop) persisted into the next
   exit's `_loopEnterRate || this.rate`, or `|| this.rate` discarded a
   live bend/spin multiplier — ADR-0384's class, again.

3. **No anchor at all.** The `stopRoll` saved-loop restore re-armed
   `loopOn` with `_loopT`/`_loopEnterRate` explicitly nulled by
   `startRoll` and `_loopEnterPos` still holding the previous arm's
   position — a pause→play→slip-exit reckoned from a stale anchor.
   The `_savedLoop` restore inside `load()` armed `loopOn` with all
   three fields reset to zero-ish: playing then slip-exiting reckoned
   `0 + elapsed`, teleporting the deck back to the track start when
   playback had begun at a non-zero cue point.

Every `loopOn = true` writer was expected to keep the same three-field
bookkeeping contract, and six of them each kept a different fraction
of it. That is the recurrence signature the whole ADR-0377…0397 run
has been fixing: a contract kept by convention at N sites drifts.

## Decision

One shared writer, `_armLoopSlip()`, called by every site that turns
`loopOn` on:

```js
_armLoopSlip() {
  this._loopEnterPos = this.pos();
  this._loopEnterRate = this.rate * this.bendMul * this.spinMul;
  this._loopT = this.playing ? ctx.currentTime : null;   // unfold re-arms if stopped
}
```

The clock gate is the point: `_loopT` is a *playback* clock, so it is
stamped only while `playing`. A stopped arm leaves it null and
`_unfoldReckon` stamps it at the next `play()` — the same
park-and-resume semantics ADR-0390 gave held slips.

Sites now sharing the path:

- `toggleLoop` free-size OUT arm and normal/loop-back arm
- `reloop` (gains `_loopEnterRate` for the first time)
- `stopRoll` saved-loop restore — stamped after the slip seek so the
  anchor is the landing point, not a stale arm (gains `_loopEnterPos`
  and `_loopEnterRate` for the first time)
- `load()` `_savedLoop` restore (gains all three for the first time)
- the emergency loop (gains `_loopEnterRate` for the first time)

`startRoll` still nulls `_loopT`/`_loopEnterRate` — a roll owns its
own bookkeeping (`_roll`), and the restore path above re-stamps on
release.

## Consequences

- Stopped-deck loop arms can no longer smuggle stopped time into the
  slip exit — the ADR-0390 gap class is closed at the arm, not just at
  pause.
- Every arm records the entry-time effective rate; a stale or missing
  `_loopEnterRate` can no longer skew the exit landing or ghost
  marker.
- Restored loops (roll release, library loop) anchor where playback
  actually resumes from, matching the fresh-arm contract.
- Remaining approximation (unchanged from ADR-0384): multipliers
  changing *during* an armed loop still drift `elapsed * Δmul`.

## Verification

`~/smokeapp/t_armbook.mjs`: stopped arm leaves `_loopT` null with
anchor + rate stamped; arm→wait 1.1 s→play 0.4 s→exit lands at 10.40 s
(the stopped gap excluded; pre-fix ≈ 11.5); stopped reloop stamps
`rate × bendMul` and null clock; playing arm + mid-arm pause folds and
unfolds (10.40 s landing); `stopRoll` restore anchors at the slip
landing; `_savedLoop` meta restore arms all three fields. `tests/smoke.mjs`
passes; zero page errors.
