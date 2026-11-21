---
name: next
description: Use when the user types /next alone, asks what to work on, asks to carry on from where an earlier session stopped, asks to map the product into capabilities, features and milestones, or asks to decide, plan, or build a feature of this product. Also use when the user names a feature id and nothing else.
---

# next

Do one piece of product work. Read the state from disk, say in one line what you're about to do,
then do it.

## Pick the unit

Read `docs/roadmap.md`. Use the first rule below that matches. Don't weigh them up.

1. `docs/_current.md` exists — carry on from its `Next step`.
2. No `docs/capabilities.md` — run MAP. Its `Map:` line reads `proposed` — the map waits on the
   user's answer. Handle an answer in this message as MAP says. With none, run `/serve`, give the
   user the map's address, ask for the answer, and stop.
3. Take the first milestone that isn't `done`. Read its `_milestone.md`.
4. A feature with decision `open` — run BRAINSTORM. It covers every undecided feature in the
   milestone at once.
5. All features decided, and the milestone folder has no `final-look.html`, or one whose stamp
   disagrees with `decisions.md`, or one missing the mark of an answered decision or an exit step —
   run FINAL LOOK.
6. A feature with build `planned` or `building` — run BUILD on its next unbuilt slice.
7. All features decided and one has build `none` — run PLAN on the first.
8. All features built — run CLOSE.
9. No milestones left — run MAP on the sub-features the map holds for `later`. With none left, say
   the roadmap is done. Stop.

A feature's decision is `open`, `deciding` or `locked`, and its build is `none`, `planned`,
`building` or `built`. Write no other value. A row already holding one matches no rule, and the pick
slides past it to a later feature — name the row and the value, ask which value it holds, and stop.

Say what you're doing first, in one line: milestone, feature, mode, position. `M2 Reminders, F-03
SMS reminders, brainstorm, 4 of 7 decisions answered.` The user can veto in one word.

A feature id is the only argument, and it only changes which feature you pick. `/next f-07` runs the
same steps on that feature. Anything else passed is not an argument — say so and read the state.

## Files you may open

`docs/roadmap.md` and `docs/capabilities.md`. `docs/_current.md` if it exists. The current
milestone's `_milestone.md`, `decisions.md`, `decisions.html` and `final-look.html`. The feature
documents listed in the row's `needs` column. In BUILD, the source files the slice names. In MAP,
every milestone's `_milestone.md` and the sources MAP names.

Don't open another milestone's folder outside MAP. Don't open a feature document you aren't working
on. Don't open source code outside BUILD and MAP. Don't read all of `docs/`.

## One job at a time

`docs/_current.md` is the open job. While it exists, don't start a different feature — not for a
named argument, not because the open one looks stuck. Carry on with the open job, and say in the
opening line that you set the argument aside and which job took its place.

## MAP

Lay the product out as business capabilities, then features, then sub-features, and cut the
milestones across that map. Nothing else runs until the user confirms it.

Read what the product is from the user's brief and the documents they point to. In a repo that
already has work in it, also read what is built — its screens, services and integrations — and its
commit history when the user agrees. Everything on the map traces to one of those. A gap you notice
is a question for the user, not a row.

Build the map top down:

1. Capabilities first: each area of the business the product covers, the actor it serves, and one
   sentence on the outcome. A capability is something the owner would notice missing, never a part
   of the system.
2. Features second: each screen, service or connection people use or rely on, under exactly one
   capability, with its kind.
3. Sub-features third: each behaviour a person can see or a check can prove, under exactly one
   feature. A sub-feature has its own acceptance statement.

Then cut milestones:

- Each milestone has one main capability, and its goal states that capability's outcome for a named
  actor.
- The first milestone is the thinnest path on which the main actor reaches the product's core
  outcome from start to finish. It takes the first sub-feature of each capability on that path.
- A milestone takes sub-features of its main capability freely. It takes a sub-feature of another
  capability only when a step of its exit check can't pass without it, and names that step.
- A milestone holds at most 15 sub-features. Past that, split it into consecutive milestones along
  the main capability's features.
- Order milestones by what the business needs first. Between two equal needs, put first the one more
  likely to change the map if it goes wrong.
- Security, performance and infrastructure work are sub-features of the capability they protect or
  carry. They make a milestone of their own only when its goal states the protection as an outcome
  the owner would notice.
- A feature can span milestones. Each milestone's row for it covers only the sub-features that
  milestone takes.
- Every sub-feature lands in exactly one milestone, or in `later`.

Name everything in the words the business and its users already use, so someone who has never seen
the product understands each name on its own. The naming table in `references/templates.md` gives the
form for each level. No metaphors, slogans or invented phrases.

A project that already has milestones keeps its `done` ones exactly as they are. Place their
features on the map under the milestone that built them, and cut only the work that isn't done.

Write `docs/capabilities.md` with `Map: proposed`, `docs/roadmap.md`, and the `_milestone.md` of the
first milestone that isn't done, with its exit check. Run `/serve`, give the user the address, name
the two or three calls most worth checking — a capability that might be named wrong, a milestone
order that could go either way, a milestone split in two for size and where the cut falls — and
stop.

When the user answers about a proposed map: a confirmation sets `Map: confirmed` and stops. Changes
get made in the same files, the map stays `proposed`, and you hand the address back. A map that
changes after it's confirmed goes back to `proposed`.

## BRAINSTORM

Give the user every open question at once, as a review they can answer in any order. Don't ask one
question per message. That makes them hold the whole feature in their head for a dozen replies.

Write two files in the milestone folder. Both cover every undecided feature in the milestone.

- `decisions.md` — every question, grouped under the sub-feature it shapes, or under its feature
  when it shapes the whole feature. Each gets a line saying what depends on it, two or three
  lettered options, and a `Decision:` line with a dash. Put a table at the top listing the questions
  and their answers, so it's easy to see how many are left.
- `decisions.html` — the same questions as a web page. Every option on it is a working prototype the
  user plays with, and the page saves the user's picks.

Then run `/serve`, which puts the page at `http://localhost:4399` and writes every pick straight into
`decisions.md`. Give the user that address. It's the main way they answer. Running `/serve` when the
server is already up changes nothing, so never check first.

