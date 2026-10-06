# ADR-0208: Fail loud, not silent

## Context
The product audit (P0) flagged silent failure paths: an
undecodable file dropped on a sampler pad threw an unhandled
rejection and left the pad looking armed; `autoNext` returned
false from three different conditions with no sign of which; a
corrupt library record made preview die invisibly. Every one of
these looks to the user like "the button does nothing".

## Decision
Failure paths now say what happened where the user is looking:
the sampler pad shows `!` with a title naming the bad file,
`autoNext` writes the reason to the vacated deck's status
(`Library empty` / `No next track available` / `Auto-load
failed`), and a preview that can't decode marks its library row
title. Errors still log to console — the change is surfacing,
not suppressing.

## Consequences
- "Does nothing" states now carry their own explanation.
- autoNext's catch keeps `console.warn(err)` — silent catches
  lose the error object forever, logged ones don't.
