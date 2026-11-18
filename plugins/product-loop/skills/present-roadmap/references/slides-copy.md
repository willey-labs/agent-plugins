# docs/presentation/slides.json

The words of the deck. Everything else — counts, colours, order, status, what each milestone builds
— comes from the map and the roadmap. The example comes from a made-up clinic booking product.

```json
{
  "title": "Clinic booking roadmap",
  "subtitle": "Three milestones, from the first online booking to families booking for each other.",
  "date": "Roadmap review · March 2027",
  "areas": [
    { "name": "Booking a visit", "capabilities": ["C-01"] },
    { "name": "Keeping patients on time", "capabilities": ["C-02"] }
  ],
  "flow": {
    "headline": "Patients book online. The front desk handles what they can't.",
    "front": [
      { "name": "Patient", "icon": "person", "area": "Booking a visit", "text": "Books, moves or cancels a visit from a phone" },
      { "name": "Booking calendar", "icon": "phone", "area": "Booking a visit", "text": "Shows free slots and holds the booking" },
      { "name": "Receptionist", "icon": "agent", "text": "Handles changes the calendar can't" }
    ],
    "links": ["books", "needs help"],
    "behind": [
      { "name": "Clinic owner", "icon": "owner", "text": "Sets opening hours and doctors" },
      { "name": "SMS service", "icon": "phone", "area": "Keeping patients on time", "text": "Sends the reminders and takes the replies" }
    ]
  },
  "example": "F-01.2",
  "milestones": {
    "M1": {
      "headline": "Patients book a visit without calling",
      "steps": [
        "A patient picks a free Tuesday slot from their phone",
        "They get a confirmation text within a minute",
        "The receptionist sees the booking in the day view"
      ]
    },
    "M2": {
      "headline": "Nobody forgets their visit",
      "steps": [
        "A reminder goes out the day before",
        "Replying YES confirms the visit",
        "The receptionist sees which visits are confirmed"
      ]
    },
    "M3": { "headline": "Families book for each other", "steps": [] }
  },
  "next": "Finish the reminder replies, then open M3.",
  "after": "Decide how a family account shares bookings."
}
```

| field | holds |
| ----- | ----- |
| `title`, `subtitle` | The title slide. The subtitle says where the roadmap goes, in one sentence. |
| `date` | The small line above the title: the occasion and the date. |
| `areas` | Up to four areas, named for who or what they serve. Every capability on the map sits in exactly one. The four colours go to the areas in this order. |
| `flow` | The product slide. `front` holds two or three actors on the main path, `links` the label on each arrow between them, `behind` up to three people or systems that support it. `icon` is one of `person`, `ai`, `agent`, `owner`, `team`, `platform`, `website`, `phone`, `money`, `document`. `area` colours the icon and is optional. |
| `example` | One sub-feature id the "how the work is cut" slide follows from capability to milestone. Pick one whose names explain themselves. |
| `milestones` | One entry per roadmap milestone. `headline` says what changes for a person. `steps` retells the exit check, one line per step, same order and same number; a milestone with no page yet has an empty list. |
| `next`, `after` | The last slide: what happens next, and after that. Both optional. |
