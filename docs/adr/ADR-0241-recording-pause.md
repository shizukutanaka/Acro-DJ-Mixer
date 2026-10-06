# ADR-0241: Shift+Rec pauses the set recording

## Status
Accepted.

## Context
The set recorder is binary: Rec starts, Rec stops. A live set has
pauses that aren't set — an MC break, a request, a chat at the
booth — and they end up on the recording (or force a take split at
a dead spot). `MediaRecorder.pause()` exists and flushes correctly
to the same chunk stream; it was simply never wired.

## Decision
`shift+Rec` toggles pause/resume while a take is running:
`recorder.pause()` + the button shows `Rec II` with the timer
frozen; `shift+Rec` again resumes — `recStart` advances by the
paused span so the on-button timer keeps showing *recorded* time,
not wall time. A plain Rec click while paused still stops and
saves (`stop()` flushes from the paused state), so a take can
never be stranded mid-pause.

## Consequences
Dead air can be left out of a take without splitting the file.
The gesture sits on the existing modifier grammar (shift =
alternate action) and can't be hit by accident the way an
unmodified click could be.

## Round
Improvement round 241.
