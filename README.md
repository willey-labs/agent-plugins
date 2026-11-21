# agent-plugins

Plugins for [Claude Code](https://claude.com/claude-code), published as one marketplace.

## Install

```shell
/plugin marketplace add willey-labs/agent-plugins
/plugin install product-loop@willey-labs
```

Point the marketplace at a local clone instead by passing its path:

```shell
/plugin marketplace add ./agent-plugins
```

## Plugins in this repo

### `product-loop`

Drives product work one unit at a time, from a capability map to a built slice. It keeps the state
on disk — a map of the product's capabilities, a roadmap, a milestone folder per phase, and a marker
for the job currently open — so a new session picks up where the last one stopped without being
told.

`/start-project` opens a new product from nothing. It refuses a project that already has code or a
map, asks only what the brief leaves out, and turns the brief into business capabilities, their
features and sub-features, and the milestones cut across them, with the first milestone's page and
exit check written. The user confirms the map, and `/next` takes it from there.

`/next` does one piece of work. It reads the state, says in one line which milestone, feature and
mode it chose, then runs that mode. A product with no map gets one first: business capabilities,
then the features under each, then their sub-features, all in plain business terms, with milestones
cut across them. Each milestone moves one capability forward, and the user confirms the map before
anything else runs. Undecided features go to a review that asks every open question at once, as a
page where every option is a working prototype the user plays with before picking, and a matching
document that records the answers. Once a milestone is decided, its final look puts the whole
milestone together as one clickable prototype, with a guide through its exit check. A decided
feature gets sliced into a plan along its sub-features. A planned feature gets built one slice at a
time. Passing a feature id changes which feature it picks, nothing else. Passing a bug id fixes that
bug: a check that shows the fault first, then the smallest change that passes it. Bugs are fixed
only when named.

`/feature` puts a new request on a product that already has a map. It finds the capability the
request moves forward, adds the feature and its sub-features under it, and gives them a milestone:
the current one while its review hasn't started, otherwise a new milestone of their own, so work
already decided or being built is never sent back to its review. A request the map already holds is
named, not added twice, and a fault in something already built goes to `/issue`. The map goes back
to the user to confirm, and `/next` reaches the new milestone in roadmap order.

`/decide` runs a milestone's decision review before its turn comes: `/decide m4` writes that
milestone's page from the map and puts its review in front of the user, while the current milestone
carries on. Planning, the final look and the build stay in roadmap order, so the final look checks
the early answers against the map as it stands when the milestone's turn comes.

`/issue` sorts a reported problem against the map. A fault in built work becomes a bug in
`docs/bugs.md`, tied to the sub-feature it breaks, for `/next` to fix by its id. Work nobody planned
goes to `/feature`. A sub-feature not built yet is named with the milestone that delivers it, and
the product doing what it was built to do is left to the user: keep it, or change it as new work.
Nothing is recorded before the user confirms the sort.

`/serve` puts the review pages in front of the user, on one address that never changes. A Map tab
draws the capability map with the milestones across it and lists any rule the map breaks, and a
Presentation tab shows the roadmap deck. Tabs across the top reach every milestone, each offering
its decision review, where every option is a prototype to play with, and its final look, the
finished milestone as a clickable prototype. Each tab names any option or answer left without a
prototype. Running it a second time does nothing, so it is also the answer when the page has gone —
the server closes itself after fifteen idle minutes. `/serve stop` closes it by hand.

`/present-roadmap` turns the map and the roadmap into a 16:9 slide deck and a PDF: the milestones as
a route, what the product does, its capabilities by area, how the work is cut, a journey chart, one
slide per milestone headed by what changes for people, and where the work stands, with a detail page
per milestone in an appendix. The agent writes the words; the counts, colours and order come from the
plan, and the build refuses words that disagree with it or slides that overflow. It needs Chrome or
Chromium for the PDF.

`/status` reports where the work stands and never continues into it: the map, a line per milestone
with its main capability, the current milestone's features, the job currently open, and anything
waiting on the user, named as an action they take.

A session hook watches how much context the session carries and suggests a fresh one past a
threshold. It warns at 400k tokens and again every 100k after that; `CLAUDE_CONTEXT_WARN` and
`CLAUDE_CONTEXT_WARN_STEP` override both.

## Repo layout

```
agent-plugins/
  .claude-plugin/
    marketplace.json                 ← lists every plugin below
  plugins/
    product-loop/
      .claude-plugin/plugin.json
      hooks/
      skills/
```

Each plugin is a folder under `plugins/`, listed once in the marketplace file. Adding a plugin means
adding a folder and one entry.

## License

MIT
