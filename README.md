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
  whatever the browser's `decodeAudioData` supports). Rapid loads
  can't interleave — the last caller wins (see ADR-0261).
- **Transport** — play/pause, cue-to-start, click waveform to seek.
- **Tempo** — ±16% playback-rate slider per deck.
- **Key lock** — preserve pitch while tempo changes (WSOLA time-stretching
  in an `AudioWorklet`, see ADR-0003). Requires http(s); on `file://` the
  button is disabled and tempo stays varispeed.
- **Gain** — per-deck channel trim; `Mut` beside it is a momentary
  channel on/off — hold to silence, playback keeps running underneath
  so release lands on beat (see ADR-0137).
- **3-band EQ** — High/Mid/Low per deck (shelf 250 Hz / peak 1 kHz /
  shelf 4 kHz, ±26 dB isolator-style travel, double-click resets).
  See ADR-0005.
- **Channel fader** — an upfader per deck between the channel
  strip and the crossfader: ride channel level like a real mixer.
  Double-click resets to unity; the channel meter stays pre-fader
  (see ADR-0214).
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
  (see ADR-0030).
- **Key detection** — chromagram + Krumhansl–Schmuckler profiles → Camelot
  code shown next to BPM; green = mixes harmonically with the other deck,
  amber = clash (see ADR-0004). The readout shows the effective key —
  detection plus any transpose — and matching compares both decks'
  effective keys (see ADR-0198).
- **Sync** — one click matches a deck's tempo and beat phase to the other deck
  (tempo limited to the ±16% slider range, like hardware).
- **Loop-back** — `Alt`+Loop traps the last N beats you just
  heard instead of arming forward (see ADR-0218).
- **Loop** — one click captures a beat-grid-quantized 4-beat (one bar)
  loop on either engine; the region highlights on the waveform and
  seeking outside it exits the loop (see ADR-0006); `½`/`2×` halve or
  double the armed loop in place (see ADR-0009). A gridded track
  reaching its last 4 beats while still playing auto-arms a 4-beat
  tail loop — emergency loop, never dead air (see ADR-0195).
- **Hot cues** — eight pads per deck (ADR-0140; keys still fire the first
  four): click records a marker (amber tick
  on the waveform), click jumps, right-click previews the cue on the
  headphone bus (same idiom as library rows and sampler pads),
  shift-click clears; persisted per track
  in the library (see ADR-0010, ADR-0161); each occupied pad's tooltip
  reads its stored time, including cues restored on load (see ADR-0254).
  Recording snaps to the nearest beat
  when a grid exists — hardware QUANTIZE (see ADR-0021).
  `−1b`/`+1b` beside them beat-jump one
  beat of the grid (see ADR-0012).
  Drag a colored tick on the waveform to reposition that cue; Qtz snaps it (ADR-0189).
- **Headphone cue (PFL)** — `Phones` button taps each deck pre-fader onto
  a cue bus; `Shift+Phones` arms it solo, dropping the other deck's
  cue in one click (see ADR-0113); `Cue out` picks the output device (`setSinkId`, Chrome/Edge); the
  pick persists across reloads (see ADR-0227).
  See ADR-0007. A thin level meter under the selector shows what the
  phones are hearing, with a peak-hold tick like the other meters
  (see ADR-0022, ADR-0107). A `Δ ±x% beat` readout below it
  shows the live beat-phase offset between decks — green when locked;
  click the readout to sync the non-playing deck to the playing one
  (ADR-0196)
  (see ADR-0023).
- **Row double-click** — double-clicking a library row loads it
  into whichever deck is free (see ADR-0223).
- **Library** — every loaded track is auto-saved to IndexedDB (audio +
  BPM/key analysis, soft-deletable); `→A`/`→B` reloads instantly with
  cached analysis, survives page reloads. Reloading a *playing* deck
  needs a second confirming click ("sure?") — the load lock
  (see ADR-0104); dropping a file onto a playing deck arms the same
  guard on the dropzone (see ADR-0153). Row `×` delete shares the same two-click confirm
  (see ADR-0105). Rows highlight green when the
  track fits a loaded deck (tempo within ±16% sync range + harmonic key)
  — see ADR-0008/0011. Rows that were never deck-loaded get BPM and
  key filled in the background — one track at a time, only while both
  decks are stopped (see ADR-0243). A coloured `A`/`B` letter marks the row a deck
  currently holds (see ADR-0136). Filter box narrows rows by name as
  you type (see ADR-0032); `Enter` loads the top match into the free
  deck (see ADR-0229).
