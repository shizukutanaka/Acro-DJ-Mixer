# ADR-0397: Counters increment inside the write chain

## Context
Every library write rides the serialized `_mutate` chain (ADR-0267)
because get->put is read-modify-write. `tagLib` takes absolute
values, which is fine for cue arrays and grids — but the play
counter did its `get` *outside* the chain:

```js
const rec = await Library.get(id);
if (rec) this.tagLib({ plays: (rec.plays || 0) + 1 });
```

Two decks playing the same record — instant doubles, or the same
track on both sides — each read the same stale count and tagged
the same absolute value, so two plays landed as one.

## Decision
`Library.bump(id, field)` performs the read + increment + put
inside `_mutate`, exactly like `tag` but for counters. The play
path calls it directly; `tagLib`'s accumulating absolute-value
patches are untouched (a functional patch there would re-fire on
every later tag).

## Consequences
Same-record plays on both decks count twice as they should;
single-deck behavior is unchanged.
