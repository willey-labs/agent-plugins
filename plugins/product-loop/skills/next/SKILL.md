---
name: next
description: Use when the user types /next alone, asks what to work on, asks to carry on from where an earlier session stopped, or asks to decide, plan, or build a feature of this product. Also use when the user names a feature id and nothing else.
---

# next

Do one piece of product work. Takes no arguments. Read the state from disk, say in one line what
you're about to do, then do it.

## Pick the unit

Read `docs/roadmap.md`. Use the first rule below that matches. Don't weigh them up.

1. `docs/_current.md` exists — carry on from its `Next step`.
2. Take the first milestone that isn't `done`. Read its `_milestone.md`.
3. A feature with decision `open` — run BRAINSTORM. It covers every undecided feature in the
   milestone at once.
4. All features decided and one has build `none` — run PLAN on the first.
5. A feature with build `approved` — run BUILD on its next unbuilt slice.
6. A feature with build `planned` — show its slices and ask for approval. Stop.
7. All features built — run CLOSE.
8. No milestones left — say the roadmap is done. Stop.

Say what you're doing first, in one line: milestone, feature, mode, position. `M2 accounts, F-06
password reset, brainstorm, 6 of 9 decisions answered.` The user can veto in one word.

An argument only changes which feature you pick. `/next f-07` runs the same steps on that feature.

## Files you may open

`docs/roadmap.md`. `docs/_current.md` if it exists. The current milestone's `_milestone.md`,
`decisions.md` and `decisions.html`. The feature documents listed in the row's `needs` column. In
BUILD, the source files the slice names.

Don't open another milestone's folder. Don't open a feature document you aren't working on. Don't
open source code outside BUILD. Don't read all of `docs/`.

## One job at a time

`docs/_current.md` is the open job. While it exists, don't start a different feature — not for a
named argument, not because the open one looks stuck. Say what's open and ask.

## BRAINSTORM

Give the user every open question at once, as a review they can answer in any order. Don't ask one
question per message. That makes them hold the whole feature in their head for a dozen replies.

Write two files in the milestone folder. Both cover every undecided feature in the milestone.

- `decisions.md` — every question, grouped by feature. Each gets a line saying what depends on it,
  two or three lettered options, and a `Decision:` line with a dash. Put a table at the top listing
  the questions and their answers, so it's easy to see how many are left.
- `decisions.html` — the same questions as a web page. It draws the options instead of describing
  them, and it saves the user's picks.

Then start the review server that sits next to this skill:

```
node <skill folder>/serve-decisions.mjs <milestone folder> 4399
```

It serves the page at `http://localhost:4399` and writes every pick straight into `decisions.md`.
Give the user that address. It's the main way they answer.

The server stops three ways: the button on the page, ctrl-c, or fifteen minutes with nobody on it.
The open page pings while it's there, so the idle timer only runs down once the tab is closed.

Also publish `decisions.html` and give them the link, for answering away from this machine. The
published copy saves picks in its own store instead.

Never tell the user to open `decisions.html` as a file. With no server and no published store behind
it, their picks live in the browser tab and vanish on the next reload.

Write both files, start the server, hand over the address, stop. Answers come back in whatever order
the user likes.

Questions to cover for each feature, in this order: who reaches it and what they want; what it
holds; how it behaves when empty and when something it depends on is down; what someone can do to
it; what it refuses; what it leaves to another feature, named; who can see it and who must never;
how you'll know it works; one worked example.

A feature with no screen answers the same nine. "What it holds" becomes what it exposes. "What
someone can do to it" becomes what it accepts.

Writing the options:

- Every option should be one a reasonable person would pick. Say what it costs, not what it gives.
- Recommend one and mark it. Give one line of reason. Don't recommend when the choice comes down to
  taste, or to money you can't see.
- If there's only one sensible answer, it isn't a decision. Settle it, write it down as settled, and
  leave it out of the review.