- **Crossfader curve** — `Smooth` (equal-power, default) or `Cut`
  (each side reaches full within 10% of travel for scratch chops; both
  full in the middle), selected next to the fader (see ADR-0036).
- **Loop persistence** — an armed loop is saved to the library record
  and re-armed on reload, like hot cues (see ADR-0038).
- **Loop roll** — hold `Roll` to loop the current beat, release to
  resume where the track would have been (slip); an armed loop is
  restored on release (see ADR-0037); `Shift`+Roll rolls a ½ beat,
  `Alt`+Roll a ¼ beat (see ADR-0103, ADR-0181).
- **Instant doubles** — `×2` clones the deck into the partner at the
  same position and tempo, playing if it was playing (see ADR-0039);
  `Shift+×2` swaps both decks' full state — position, tempo, play
  state, cues, loops, keys (see ADR-0192).
- **Vinyl brake** — `Brake` toggle makes pause spin down and play
  spin up like a turntable; off = instant stop (see ADR-0040).
- **Beat echo** — `Echo` slider adds a 3/4-beat feedback delay that
  follows the deck's grid and tempo slider; double-click resets to
  dry (see ADR-0041).
- **Transpose** — `−`/`+` beside the key readout shifts the deck's key
  ±6 semitones while tempo holds (WSOLA pitch shift; needs key lock /
  http) — fixes an almost-compatible harmonic mix (see ADR-0042).
- **Mini overview** — a whole-track strip under each waveform shows
  peaks, the loop band, the playhead, and the zoom viewport box, so
  orientation survives zooming (see ADR-0162); clicking it seeks
  straight to that fraction of the track (see ADR-0164).
- **Waveform zoom** — scroll over a waveform to zoom ×1.5–32 around
  the playhead; the window follows playback, click still seeks inside
  the visible slice (see ADR-0043).
- **Auto-cue** — loading a track skips lead-in silence: the playhead
  starts at the first sample over −50 dBFS and `Cue` returns there
  (see ADR-0044). Pressing `Play` after a track ends restarts at that
  same cue point (see ADR-0257).
- **Track-end warning** — the time readout flashes red during the
  last 30 s of a track, CDJ-style (see ADR-0045).
- **Key sync** — `Key` button transposes the deck to the smallest
  shift that mixes harmonically with the other deck's effective key;
  the key readout shows and colours by the effective (transposed)
  key (see ADR-0046, ADR-0198).
- **Elapsed / remaining** — click the time readout to flip between
  `pos / dur` and `-remaining / dur`, CDJ TIME-mode style (see
  ADR-0047).
- **Bar downbeats** — every 4th beat-grid tick on the waveform draws
  brighter and wider, so bar boundaries (where phrases and loops live)
  read at a glance (see ADR-0048).
- **Crossfader reverse** — `Rev` beside the curve select mirrors the
  fader's A/B assignment (hamster switch for scratching; works with
  both curves and auto mix) (see ADR-0049).
- **Loop length** —  beside Loop picks the armed loop's
  size up front (CDJ loop-beat select) (see ADR-0099). Once armed,
  the button itself shows the live length — `Loop 4.0b`, or seconds
  off-grid (see ADR-0110).
- **Loop move** — `◂`/`▸` beside the loop length buttons slide the
  armed loop by its own length (CDJ LOOP MOVE), persisted like the
  bounds (see ADR-0050); `Shift`+◂/▸ trims the in-point a beat
  (see ADR-0096); +◂/▸ trims the out-point (see ADR-0098).
- **Cue mix** — `Cue mix` slider blends the master output into the
  headphone bus alongside pre-fader cue, like a monitor knob
  (see ADR-0051).
- **Bar.beat counter** — the readout beside BPM shows where on the
  grid the playhead sits (`9.3` = bar 9, beat 3), matching the bar
  ticks on the waveform (see ADR-0052).
- **Bar jump** — `Shift` + `−1b`/`+1b` jumps a whole bar (4 beats)
  instead of one beat, for phrase-sized moves (see ADR-0053).
- **Mono check** — `Mono` under `Cue mix` folds the master to one
  channel (pre-limiter) to audition mono compatibility; hold it
  for a momentary check (see ADR-0054, ADR-0185).
- **Quantize toggle** — `Qtz` beside `Rev` switches beat-grid snapping
  for hot cues and loop in-points on/off (on by default)
  (see ADR-0055).
- **Effective BPM** — once the tempo fader moves, the readout
  adds `→N` for what's actually playing, next to the detected
  tempo (see ADR-0219).
