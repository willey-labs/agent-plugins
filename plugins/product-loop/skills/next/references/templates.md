# File shapes

Each list below is the full set of values for that column. Nothing else is valid.

Milestone status: `open` · `current` · `done`
Feature decision: `open` · `deciding` · `locked`
Feature build: `none` · `planned` · `building` · `built`
Feature kind: `page` · `contract` · `job` · `integration`

Exactly one milestone is `current`. A feature reaches `planned` once its decision is `locked`, and
`built` once every slice of its plan passes its own check.

## docs/roadmap.md

```markdown
# Roadmap

| id | milestone | status | folder |
| -- | --------- | ------ | ------ |
| M1 | Foundations | done | m1-foundations/ |
| M2 | Accounts | current | m2-accounts/ |
| M3 | Reporting | open | m3-reporting/ |
```

The order matters. `/next` takes the next row, not the interesting one. If the order is wrong, fix
it here rather than working around it.

## docs/m<n>-<name>/_milestone.md

```markdown
# M2 Accounts

Goal: <one sentence saying who is better off, and how.>

Excludes: <what this milestone leaves for later, and which milestone gets it.>

## Exit check

1. <first step of one scenario that runs end to end>
2. <...>
5. <the last step, ending in something you can see>

## Features

| id | feature | kind | decision | build | needs | doc |
| -- | ------- | ---- | -------- | ----- | ----- | --- |
| F-04 | Password reset | page | locked | built | F-01 | f-04-password-reset.md |
| F-05 | Session timeout | job | open | none | F-01, F-02 | — |
```

Write the exit check when the milestone opens. Write it at the end and you'll write the check the
work happens to pass.

## docs/_current.md

One file, one open job. Delete it when the job closes.

```markdown
# F-05 Session timeout — brainstorm

Milestone: M2
Feature: F-05
Mode: brainstorm

## Settled
- <one decision per line, written as a fact>

## Open
- <the decision ids still showing a dash in decisions.md>

## Next step
<what the next session does with the answers when they arrive>
```

In build mode use `Mode: build`. `Settled` lists the slices that pass, `Open` lists the slices left,
and `Next step` names the one slice to build.

Nothing else goes in this file. No transcript, no reasoning, no options you weighed up.

## docs/m<n>-<name>/decisions.md

One file per milestone, covering every feature in it that isn't decided yet.

```markdown
# M3 decision review

Nine decisions the build is waiting on. The `Decision` line under each holds the answer. A dash
means it's still open.

`decisions.html` next to this file draws the options, and saves a pick when opened at
<published link>.

| id | question | feature | decision |
| -- | -------- | ------- | -------- |
| D-01 | Where a finished export lands | F-09 | B |
| D-02 | What an export holds when a range is empty | F-09 | — |

## F-09 Scheduled export

### D-01 — Where does a finished export land?

<One line on what depends on this.>

- **A** — <the option in five words.> <What it costs.>
- **B** — <...> <...> *Recommended.*
- **C** — <...> <...>

Decision: B
```

The `Decision` line holds the letter, plus the user's own words if they added any. Write the letter
into the table in the same edit so the two can't disagree.

## docs/m<n>-<name>/decisions.html

The same questions as a published page. This is where options get drawn instead of described.

Each decision holds: the id, the question, one line on what depends on it, the options as
selectable controls, the cost under each option, the recommendation marked, and a note field. A
count of answered decisions sits at the top.

Every option gets a picture, drawn at the size it will really be. If the option is a layout, draw
that layout — a row at its real height, a control in its real state. If the option is a rule, a
cost, or a delay, draw what it produces: the screen a month of that rule leaves behind, the extra
row it adds to a settings list, the gap between something changing and someone seeing it. An option
with only words next to it is one the user can't weigh.

The page works out where it's running and saves accordingly. Behind the review server it posts each
pick to `decision` and reads `decisions.json` on load, both as paths relative to the page's own
address, so the server knows which milestone they belong to without the page being told. Published,
it saves to its own store instead. Opened as a bare file, it says plainly that picks aren't being
saved rather than losing them quietly.

