# Acro DJ Mixer

DJ software for the AI era — a minimal, dependency-free two-deck mixer that runs
entirely in your browser. Audio files stay local; nothing is uploaded.

Scope and rationale are defined in [docs/adr/ADR-0001](docs/adr/ADR-0001-first-principles-scope.md):
first-principles analysis says the atomic unit of DJing is two sources, tempo,
gain, a crossfader, and cueing — so that is exactly what ships first, with
AI-era automation (beat-grid, stems, harmonic mixing, recommendations) layered
on top one capability at a time.

## Quickstart

No build step, no install:

```sh
# option 1: just open it
open index.html            # macOS
# or double-click index.html in a file browser

# option 2: serve it
python3 -m http.server 8000
# then open http://localhost:8000
```

Option 1 (`file://`) plays fine, but browsers block `AudioWorklet` module
loads on an opaque origin — so key lock is unavailable and decks fall back
to classic varispeed tempo. Use option 2 for the full feature set.

## Features

- **Two decks** — load audio by click or drag & drop (MP3/WAV/OGG/FLAC/M4A,
  whatever the browser's `decodeAudioData` supports).
- **Transport** — play/pause, cue-to-start, click waveform to seek.
- **Tempo** — ±16% playback-rate slider per deck.
- **Key lock** — preserve pitch while tempo changes (WSOLA time-stretching
  in an `AudioWorklet`, see ADR-0003). Requires http(s); on `file://` the
  button is disabled and tempo stays varispeed.
- **Gain** — per-deck channel fader.
- **3-band EQ** — High/Mid/Low per deck (shelf 250 Hz / peak 1 kHz /
  shelf 4 kHz, ±26 dB isolator-style travel, double-click resets).
  See ADR-0005.
- **Crossfader** — equal-power law for constant loudness through the middle.
- **Waveform overview** with playhead per deck.
- **Auto BPM estimate + beat grid** — energy-flux autocorrelation, 60–180 BPM,
  no dependencies; grid ticks drawn on the waveform (see ADR-0001 / ADR-0002).
  `beatOff` is refined to ~ms precision by an energy-rise search around
  each comb line (see ADR-0025); `bpm` is fractional internally via
  sub-lag parabolic interpolation — integer lag error (~0.5%) used to
  drift the grid ~2 beats over a 4-min track (see ADR-0027). `Tap` sets
  tempo + phase by hand for tracks the detector can't read (see ADR-0029);
  `‹`/`›` nudge the grid phase ±10 ms to trim ticks onto transients
  (see ADR-0030).y detection** — chromagram + Krumhansl–Schmuckler profiles → Camelot
  code shown next to BPM; green = mixes harmonically with the other deck,
  amber = clash (see ADR-0004).
- **Sync** — one click matches a deck's tempo and beat phase to the other deck
  (tempo limited to the ±16% slider range, like hardware).
- **Loop** — one click captures a beat-grid-quantized 4-beat (one bar)
  loop on either engine; the region highlights on the waveform and
  seeking outside it exits the loop (see ADR-0006); `½`/`2×` halve or
  double the armed loop in place (see ADR-0009).
- **Hot cues** — four pads per deck: click records a marker (amber tick
  on the waveform), click jumps, right-click clears; persisted per track
  in the library (see ADR-0010). Recording snaps to the nearest beat
  when a grid exists — hardware QUANTIZE (see ADR-0021).
  `−1b`/`+1b` beside them beat-jump one
  beat of the grid (see ADR-0012).
- **Headphone cue (PFL)** — `Phones` button taps each deck pre-fader onto
  a cue bus; `Cue out` picks the output device (`setSinkId`, Chrome/Edge).
  See ADR-0007. A thin level meter under the selector shows what the
  phones are hearing (see ADR-0022). A `Δ ±x% beat` readout below it
  shows the live beat-phase offset between decks — green when locked
  (see ADR-0023).
- **Library** — every loaded track is auto-saved to IndexedDB (audio +
  BPM/key analysis, soft-deletable); `→A`/`→B` reloads instantly with
  cached analysis, survives page reloads. Rows highlight green when the
  track fits a loaded deck (tempo within ±16% sync range + harmonic key)
  — see ADR-0008/0011. Filter box narrows rows by name as you type
  (see ADR-0032).
- **Crossfader curve** — `Smooth` (equal-power, default) or `Cut`
  (each side reaches full within 10% of travel for scratch chops; both
  full in the middle), selected next to the fader (see ADR-0036).
- **Loop persistence** — an armed loop is saved to the library record
  and re-armed on reload, like hot cues (see ADR-0038).
- **Loop roll** — hold `Roll` to loop the current beat, release to
  resume where the track would have been (slip); an armed loop is
  restored on release (see ADR-0037).
- **Instant doubles** — `×2` clones the deck into the partner at the
  same position and tempo, playing if it was playing (see ADR-0039).
- **Vinyl brake** — `Brake` toggle makes pause spin down and play
  spin up like a turntable; off = instant stop (see ADR-0040).
- **Beat echo** — `Echo` slider adds a 3/4-beat feedback delay that
  follows the deck's grid and tempo slider; double-click resets to
  dry (see ADR-0041).
- **Transpose** — `−`/`+` beside the key readout shifts the deck's key
  ±6 semitones while tempo holds (WSOLA pitch shift; needs key lock /
  http) — fixes an almost-compatible harmonic mix (see ADR-0042).
- **Waveform zoom** — scroll over a waveform to zoom ×1.5–32 around
  the playhead; the window follows playback, click still seeks inside
  the visible slice (see ADR-0043).
- **Auto-cue** — loading a track skips lead-in silence: the playhead
  starts at the first sample over −50 dBFS and `Cue` returns there
  (see ADR-0044).
- **Track-end warning** — the time readout flashes red during the
  last 30 s of a track, CDJ-style (see ADR-0045).
- **Key sync** — `Key` button transposes the deck to the smallest
  shift that mixes harmonically with the other deck; the key readout
  colours by the effective (transposed) key (see ADR-0046).
- **Elapsed / remaining** — click the time readout to flip between
  `pos / dur` and `-remaining / dur`, CDJ TIME-mode style (see
  ADR-0047).
- **Bar downbeats** — every 4th beat-grid tick on the waveform draws
  brighter and wider, so bar boundaries (where phrases and loops live)
  read at a glance (see ADR-0048).
- **Crossfader reverse** — `Rev` beside the curve select mirrors the
  fader's A/B assignment (hamster switch for scratching; works with
  both curves and auto mix) (see ADR-0049).