- **Decimal BPM** — the readout shows the fractional estimate
  (`120.2`), so matched decks are visibly matched (see ADR-0056).
- **Manual loop** — tracks with no detected grid can still loop:
  `Loop` arms a 4-second free loop from the press point, and halve /
  double / move all work (see ADR-0057).
- **Free-size loop** — `Shift` + `Loop` marks the IN point, a second
  press marks OUT: any-length loops (button blinks while armed);
  honours Quantize like hot cues (see ADR-0058, ADR-0176).
- **Reloop** — `↺` beside `Loop` re-enters the last exited loop with
  its exact bounds; seeking out of a loop is also reloop-able
  (see ADR-0059). `Shift+↺` stores the armed loop in a dedicated
  memory slot that survives later exits — Serato's loop memory
  (see ADR-0116); `Alt+↺` owns a second slot the same way: armed
  loop saves, disarmed click recalls (see ADR-0166); both slots
  persist in the library record like cues and loops (see ADR-0221).
- **Slip cues** — `Slip` makes pad presses momentary: hold to play the
  cue, release to snap back to where the track would have been
  (see ADR-0060); with Slip on, loop exits land on the true timeline
  too (see ADR-0143), and a dim ghost playhead shows that timeline
  during any slip borrow (see ADR-0156). Hold `Slip` ≥250 ms for
  momentary mode — one-off slips without a second click (see ADR-0177).
- **Next-bar jump** — `▸bar` on the hot-cue row lands the playhead on
  the next bar downbeat, so drops hit "the one" (see ADR-0061).
- **Tempo reset** — double-click the tempo slider for an exact ±0.0%,
  like the hardware TEMPO RESET (see ADR-0062). Scrolling over the
  slider trims ±0.1% per notch for fine pitch rides (see ADR-0109);
  a center detent snaps ±0.3% of unity to exact 1.000 (see ADR-0129).
  Eject on a playing deck needs a second click within 2 s (`sure?`),
  matching the load/stepper guards (see ADR-0131). Right-click on the
  emptied dropzone undoes the last eject — the library record restores
  grid, key, cues and loop (see ADR-0244). Alt+Sync arms that deck as **sync leader** — the partner
  continuously re-matches its tempo and beat phase (drift-seek past
  1/16 beat), so riding the leader's fader keeps the blend glued
  (SYNC MASTER; see ADR-0130).
- **Cue preview** — hold `Cue` while stopped to audition from the cue
  point; release pauses and snaps back (see ADR-0063).
- **Split cue** — `Split` on the Phones row pans headphone cue to the
  left ear and master PGM to the right for one-ear monitoring
  (see ADR-0064). `Cut` beside it is a momentary master mute —
  hold to chop, release restores (see ADR-0123).
- **Beat lamp** — the dot beside the bar counter pulses each beat and
  flashes deck-accent on the downbeat (see ADR-0065).
- **Fader resets** — double-click Gain (unity), the crossfader
  (centre), or Master (90%) to snap back to default (see ADR-0066).
- **Mic input** — `Mic` button sums a `getUserMedia` microphone into
  the master before the limiter, so it is recorded too (see ADR-0067).
  While open the button pulses with the input level — a dead mic is
  visible before it reaches the floor (see ADR-0115). A fixed
  120 Hz high-pass strips rumble and plosives (see ADR-0122). The
  slider beside it trims mic level in the master, 0–1.5 (past unity
  for quiet mics; see ADR-0135), and the two following sliders are a
  DJM-style mic EQ — LOW 200 Hz and HI 4 kHz shelves, ±12 dB (see
  ADR-0151). A downward gate at the end of the chain drops room
  noise to −22 dB between phrases, snapping back open on speech
  (see ADR-0154). Holding the Mic button while off works as
  press-to-talk — tap latches, hold is momentary like kills, mute,
  FX, pads, and Phones (see ADR-0155, ADR-0175).
- **Channel fader start** — pulling a deck's upfader off zero
  starts a stopped deck, the same FADER START idiom as the
  crossfader (see ADR-0216).
- **Fader start** — pushing the crossfader fully into a stopped deck's
  side starts it (see ADR-0068).
- **Tempo range** — `±8 / ±16 / ±50` select per deck trades slider
  resolution for reach, CDJ-style (see ADR-0069).
- **Cue colors** — each hot-cue pad owns a color, mirrored by its
  waveform marker (see ADR-0070).
