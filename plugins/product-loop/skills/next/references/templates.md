# File shapes

Each list below is the full set of values for that column or line. Nothing else is valid.

Map: `proposed` · `confirmed`
Milestone status: `open` · `current` · `done`
Feature decision: `open` · `deciding` · `locked`
Feature build: `none` · `planned` · `building` · `built`
Feature kind: `page` · `contract` · `job` · `integration`
Plan slice state: `none` · `built`
Bug status: `open` · `fixing` · `fixed`

Exactly one milestone is `current`. A feature reaches `planned` once its decision is `locked`,
`building` once a slice of its plan passes its own check, and `built` once every slice does. A bug
reaches `fixing` once its failing check is written, and `fixed` once that check passes.

Every example below comes from one made-up product: a clinic's booking system.

## Naming

Every name uses the words the business and its users already use. Someone who has never seen the
product understands each name on its own.

| level | form | example |
| ----- | ---- | ------- |
| Capability | A noun phrase naming the business area | Appointment booking · Patient reminders · Staff roles and permissions |
| Feature | The name of the screen, service or connection people point at | Booking calendar · SMS reminders · Payment gateway connection |
| Sub-feature | A short verb phrase for one thing it does | Reschedule a booking · Send a reminder 24 hours before |
| Milestone | What gets delivered, in plain words | Online booking · SMS reminders and confirmations |

Standard product terms come before invented ones: "admin console", "inbox", "handover",
"permissions", "API key". A label from the product's own interface in another language follows the
plain name in quotes. A goal or exit step explains any non-English phrase in brackets the first time
it appears.

## docs/capabilities.md

The whole map: every capability, its features, their sub-features, and the milestone each
sub-feature lands in.

```markdown
# Capability map

<One sentence on what the product does and for whom.>

Actors: Patient · Receptionist · Clinic owner

Map: proposed

| id | capability | serves | features | milestones |
| -- | ---------- | ------ | -------- | ---------- |
| C-01 | Appointment booking | Patient | F-01 | M1, M2, M3 |
| C-02 | Patient reminders | Patient | F-03 | M2 |

## C-01 Appointment booking

Serves: Patient

Outcome: Patients book, move and cancel visits online without calling the clinic.

### F-01 Booking calendar · page

| id | sub-feature | milestone |
| -- | ----------- | --------- |
| F-01.1 | Pick a free slot | M1 |
| F-01.2 | Reschedule a booking | M1 |
| F-01.3 | Book for a family member | M3 |
| F-01.4 | Show the reminder setting on each booking | M2 |
| F-01.5 | Join a waiting list for a full day | later |

## C-02 Patient reminders

Serves: Patient

Outcome: Patients are reminded before each visit and confirm it without calling.

### F-03 SMS reminders · job

| id | sub-feature | milestone |
| -- | ----------- | --------- |
| F-03.1 | Send a reminder 24 hours before | M2 |
| F-03.2 | Confirm the visit by replying YES | M2 |
```

Sub-feature ids are the feature id plus a number, and they never change once written. `later` holds
a sub-feature no milestone takes yet. The summary table and the sections say the same thing; change
both in one edit.

`Map: proposed` means the user hasn't confirmed it, and any later change to the map sets it back to
`proposed`. A change to a confirmed map adds a line under it, `Changed: M5`, naming every milestone
the change touched. Without that line nothing past MAP runs until the map reads `confirmed`; with
it, the current milestone's work goes on while the line leaves that milestone out. The confirmation
removes the line.

## docs/roadmap.md

```markdown
# Roadmap

Checked up to: 4e1a9c2b7d0f3a6e8c5b1d9f2a4c6e8b0d2f4a6c

| id | milestone | capability | status | folder |
| -- | --------- | ---------- | ------ | ------ |
| M1 | Online booking | C-01 | done | m1-online-booking/ |
| M2 | SMS reminders and confirmations | C-02 | current | m2-sms-reminders/ |
| M3 | Family bookings | C-01 | open | m3-family-bookings/ |
```

