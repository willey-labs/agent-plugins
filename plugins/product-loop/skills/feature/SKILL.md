---
name: feature
description: Use when the user asks to add something new to a product that already has a capability map — a new feature, capability or behaviour ("we also need", "add a way to", "can it also", "customers keep asking for") — or to schedule a sub-feature the map holds for `later`. Places the request on the map and in a milestone, then hands the map back to the user to confirm. It never decides or builds.
---

# feature

Put one request on the map: its capability, its feature, its sub-features, and the milestone that
delivers it. Then hand the map back to the user, as MAP does.

## Read the state

Read `docs/capabilities.md` and `docs/roadmap.md`. Read the `_milestone.md` of the first milestone
that isn't `done`, and list that milestone's folder.

No `docs/capabilities.md` means there is no map to add to. Say that `/next` maps the product first,
with this request as part of the brief, and stop.

## Read the request

Say in one line who asks for it and what they can do once it exists: `Receptionist: move a booking
to another clinic.` When the request doesn't say who it serves or what changes for them, ask that
one question and wait.

Then look for it on the map. The map holds the request only when a sub-feature already lets this
actor do this thing, with nothing added. A request that adds to a sub-feature — another actor,
another case, one more step — isn't on the map yet: it becomes a new sub-feature.

- The map holds it, and the sub-feature's milestone isn't `done`. Name the sub-feature and its
  milestone, and stop.
- The map holds it in `later`. The request is to schedule it: pick its milestone below and leave the
  rest of the map as it is.
- The map holds it in a `done` milestone, and the user reports that the product no longer does what
  the sub-feature says. That is a fault in built work, not new work. Name the sub-feature and the
  milestone that built it, tell the user the fault is fixed in the code directly because the plan
  has no step for fixes, and stop.
- The map holds it in a `done` milestone, and nobody reports a fault. It is built already. Name it,
  and stop.
- In a repo with work in it, read the screens, services and integrations of the request's area. When
  the code already does it, say where, and stop.

## Place it on the map

Top down, in the naming forms of the next skill's `references/templates.md`:

1. Capability: the area of the business the request belongs to, serving the request's actor. When
   that capability's outcome sentence leaves the actor or the request out, widen the sentence in the
   same edit. When no capability covers the area, add one, with the actor it serves and one sentence
   on the outcome. A capability is an area the owner would notice missing, never a part of the
   system.
2. Feature: the screen, service or connection people point at, under exactly one capability, with
   its kind. The request extends an existing feature when people would do it on that same screen,
   service or connection. A feature that serves other actors is no evidence that this actor uses
   it: when the map, the request and the repo don't show where this actor would do it, ask.
3. Sub-features: each behaviour a person can see or a check can prove. New ids continue the
   feature's numbering. An id already on the map never changes.

## Pick the milestone

Take the first that fits:

1. The current milestone, while its review hasn't started: its folder holds no `decisions.md`, and
   the feature the request lands in is either new to the milestone or already in it with decision
   `open`. The new sub-features belong to the milestone's main capability, or an exit step the
   milestone already has can't pass without them. The milestone stays within 15 sub-features.
   - Add the feature's row with decision `open` and build `none` when the milestone doesn't have it
     yet, and a row per sub-feature.
   - Fit one step into the exit check where its scenario reaches the new behaviour, and renumber the
     `exit step` column for any sub-feature that names a later step.
   - When the milestone's goal no longer covers what it delivers, widen it, still on one line. When
     its name no longer says what it delivers, rename it on its page and in its roadmap row.
2. A new milestone, with the request's capability as its main capability and a name that says what
   gets delivered. Its id is the next number the roadmap hasn't used, wherever its row goes, and its
   folder is `m<n>-<name>/`. Add its row to `docs/roadmap.md` with status `open`, after the last
   milestone that isn't `done`. When the user wants it sooner ("now", "next", "first") and the
   current milestone can't take it, put it right after the current milestone and say why it couldn't
   join. Past 15 sub-features, split it into consecutive milestones along the
   features. Its goal, exit check and `_milestone.md` are written when it becomes current.
3. `later`, when the user says it isn't for now.

A milestone whose review has started takes no new work: decisions come before building, and the
review covers the features it started with. A `done` milestone takes no new work.

Once the milestone is picked, say in one line what the request becomes:
`C-02 Patient reminders, F-03 SMS reminders, adds F-03.4 Remind by WhatsApp, new milestone M5.`

## Hand it over

Set `Map: proposed`, and change the summary table and the sections in the same edit. Run `/serve`,
give the user the address, and name each call to check, most important first: a milestone split for
size and where the cut falls, a request that couldn't join the current milestone because it would
pass 15 sub-features, an exit step added, a sentence widened, a milestone renamed, the capability the request went under, an existing feature
extended or a new one added, and the new milestone's place in the order. Tell the user the map waits
on their answer: an open job in `docs/_current.md` carries on, and nothing else moves until they
answer. The server stops after fifteen idle minutes, and `/serve` brings it back. Stop.

When the user answers, a confirmation sets `Map: confirmed` and stops. Changes go into the same
files, and the map stays `proposed`. Once the map reads `confirmed`, `/next` reaches the new work in
roadmap order.

## Files you may write

`docs/capabilities.md`, `docs/roadmap.md`, and the current milestone's `_milestone.md` when the
request joins it. Nothing else.

## Stop and ask if

- You're about to add something the request, the user's answers and the repo don't show.
- You're about to name a capability after a part of the system, or name anything with a phrase the
  business wouldn't use.
- The user names a `done` milestone, or one whose review has started, as the place for the request.
  Say why it can't go there, offer the place right after the current milestone, and ask.
- You're about to put a sub-feature from another capability into the current milestone without an
  exit step it already has that needs it.
- You're about to change an id already on the map.
- You're about to decide how the feature behaves. That is the review's job.

Each one means: stop, say what you were about to do, and ask.
