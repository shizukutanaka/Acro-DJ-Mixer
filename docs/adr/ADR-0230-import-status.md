# ADR-0230: Library import reports its outcome

## Context
Import finished silently — no way to tell whether the file
parsed, matched any loaded tracks, or did nothing. Silent
finish is the same failure class ADR-0208 fixed in the audio
paths.

## Decision
The change handler counts tagged records and reports through
the deck status line: `imported N record(s)`, `import: no
matching tracks`, or `import: not a library file` on a parse
or shape failure.

## Consequences
- Every import path answers back — success count or why not.
