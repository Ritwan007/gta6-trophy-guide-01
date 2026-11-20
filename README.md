# Leonida Trophy Atlas — offline GTA VI platinum guide & tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Ritwan007/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Ritwan007/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Built for the make.fun bounty: [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01).

Leonida Trophy Atlas is a free, open-source, offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. It runs from its own files in any desktop browser with the network off: no account, no server, no tracking.

## What it does

- **Every trophy, complete.** All 55 official trophies with their PlayStation name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze), each with a guide written in this atlas's own words and the sources it was checked against, named beside it.
- **A tracker that remembers.** Tick trophies off as you earn them and nudge the per-trophy progress counters (250 stunts, 42 shooting-range golds, 18 meditations and more). Progress is saved in the browser, and can be exported to a file and imported back.
- **Filters and search.** Filter by kind (story, missable, collectibles, activities, questlines, crime, money, 100%, unconfirmed), by grade, by earned or remaining, or search by name and text.
- **Spoiler setting.** Story trophies stay masked until you earn them. It is on by default for a new player and can be switched off any time.
- **Next-up planner.** The first unearned trophy in roadmap order is always shown at the top, so you know what to chase next.
- **A roadmap to the platinum.** Three steps — story (60–80 hours), the 100% checklist (about 100 hours), Strangers & Freaks and clean-up (about 10 hours) — with the Chapter 1 balcony-meditation warning boxed at the top.
- **The full 100% checklist.** All 35 requirements with their counts, tickable here, from the PowerPyx and GTABase 100% guides.
- **Missables, honestly flagged.** One possibly missable trophy (Positive Mental Attitude) and one trophy whose method is still unconfirmed (Bad Luck, I Guess, checked 20 Nov 2026). Four trophies that were unknown at launch had their methods confirmed on 20 Nov 2026 and are marked as such.

## How the tracker saves

Progress lives only in your own browser, under localStorage. Nothing leaves your machine: there is no account and no server call. **Export progress** downloads a JSON file with your earned ticks, counters and 100% checklist ticks; **Import progress** reads such a file back. Use it to move your run to another browser or to keep a backup before a clean-up.

## Sources

Every guide cites its sources by name, with links, beside the guide. The two full guides that cover all 55 trophies are the PowerPyx trophy guide and roadmap and the GTABase trophy guide and achievements list; the 100% checklist draws on the PowerPyx and GTABase 100% guides. Output Lag, GTA Six How, KeenGamer, GTA Vibes and GTA Vice City Hub are cited where they corroborate a point. Only the official trophy names and descriptions are shown as PlayStation publishes them; all guide text is this atlas's own words. No Rockstar logo or official artwork is used anywhere.

## Run it

Serve `app/` with any static server and open `index.html`, or run `node serve.ts` and open http://localhost:8080. It works with the network off: every file it loads lives under `app/`.

## Hand it in

`main.ts` at the repository root copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT. See LICENSE.