`capability` is the milestone's main capability. The order matters. `/next` takes the next row, not
the interesting one. If the order is wrong, fix it here or with `/prioritize`, rather than working
around it. `Checked up to:` is the newest commit `/catch-up` read; a plan that has never been caught
up has no such line.

## docs/m<n>-<name>/_milestone.md

```markdown
# M2 SMS reminders and confirmations

Capability: C-02 Patient reminders
Also touches: C-01

Goal: <one sentence saying which actor is better off, and how, in the main capability's terms.>

Excludes: <what this milestone leaves for later, and which milestone gets it.>

## Exit check

1. <first step of one scenario that runs end to end>
2. <...>
5. <the last step, ending in something you can see>

## Features

| id | feature | capability | kind | decision | build | needs | doc |
| -- | ------- | ---------- | ---- | -------- | ----- | ----- | --- |
| F-01 | Booking calendar | C-01 | page | open | none | — | — |
| F-03 | SMS reminders | C-02 | job | open | none | F-01 | — |

## Sub-features

| id | sub-feature | feature | exit step |
| -- | ----------- | ------- | --------- |
| F-01.4 | Show the reminder setting on each booking | F-01 | 2 |
| F-03.1 | Send a reminder 24 hours before | F-03 | — |
| F-03.2 | Confirm the visit by replying YES | F-03 | — |
```

Write this file when the milestone opens, from the map, and write the exit check with it. Write it
at the end and you'll write the check the work happens to pass.

`/catch-up` adds a section when commits built part of the milestone before its review, one line per
sub-feature with the commit that built it: `## Built outside the loop` then `- F-01.4 e8a2d26`. The
review asks nothing about those sub-features, and the plan cuts no slice for them.

`Also touches` lists every other capability the milestone pulls a sub-feature from. A sub-feature of
the main capability shows a dash under `exit step`. Any other sub-feature names the exit step that
can't pass without it.

A feature that spans milestones has a row in each, and each row's decision, build and document cover
only the sub-features that milestone takes.

## docs/_current.md

One file, one open job. Delete it when the job closes.

```markdown
# F-03 SMS reminders — brainstorm

Milestone: M2
Feature: F-03
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
# M2 decision review

Seven decisions the build is waiting on. The `Decision` line under each holds the answer. A dash
means it's still open.

`decisions.html` next to this file turns every option into a prototype to play with, and saves a
pick when opened at <published link>.

| id | question | feature | sub-feature | decision |
| -- | -------- | ------- | ----------- | -------- |
| D-01 | Who a reminder goes to | F-03 | — | B |
| D-02 | When the reminder is sent | F-03 | F-03.1 | — |

## F-03 SMS reminders

### D-01 — Who does a reminder go to?

<One line on what depends on this.>

- **A** — <the option in five words.> <What it costs.>
- **B** — <...> <...> *Recommended.*
- **C** — <...> <...>

Decision: B

## F-03.1 Send a reminder 24 hours before (F-03 SMS reminders)

### D-02 — When is the reminder sent?

<...>

Decision: —
```

A question that shapes the whole feature sits under the feature's heading. One that shapes a single
sub-feature sits under that sub-feature's heading, and the table names it. Decision headings stay at
`###`, and `decision` stays the table's last column — the review server reads both.

The `Decision` line holds the letter, plus the user's own words if they added any. Write the letter
into the table in the same edit so the two can't disagree.

## docs/m<n>-<name>/decisions.html

The same questions as a page where every option is a working prototype the user plays with.

Each decision holds: the id, the question, the sub-feature it shapes, one line on what depends on
it, one prototype per option, the cost under each option, the recommendation marked, a pick control
per option, and a note field. A count of answered decisions sits at the top.

### Every option is a prototype

Each option gets a small working piece of the product, built the way that option makes it behave,
at the size it will really be. The user clicks, types, submits and switches in it. An option the
user can only look at or read about is one they can't weigh.

The prototypes of one decision sit side by side, start from the same state and hold the same made-up
data, so the difference between the options is what the user finds by using them. The data
exercises that difference: a limit has something at it, a threshold has something on each side.

Every decision carries three controls that act on all its options at once:

