---
name: present-roadmap
description: Use when the user types /present-roadmap, or asks for a presentation, slides, a deck or a PDF of the product's roadmap, capability map or milestones, to show a team, a client or management.
---

# present-roadmap

Turn the product's capability map and roadmap into a slide deck people want to sit through, as a
PDF, and put it in front of the user.

The deck runs: the title with the milestones as a route, what the product does, the capabilities by
area, how the work is cut, the journey chart, every milestone at a glance, one slide per milestone,
and where the work stands. An appendix holds one detail page per milestone for questions afterwards.

## Read

`docs/capabilities.md`, `docs/roadmap.md`, and every milestone's `_milestone.md`. Nothing else: no
feature documents, no plans, no code.

No `docs/capabilities.md` — say the product has no map yet and that `/next` builds one, and stop.

## Write the words

Everything the deck counts, colours and orders comes from the map and the roadmap. The words are
yours, and they go in `docs/presentation/slides.json`. `references/slides-copy.md` gives its shape.
When the file already exists, keep what still holds and change only what the map or the pages
changed.

The words decide whether anyone listens. Write for people who have never seen the product:

- A milestone's headline says what changes for a person, in their words — never the feature's
  name. "Patients book a visit without calling" beats "Online booking calendar".
- Its steps retell its exit check, one line per step, in the same order and the same number. Keep
  who does what and what they see; drop setup detail. Each line fits one line on a slide, about
  70 characters.
- Areas group the capabilities by who or what they serve, up to four of them, every capability in
  exactly one.
- The product flow shows the main path in two or three actors, with what passes between them, and
  up to three people or systems behind it.
- Say nothing the map, the roadmap or the milestone pages don't hold. A gap you notice is a question
  for the user, not a line on a slide.

## Build

```
node <skill folder>/deck/build-deck.mjs docs
```

It writes `docs/presentation/deck.html` and `docs/presentation/deck.pdf`, and names anything to fix:
words that disagree with the plan — a milestone without a headline, a step count that differs from
its exit check, a capability in no area — or a slide whose words run past its edge. Fix the words,
never the layout, and build again until it names nothing.

It needs Chrome or Chromium for the PDF and finds the usual installs; `CHROME_PATH` points it at any
other. Without one it writes only the HTML and says so — pass that on.

## Show

Run `/serve`. The Presentation tab at `http://localhost:4399/#presentation` shows the PDF. Give the
user that address and the PDF's path, and stop.

## Hold the line

The deck shows the plan; it doesn't change it. Never edit the map, the roadmap or a milestone page
from here. Something wrong in the deck that comes from those files is fixed with `/next`, then the
deck is built again.

## Stop and ask if

- You're about to write a headline or step that the map, the roadmap or the milestone pages don't
  support.
- You're about to change a capability, a milestone or an exit check to make a slide read better.
- You're about to shrink the type or change the stylesheet to make words fit.
