# ADR-0360: Import validates entries before tagging

## Context
The import loop assumed every array element was a record object.
`e.hash` on a `null` entry threw mid-loop — records already tagged
stayed tagged, the rest silently skipped, and no status ever
reported. Separately, `e[k] !== undefined` copied wrong-typed values
(`cues:"x"`, `bpm:"fast"`, `bpm:null`) straight into records —
`null` fields even overwrote good data, and a non-array `cues` would
corrupt loadInto's meta reads.

## Decision
Skip non-object entries, then type-validate per field: finite
numbers for duration/bpm/beatOff/cueIn, strings for key/stem,
arrays-or-null for loop/mem1/mem2, array-only for cues. A match
with no valid fields writes nothing and doesn't count toward the
"imported N" status.

## Consequences
A hand-edited or hostile JSON can't crash the import halfway or
pollute records; the reported count is honest.
