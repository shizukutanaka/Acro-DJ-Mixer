# ADR-0271: Recordings keep the recorder's real container type

## Status
Accepted.

## Context
`recorder.onstop` stamped every take `audio/webm` regardless of what
the MediaRecorder actually produced. Chrome emits
`audio/webm;codecs=opus`; Safari's MediaRecorder emits mp4 — so the
saved file wore the wrong extension and its library record carried a
mime that didn't describe the bytes, confusing `decodeAudioData`
sniffing and anything reading `blob.type`.

## Decision
Read `recorder.mimeType` for both the blob type and the filename
extension (`.m4a` for mp4 containers, `.webm` otherwise) — the
library row and the download both name what's really inside.

## Consequences
Takes are truthful files on every engine; codec hints ride along
into the library instead of being flattened to a bare `audio/webm`.

## Round
Improvement round 271.