- **Loop move** — `◂`/`▸` beside the loop length buttons slide the
  armed loop by its own length (CDJ LOOP MOVE), persisted like the
  bounds (see ADR-0050).
- **Cue mix** — `Cue mix` slider blends the master output into the
  headphone bus alongside pre-fader cue, like a monitor knob
  (see ADR-0051).
- **Bar.beat counter** — the readout beside BPM shows where on the
  grid the playhead sits (`9.3` = bar 9, beat 3), matching the bar
  ticks on the waveform (see ADR-0052).
- **Bar jump** — `Shift` + `−1b`/`+1b` jumps a whole bar (4 beats)
  instead of one beat, for phrase-sized moves (see ADR-0053).
- **Mono check** — `Mono` under `Cue mix` folds the master to one
  channel (pre-limiter) to audition mono compatibility
  (see ADR-0054).
- **Quantize toggle** — `Qtz` beside `Rev` switches beat-grid snapping
  for hot cues and loop in-points on/off (on by default)
  (see ADR-0055).
- **Decimal BPM** — the readout shows the fractional estimate
  (`120.2`), so matched decks are visibly matched (see ADR-0056).
- **Manual loop** — tracks with no detected grid can still loop:
  `Loop` arms a 4-second free loop from the press point, and halve /
  double / move all work (see ADR-0057).
- **Free-size loop** — `Shift` + `Loop` marks the IN point, a second
  press marks OUT: any-length loops (button blinks while armed)
  (see ADR-0058).
- **Reloop** — `↺` beside `Loop` re-enters the last exited loop with
  its exact bounds; seeking out of a loop is also reloop-able
  (see ADR-0059).
- **Slip cues** — `Slip` makes pad presses momentary: hold to play the
  cue, release to snap back to where the track would have been
  (see ADR-0060).
- **Next-bar jump** — `▸bar` on the hot-cue row lands the playhead on
  the next bar downbeat, so drops hit "the one" (see ADR-0061).
- **Tempo reset** — double-click the tempo slider for an exact ±0.0%,
  like the hardware TEMPO RESET (see ADR-0062).
- **Cue preview** — hold `Cue` while stopped to audition from the cue
  point; release pauses and snaps back (see ADR-0063).
- **Split cue** — `Split` on the Phones row pans headphone cue to the
  left ear and master PGM to the right for one-ear monitoring
  (see ADR-0064).
- **Beat lamp** — the dot beside the bar counter pulses each beat and
  flashes deck-accent on the downbeat (see ADR-0065).
- **Fader resets** — double-click Gain (unity), the crossfader
  (centre), or Master (90%) to snap back to default (see ADR-0066).
- **Mic input** — `Mic` button sums a `getUserMedia` microphone into
  the master before the limiter, so it is recorded too (see ADR-0067).
- **Fader start** — pushing the crossfader fully into a stopped deck's
  side starts it (see ADR-0068).
- **Tempo range** — `±8 / ±16 / ±50` select per deck trades slider
  resolution for reach, CDJ-style (see ADR-0069).
- **Cue colors** — each hot-cue pad owns a color, mirrored by its
  waveform marker (see ADR-0070).
- **Prep badges** — library rows show `⚑N` saved cues and `∞` for a
  stored loop (see ADR-0071).
- **Library export/import** — `⤓` downloads BPM, key, cues and loops
  as JSON; `⤒` merges them onto tracks matched by name+size
  (see ADR-0072).
