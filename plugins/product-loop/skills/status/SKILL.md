---
name: status
description: Use when the user types /status alone, or asks where the product work stands, what is finished, what is left, what is in progress, or what is waiting on them.
---

# status

Report where the product work stands. Read only, and cheap — never a step toward doing the work.

## Read

`docs/roadmap.md`, then every milestone's `_milestone.md`, then `docs/_current.md` when it exists,
then the current milestone's `decisions.md` when it exists — its summary table only.

Nothing else. No feature documents, no plans, no source code, no tests.

## Report

Four parts, in this order.

One line per milestone: id, name, how many of its features are built out of the total, and its
status.

The features of the milestone marked `current`, one line each: id, name, decision, build.

The open job, when `docs/_current.md` exists: the feature, the mode, and its next step verbatim.

Anything waiting on the user, last, and named as an action they take. Two are usual: decisions still
holding a dash in `decisions.md`, counted and named by id, and a plan needing approval. Nothing
waiting — say so in those words.

## Hold the line

The files are the source. Report what they say, and say that is what you did.

A row that looks wrong is worth naming as a doubt. Do not open the code to settle it, and do not
correct the row — that belongs to the session that does the work.

Never continue into the work. Never open a feature document because the summary felt thin. When
the user wants the work moved, they run `/next`.
