---
name: decide
description: Use when the user wants to answer a milestone's open questions before its turn comes — "decide M4 now", "let's settle M5's questions early", "review the next milestone" — or names a milestone to decide. Runs that milestone's decision review ahead of the roadmap; planning and building stay in roadmap order with /next.
---

# decide

Run the decision review of one milestone now, whatever its place in the roadmap. Deciding early
changes no code, so it can run ahead of the build. Planning and building stay in roadmap order, and
`/next` does them.

## Pick the milestone

The argument is a milestone id: `/decide m4`. Without one, read `docs/roadmap.md`, name the
milestones that aren't `done`, ask which, and wait.

Read `docs/roadmap.md`, `docs/capabilities.md`, `docs/_current.md` when it exists, and the
milestone's folder. Stop when one of these holds, and say which:

- The milestone is `done`. It has nothing left to decide.
- `docs/_current.md` exists. One job is open at a time: name it, and say `/next` carries it on.
- The map reads `proposed`, and has no `Changed:` line, or one that names this milestone. Its
  features can still move: the map waits on the user's answer first.
- Every feature of the milestone has decision `locked`. Its review is done.

## Open its page

A milestone that isn't current has no `_milestone.md` yet. Write it now from the map, in the shape
of the next skill's `references/templates.md`: its main capability, its goal, its features with
decision `open` and build `none`, its sub-features, and its exit check. Its roadmap status stays as
it is.

## Run the review

Run the next skill's BRAINSTORM on this milestone, exactly as written there, with two differences:

- Where BRAINSTORM's page and file tell the user to run `/next` once every answer is in, they say
  `/decide <id>` with this milestone's id. `/next` works the current milestone, not this one.
- Never write `docs/_current.md`. It would make `/next` carry on this review ahead of the current
  milestone. The review's `decisions.md` holds its state, so a long session stops with the
  questions left open and `/decide <id>` picks them up again.

A review already written keeps every answer. Run again on it, `/decide <id>` reads the answers in
`decisions.md` and closes each feature whose questions are all answered, as BRAINSTORM says: its
feature document, and its decision `locked`.

Tell the user that the plan, the final look and the build of this milestone wait for its turn in
the roadmap. The final look runs then, so it checks these answers against the map as it stands at
that time.

## Files you may write

The milestone's `_milestone.md` when it has none, and the files the next skill's BRAINSTORM writes
in this milestone's folder. Nothing else.

## Stop and ask if

- You're about to plan or build anything. That is `/next`, in roadmap order.
- You're about to change the map or the roadmap's order. That is `/feature`, or an edit to the
  roadmap.
- You're about to decide a question the user hasn't answered.

Each one means: stop, say what you were about to do, and ask.
