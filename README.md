# Leonida Trophy Atlas — GTA VI Platinum Guide & Tracker

An offline guide and tracker for all 55 Grand Theft Auto VI PlayStation 5
trophies (1 platinum, 2 gold, 6 silver, 46 bronze), built for the make.fun
competition `gta6-trophy-guide-01`.

- **Checklist** — every trophy with its official name, description and grade,
  an earned checkbox, and a progress counter where the game tracks one
  (250 stunts, 42 shooting-range golds, 18 meditations, …). Progress is saved
  in the browser (localStorage) and can be exported to a file and imported back.
- **Guides in our own words** — each trophy has a guide that names its sources
  beside it (PowerPyx and GTABase first, plus the 100% guides where the trophy
  touches the checklist). Five trophies have no confirmed unlock method yet
  (checked 20 Nov 2026); this guide says so plainly instead of guessing.
- **Roadmap to the platinum** — three steps (story ~60–80h, 100% checklist
  ~100h, strangers & clean-up ~10h), built from the official descriptions.
- **Missables** — only Positive Mental Attitude is flagged as possibly
  missable (the Chapter 1 balcony meditation); everything else is obtainable
  in free roam after the story.
- **100% Checklist** — all 35 requirements with their counts, from the
  PowerPyx and GTABase 100% guides.
- **Spoiler setting** — hides the names and descriptions of story trophies
  until they are earned. Filters by kind (story, missable, collectibles,
  activities, questlines, crime, money), grade, and earned/remaining, plus
  search and a Next-up planner.
- **Offline** — static files under `app/`, no network request at run time,
  no Rockstar logo or artwork. All visuals are our own.

Run it: `node serve.ts`, then open http://localhost:8080.

Entry program: `main.ts` (Node 22) copies `app/` and `screenshots/` to
`/output` and writes `/output/dossier.json` with the vendored make.fun
library. Outside the grader: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

License: MIT. Not affiliated with Rockstar Games.
