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
4. All features decided, and either no `final-look.html` in the milestone folder or one whose stamp
   disagrees with `decisions.md` — run FINAL LOOK.
5. All features decided and one has build `none` — run PLAN on the first.
6. A feature with build `approved` — run BUILD on its next unbuilt slice.
7. A feature with build `planned` — show its slices and ask for approval. Stop.
8. All features built — run CLOSE.
9. No milestones left — say the roadmap is done. Stop.

Say what you're doing first, in one line: milestone, feature, mode, position. `M2 accounts, F-06
password reset, brainstorm, 6 of 9 decisions answered.` The user can veto in one word.

An argument only changes which feature you pick. `/next f-07` runs the same steps on that feature.

## Files you may open

`docs/roadmap.md`. `docs/_current.md` if it exists. The current milestone's `_milestone.md`,
`decisions.md`, `decisions.html` and `final-look.html`. The feature documents listed in the row's
`needs` column. In BUILD, the source files the slice names.

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

Then run `/serve`, which puts the page at `http://localhost:4399` and writes every pick straight into
`decisions.md`. Give the user that address. It's the main way they answer. Running `/serve` when the
server is already up changes nothing, so never check first.

When the last decision lands, the page says every question is answered and tells them to run
`/next`, which draws the final look. Nothing is listening for that moment on this side — the session
handed over the address and stopped — so the page is what tells them the review is done.

The server stops on the button, on ctrl-c, or after fifteen idle minutes, and `/serve` brings it
back. Tell the user that once. It's the answer to every later "the page is gone".

Also publish `decisions.html` and give them the link, for answering away from this machine. The
published copy saves picks in its own store instead.

Never tell the user to open `decisions.html` as a file, and never hand them the `node` command. A
file opened directly has no server behind it, so their picks vanish on the next reload and every
answer already given draws as unanswered. The address is the only thing they should be given.

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

## FINAL LOOK

Draw the milestone as the answers make it, on one page, in one file: `final-look.html` in the
milestone folder. One page for the whole milestone, not one per feature — the decisions were taken
together and the point is to see them together.

The page carries a stamp listing every decision and the letter it holds. Compare that stamp to
`decisions.md` before anything else. They agree — the drawing is current, so leave it alone and move
on to the next rule. They disagree, or there is no stamp — redraw the whole page and write a fresh
stamp. A stamp is the only way a reopened decision ever reaches the drawing, so never write one
without redrawing, and never redraw without rewriting it.

Every answer that shows on a screen has to show here, as that answer and no other. A question
answered B is drawn B, including where B lost the recommendation. Read the `Decision` lines again as
you draw; don't work from what you remember recommending.

Draw nothing the milestone excludes. `_milestone.md` names what this milestone leaves out, and a
drawing that includes it makes the excluded thing look agreed.

Seed it with enough made-up content to exercise the answers. A limit that shows at four items needs
a row with four. A mark that appears past a threshold needs something over it and something under
it. An answer that never draws in the seed is an answer the page can't be checked against.

This is the check on the combination, and it runs before anything is cut into slices. Each decision
was weighed alone. Two that each read well can sit badly on one screen, and this is the only place
that shows up while changing it is still cheap.

Write the file, run `/serve`, give the user the address, say which answers to look at hardest, and
stop. Don't plan. If they want an answer changed, that's a decision reopening — say so and let them
call it.

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
`docs/_current.md`, a `decisions.md`, a `decisions.html`, a `final-look.html`, a feature document, or
a plan.

## What ships alongside

`/serve` runs the review server, which serves every milestone's review page and final look on one
port and writes answers into each milestone's `decisions.md`. Its code sits in that skill's folder.

The plugin holding this skill also registers a hook that reads the session transcript after each
turn and says once, past a threshold, how much context the session is carrying.
`CLAUDE_CONTEXT_WARN` sets the first warning and `CLAUDE_CONTEXT_WARN_STEP` the gap before it
repeats.

## Stop and ask if

- You're about to invent a milestone, a feature, or an answer the user never gave.
- You're about to ask questions one at a time in chat instead of writing the review.
- You're about to send the user to `decisions.html` as a file, or to a `node` command, instead of
  the address `/serve` gives.
- You're about to offer an option without saying what it costs.
- You're about to mark a row `locked`, `approved` or `built` yourself.
- You're about to reopen a locked decision because the current feature would be tidier without it.
- You're about to draw the final look from a recommendation instead of the answer that was picked.
- You're about to draw something `_milestone.md` excludes into the final look.
- You're about to read another milestone's folder for context.
- You're about to put the review discussion into the feature document.
- You're about to build a slice the user hasn't approved.

Each one means: stop, say what you were about to do, and ask.
