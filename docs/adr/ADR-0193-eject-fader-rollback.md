# ADR-0193: Ejecting a fading deck parks the fader on the survivor

## Context
ADR-0191 rolled the crossfader back when an auto-mix fade was
*cancelled*, but `eject()` had the same leak: bailing a fade left
the fader mid-travel, so the surviving deck could be silenced on
its own side — outgoing ejected at xf 0.4 leaves the incoming
playing while the fader sits at 0.4 hearing mostly nothing.

## Decision
When the fade bail fires inside `eject()`, restore
`xfader.value` to the surviving deck's side — `fromX` when the
incoming deck is ejected, `toX` when the outgoing deck is —
then `applyCrossfade()`. Same record as ADR-0191, same rule:
whoever's left playing owns the fader.

## Consequences
- Ejecting either role mid-fade ends audibly correct: eject the
  incoming → original track keeps its channel; eject the
  outgoing → incoming keeps its channel.
- Stopped deck silence can't be mistaken for an app failure.