- **Prep badges** — library rows show `⚑N` saved cues and `∞` for a
  stored loop (see ADR-0071). A trailing  counts actual plays
  (see ADR-0095); played rows also dim so unplayed tracks pop
  (see ADR-0174).
- **Library export/import** — `⤓` downloads BPM, key, cues and loops
  as JSON; `⤒` merges them onto tracks matched by name+size
  (see ADR-0072) and reports how many records matched (see ADR-0230).
- **Setlist** — every track actually played is logged in order and
  kept across reloads; `Setlist` downloads the playlist as a dated
  .txt
  (see ADR-0093).
- **Cue marker** — the deck cue point (auto-cue or track start) shows
  as a cyan tick on the waveform, and the Cue button's tooltip reads
  the exact landing time (see ADR-0074, ADR-0253).
- **Beat sync** — `Shift+Sync` slips beat phase only, leaving the
  tempo fader alone (see ADR-0075); right-click matches tempo
  only, leaving this deck's position untouched (see ADR-0206).
- **Waveform scrub** — hold and drag on the waveform to jog the
  playhead continuously (see ADR-0076); `Shift`-drag while playing
  bends pitch like a finger on the platter (see ADR-0102).
- **Grid beat shift** — `Shift+‹/›` moves the grid a whole beat when
  detection locked onto the off-beat (see ADR-0078).
- **BPM edit** — click the BPM readout to type the tempo directly;
  Enter commits, Esc cancels (see ADR-0079).
- **Library preview** — `▶` on a library row auditions the track on the
  headphone cue bus without loading a deck, starting at the cue point
  like the decks; rapid row clicks can never layer two auditions
  (see ADR-0080, ADR-0108, ADR-0260). Loading or deleting the row
  stops its audition — no double on the cue bus and the floor
  (see ADR-0246, ADR-0248).
- **Beat FX select** — the FX knob drives `Echo`, `Flng` (LFO-swept
  comb), `Trans` (beat-synced gate chop), `Noise` (swept
  bandpass riser that breathes in time with the BEAT division,
  ADR-0142), `Crush` (staircase lo-fi on the dry path), or
  `Verb` (generated-IR convolver send), or `Ping` (ping-pong echo —
  the same delay line with L/R-crossed feedback, repeats hop sides);
  only the selected effect sounds (see ADR-0081, ADR-0097, ADR-0126,
  ADR-0127, ADR-0128, ADR-0160). The
  `FX` button punches the effect in/out without touching the knob —
  hold for a momentary stab (see ADR-0133, ADR-0144). Off closes the
  delay/reverb SEND so a tail in the line rings out at the knob's
  wet level instead of being hard-cut (see ADR-0182). The
  `pre`/`post` select moves the send tap — tails that outlive the
  crossfader (pre) or fader FX that die with the side (post; see
  ADR-0134).
- **Beat division** — the `¼/½/¾/1` select sets echo time in beats,
  the DJM BEAT parameter (see ADR-0094); it also paces the flanger
  sweep — one LFO cycle per `div*4` beats (see ADR-0138) — and the
  trans chop rate (`1/div` chops per beat; see ADR-0141).
- **Rec timer** — the Rec button counts `M:SS` while recording so a
  forgotten take can't hide (see ADR-0082). The browser tab title
  shows `▶ A: name` while a deck plays, so a background tab still
  tells you what's on the floor (see ADR-0114).
- **Cue undo** — right-click an empty pad restores the last
  cleared hot cue to its original pad (see ADR-0212).
- **Cue clear** — `Shift`+pad click deletes a hot cue —
  trackpad-friendly (see ADR-0083); right-click previews instead
  (see ADR-0161).
- **Eject** — `⏏` unloads the track and resets deck readouts;
  control settings survive (see ADR-0084); ejecting a deck mid-
  auto-mix-fade parks the crossfader on the surviving deck's side
  (ADR-0193). `‹`/`›` beside it step
  the deck through the library in list order — crate-dig without
  leaving the deck; playing decks still confirm (see ADR-0124). Hold
  `Shift` to step through unplayed tracks only (see ADR-0225).
  Library rows are also draggable onto a deck's dropzone (ADR-0194).
- **Channel assign** — `A/Thru/B` select routes each deck to a
  crossfader side or bypasses it; fader-start follows the assign
  (see ADR-0085).
- **Continuous auto-mix** — after each auto fade the vacated deck
  auto-loads the next library track and stays armed (see ADR-0086);
  the pick prefers a Camelot+tempo fit to the playing deck before
  falling back to list order (see ADR-0146) — and says which it
  did on the deck's status line (see ADR-0207). It skips already-played
  tracks unless they're all that's left (see ADR-0203); the picked row
  carries an amber left edge while armed (see ADR-0179).
