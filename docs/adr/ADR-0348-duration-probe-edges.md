# ADR-0348: The duration probe cleans up and only stores finite times

## Status
Accepted (2026-10-07)

## Context
`libDurOf` probes a dropped file's length via `<audio>` metadata so
crate-drop rows can show a duration without a full decode. Two
edge defects:

1. **Leaked object URL on failure.** `onloadedmetadata` revoked the
   URL, `onerror` did not — every undecodable file dropped on the
   library left one blob URL alive for the session.
2. **`Infinity` durations.** Stream-like containers and some WAVs
   probe as `Infinity`. `a.duration || 0` passes it through
   (Infinity is truthy), so the record stored `Infinity` — the row
   printed it through `fmt` (`Infinity:NaN`) and any duration math
   downstream inherited a non-finite value.

## Decision
Both callbacks revoke the URL via a captured reference, and the
probe resolves `Number.isFinite(a.duration) ? a.duration : 0` —
zero already means "unknown duration" everywhere else (the row
hides the time, bgScan fills in the real length on decode).

## Consequences
- Bad drops are free: no per-file blob URL accumulation.
- A probe can never write a non-finite duration into a record.
