# ADR-0270: Downloads get the delayed object-URL revoke

## Status
Accepted.

## Context
The library export and setlist download revoked their object URL
synchronously after `a.click()`. Browsers that begin the download
asynchronously (notably Firefox) can lose the URL before the fetch
starts — a silent dead click. The set-recording download already
used a delayed revoke for exactly this reason; the other two were
written earlier and missed the fix.

## Decision
Same 10-second delayed `revokeObjectURL` for all three downloads —
long enough for the browser to take ownership, short enough that a
blob URL doesn't outlive its purpose.

## Consequences
Export and setlist downloads are reliable across engines, matching
the recording path; the URL is still freed shortly after.

## Round
Improvement round 270.
