# Product Audit v2 — Acro DJ Mixer (2026-10)
Supersedes the v1 audit (PR #210). Method: first-principles
("what must be true for a DJ in 2026 to trust this on a floor?")
+ Socratic cross-examination of every claim against the code.

## 長所 (Strengths) — 50

### Signal path & sound
1. Full hardware-style chain: trim→mid/side→EQ→filter→gate→crusher→fader→xfader→master→limiter.
2. AudioWorklet playback engine with a graceful buffer fallback.
3. WSOLA time-stretch + pitch shift in the worklet — key-lock and transpose without resampling.
4. EBU R128 gated auto-gain (K-weighting + absolute/relative gates), attenuation only.
5. Master limiter + live GR readout — clipping is engineered out, not hoped out.
6. Momentary mono fold-down before the limiter for booth checks.
7. Isolator-style 3-band EQ (−26 dB floor) with letter-key kills.
8. Color filter knob LP↔HP, per deck.
9. Beat-synced FX bank (echo/flanger/gate/noise/crush/reverb/ping) sharing one send knob.
10. Pre/post send tap — echo-out tails survive fader cuts.
11. Mid/side stem split (Vocal/Inst) — zero-dep stem-ish mixing.
12. Mic channel with HPF, 2-band EQ, noise gate, talkover duck, PTT momentary.
13. Sampler: 4 single-voice pads, gate/loop/pitch/per-pad level, velocity, choke.
14. Pad resampling of an armed loop straight off a deck.
15. Split cue (PFL left / PGM right) + cue-mix blend knob + cue-bus meter + device pick via setSinkId.

### Beat intelligence
16. Onset-based BPM detection with fractional interpolation + octave-safe UI.
17. Tap tempo entry with phase.
18. Beat grid with nudge, beat-shift, downbeat accents, quantized cues/loops.
19. Phase meter with live sub-frame delta + click-to-sync.
20. Sync grammar: tempo+phase / phase-only / leader-follow / tempo-only.
21. Quantize toggle governs cue, loop-in/out, and cue-point writes uniformly.
22. Beat/bar counter, beat lamp, jump-to-next-bar, beat jump ±1/±4.
23. Auto-mix: bar-aligned fire point, filter sweep, bass swap, echo-out, countdown display.
24. Alt+Auto fires the transition immediately through the same path.
25. Auto-mix skips already-played tracks and says *why* it picked the next one.
26. Emergency last-4-beats loop on gridded tracks.

### Prep & persistence
27. IndexedDB library with soft-delete, dedupe, version stamps.
28. Per-track persistence: cues, cueIn, loop, loop memory ×2, grid, key, stem, hash.
29. Export/import of all analysis + prep as JSON — portable between machines.
30. Session persistence restores the whole mixer surface across reloads.
31. Cue output device survives reloads (origin-stable deviceIds).
32. Setlist logs every played track, exportable, persisted in localStorage.
33. Track identity moving to content hash, killing name-collision misfires.
34. Library preview on the cue bus starting at cueIn, normalized by the deck's own gated gain.
35. Play counts + dimmed played rows + prep badges (⚑n, ∞, ×N).
36. Row ↔ deck on-load highlight (A/B letters).

### Interaction grammar
37. Consistent momentary grammar across 9+ controls (tap=latch, hold=momentary).
38. armConfirm shared two-click guard on every destructive mid-set action.
39. Double-click reset on every continuous control; wheel nudge everywhere.
40. Modifier keys carry consistent semantics (shift=alternate, alt=deep/expert, right-click=preview/tempo-only).
41. Load guard: playing decks can't be silently replaced (click, drop, steppers, auto-mix share it).
42. Waveform: peaks render, zoom, drag-scrub, pitch-jog, cue/loop/marker dragging, mini overview.
43. Keyboard map covers transport, pads, sync, loop, masters.
44. Web MIDI: pads, transport, tempo/filter/gain/fader CCs, pitch-bend wheel, velocity.
45. Honest status lines — failures surface text instead of dying quietly.

### Engineering hygiene
46. 176 ADRs — every behavior carries its "why", discoverable and revisable.
47. Zero runtime dependencies, no build step — one file opens anywhere.
48. Committed smoke gate (tests/smoke.mjs) makes the core contract re-verifiable.
49. The audit itself exists — the project self-examines instead of accruing blind spots.
50. Velocity of iteration: 230+ rounds of small reversible increments with working verification each time.

## 短所 (Weaknesses) — 50

### Structure
1. 3669-line single file — every edit risks touching everything; no seams for tests.
2. No modular boundary between audio engine, deck state, DOM, and persistence.
3. tests/smoke.mjs exists only in an unmerged PR — main still has zero committed gates.
4. ~45 open unmerged PRs — main diverges far behind the reviewed surface; merge-order stacks (#218→#219/#220) must land in sequence.
5. Duplicate gestural logic scattered (modifiers re-derived per handler; no single gesture interpreter).
6. Global mutable singletons (deckA/deckB/smpSlots/ctx) make every feature implicitly coupled.
7. ADRs document intent but nothing enforces behavior — docs drift from code silently.
8. No lint/format/type gate — a syntax slip is found by the browser, not a tool.
9. Two audio engines (worklet vs buffer fallback) diverge in capability but share one API surface — subtle behavioral deltas are untested.
10. Inline styles + class toggles mix state into DOM — no single source of truth for "on".

### Correctness risks
11. `pos()`/worklet seek interplay re-derived in several places — edge cases when looping + slipping + seeking simultaneously.
12. Library dedupe still partially name+size in legacy records — hash migration unfinished (PR open).
13. IndexedDB has no schema version — record shape changes rely on tolerant reads.
14. Soft-deleted pad records accumulate audio blobs (no vacuum/GC of deleted blob payloads).
15. localStorage writes are fire-and-forget — quota errors degrade silently.
16. Session restore replays synthetic events — a handler added without the replay contract is silently skipped.
17. Several `catch (_)` remain on secondary paths — the loud-fail doctrine is not exhaustive.
18. No error path for decode of huge files — multi-hundred-MB WAVs can exhaust memory with no guard.
19. `setTargetAtTime` races when a control is hammered (cancelScheduledValues coverage varies by control).
20. Timers (`setTimeout`-driven _mom/_arm) aren't cancelled on deck eject/load — latent edge bugs.

### Missing features (vs. a 2026 floor expectation)
21. No real stem separation — mid/side matrix only works on centre-heavy mixes; no spectral/ML option.
22. No recording time-stamp splitting or multi-format export beyond wav/webm.
23. No streaming input — local files only; a browser DJ in 2026 still can't pull a URL/track link.
24. No visual key/Camelot wheel — harmonic fit is row-highlight only.
25. No per-pad choke groups — single-voice only (fine for 4 pads, limiting if expanded).
26. No deck C/D or routing beyond 2 channels + sends.
27. No undo beyond single-level cue-clear restore.
28. No macro/FX presets — FX state persists per session but can't be saved/recalled by name.
29. No touch-optimized surface — pointer events work, but the layout is mouse-first at small sizes.
30. No accessibility pass — buttons rely on title attributes; no ARIA, no focus model, screen readers get little.

### Performance & scale
31. Peaks/waveform recompute is O(track) at load and O(zoom) per wheel tick — long sets stutter on redraw.
32. `renderLibrary` rebuilds all rows' HTML on every tag write — O(library) DOM churn per cue save.
33. monoResample runs full-length on every load even when analysis is cached (gain re-derive could reuse).
34. Analyser taps run rAF unthrottled — meters + wave + lamps all repaint every frame.
35. Float32 pad records double memory at save time (planar copy before Blob).
36. No virtualized library rows — thousands of tracks degrade linearly.
37. decodeAudioData holds the full float copy per deck — 2 decks + 4 pads + preview can pin GBs.
38. `Library.all()` fetches every record incl. blobs wherever only metadata is needed.
39. localStorage setlog/session blobs serialize entire objects per write — O(state) per keypress-debounce.
40. No worker offload for analysis — BPM/key compute on the main thread blocks input on big tracks.

### Process & product
41. One maintainer, one branch cadence — PR backlog means "shipped" and "written" diverge by dozens of features.
42. Feature surface is now wider than the README gesture legend can honestly compress.
43. No usage telemetry (even local counters) — which of 200 gestures are actually used is unknown.
44. Help/discoverability is title-attribute-driven — a new user cannot learn the modifier grammar in-app.
45. No onboarding state — first-run shows an empty mixer with no guided first track.
46. ADR numbering races across parallel sessions (gaps/renumber risk noted before).
47. Screenshot/visual regression is manual — CSS changes to the dense layout ship unverified visually.
48. Non-Chrome support is partial (setSinkId absent → cue bus degrades silently on Firefox/Safari).
49. No automated checks on PRs (no CI) — the smoke gate isn't wired to run per-PR.
50. "AI" in the product's mission remains implicit — auto-pick + analysis exist, but no model/ML path or learning from the user's own sets is articulated.

## Socratic reframes (assumptions worth re-questioning)
- "Features = completeness." → The product now solves breadth; the open-PR pileup says depth-of-landing is the real bottleneck.
- "Single file = simplicity." → True at 800 lines; at 3669 it's indirection-free but seam-free — the test gate exists because the file can't be trusted by reading.
- "More modifiers = more power." → The grammar is consistent but invisible; discoverability is now the binding constraint on power users.
- "AI-era = automation." → The strongest current claim is *explainable* automation (pick reasons); the weakest is that nothing learns from the DJ's own history.
- "Zero deps = principled." → Holds for runtime; the test tooling is already a sanctioned exception — extend the exception to a lint/type check, not to app deps.

## 改善優先度 (prioritized)
- P0 (broken/structural): land the ~45-PR backlog (in stack order), commit the smoke gate to main (PR #221), wire it to PR checks, finish hash migration (#215).
- P1 (core gaps): real stem separation path (spectral subtraction or bundled ONNX-style model — biggest mission gap), first-run onboarding (drop-anywhere → auto-analyze → guided cue), gesture legend overlay (? key), blob GC for soft-deleted records, analysis in a Worker.
- P2 (quality): FX macro presets, Camelot wheel readout, undo ring (cue/loop/grid ops), ARIA + focus model, per-PR CI on the smoke gate.
- P3 (polish): visual diff checks on layout, telemetry-lite local counters, deck C, choke groups, split recordings.