- **Phones volume** — a level knob for the whole cue bus, independent
  of the cue/PGM blend (see ADR-0087).
- **Wake lock** — the screen can't sleep while a deck is playing,
  so a set never dies to the OS idle timer (see ADR-0088).
- **Bar-quantized play** — `Shift+Play` snaps to the next downbeat
  and starts: drop on the one in a single click (see ADR-0089).
- **Transpose reset** — double-click `±N` to return to concert pitch
  (see ADR-0090).
- **Mic ducking** — opening the mic squeezes the music ~12 dB
  (broadcast talkover), restored on close (see ADR-0091).
- **Manual cue point** — `Shift+Cue` sets the cue point at the
  playhead; persisted and restored on reload (see ADR-0092), and
  snaps to the grid when Quantize is on like every other marker
  (see ADR-0200).
- **Auto mix** — `Auto` button: at 16 beats before the playing deck
  ends, the other deck starts on its first beat, tempo-synced, and the
  crossfader rides across over 8 beats; one click per transition,
  click again to cancel mid-fade — the fader and the incoming deck
  roll back to pre-fade state (ADR-0191); Shift+Auto arms a long 32-beat
  blend (see ADR-0013, ADR-0073). The button counts down beats to
  the fade (`Auto 14b`) and shows fade progress (`Auto 31%`); with a
  beat grid the fire point snaps to the nearest bar so transitions
  start on a downbeat (see ADR-0170), and it counts back from the
  last audible sample so silent tails can't delay it (see ADR-0171);
  an amber tick on the waveform (and mini overview) marks that fire
  point while the fade is pending (see ADR-0178)
  (see ADR-0111). During the fade the
  outgoing deck is also low-pass swept 20 kHz → ~400 Hz — a
  "filter out" transition, not a flat crossfade (see ADR-0020), and
  the incoming deck's low band rises from the isolator floor for a
  bass swap (see ADR-0077). In the fade's last 2 beats the outgoing
  deck's delay send lifts for an echo-out tail past the fader
  (see ADR-0159).
- **Pitch bend** — hold `−`/`+` beside the tempo fader to ride the deck
  ±5 % for manual beat alignment; release restores the fader rate
  (see ADR-0017).
- **Color filter** — one knob: left sweeps a low-pass down to ~200 Hz,
  right sweeps a high-pass up to ~8 kHz, centre is open; live `LP`/`HP`
  readout, double-click resets (see ADR-0016).
- **EQ kills** — the H/M/L letters are buttons: click pins the band at
  −26 dB, click again restores the slider value (see ADR-0015).
  Holding a letter ≥250 ms kills momentarily — release restores, for
  one-beat kill stabs (see ADR-0117).
- **Set recording** — `Rec` button captures the master output to a
  `.webm` (opus) download via `MediaRecorder` on a MediaStream tap;
  shift+Rec pauses/resumes the take (paused time doesn't count —
  see ADR-0241); the take also lands in the library as a track you
  can replay, cue, or resample (see ADR-0148)
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
  deflate the value (see ADR-0019/0024/0034). The BPM/key estimators
  run in a Web Worker, so analyzing a long track never freezes the
  surface (see ADR-0233).
- **Channel meters** — a thin strip under each waveform shows the
  deck's post-EQ/filter, pre-crossfader peak level, so gain staging is
  visible before the fader opens (see ADR-0035); a tick holds the
  recent peak ~1.4 s like a hardware max-hold segment (see ADR-0100).
- **Master limiter** — a fast `DynamicsCompressor` at the end of the
  chain (threshold −3 dB, ratio 20) keeps two-deck sums and EQ boosts
  from clipping; `GR −x.x dB` shows under the meter while it rides
  peaks (see ADR-0018).
- **Master level meter** — post-limiter output with a decaying
  peak-hold tick like the channel meters (see ADR-0106), plus a
  K-weighted LU readout beside the GR text (~400 ms momentary;
  click for the integrated view, double-click resets it — ADR-0187;
  −14 LU is the streaming target; see ADR-0139), turning green inside
  the −14 ± 1 band (see ADR-0165) — and master gain.
