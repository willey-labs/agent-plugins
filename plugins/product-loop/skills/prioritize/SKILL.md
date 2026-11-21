---
name: prioritize
description: Use when a milestone has to go first — urgent work, a deadline, "do M7 before anything else", "put this first", "pause M4" — or the user wants to change the roadmap's order. Makes the named milestone current and pauses the current one with all its work kept. It changes the order only; /next does the work.
---

# prioritize

Make one milestone current now, and pause the one that was. Nothing is lost: the paused milestone
keeps its answers, its final look, its plans and its built slices, and `/next` carries on from them
when its turn comes back.

An urgent request that isn't on the map yet goes through `/feature` first, then here.

## Pick the milestone

The argument is a milestone id: `/prioritize m9`. Without one, read `docs/roadmap.md`, name the
milestones that aren't `done`, ask which, and wait.

Read `docs/roadmap.md`, `docs/capabilities.md`, `docs/_current.md` when it exists, the named
milestone's folder, and the current milestone's folder. Stop when one of these holds, and say which:

- The milestone is `done`, or already `current`.
- `docs/_current.md` exists. Ask whether to finish that job first or drop it. Dropping deletes
  `docs/_current.md` and nothing else: a review keeps every answer it holds, and `/next` picks it
  up again when its milestone comes back. Drop it only on the user's word. When the user wants it
  finished, say that `/prioritize` with the same id runs once the job is closed, and stop.
- The map reads `proposed`, and has no `Changed:` line, or one that names this milestone. Its
  features can still move: the map waits on the user's answer first.

## Change the order

In `docs/roadmap.md`, in one edit:

- The current milestone becomes `open`.
- The named milestone becomes `current`, and its row moves right after the last `done` row.
- The paused milestone's row goes right after it, so it comes back next.

The named milestone has no `_milestone.md` when it was never current and `/decide` never opened it.
Write it now from the map, as the next skill's CLOSE does: its features with decision `open` and
build `none`, its sub-features, and its exit check.

The paused milestone keeps every file in its folder. A feature of it half built keeps its built
slices, and its build stays `building`.

## Hand it over

Say the new order in one line, and what the paused milestone keeps:
`M9 Printed day lists is current. M4 Family bookings is paused, comes back next, and keeps its 10
answers, its final look and 2 built slices.` Then say that `/next` now works the named milestone, and
stop. The map doesn't change, so it needs no confirmation.

## Files you may write

`docs/roadmap.md`, the named milestone's `_milestone.md` when it has none, and `docs/_current.md`
only to delete it on the user's word. Nothing else.

## Stop and ask if

- You're about to change the map. That is `/feature`.
- You're about to move a `done` milestone.
- You're about to drop an open job without the user's word.

Each one means: stop, say what you were about to do, and ask.