When the last decision lands, the page says every question is answered and tells them to run
`/next`, which builds the final look. Nothing is listening for that moment on this side — the session
handed over the address and stopped — so the page is what tells them the review is done.

The server stops on the button, on ctrl-c, or after fifteen idle minutes, and `/serve` brings it
back. Tell the user that once. It's the answer to every later "the page is gone".

Also publish `decisions.html` and give them the link, for answering away from this machine. The
published copy saves picks in its own store instead.

Never tell the user to open `decisions.html` as a file, and never hand them the `node` command. A
file opened directly has no server behind it, so their picks vanish on the next reload and every
answer already given shows as unanswered. The address is the only thing they should be given.

Write `decisions.md`, then `decisions.html` in passes, one feature's decisions per edit. Check that
every option of every decision carries its prototype mark, start the server, hand over the address,
stop. Answers come back in whatever order the user likes.

A review page already written keeps every answer. Build any prototype it lacks — the review server
names them on the Decisions tab — and change nothing else.

Questions to cover for each feature, in this order, across the sub-features this milestone takes:
who reaches it and what they want; what it holds; how it behaves when empty and when something it
depends on is down; what someone can do to it; what it refuses; what it leaves to another feature,
named; who can see it and who must never; how you'll know it works; one worked example.

A feature with no screen answers the same nine. "What it holds" becomes what it exposes. "What
someone can do to it" becomes what it accepts.

Writing the options:

- Every option should be one a reasonable person would pick. Say what it costs, not what it gives.
- Recommend one and mark it. Give one line of reason. Don't recommend when the choice comes down to
  taste, or to money you can't see.
- If there's only one sensible answer, it isn't a decision. Settle it, write it down as settled, and
  leave it out of the review.
- Build every option as a playable prototype: a working piece of the product that behaves the way
  the option makes it behave. The user decides by using the options, not by reading about them.
  The template gives the form for each kind of feature.
- Prototype what the option leads to — that's playable even when the option is a rule. Usually one
  of these: what it leaves behind after a month of use, what it adds to a screen people already
  use, how long it makes someone wait next to the alternative, or what someone sees when it breaks.
- Put an option's prototype next to its rivals, at the size it will really be, from the same
  starting state and the same data, so the difference is what the user finds.
- Give every decision a Play that fires the moment that matters into all its options at once and
  ends each with what happened to the person in it. Decisions about time — something that moves,
  arrives late, reorders itself or interrupts someone — depend on it most.
- If the options can't be made to play differently, they aren't a decision. Settle it, or find the
  moment where they part.
- Keep the review to one page and one file.
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

Build the milestone as a clickable prototype, as the answers make it, on one page, in one file:
`final-look.html` in the milestone folder. One page for the whole milestone, not one per feature —
the decisions were taken together and the point is to use them together. The user moves between
the screens, does what the milestone lets them do, switches role and state, and walks the exit
check step by step.