- A state switch over every state the decision touches: empty, loading, error, no permission, past a
  limit, a dependency slow or down.
- Play, which runs the moment that matters. A pointer stands in for the person and does what they'd
  be doing, the same thing in every option at the same moment, and each option ends with a line
  saying what happened to that person: what opened, what they lost, what they never saw. It plays
  once when the decision first scrolls into view. With reduced motion on, it jumps to the end state.
- Reset, which puts every option back where it started.

After Play the prototypes stay live, so the user can take over from where the pointer stopped.

The prototype takes the form of the feature's kind:

| kind | prototype |
| ---- | --------- |
| page | The part of the screen the decision changes, with working controls. |
| contract | A request console: pick or edit a request, send it, and see each option's answer or refusal beside what the screen reading it shows. |
| job | A clock and a timeline: fire the event that starts the job, fast-forward, and watch what each option does over time and what a person sees at each moment. |
| integration | The outside service as a switch — working, slow, down, answering wrong — and what each option does in each case. |

A decision about a rule, a limit or a cost plays what the rule produces: fast-forward a month and
see what the screen holds, push a counter past the limit and see who gets stopped.

Example: whether a patient can reschedule up to 24 hours or up to 2 hours before a visit. Two booking
calendars side by side, the same visit booked for 10:00 tomorrow, and a clock the user can drag.
Play sets the clock to 08:30 tomorrow and presses Reschedule. The first calendar refuses and shows
the clinic's phone number; its line says the patient had to call. The second offers the free slots;
its line says the 10:00 slot came free too late for anyone else to book it.

If the options can't be made to play differently, they aren't a decision. Settle it, or find the
moment where they part.

### Marks for the review server

Each option's prototype carries `data-prototype="<decision id> <letter>"`, for example
`data-prototype="D-04 B"`. The review server compares these marks with the options in
`decisions.md` and names every option without one on the milestone's Decisions tab. Write every mark
out in full in the file, never assembled by script: the server reads the file, not the running page.

### Writing it in passes

The review stays one page in one file, written in passes so that no single write carries the whole
of it. First the frame: the count, the saving, and one shared kit holding the state switch, Play,
the pointer and Reset. Then one feature's decisions per edit, every prototype built from that kit.
Before handing over the address, check that every option of every decision carries its mark.

The page works out where it's running and saves accordingly. Behind the review server it uses three
paths, each relative to the page's own address:

| request | sends | gets back |
| ------- | ----- | --------- |
| GET `decisions.json` | nothing | every answer so far, keyed by the decision id in lower case without its dash: `{"d04": {"choice": "b", "note": ""}}` |
| POST `decision` | `{"id": "D-04", "choice": "b", "note": "the user's words"}`; `"choice": ""` takes the pick back | `{"ok": true}` once the answer is written into `decisions.md` |
| GET `health` | nothing | `{"signature": "product-loop/review", …}`; that signature is how the page knows the review server is behind it |

A pick counts as saved only when `{"ok": true}` comes back. Any other reply leaves the option
unpicked and says the pick didn't save. Published, the page saves to its own store instead. Opened
as a bare file, it says plainly that picks aren't being saved rather than losing them quietly.

Use relative paths, never a leading slash. The page is served from inside its milestone's folder,
and an absolute path would send every milestone's picks to the same place.

The page fetches `health` every four minutes so the server's idle timer only runs down once the tab
is gone. It carries no stop button of its own — the frame around it has one, and two would be a
question about which is real.

Don't ask for a name, an email, or anything else the page doesn't need.

### When the last answer lands

The count at the top reaches the total, and a panel opens saying the review is finished and telling
the user to run `/next`, which builds the final look. Nothing on the agent's side is watching the
page, so this panel is the only thing that tells the user the review is over.

It opens on the answer that completes the set, and it's there on load when the page opens already
complete. Taking an answer back closes it again. It doesn't cover the decisions or scroll away from
them — someone who wants to re-read a pick before moving on can.

## docs/m<n>-<name>/final-look.html

The milestone as a clickable prototype, built from the answers. One file for the whole milestone.

