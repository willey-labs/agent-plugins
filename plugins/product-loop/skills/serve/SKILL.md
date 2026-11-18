---
name: serve
description: Use when the user types /serve alone or with stop, asks to open or reopen the capability map, the decision review or the final look, asks to see a milestone again, says the review page or the review server is down, or asks to stop the review server.
---

# serve

Put the review pages in front of the user. One server, one port, the capability map and every
milestone.

Takes `stop` or nothing.

## The address

`http://localhost:4399`, always. The page opens on the map while the map waits for the user to
confirm it. Otherwise it opens on the milestone with decisions still to answer, newest if they are
all answered. The tabs at the top reach the map and every milestone.

Give the user that address and nothing else. Never hand them a command to type, a file path, or a
port worked out at runtime.

## Start

Ask the port whether our server is already there:

```
curl -s --max-time 2 http://localhost:4399/health
```

Three answers, three moves.

It replies with `"signature":"product-loop/review"` — the server is up. Give the address. Start
nothing. This is the whole point of the probe: running `/serve` twice in a row is the same as
running it once.

Nothing replies — start it from the project root, detached, so it outlives this turn:

```
node <skill folder>/review-server/serve.mjs docs 4399
```

Wait a moment, probe again, and give the address once it answers. It failed to come up — say so and
show what it printed. Don't try another port.

It replies with something else — another program holds 4399. Name what answered and stop. Starting
somewhere else buys a working page today and a wrong address tomorrow.

## Stop

`/serve stop` posts to `http://localhost:4399/stop`. Nothing on the port means it's already stopped —
say so plainly, as a fact rather than a failure.

It also stops on its own: the button on the page, ctrl-c in its terminal, or fifteen minutes with
nobody on it. Every open page pings, so an open tab keeps it alive.

Restarting is `/serve` again, which is why the idle exit is safe to leave alone.

## What it serves

The capability map from `docs/capabilities.md`, on the Map tab. It draws capabilities and their
features as rows and the roadmap's milestones as columns, each sub-feature in the cell of the
milestone that takes it, and a last column for sub-features no milestone takes yet. A sub-feature
pulled in from another capability shows dashed, with the exit step that needs it. Clicking a
milestone shows its goal, exclusions, exit check and feature states.

The map page also lists every rule the map breaks: a sub-feature landing in a milestone the roadmap
doesn't list, a milestone with no sub-feature or more than fifteen, a sub-feature from another
capability with no exit step that needs it, and a milestone page that disagrees with the map. The
Map tab reads `proposed` while the map waits for confirmation, and otherwise counts the breaks to
fix. Report them when you see them; fixing them is `/next`, not this skill.

The roadmap presentation from `docs/presentation/deck.pdf`, on the Presentation tab, once
`/present-roadmap` has built it. The tab is greyed out until then.

Every folder under `docs/` named `m<n>-<something>`. Each milestone offers its decision review, where
every option is a prototype to play with, and its final look, the whole milestone as a clickable
prototype. A tab is greyed out when that milestone has no such page yet.

The Decisions tab counts the options that carry no prototype mark. The Final look tab carries the
state of the prototype behind it. The server reads the stamp it was built with and compares it to
the answers in `decisions.md`: they agree and the tab is plain, they disagree and it reads stale,
there is no stamp and it says so. With the stamp current, the tab counts the answered decisions and
exit check steps the prototype leaves unmarked. Milestones the roadmap marks `done` are not checked
for marks.

Any of these puts a line under the tabs naming what's missing or what moved. Report that line when
you see it; building and rebuilding are `/next`, not this skill.

Picks made on the decision review go straight into that milestone's `decisions.md`, the same file
`/next` and `/status` read. There is no second copy of an answer anywhere.

## Hold the line

Serving is not doing the work. Don't answer a decision for the user, don't write a page that's
missing, don't open a feature document because a tab was empty, don't edit or confirm the map. Hand
over the address and stop.

A milestone with no review page, or a map that breaks its rules, is a thing to report, not to fix.
`/next` handles those.

## Stop and ask if

- You're about to hand the user a `node` command or a file path instead of the address.
- You're about to start a second server on another port because 4399 was taken.
- You're about to answer a decision yourself, or write a review page from here.
- You're about to change `docs/capabilities.md`, or mark the map confirmed, from here.
