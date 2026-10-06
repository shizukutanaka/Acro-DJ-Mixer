# ADR-0311: Engine-honest transpose and key lock

## Context

On the `file://` fallback engine (no AudioWorklet) `transpose()`
still mutated `this.st`: the ±N readout moved, and `effKey()`'s
harmonic matching claimed a transposed key — while the audio kept
its pitch. Two lies from one unsupported control. `toggleKeylock()`
had the same shape: the button lit while pitch still followed
tempo on the BufferSource.

## Decision

Both refuse cleanly on a non-worklet engine: no state changes, a
status line says what the engine needs (`Transpose needs key lock
(http).`, `Key lock needs http.`). Worklet behaviour is unchanged.

## Consequences

- UI state can no longer claim audio effects the engine can't
  deliver; harmonic matching stays honest on every engine.