It holds every screen the milestone touches, at real size, joined by the navigation the product will
have. Every action the milestone adds works against made-up data held in the page: adding, editing,
deleting, sending, approving. Every answered decision behaves as the answer that won. A row that
holds two items and a count holds two and a count. A mark that appears past a threshold appears past
it and nowhere else. A list that waits for a click before reordering waits.

Controls sit around the product's screens, never inside them:

- A role switch over every role the feature documents name, showing what each can and can't do.
- A state switch: empty, error, a dependency slow or down.
- A clock for jobs: fire the event and fast-forward.
- An exit check guide listing the milestone's exit check steps. Picking a step sets the prototype to
  where that step starts and says what to do; the user carries the step out.

A stamp names every decision it was built from and the letter each one holds, in id order. It is
written twice from the same facts: once across the top of the page for a reader, and once as a
`drawn-from` meta tag whose content lists each id and letter separated by commas, so the review
server can compare it without reading the layout.

The meta tag is what makes a stale prototype findable. A decision reopened later leaves a stamp that
no longer matches, the server marks the milestone's final look stale and names the decisions that
moved, and the next session rebuilds it. Change the two halves together or the page claims one thing
and reports another.

Seed content exercises the answers rather than filling space. Every limit has something that reaches
it, every threshold has something on each side, every state a decision names has an example on the
page. A decision that nothing on the page exercises is one the page can't be checked against.

The element where an answer takes effect carries `data-shows="<decision id>"`, and each entry of the
exit check guide carries `data-exit-step="<number>"`. The review server names every answered
decision without a `data-shows` mark and every exit step without a guide entry on the milestone's
Final look tab. Like the review's marks, these are written out in full in the file.

Anything the milestone excludes stays off it, and so does every sub-feature it doesn't take. Building
either makes it look settled.

Write it in passes: the frame, the controls, the seed data and the navigation first, then one screen
per edit. It works with no server and no store. Reloading resets it, and nothing is asked of the
user — it's played, not answered.

## docs/m<n>-<name>/f-<nn>-<name>.md

```markdown
# SMS reminders

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
One statement per sub-feature this milestone takes, each one passing or failing on its own.
## Example
One worked case, start to finish, with real values.
## In plain words
The same thing, explained to someone who has never seen the product.
```

A feature with no screen fills the same sections. "What is on it" becomes what it exposes.
"Actions" becomes what it accepts.

The document covers the sub-features its milestone takes. Write it from scratch when the feature
locks. It states the settled result as if it had always been that way — no history, no rejected
options, no reasons for the choice.

## docs/m<n>-<name>/f-<nn>-<name>-plan.md

```markdown
# SMS reminders — build plan

| slice | sub-feature | does | check | state |
| ----- | ----------- | ---- | ----- | ----- |
| 1 | F-03.1 | <the thinnest change that works end to end> | <what proves it> | built |
| 2 | F-03.2 | <...> | <...> | none |
```

Each check has to pass or fail on its own, with no other slice finished. Slice one is the one most
likely to prove the plan wrong. A slice reads `none` until its own check passes, and `built` after.
Every sub-feature the milestone takes from this feature has at least one slice.

## docs/bugs.md

Every fault found in built work, each tied to the sub-feature it breaks.

```markdown
# Bugs

| id | bug | sub-feature | built in | status | reported |
| -- | --- | ----------- | -------- | ------ | -------- |
| B-01 | Every slot shows as full | F-01.1 | M1 | fixed | 2026-03-02 |
| B-02 | Reminder sent twice | F-03.1 | M2 | open | 2026-03-09 |

## B-02 Reminder sent twice

Sub-feature: F-03.1 Send a reminder 24 hours before
Reported by: Receptionist, 2026-03-09
What happens: A patient with one visit tomorrow gets two reminders.
What should happen: One reminder, 24 hours before the visit.
How to see it: Book a visit for tomorrow, let the reminder run, count the messages.
Fixed by: —
```

Bug ids never change and are never reused. A fixed bug keeps its row and its section, and
`Fixed by` names the check that proves the fix.