- **Auto mix** — `Auto` button: at 16 beats before the playing deck
  ends, the other deck starts on its first beat, tempo-synced, and the
  crossfader rides across over 8 beats; one click per transition,
  click again to cancel mid-fade; Shift+Auto arms a long 32-beat
  blend (see ADR-0013, ADR-0073). During the fade the
  outgoing deck is also low-pass swept 20 kHz → ~400 Hz — a
  "filter out" transition, not a flat crossfade (see ADR-0020).
- **Pitch bend** — hold `−`/`+` beside the tempo fader to ride the deck
  ±5 % for manual beat alignment; release restores the fader rate
  (see ADR-0017).
- **Color filter** — one knob: left sweeps a low-pass down to ~200 Hz,
  right sweeps a high-pass up to ~8 kHz, centre is open; live `LP`/`HP`
  readout, double-click resets (see ADR-0016).
- **EQ kills** — the H/M/L letters are buttons: click pins the band at
  −26 dB, click again restores the slider value (see ADR-0015).
- **Set recording** — `Rec` button captures the master output to a
  `.webm` (opus) download via `MediaRecorder` on a MediaStream tap
  (see ADR-0014).
- **Stem split** — per-deck `Full / Vocal / Inst` mid/side matrix:
  `Vocal` keeps the centre channel (acapella extraction), `Inst` keeps
  the sides (vocal-removed). Fixed splitter→matrix→merger topology,
  click-free mode switches, zero dependencies (see ADR-0026).
- **Auto-gain** — each loaded track's K-weighted mono RMS (38 Hz
  high-pass + +4 dB high shelf, approximating BS.1770 perceived
  loudness) is measured from the same downmix as BPM/key analysis and
  the deck gain is set so it lands near −15 dBFS; attenuation only,
  slider shows and can override. Measured with full EBU R128 gating
  (−70 LUFS absolute + −10 LU relative), so silent tails/intros don't
  deflate the value (see ADR-0019/0024/0034).
- **Channel meters** — a thin strip under each waveform shows the
  deck's post-EQ/filter, pre-crossfader peak level, so gain staging is
  visible before the fader opens (see ADR-0035).
- **Master limiter** — a fast `DynamicsCompressor` at the end of the
  chain (threshold −3 dB, ratio 20) keeps two-deck sums and EQ boosts
  from clipping; `GR −x.x dB` shows under the meter while it rides
  peaks (see ADR-0018).
- **Master level meter** and master gain.
- **Keyboard** — `Q`/`P` toggle deck A/B, `←`/`→` move the crossfader,
  `0` centers it; mirrored pad/sync/loop keys: deck A `Z X C V` `E` `R`,
  deck B `B N M ,` `I` `U` (see ADR-0031).

## Architecture

Single file (`index.html`), vanilla JS + Web Audio API:

```
WSOLA worklet (keylock) or BufferSource (fallback)
        ┬─> cueSend ──> cue bus ──> <audio setSinkId> (headphone cue)
        └─> deckGain ──> EQ(low→mid→high) ──> filter ──> xfGain ──> masterGain ──> limiter ──> analyser ──> destination
```

Per deck, instantiated lazily on first play (browser autoplay policy requires a
user gesture before the `AudioContext` starts). The playback engine is chosen
once per deck at first load: `AudioWorklet` when the module can load
(http/https), `AudioBufferSourceNode` otherwise.

## Roadmap (deliberately not built yet)

Ordered by value per the ADR's automation layer:

1. ~~Beat-grid phase alignment + a sync button.~~ Done (ADR-0002).
2. ~~Keylock / master tempo.~~ Done (ADR-0003) — WSOLA in an AudioWorklet.
3. ~~Key detection + harmonic-mixing hints.~~ Done (ADR-0004) — chroma +
   Krumhansl–Schmuckler → Camelot compatibility.
3b. ~~3-band DJ EQ.~~ Done (ADR-0005) — pulled ahead of the library work
   as P1 core mixer functionality.
3c. ~~Beat-grid loop.~~ Done (ADR-0006/0009) — one-bar quantized loop on
   both engines, plus in-place ½/2× length cycling.
3d. ~~Headphone cue.~~ Done (ADR-0007) — pre-fader cue bus via
   MediaStream + `setSinkId`.
4. ~~Track library with persistence.~~ Done (ADR-0008) — IndexedDB,
   `id`/`created_at`/`updated_at`/`deleted_at`/`version` per record.
4b. ~~Hot cues.~~ Done (ADR-0010) — four per deck, persisted in the
   library. Beat-jump added in ADR-0012.
5. ~~Stem separation.~~ Done (ADR-0026) — dependency-free mid/side
   Vocal/Inst split. An ML model remains a possible future upgrade if
   centre-panned extraction isn't enough.
6. ~~Recommendation / auto-mix assistance.~~ Done — harmonic-fit
   highlighting (ADR-0011) + one-click auto transitions (ADR-0013).

## Security

Local files only; no network calls, no telemetry, no secrets. Report
vulnerabilities per [SECURITY.md](SECURITY.md).
