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