The page carries a stamp listing every decision and the letter it holds. Compare that stamp to
`decisions.md` before anything else. They agree, and every answered decision and exit step has its
mark — the prototype is current, so leave it alone and move on to the next rule. They disagree, or
there is no stamp — rebuild the whole page and write a fresh stamp. A stamp is the only way a
reopened decision ever reaches the prototype, so never write one without rebuilding, and never
rebuild without rewriting it. A missing mark alone needs only the piece that lacks it.

Every answer has to work here, as that answer and no other. A question answered B behaves as B,
including where B lost the recommendation. Read the `Decision` lines again as you build; don't work
from what you remember recommending.

Build nothing the milestone excludes, and no sub-feature it doesn't take. `_milestone.md` names both,
and a prototype that includes either makes it look agreed.

Seed it with enough made-up content to exercise the answers. A limit that shows at four items needs
a row with four. A mark that appears past a threshold needs something over it and something under
it. An answer the seed never exercises is an answer the page can't be checked against.

This is the check on the combination, and it runs before anything is cut into slices. Each decision
was weighed alone. Two that each read well can sit badly on one screen, and this is the only place
that shows up while changing it is still cheap.

Write the file in passes, as the template says, run `/serve`, give the user the address, say which
answers and which exit check steps to try first, and stop. Don't plan. If they want an answer changed, that's a decision reopening — say so and let them
call it.

## PLAN

Cut the locked feature into slices along the sub-features this milestone takes. Every slice serves
one sub-feature, and every sub-feature has at least one slice. If a slice can't be checked until
another slice is done, it isn't a slice — merge it or cut differently.

Each slice says what it does and how you'll check it. Write the check now, not after the code. Put
the slice most likely to prove the plan wrong first.

Write the plan file, set the row's build to `planned`, then stop. The plan is this invocation's whole
unit — don't write code in the same turn. The next `/next` picks the first slice up and builds it.

## BUILD

Build one slice. Write the failing check first, then just enough code to pass it, then run it.

Touch only what the slice names. Not the next slice. Not something untidy you noticed on the way.
Not a decision the feature document already made.

Follow the repo's coding standards.

When the slice passes, mark it built in the plan, set the row's build to `building`, and stop. When
every slice passes, set the row to `built` in the same turn. The passing check is the authority for
every one of those marks — don't ask the user to confirm what the check already proved.

If a build session runs long, stop the way a brainstorm does: write `docs/_current.md` with the
slice and what's left, then tell the user to start a new session.

## CLOSE

Run the milestone's exit check from `_milestone.md`. Report each step as pass or fail, with the
evidence.

All steps pass — set the milestone to `done` and the next one to `current`, then open it: write its
`_milestone.md` from the map, with its features, its sub-features and a fresh exit check. Say which
feature `/next` will pick up. Any step fails — say which one, and stop. Don't close it.

## Templates

Read `references/templates.md` before writing `docs/capabilities.md`, `docs/roadmap.md`, a
`_milestone.md`, `docs/_current.md`, a `decisions.md`, a `decisions.html`, a `final-look.html`, a
feature document, or a plan.

## What ships alongside

`/serve` runs the review server, which serves the map and every milestone's review page and final
look on one port and writes answers into each milestone's `decisions.md`. Its code sits in that
skill's folder.

The plugin holding this skill also registers a hook that reads the session transcript after each
turn and says once, past a threshold, how much context the session is carrying.
`CLAUDE_CONTEXT_WARN` sets the first warning and `CLAUDE_CONTEXT_WARN_STEP` the gap before it
repeats.

## Stop and ask if

- You're about to put something on the map that the brief, the user's documents and the repo don't
  show, or to invent an answer the user never gave.
- You're about to name a capability after a part of the system, or name anything with a phrase the
  business wouldn't use.
- You're about to put a sub-feature from another capability into a milestone without an exit step
  that needs it.
- You're about to change a `done` milestone while mapping.
- You're about to start a brainstorm while the map is still `proposed`.
- You're about to ask questions one at a time in chat instead of writing the review.
- You're about to send the user to `decisions.html` as a file, or to a `node` command, instead of
  the address `/serve` gives.
- You're about to offer an option without saying what it costs.
- You're about to leave an option, or an answer on the final look, as a picture or a description
  instead of something the user can play with.
- You're about to mark a row `locked` or `built` without the evidence that earns it: every decision
  of the feature answered, or every slice of the plan passing its own check.
- You're about to reopen a locked decision because the current feature would be tidier without it.
- You're about to build the final look from a recommendation instead of the answer that was picked.
- You're about to build something `_milestone.md` excludes into the final look.
- You're about to read another milestone's folder for context outside MAP.
- You're about to put the review discussion into the feature document.
- You're about to build something the plan doesn't list as a slice.

Each one means: stop, say what you were about to do, and ask.
