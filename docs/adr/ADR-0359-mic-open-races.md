# ADR-0359: Mic open can't outlive a press-to-talk hold, or double-build

## Context
Two races in `micOpen`:

1. Press-to-talk released while getUserMedia was still pending
   (permission prompt, slow device): `micMomEnd` found `micSrc`
   unset and returned — then the stream resolved and the chain
   built anyway, latching the mic open after the hold ended.
2. `micOpen` had no re-entry guard: a second click while the first
   was still pending built a second audio chain — `micSrc` was
   overwritten, the first chain leaked connected with no way to
   disconnect it, and the mic played doubled.

## Decision
- `micOpening` flag makes `micOpen` idempotent; cleared in a
  `finally` so even a throw can't wedge it.
- `micOpen(ptt)` re-checks `micBtn2._mom` after the await: a hold
  that already ended drops the just-acquired stream instead of
  building a chain on it.

## Consequences
Releasing the button mid-prompt can never leave the mic open, and
rapid toggles can't double the mic chain.