- **Sampler** — `Smpl` row: 4 one-shot pads into the master chain.
  Click loads a file — or drop a file straight onto a pad (ADR-0186) —
  click again fires (retrigger restarts;
  press-and-hold plays only while held — gate mode, ADR-0149; `Loop` makes fired shots repeat,
  ADR-0150; the pitch slider retunes shots 0.5–2×, ADR-0152),
  alt-click stops the ringing voice, shift-click clears — and
  shift-click on an empty pad resamples the deck's armed loop into a
  one-shot, and right-click previews a pad on the headphone cue bus
  (see ADR-0118/ADR-0132/ADR-0145/ADR-0147). Keys `1`–`4` fire the pads (see ADR-0119);
  the slider beside them trims the shared sample level
  (see ADR-0120), and scrolling over a loaded pad trims that pad's
  own level (see ADR-0167). Pads auto-gain on load through the same
  K-weighted pipeline as the decks, so shots start level (see ADR-0197);
  resampled loops normalize the same way (see ADR-0202).
  Pads form two choke groups — 1+2 and 3+4: firing one chokes only its
  groupmate, so layers across groups keep ringing (see ADR-0121, ADR-0239);
  clearing a pad stops its cue audition (see ADR-0250). Right-click on an
  empty pad restores the last shift-cleared sample (see ADR-0240).
- **Wheel nudge** — scrolling over any fader or knob steps it one
  detent (EQ, filter, FX, gain, master, crossfader); the tempo
  slider keeps its finer ±0.1% trim (see ADR-0109, ADR-0112).
- **Keyboard** — `Q`/`P` toggle deck A/B, `←`/`→` move the crossfader,
  `0` centers it, `↑`/`↓` ride the master level; mirrored pad/sync/loop
  keys: deck A `Z X C V` (cues 1–4) `A S D F` (cues 5–8) `E` `R`,
  deck B `B N M ,` `H J K L` `I` `U` (see ADR-0031, ADR-0101,
  ADR-0157). `?` (or `/`) toggles a gesture-legend overlay listing the
  modifier grammar — click/hold/double-click/wheel/shift/alt/
  right-click — the library gestures, and the key map
  (see ADR-0231, ADR-0255). While a slider is
  focused, arrow keys belong to it — no double-drive of fader +
  crossfader (see ADR-0251).
- **Web MIDI** — connected controllers drive the surface: notes
  60–75 = deck A/B pads, 36–39 = sampler pads (velocity-sensitive,
  ADR-0168; held ≥250 ms gates the shot like a held mouse pad,
  ADR-0169), 44/45 = play A/B, 46/47 = sync, 48/49 = loop,
  50/51 = cue (ADR-0173), 52–57 = deck A/B H/M/L kills,
  58/59 = deck A/B FX on/off (ADR-0180);
  CC1 = crossfader, CC7 = master, CC20/21 = channel gains,
  CC14/15 = deck tempo, CC16/17 = colour filter,
  pitch-bend wheel ch1/ch2 = deck A/B bend ±5% (ADR-0184) —
  works unmapped on most budget controllers (see ADR-0163, ADR-0172).
- **Session persistence** — the mixer surface (faders, EQ, filters,
  FX selection, toggles, sampler, mic trims, phones volume and loop
  length selects) is saved on change and restored on reload through
  the same handlers (see ADR-0158, ADR-0252).
- **Status line** — deck status messages are ephemeral: they confirm
  the action that just happened, then clear themselves after 5 s so a
  stale message never reads like live state (see ADR-0245).

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
   `id`/`created_at`/`updated_at`/`deleted_at`/`version` per record;
   deletion frees the audio blob (ADR-0232).
4b. ~~Hot cues.~~ Done (ADR-0010) — four per deck, persisted in the
   library; eight since ADR-0140. Beat-jump added in ADR-0012.
5. ~~Stem separation.~~ Done (ADR-0026) — dependency-free mid/side
   Vocal/Inst split. An ML model remains a possible future upgrade if
   centre-panned extraction isn't enough.
6. ~~Recommendation / auto-mix assistance.~~ Done — harmonic-fit
   highlighting (ADR-0011) + one-click auto transitions (ADR-0013).

## Local stats

Lifetime counters (loads / plays / loops / auto transitions /
recordings) live in `localStorage` — hover the footer to read them.
Local-only; nothing is sent anywhere (see ADR-0237).

## Accessibility

Every control's tooltip is mirrored into `aria-label` at boot, so
icon buttons announce verbs to assistive tech, and deck status
lines are `aria-live` (see ADR-0236).

## Security

Local files only; no network calls, no telemetry, no secrets. Report
vulnerabilities per [SECURITY.md](SECURITY.md).
