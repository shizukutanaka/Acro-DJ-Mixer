// Smoke gate for Acro DJ Mixer — the app ships zero-dependency, so the
// test lives outside the page: launch Chrome with
//   --remote-debugging-port=9222
// serve the repo (e.g. `python3 -m http.server 8931`), then:
//   npm i playwright   (dev-time only — nothing ships)
//   node tests/smoke.mjs
//
// It loads the app, synthesises a WAV, loads it into both decks, and
// asserts the core contract: decode, nodes, play/pause, crossfader
// gains, hot cue set/jump/clear, tempo sync, page-error-free run.

import { chromium } from 'playwright';

const CDP = process.env.CDP_URL || 'http://localhost:9222';
const URL_ = process.env.APP_URL || 'http://localhost:8931/index.html';

const browser = await chromium.connectOverCDP(CDP);
const page = await browser.contexts()[0].newPage();
const errs = [];
page.on('pageerror', e => errs.push(e.message));

// The app persists mixer state to localStorage — a prior run's
// leftovers (channel assign, xf curve, fader position) would seed
// this run's assertions. Reset before the app's own scripts read it.
await page.addInitScript(() => localStorage.clear());
await page.goto(URL_ + '?v=' + Date.now());
await page.waitForTimeout(800);

const r = await page.evaluate(async () => {
  const out = {};
  audio();                                   // creates/resumes ctx
  const mk = secs => {                        // 16-bit stereo WAV
    const sr = 44100, n = sr * secs;
    const buf = new ArrayBuffer(44 + n * 4), dv = new DataView(buf);
    const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); ws(8, 'WAVEfmt ');
    dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
    dv.setUint32(24, sr, true); dv.setUint32(28, sr * 4, true);
    dv.setUint16(32, 4, true); dv.setUint16(34, 16, true);
    ws(36, 'data'); dv.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) {
      const v = Math.sin(i * 0.05) * 0.3 * 32767 | 0;
      dv.setInt16(44 + i * 4, v, true); dv.setInt16(46 + i * 4, v, true);
    }
    return buf;
  };

  deckA.buffer = await ctx.decodeAudioData(mk(20));
  deckB.buffer = await ctx.decodeAudioData(mk(20));
  await deckA.ensureNodes(); await deckB.ensureNodes();
  out.nodes = !!(deckA.engine && deckA.deckGain && deckA.xfGain);

  deckA.play();
  out.plays = deckA.playing === true;
  deckA.pause();
  out.pauses = deckA.playing === false;

  // Crossfader ends: full left = A only, full right = B only.
  xfader.value = 0; applyCrossfade();
  await new Promise(r => setTimeout(r, 300));
  out.xfLeft = deckA.xfGain.gain.value > 0.9 && deckB.xfGain.gain.value < 0.1;
  xfader.value = 1; applyCrossfade();
  await new Promise(r => setTimeout(r, 300));
  out.xfRight = deckB.xfGain.gain.value > 0.9 && deckA.xfGain.gain.value < 0.1;
  xfader.value = 0.5; applyCrossfade();

  // Hot cue set/jump/clear round-trip.
  deckA.seekTo(5);
  deckA.padCue(0);
  out.cueSet = typeof deckA.cues[0] === 'number';
  deckA.seekTo(0); deckA.padCue(0);
  out.cueJump = Math.abs(deckA.pos() - deckA.cues[0]) < 0.05;
  deckA.clearPad(0);
  out.cueClear = deckA.cues[0] == null;

  // Sync: B's rate tracks A's effective tempo (grids stubbed — the
  // synthetic WAV has no analysed BPM).
  deckA.grid = { bpm: 120, beatOff: 0 };
  deckB.grid = { bpm: 118, beatOff: 0 };
  deckA.rate = 1.1; deckB.rate = 0.9;
  deckA.play(); deckB.play();
  deckB.syncTo(deckA);
  out.syncs = Math.abs(deckB.rate - (120 * 1.1 / 118)) < 0.01;
  deckA.pause(); deckB.pause();

  // Bookkeeping doctrines the audit rounds rely on — all merged on
  // main, asserted here so CI pins them against regression.

  // Loop arms stamp slip bookkeeping (ADR-0398): anchor + effective
  // rate + a clock that only runs while playing.
  deckA.loopBeats.value = '4';
  deckA.play();
  deckA.toggleLoop();
  out.armBookkeeping = deckA.loopOn && deckA._loopEnterRate > 0 && deckA._loopT != null;
  deckA.pause();

  // Seeking outside an armed loop exits it — the deck-standard escape.
  // Land past loopEnd (start-side seeks can land inside when the
  // armed region starts at 0).
  deckA.seekTo(Math.min(deckA.loopEnd + 1, deckA.buffer.duration - 0.01));
  out.loopEscape = deckA.loopOn === false;

  // Reloop re-enters the last exited region (ADR-0059/_prevLoop).
  deckA.reloop();
  out.reloops = deckA.loopOn === true;
  deckA.loopOn = false;

  // A latched pitch bend is transient finger state — stopping clears it.
  deckA.play();
  deckA._setBendMul(1.1);
  deckA.pause();
  out.bendReleased = deckA.bendMul === 1;

  // Fader start: sweeping into a stopped deck's side starts it, and
  // the edge bookkeeping re-arms after a double-click reset
  // (ADR-0358/0391 — a parked xfPrev must not ghost-fire or swallow).
  deckA.pause(); deckB.pause();
  xfader.value = 0.5; applyCrossfade(); xfEdgeCheck();
  xfader.value = 0.97; xfEdgeCheck();
  out.faderStart = deckB.playing === true;
  deckB.pause();
  xfader.dispatchEvent(new Event('dblclick'));   // reset parks centre
  xfader.value = 0.97; xfEdgeCheck();
  out.faderStartRearm = deckB.playing === true;
  deckB.pause();
  xfader.value = 0.5; applyCrossfade(); xfEdgeCheck();

  // Sync clamps to the follower's own tempo range (ADR-0357):
  // A at 120×1.15 asks B (range ±8) for 1.169 — beyond its ±8%,
  // it must land on the clamp, not the raw rate.
  deckB.tempoRange = 0.08;
  deckA.rate = 1.15;
  deckB.syncTo(deckA);
  out.syncClamps = deckB.rate <= 1.081 && deckB.rate > 1.0;
  deckB.tempoRange = 0.16; deckB.rate = 1;

  // Grid undo: a nudge stashes _prevGrid, right-click on the tempo
  // controls restores it (ADR-0292's right-click-restores grammar).
  const off0 = deckA.grid.beatOff;
  deckA.nudgeGrid(0.01);
  out.undoStashed = deckA._prevGrid !== undefined;
  deckA.el.querySelector('.bpmctl').dispatchEvent(new Event('contextmenu'));
  out.undoRestored = Math.abs(deckA.grid.beatOff - off0) < 1e-9 && deckA._prevGrid === undefined;

  // Channel assign: deck B routed to side A follows the A-side law —
  // audible at xfader 0, silent at xfader 1 (ADR-0377).
  deckB.assignSel.value = 'a';
  xfader.value = 0; applyCrossfade();
  await new Promise(r => setTimeout(r, 300));   // setXf smooths with setTargetAtTime
  const assignA = deckB.xfGain.gain.value > 0.9;
  xfader.value = 1; applyCrossfade();
  await new Promise(r => setTimeout(r, 300));
  out.assignLaw = assignA && deckB.xfGain.gain.value < 0.1;
  deckB.assignSel.value = 'b';
  xfader.value = 0.5; applyCrossfade();

  // Hamster reverse: Rev swaps the sides the fader feeds — fader at
  // 0 then feeds deck B instead of A (ADR-0049/0382).
  document.getElementById('xfrev').click();   // toggles xfRev + rebases xfPrev
  xfader.value = 0; applyCrossfade();
  await new Promise(r => setTimeout(r, 300));
  out.hamsterLaw = deckB.xfGain.gain.value > 0.9 && deckA.xfGain.gain.value < 0.1;
  document.getElementById('xfrev').click();
  xfader.value = 0.5; applyCrossfade(); xfEdgeCheck();

  // Mono fold: the Mono button flips the master chain to one channel
  // (ADR-0054), and back.
  document.getElementById('mono').click();
  out.monoFold = monoNode.channelCount === 1;
  document.getElementById('mono').click();
  out.monoFold = out.monoFold && monoNode.channelCount === 2;

  // Quantize contract: Qtz on snaps a hot-cue write to the grid,
  // Qtz off places it freehand (ADR-0021/0055).
  deckA.seekTo(5.3);
  deckA.padCue(1);
  const snapped = deckA.cues[1];
  deckA.clearPad(1);
  document.getElementById('qtz').click();   // quantizeOn off
  deckA.padCue(1);
  const freehand = deckA.cues[1];
  deckA.clearPad(1);
  document.getElementById('qtz').click();   // restore
  out.qtzSnap = Math.abs(snapped - 5.5) < 1e-9 && Math.abs(freehand - 5.3) < 1e-9;

  // Beat jump rides the detected grid (0.5 s/beat at 120 BPM), ±1.
  deckA.seekTo(5.3);
  deckA.beatJump(1);
  const jumped = deckA.pos();
  deckA.beatJump(-1);
  out.beatJump = Math.abs(jumped - 5.8) < 0.01 && Math.abs(deckA.pos() - 5.3) < 0.01;

  // Loop scaling: halve/double an armed loop in place, clamped at
  // half a beat (ADR-0009).
  deckA.toggleLoop();               // loopbeats=4 → 2 s at 120 BPM
  deckA.setLoopLen(0.5);
  const halved = deckA.loopEnd - deckA.loopStart;
  deckA.setLoopLen(2);
  out.loopScale = Math.abs(halved - 1) < 1e-9 && Math.abs(deckA.loopEnd - deckA.loopStart - 2) < 1e-9;
  deckA.toggleLoop();

  // Bar jump lands on the next downbeat — floor+1 even mid-bar,
  // shift jumps back one bar (ADR-0061/0201).
  deckA.seekTo(1.2);
  deckA.jumpBar(1);
  const toBar = deckA.pos();
  deckA.jumpBar(-1);
  out.barJump = Math.abs(toBar - 2) < 0.01 && Math.abs(deckA.pos()) < 0.01;

  // EQ kill pins the band at −26 dB and restores the knob's value on
  // release (ADR-0015).
  deckA.eqEls.high.value = 0.5;
  deckA.setBand('high', 0.5);
  deckA.setKill('high', true);
  await new Promise(r => setTimeout(r, 300));
  const killed = deckA.eq.high.gain.value;
  deckA.setKill('high', false);
  await new Promise(r => setTimeout(r, 300));
  out.killRestores = killed < -20 && Math.abs(deckA.eq.high.gain.value - 13) < 2;

  // Loop move + in/out adjust: the armed loop slides by its own
  // length, or trims a bound by one beat (ADR-0050/0096/0098).
  deckA.toggleLoop();
  const ls0 = deckA.loopStart, llen = deckA.loopEnd - deckA.loopStart;
  deckA.moveLoop(1);
  const moved = Math.abs(deckA.loopStart - ls0 - llen) < 1e-9;
  deckA.adjustLoopIn(1);
  const inAdj = Math.abs(deckA.loopStart - (ls0 + llen) - 0.5) < 1e-9;
  deckA.adjustLoopOut(-1);
  out.loopMove = moved && inAdj && Math.abs(deckA.loopEnd - (ls0 + 2 * llen) + 0.5) < 1e-9;
  deckA.toggleLoop();

  // Free-size loop: shift+Loop marks IN, a second press marks OUT —
  // bounds still snap under Qtz (ADR-0058/0176).
  deckA.seekTo(5.3);
  deckA.toggleLoop(true);              // marks _loopIn
  deckA.seekTo(6.3);
  deckA.toggleLoop(true);              // commits [5.5, 6.5]
  out.freeLoop = deckA.loopOn && Math.abs(deckA.loopStart - 5.5) < 1e-9 && Math.abs(deckA.loopEnd - 6.5) < 1e-9;
  deckA.toggleLoop();

  // Transpose is engine-gated: on the fallback engine it refuses (a
  // lying ±N readout is worse than no readout, ADR-0311); on the
  // worklet it applies and resets.
  if (deckA.engine === 'worklet') {
    deckA.transpose(1);
    const up = deckA.st === 1;
    deckA.transpose(-1);
    out.transposeGate = up && deckA.st === 0;
  } else {
    deckA.transpose(1);
    out.transposeGate = deckA.st === 0;
  }

  // Headphone cue: toggleCue opens the deck's PFL send; shift = solo
  // drops the partner's cue (ADR-0007/0113).
  deckA.toggleCue();
  const cueOpened = deckA.cueOn === true;
  deckB.toggleCue(true);               // solo — partner's cue drops
  out.soloCue = cueOpened && deckB.cueOn === true && deckA.cueOn === false;
  deckB.toggleCue();

  // Sync leader is exclusive: only one deck leads (ADR-0130).
  deckA.toggleLead();
  const aLeads = deckA.leading === true;
  deckB.toggleLead();
  out.leaderExclusive = aLeads && deckB.leading === true && deckA.leading === false;
  deckB.toggleLead();

  // Mid/side stem split: 'voc' keeps mid only — all four matrix taps
  // move to 0.5; 'off' restores pass-through (ADR-0026).
  if (deckA.mg) {
    deckA.setStem('voc');
    await new Promise(r => setTimeout(r, 300));
    const vocMix = deckA.mg.every(g => Math.abs(g.gain.value - 0.5) < 0.05);
    deckA.setStem('off');
    await new Promise(r => setTimeout(r, 300));
    out.stemMix = vocMix && Math.abs(deckA.mg[0].gain.value - 1) < 0.05 && Math.abs(deckA.mg[1].gain.value) < 0.05;
  } else out.stemMix = true;   // stereo path — no mid/side matrix on this engine

  // Help overlay is modal: while it's open, keys belong to it and
  // must not drive the mixer (ADR-0308) — then, once closed, a real
  // keydown rides the handler end-to-end ('q' plays/pauses, ADR-0031).
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true }));
  const gated = deckA.playing === false && !helpEl.hidden;
  helpEl.hidden = true;
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true }));
  const qPlays = deckA.playing === true;
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true }));
  out.keyDispatch = gated && qPlays && deckA.playing === false;

  // Slip: a held pad snaps the playhead back to where the timeline
  // would be on release (ADR-0060/0143/0390).
  deckA.slip = true;
  deckA.cues[0] = 5.0;
  deckA.seekTo(2);
  deckA.play();
  await new Promise(r => setTimeout(r, 300));
  deckA.slipCueStart(0);
  const atCue = Math.abs(deckA.pos() - 5.0) < 0.05;
  await new Promise(r => setTimeout(r, 300));
  deckA.slipCueEnd();
  const back = deckA.pos();
  deckA.pause();
  deckA.slip = false; deckA.cues[0] = null;
  out.slipSnapBack = atCue && back > 2.1 && back < 2.9;

  // Sampler choke groups: firing pad 2 chokes pad 1's voice but a
  // shot in the other group keeps ringing (ADR-0239).
  const sbuf = ctx.createBuffer(1, 1000, 44100);
  smpSlots[0] = smpSlots[1] = smpSlots[3] = { buf: sbuf };
  fireSmpPad(0);
  const p0Lit = smpPadsEl.children[0].classList.contains('on');
  fireSmpPad(1);
  const choked = !smpPadsEl.children[0].classList.contains('on') && smpPadsEl.children[1].classList.contains('on');
  fireSmpPad(3);
  out.chokeGroup = p0Lit && choked && smpPadsEl.children[1].classList.contains('on');
  smpSlots[0] = smpSlots[1] = smpSlots[3] = null;

  // Session persistence: sessSave() serializes the mixer surface into
  // acro-session — a reload restores every control (ADR-0158/0290).
  sessSave();
  const sess = JSON.parse(localStorage.getItem('acro-session') || 'null');
  out.sessPersist = !!(sess && sess.v && sess.v.xfader != null &&
    sess.decks && sess.decks.a && sess.decks.a.tempo != null && sess.decks.a.assign != null);

  // The Cue button's title names the landing point (ADR-0253/0388).
  deckA.cueIn = 5.0; deckA._cueTitle();
  out.cueTitle = deckA._cueBtnEl.title.includes('0:05');
  deckA.cueIn = 0; deckA._cueTitle();

  // An armed loop lights the Loop button and shows the loop toolbar
  // (ADR-0399); exiting restores both.
  deckA.toggleLoop();
  const lit = deckA.loopBtn.classList.contains('on') && !deckA.loopLenEl.hidden;
  deckA.toggleLoop();
  out.loopLit = lit && !deckA.loopBtn.classList.contains('on') && deckA.loopLenEl.hidden;

  // The tab title shows the playing deck's track (ADR-0114).
  deckA.fileName = 'a.wav';
  deckA.play();
  await new Promise(r => setTimeout(r, 400));
  const tPlaying = document.title.includes('a.wav');
  deckA.pause();
  await new Promise(r => setTimeout(r, 400));
  out.titleNow = tPlaying && !document.title.includes('a.wav');

  // alt+Eject (full channel reset) still rides eject() — the undo
  // stash must survive so right-click can restore the track.
  // (The smoke buffer is injected directly, so fake the file-loaded
  // fields eject() reads to build the stash.)
  deckA._fileObj = new File([new ArrayBuffer(8)], 'a.wav');
  deckA.fileName = 'a.wav';
  deckA.resetChannel();
  out.resetUndoStash = deckA._ejected != null && deckA.st === 0 && deckA.slip === false;

  // Empty-deck control surfaces don't throw (ADR-0355/0356).
  deckA.eject();
  try { deckA.cue(); deckA.seekTo(1); deckA.play(); out.emptyDeckSafe = true; }
  catch (_) { out.emptyDeckSafe = false; }
  return out;
});

const failed = Object.entries(r).filter(([, v]) => v !== true);
console.log(JSON.stringify({ ...r, pageErrors: errs }, null, 1));
if (failed.length || errs.length) {
  console.error('FAIL:', failed.map(([k]) => k).join(',') || 'pageErrors');
  process.exit(1);
}
console.log('smoke OK');
await browser.close();
