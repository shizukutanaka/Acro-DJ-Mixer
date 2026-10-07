# ADR-0363: The send tap rewires send nodes, not effect cores

## Context
`setFxTap` iterated `[delay, flDelay, verb]` — but echo and reverb
are fed through gate nodes: `filter→delaySend→delay` and
`filter→verbSend→verb`. There was no `filter→delay` or
`filter→verb` edge to remove, so the disconnects no-op'd and
`src.connect(delay)` created a NEW direct edge that bypassed the
`delaySend`/`verbSend` gate entirely.

Two compounding consequences on 'post': the old `filter→delaySend`
feed stayed live (the send was doubled when gated), and FX-off no
longer gated the send — echoes and tails kept regenerating while
the fader passed signal, defeating the tap's purpose and the FX
button's promise.

## Decision
The rewire targets `[delaySend, flDelay, verbSend]` — the nodes
that actually own the source edge. Flanger already connected
directly and is unchanged in behavior; echo/verb now move with it.

## Consequences
'Post' truly moves the tap: sends follow the crossfader and die
with the side; FX-off still gates them. The doubled feed is gone.