Use relative paths for both, never a leading slash. The page is served from inside its milestone's
folder, and an absolute path would send every milestone's picks to the same place.

The page pings every four minutes so the server's idle timer only runs down once the tab is gone. It
carries no stop button of its own — the frame around it has one, and two would be a question about
which is real.

Don't ask for a name, an email, or anything else the page doesn't need.

### When the last answer lands

The count at the top reaches the total, and a panel opens saying the review is finished and telling
the user to run `/next`, which draws the final look. Nothing on the agent's side is watching the
page, so this panel is the only thing that tells the user the review is over.

It opens on the answer that completes the set, and it's there on load when the page opens already
complete. Taking an answer back closes it again. It doesn't cover the decisions or scroll away from
them — someone who wants to re-read a pick before moving on can.

### A running demo inside a decision

Some decisions are only different over time. Something arrives late, something moves while a person
is using it, something interrupts them. A still picture can't show that.

Build a demo instead, inside that decision's card, instead of the still pictures its options would
have had. Don't make it a second file.

How it works: each option gets its own panel, side by side, identical to start with. One event fires
into every panel at the same moment. A pointer stands in for the person and does what they'd have
been doing when the event lands. Each panel ends with a line saying what happened to that person —
what opened, what they lost, what they never saw.

It plays once when the page opens, and a button replays it. With reduced motion on, it jumps to the
end state instead of animating.

Example: choosing between confirming a save the moment it's pressed, and confirming it once the
write finishes. Two panels, one slow write fired into both, a pointer pressing save and moving on.
The first panel says the person walked away trusting a save that hadn't happened. The second says
they waited two seconds and knew.

## docs/m<n>-<name>/final-look.html

The milestone working, as the answers make it, on one page. One file for the whole milestone.

It shows the screens the milestone touches, at the size they'll really be, with every answered
decision drawn as the answer that won. A row that holds two items and a count holds two and a count.
A mark that appears past a threshold appears past it and nowhere else. A list that waits for a click
before reordering waits.

A stamp names every decision it was drawn from and the letter each one holds, in id order. It is
written twice from the same facts: once across the top of the page for a reader, and once as a
`drawn-from` meta tag whose content lists each id and letter separated by commas, so the review
server can compare it without reading the layout.

The meta tag is what makes a stale drawing findable. A decision reopened later leaves a stamp that
no longer matches, the server marks the milestone's drawing stale and names the decisions that
moved, and the next session redraws. Change the two halves together or the page claims one thing and
reports another.

Seed content exercises the answers rather than filling space. Every limit has something that reaches
it, every threshold has something on each side, every state a decision names has an example on the
page. A decision that nothing on the page exercises is one the page can't be checked against.

Anything the milestone excludes stays off it. Drawing an excluded thing makes it look settled.

It works with no server and no store. Nothing is saved from it and nothing is asked of the reader —
it's read, not answered.

## docs/m<n>-<name>/f-<nn>-<name>.md

```markdown
# Session timeout

<Who reaches this, and what they came to do. One or two sentences.>

## What is on it
## States
Empty, loading, error, and no permission — what a person sees in each.
## Actions
Each action, and what it changes.
## Rules
What it refuses: bad input, state changes that aren't allowed, limits.
## Boundaries
What it doesn't do, and which feature id does it instead.
## Who may see it
Which roles, and who it must never show.
## Acceptance
One statement that passes or fails, and proves the feature is built.
## Example
One worked case, start to finish, with real values.
## In plain words
The same thing, explained to someone who has never seen the product.
```

A feature with no screen fills the same sections. "What is on it" becomes what it exposes.
"Actions" becomes what it accepts.

Write this file from scratch when the feature locks. It states the settled result as if it had
always been that way — no history, no rejected options, no reasons for the choice.

## docs/m<n>-<name>/f-<nn>-<name>-plan.md

```markdown
# Session timeout — build plan

| slice | does | check | state |
| ----- | ---- | ----- | ----- |
| 1 | <the thinnest change that works end to end> | <what proves it> | built |
| 2 | <...> | <...> | none |
```

Each check has to pass or fail on its own, with no other slice finished. Slice one is the one most
likely to prove the plan wrong.
