---
name: serve
description: Use when the user types /serve alone or with stop, asks to open or reopen the decision review or the final look, asks to see a milestone again, says the review page or the review server is down, or asks to stop the review server.
---

# serve

Put the review pages in front of the user. One server, one port, every milestone.

Takes `stop` or nothing.

## The address

`http://localhost:4399`, always. The page opens on the milestone with decisions still to answer,
newest if they are all answered, and the tabs at the top reach every other one.

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

Every folder under `docs/` named `m<n>-<something>`. Each milestone offers its decision review and
its final look, and a tab is greyed out when that milestone has no such page yet.

The final look tab carries the state of the drawing behind it. The server reads the stamp the
drawing was written with and compares it to the answers in `decisions.md`: they agree and the tab is
plain, they disagree and it reads stale, there is no stamp and it says so. A stale or unstamped
drawing also puts a line under the tabs naming the decisions that moved. Report that line when you
see it; redrawing is `/next`, not this skill.

Picks made on the decision review go straight into that milestone's `decisions.md`, the same file
`/next` and `/status` read. There is no second copy of an answer anywhere.

## Hold the line

Serving is not doing the work. Don't answer a decision for the user, don't write a page that's
missing, don't open a feature document because a tab was empty. Hand over the address and stop.

A milestone with no review page is a thing to report, not to fix. `/next` builds those.

## Stop and ask if

- You're about to hand the user a `node` command or a file path instead of the address.
- You're about to start a second server on another port because 4399 was taken.
- You're about to answer a decision yourself, or write a review page from here.
