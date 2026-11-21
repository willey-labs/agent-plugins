---
name: issue
description: Use when the user reports a problem with the product — something broken, wrong, or not doing what people expect ("X doesn't work", "users complain that", "since yesterday it", "bug") — or asks whether something is a bug. Sorts the report against the capability map: a fault in built work becomes a bug in `docs/bugs.md`, tied to the sub-feature it breaks; work nobody built goes to the feature skill; the product doing what it was built to do is the user's call. It never fixes; `/next B-01` fixes a bug.
---

# issue

Sort one reported problem against the map, record it where it belongs, and stop.

## Read the state

Read `docs/capabilities.md`, `docs/roadmap.md`, and `docs/bugs.md` when it exists.

No `docs/capabilities.md` means there is nothing to sort against. Say the product needs a map first
— `/start-project` for an empty project, `/next` for one with code — and stop.

## Read the report

Say in one line who hit it, what they did, what happened, and what they expected:
`Patient: opened a free day, every slot showed as full, expected the free slots.` When the report
leaves out what happened or what was expected, ask that one question and wait.

A report that holds two problems is two issues. Say so, ask which comes first, and sort one.

## Find the sub-feature

Find the sub-feature whose behaviour the report is about, on the map and on the page of the
milestone that holds it. Read its feature document when the milestone folder holds one: the rules
the product keeps live there. In a repo with work in it, read the code of that area to see what the
product does now, and name the file. When no sub-feature is about it, the report is about work
nobody planned.

## Sort it

Exactly one of:

- **Bug.** The sub-feature is built — its milestone is `done`, or its feature row reads build
  `built` — and the product doesn't do what the sub-feature, or its feature document, says.
- **Not built yet.** The sub-feature is on the map but not built: in the current milestone, a later
  one, or `later`.
- **Not on the map.** No sub-feature is about the behaviour the report describes.
- **Works as built.** A built sub-feature is about it, the product does what that sub-feature and
  its feature document say, and the reporter expected something else.

Say the sort in one line with its evidence — the sub-feature's words, and what the product does now —
and ask the user to confirm it. Write nothing before a yes.

## Then

- **Bug.** An open bug on the same sub-feature with the same symptom is the same bug: name it, and
  stop. Otherwise give it the next unused id, add its row to the summary table of `docs/bugs.md` with
  status `open`, and add its section: what happens, what should happen, and how to see it — the
  steps and the data that make it happen, as the report and the code show them. Say that
  `/next B-04` fixes it, with its id, and stop.
- **Not built yet.** Name the milestone that delivers it, and stop.
- **Not on the map.** Hand the expected behaviour to the feature skill as its request.
- **Works as built.** Ask whether to keep it or change it. A change is new work: hand it to the
  feature skill as its request. Kept, nothing is recorded: say so, and stop.

## Files you may write

`docs/bugs.md`, in the shape of the next skill's `references/templates.md`. Nothing else. When this
hands a request to the feature skill, that skill writes its own files.

## Stop and ask if

- You're about to record a bug the user hasn't confirmed.
- You're about to call it a bug when no built sub-feature says the product does what the reporter
  expected.
- You're about to change the map or a milestone page. That is the feature skill's job.
- You're about to fix it. That is `/next` with the bug's id.

Each one means: stop, say what you were about to do, and ask.
