---
name: status
description: Use when the user types /status alone, or asks where the product work stands, what is finished, what is left, what is in progress, or what is waiting on them.
---

# status

Report where the product work stands. Read only, and cheap — never a step toward doing the work.

## Read

`docs/capabilities.md` — its `Map:` line and summary table only. Then `docs/roadmap.md`, every
milestone's `_milestone.md`, `docs/_current.md` when it exists, the `decisions.md` of every
milestone that isn't `done` — its summary table only — and `docs/bugs.md` when it exists — its
summary table only.

Nothing else. No feature documents, no plans, no source code, no tests.

## Report

Six parts, in this order.

The map: how many capabilities it holds, and whether it reads `proposed` or `confirmed`. No
`docs/capabilities.md` — say the product has no map yet.

One line per milestone: id, name, its main capability by name, how many of its features are built
out of the total, and its status.

The features of the milestone marked `current`, one line each: id, name, decision, build.

The open job, when `docs/_current.md` exists: the feature, the mode, and its next step verbatim.

The bugs not yet `fixed`, one line each: id, name, the sub-feature it breaks, and its status. No
`docs/bugs.md`, or every bug fixed — say there are no open bugs.

Anything waiting on the user, last, and named as an action they take. A map still `proposed` waits
on their confirmation. Decisions still holding a dash in a `decisions.md` wait on their answers,
counted and named by id, per milestone. Nothing waiting — say so in those words. A row that only needs the next
`/next` is not waiting on the user.

## Hold the line

The files are the source. Report what they say, and say that is what you did.

A row that looks wrong is worth naming as a doubt. Do not open the code to settle it, and do not
correct the row — that belongs to the session that does the work.

Never continue into the work. Never open a feature document because the summary felt thin. When
the user wants the work moved, they run `/next`.
