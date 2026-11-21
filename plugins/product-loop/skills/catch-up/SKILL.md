---
name: catch-up
description: Use when work was done outside the loop — an urgent fix, a quick change, commits made without /next — and the plan has to match the code again, or when /next says the plan was last checked some commits ago. Reads the commits since the plan's last check and brings the map, the milestones, the build plans and the bug list in line with what was built.
---

# catch-up

Bring the plan in line with the code. Read the commits made since the plan was last checked, put
each one where the loop would have put it, and hand the changes to the user.

## Read the state

Read `docs/roadmap.md` and its `Checked up to:` line, `docs/capabilities.md`, `docs/_current.md`
when it exists, `docs/bugs.md` when it exists, and the `_milestone.md` and build plans of every
milestone that isn't `done`.

No `docs/capabilities.md` means there is no plan to bring in line. Say that `/next` maps the product
from what is built, and stop.

## List the commits

Take the default branch's commits after the `Checked up to:` commit, oldest first, merges left out.
With no `Checked up to:` line, start after the commit that added `docs/capabilities.md`. Leave out
commits that change only `docs/`: they are the plan's own.

Read each commit's message and the files it changed, and the code where the message doesn't say
what it built. None left — say the plan is up to date, move the line to the newest commit, and stop.

## Sort each commit

Exactly one of:

- **Planned work.** It does what a slice of a build plan says: mark the slice built, and set the
  feature's build as BUILD does. It builds a sub-feature of a milestone that isn't `done` but has no
  plan yet: name it, and ask whether that sub-feature counts as built. On a yes, list it on that
  milestone's page under `## Built outside the loop`, with the commit, so the review asks nothing
  about it and the plan cuts no slice for it.
- **A fix.** It repairs behaviour a built sub-feature promised. An open bug it fixes becomes `fixed`,
  with the commit under `Fixed by`. Otherwise add a bug in the shape of `docs/bugs.md`, already
  `fixed`: what was wrong, what should happen, the sub-feature, and the commit.
- **New work.** It built behaviour no sub-feature covers. Place it on the map as the feature skill
  does — capability, feature, sub-features — in a milestone found for it below.
- **Upkeep.** It changes nothing a person can see: a refactor, a rename, a dependency, a test, a
  build or deploy setting. Leave it out.

A commit that does two of these counts for each.

## Found milestones

New work that is already built gets milestones of its own, marked `done`, because the work is done:

- Group the new work by capability. One capability's new work, in date order, is one milestone; past
  15 sub-features, split it into consecutive milestones along the features.
- Each takes the next milestone number the roadmap hasn't used, and its row goes right after the last
  `done` row.
- Write its `_milestone.md`: its main capability, its goal as the outcome the work gave its actor, its
  features with decision `locked` and build `built`, its sub-features, an exit check of the steps a
  person can now take, and the line `Built outside the loop: <first commit>…<last commit>`.
- Write its `decisions.md` in the review's shape: each choice the code made, the option it took as
  the answer, and the plain alternatives the code shows it passed over. Its title says
  `Rebuilt from commits`, and no question waits on the user.

## Hand it over

In one edit, move `Checked up to:` in `docs/roadmap.md` to the newest commit read. When the map
changed, set `Map: proposed`, and add every milestone the changes touched to the `Changed:` line. A
found milestone is `done`, so the current milestone's work goes on while the map waits.

Report each change by commit range: slices marked built, bugs recorded, found milestones with their
capabilities, and every commit you couldn't place, with its subject. Name the calls most worth
checking: a found milestone's name and capability, a fix that might be new work, a sub-feature
counted as built before its review. When the map changed, run `/serve` and give the address. Stop.

When the user answers, a confirmation sets `Map: confirmed`, removes the `Changed:` line, and stops.

## Files you may write

`docs/capabilities.md`, `docs/roadmap.md`, `docs/bugs.md`, the build plans of features the commits
built, the `_milestone.md` of a milestone whose work the commits built, and the `_milestone.md` and
`decisions.md` of found milestones. Never code.

## Stop and ask if

- You're about to mark something built that no commit shows.
- You're about to name a found milestone after a commit message instead of what it delivers.
- You're about to change a feature that the open job in `docs/_current.md` works on.
- You're about to place a commit you couldn't read. List it instead.

Each one means: stop, say what you were about to do, and ask.