- Draw every option on the page instead of describing it. Draw what the option leads to — that's
  visual even when the option isn't. Usually one of these: what it leaves behind after a month of
  use, what it adds to a screen people already use, how long it makes someone wait next to the
  alternative, or what someone sees when it breaks.
- Put an option's drawing next to its rivals, at the size it will really be, so the difference is
  what you notice.
- Some decisions are about time: something moves, arrives late, reorders itself, or interrupts
  someone mid-action. A still picture can't show those. Build a small demo instead — the options
  side by side, the same event fired into each at the same moment, playing when the page opens and
  replayable. Each side ends with a line saying what happened to the person in it.
- The demo goes inside that decision on the review page, instead of its still pictures. Keep the
  review to one page and one file.
- If an answer would contradict a locked document, say so straight away. Don't change a locked
  document from inside another feature's session.

Answers given on the local server are already in `decisions.md` — read the file, don't ask again.
Answers given anywhere else you write in yourself, as soon as they arrive: the decision's `Decision`
line and the table row, in the same edit. If the user picked on the published page, read the picks
from that page's store first. Once a decision is answered it's closed — don't reopen it and don't
work it out again.

If the session gets long, stop. Write `docs/_current.md` listing the decisions still open, set every
covered row's decision to `deciding`, and tell the user to start a new session. Don't write a
summary of the conversation anywhere else.

When every decision for a feature is answered, close it. Write the feature document from scratch,
set that row's decision to `locked`, and delete `docs/_current.md` once nothing is left open. The
document holds settled facts only — no questions, no rejected options, no trace of the review. Leave
`decisions.md` where it is, with its answers in it.

## PLAN

Cut the locked feature into slices. If a slice can't be checked until another slice is done, it
isn't a slice — merge it or cut differently.

Each slice says what it does and how you'll check it. Write the check now, not after the code. Put
the slice most likely to prove the plan wrong first.

Write the plan file, set the row's build to `planned`, then stop and hand it over. Don't write code.
Only set it to `approved` when the user says go.

## BUILD

Build one slice. Write the failing check first, then just enough code to pass it, then run it.

Touch only what the slice names. Not the next slice. Not something untidy you noticed on the way.
Not a decision the feature document already made.

Follow the repo's coding standards.

When the slice passes, mark it built in the plan and stop. When every slice passes, set the row's
build to `built`.

If a build session runs long, stop the way a brainstorm does: write `docs/_current.md` with the
slice and what's left, then tell the user to start a new session.

## CLOSE

Run the milestone's exit check from `_milestone.md`. Report each step as pass or fail, with the
evidence.

All steps pass — set the milestone to `done`, set the next one to `current`, and say which feature
`/next` will pick up. Any step fails — say which one, and stop. Don't close it.

## Templates

Read `references/templates.md` before writing `docs/roadmap.md`, a `_milestone.md`,
`docs/_current.md`, a `decisions.md`, a `decisions.html`, a feature document, or a plan.

## What ships alongside

`serve-decisions.mjs` in this folder serves the review page and writes answers into `decisions.md`.

The plugin holding this skill also registers a hook that reads the session transcript after each
turn and says once, past a threshold, how much context the session is carrying.
`CLAUDE_CONTEXT_WARN` sets the first warning and `CLAUDE_CONTEXT_WARN_STEP` the gap before it
repeats.

## Stop and ask if

- You're about to invent a milestone, a feature, or an answer the user never gave.
- You're about to ask questions one at a time in chat instead of writing the review.
- You're about to send the user to `decisions.html` as a file instead of the server address.
- You're about to offer an option without saying what it costs.
- You're about to mark a row `locked`, `approved` or `built` yourself.
- You're about to reopen a locked decision because the current feature would be tidier without it.
- You're about to read another milestone's folder for context.
- You're about to put the review discussion into the feature document.
- You're about to build a slice the user hasn't approved.

Each one means: stop, say what you were about to do, and ask.
