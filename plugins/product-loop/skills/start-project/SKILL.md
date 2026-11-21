---
name: start-project
description: Use when the user starts a new product from nothing — an empty repo, or no repo yet — and describes what to build ("start a new project", "new product", "here's the brief", "we want to build"). Turns the brief into the capability map, the milestones and the first milestone's page, then hands the map to the user to confirm. Refuses a project that already has code or a map.
---

# start-project

Turn the brief for an empty project into its capability map. The run ends when the map is in front
of the user.

## Check the project is empty

List the repo's files, then stop when either holds:

- `docs/capabilities.md` exists. The project has a map: `/feature` adds to it and `/next` works it.
  Say so, and stop.
- The repo holds source code: any file beyond docs, a readme, a licence, ignore files and editor
  settings. Its map comes from what is built, and `/next` maps it. Say so, and stop.

## Take the brief

The brief is the user's own words and the documents they point to. Read them, then ask in one
message only what they leave out:

- What the product does, and every actor who uses it.
- The outcome each actor gets: the areas of the business the owner would notice missing.
- What has to work first: the path on which the main actor reaches the core outcome.
- What is out of scope.

Wait for the answers. Ask again only about a gap that still stops the map.

## Map

Build the map and cut the milestones exactly as the next skill's MAP section says: capabilities,
then features, then sub-features, in the business's own words; the first milestone is the thinnest
path to the core outcome; a milestone holds at most 15 sub-features; every sub-feature lands in one
milestone or in `later`. Write `docs/capabilities.md` with `Map: proposed`, `docs/roadmap.md` with
the first milestone `current`, and that milestone's `_milestone.md` with its exit check, in the
shapes of the next skill's `references/templates.md`.

## Hand it over

Run `/serve`, give the user the address, name the calls most worth checking — a capability that
might be named wrong, where the first milestone's cut falls, a milestone split in two for size, a
part of the brief placed in `later` — and stop. The server stops after fifteen idle minutes, and
`/serve` brings it back.

When the user answers, a confirmation sets `Map: confirmed` and stops, and `/next` then runs the
first milestone's review. Changes go into the same files, and the map stays `proposed`.

## Files you may write

`docs/capabilities.md`, `docs/roadmap.md`, and the first milestone's `_milestone.md`. Nothing else.

## Stop and ask if

- You're about to put something on the map that the brief, its documents and the user's answers
  don't show.
- You're about to name a capability after a part of the system, or name anything with a phrase the
  business wouldn't use.
- You're about to write code or set up the repo. The build does that, after the first review.

Each one means: stop, say what you were about to do, and ask.
