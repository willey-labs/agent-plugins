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

Drives product work one unit at a time, from an open decision to a built slice. It keeps the state
on disk — a roadmap, a milestone folder per phase, and a marker for the job currently open — so a
new session picks up where the last one stopped without being told.

`/next` does one piece of work and takes no arguments. It reads the state, says in one line which
milestone, feature and mode it chose, then runs that mode. Undecided features go to a review that
asks every open question at once, as a page the user answers in any order and a matching document
that records the answers. A decided feature gets sliced into a plan. A planned feature gets built one
slice at a time. Passing a feature id changes which feature it picks, nothing else.

`/serve` puts the review pages in front of the user, on one address that never changes. Tabs across
the top reach every milestone, each offering its decision review and its drawing of the finished
milestone. Running it a second time does nothing, so it is also the answer when the page has gone —
the server closes itself after fifteen idle minutes. `/serve stop` closes it by hand.

`/status` reports where the work stands and never continues into it: a line per milestone, the
current milestone's features, the job currently open, and anything waiting on the user, named as an
action they take.

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
