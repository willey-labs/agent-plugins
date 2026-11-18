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

`/next` does one piece of work. It reads the state, says in one line which milestone, feature and
mode it chose, then runs that mode. A product with no map gets one first: business capabilities,
then the features under each, then their sub-features, all in plain business terms, with milestones
cut across them. Each milestone moves one capability forward, and the user confirms the map before
anything else runs. Undecided features go to a review that asks every open question at once, as a
page where every option is a working prototype the user plays with before picking, and a matching
document that records the answers. Once a milestone is decided, its final look puts the whole
milestone together as one clickable prototype, with a guide through its exit check. A decided
feature gets sliced into a plan along its sub-features. A planned feature gets built one slice at a
time. Passing a feature id changes which feature it picks, nothing else.

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
