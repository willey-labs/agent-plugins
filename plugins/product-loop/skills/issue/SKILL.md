---
name: issue
description: Use when the user reports a problem with the product — something broken, wrong, or not doing what people expect ("X doesn't work", "users complain that", "since yesterday it", "bug") — or asks whether something is a bug. Works out the report's case and has the user confirm it, records that understanding in docs/requests.md, then sorts the report against the capability map: a fault in built work becomes a bug in `docs/bugs.md`, tied to the sub-feature it breaks; work nobody built goes to the feature skill; the product doing what it was built to do is the user's call. It never fixes; `/next B-01` fixes a bug.
---

# issue

Understand one reported problem, record the understanding the user confirms, sort it against the
map, record it where it belongs, and stop.

## Read the state

Read `docs/capabilities.md`, `docs/roadmap.md`, `docs/bugs.md` and `docs/requests.md` when they
exist.

No `docs/capabilities.md` means there is nothing to sort against. Say the product needs a map first
— `/start-project` for an empty project, `/next` for one with code — and stop.

## Understand the report

Work out the case before anything is sorted. Read the report, what it points to, and, in a repo with
work in it, the code of the area it is about. Then write back your understanding in the sections of
a `docs/requests.md` entry, as the next skill's `references/templates.md` shapes it:

- The case: who hit it, what they did, what happened, and what they expected, with the real record
  and figures the report gives.
- Settled: every choice the user already made about the fix or about how the product behaves.
- Build steps: the work the user already planned, in their order, each with its check.
- Out: what the report leaves out.

Write it in your own plain words, never a copy of the report. Ask whether it is right, and in the
same message ask about anything it leaves out of what happened or what was expected. Wait. Take
every correction and show the whole understanding again. Write nothing before a yes.

Once it is confirmed, say it in one line:
`Patient: opened a free day, every slot showed as full, expected the free slots.`

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

- **Bug.** An open bug on the same sub-feature with the same symptom is the same bug: add the
  confirmed entry to `docs/requests.md`, sorted `bug` and landed in that bug's id, name it, and stop.
  Otherwise give it the next unused id, add its row to the summary table of `docs/bugs.md` with
  status `open`, and add its section: what happens, what should happen, and how to see it — the
  steps and the data that make it happen, as the confirmed case and the code show them — with the
  entry's id on its `Request` line. Add the entry, sorted `bug` and landed in the new bug's id. Say
  that `/next B-04` fixes it, with its id, and stop.
- **Not built yet.** Add the entry, sorted `on the map` and landed in the sub-feature and the
  milestone that delivers it. Name that milestone, and stop.
- **Not on the map.** Hand the expected behaviour and the confirmed entry to the feature skill as its
  request.
- **Works as built.** Ask whether to keep it or change it. A change is new work: hand it and the
  confirmed entry to the feature skill as its request. Kept, add the entry, sorted `works as built`
  and landed in the sub-feature that covers it. Say so, and stop.

## Files you may write

`docs/requests.md` and `docs/bugs.md`, in the shapes of the next skill's `references/templates.md`.
Nothing else. When this hands a request to the feature skill, that skill writes its own files,
the entry included.

## Stop and ask if

- You're about to write the entry, or sort the report, before the user confirms the understanding.
- You're about to put the user's own text in the entry instead of your understanding of it.
- You're about to record a bug the user hasn't confirmed.
- You're about to call it a bug when no built sub-feature says the product does what the reporter
  expected.
- You're about to change the map or a milestone page. That is the feature skill's job.
- You're about to fix it. That is `/next` with the bug's id.

Each one means: stop, say what you were about to do, and ask.
