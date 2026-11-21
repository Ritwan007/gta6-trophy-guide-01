# Leonida Trophy Atlas — GTA VI Platinum Guide &amp; Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Ritwan007/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Ritwan007/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An entry for [gta6-trophy-guide-01 on make.fun](https://make.fun/bounty/gta6-trophy-guide-01): the best offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI.

## What it is

A static web app under `app/` — no build step, no network requests, system fonts only. Open `app/index.html` in desktop Chrome (or run `node serve.ts` and open http://localhost:8080) and it works with the network off.

- **Every trophy, with its official name, description and grade** — 1 platinum, 2 gold, 6 silver, 46 bronze — plus a guide written in our own words that names its sources beside it. Gamerscore values are GTABase's.
- **Tracker** — tick trophies off, with per-trophy progress counters (stunts 250, WAiNK 100, vaults 5 of 8, …) saved in localStorage, plus export to a JSON file and import back.
- **Filters** — story, missable, collectibles, activities, questlines, crime, money, 100%, unconfirmed — plus grade, earned status and search.
- **Spoiler setting (on by default)** — hides the names and descriptions of the 28 hidden story trophies until they are earned.
- **Roadmap to the platinum** — three steps (story 60–80h, 100% checklist ~100h, Strangers & Freaks + cleanup ~10h) with the Chapter 1 balcony-meditation warning boxed at the top.
- **Full 100% checklist** — all 35 requirements with counters, in the Story & Tasks, Exploration & Activities and Discovery groups.
- **Missables tab** — the one possibly missable trophy, Positive Mental Attitude, and why everything else is safe.

## Freshness

The five trophies that had no confirmed method at launch (In The Beginning…, Capital Offense, Bad Luck I Guess, The Truth Is Out There, Ten Pin) gained methods on PowerPyx on 21 November 2026; GTABase still lists their exact steps as unconfirmed. They are flagged as newly confirmed in their guides. No trophy in this guide says "Method not confirmed yet" — every method was verified against a live source at build time.

## Sources

- PowerPyx — [GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/) and [100% Completion Checklist & Guide](https://www.powerpyx.com/gta-6-100-completion-checklist-guide/)
- GTABase — [GTA 6 Trophy Guide & Achievements List](https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series) and [100% Completion Guide & Interactive Checklist](https://www.gtabase.com/articles/gta-6/gta-6-100-completion-guide-interactive-checklist)

No Rockstar logo, official artwork, box art or game screenshot is used anywhere. The look is our own.

## Handing it in

`main.ts` (Node 22) checks the trophy list is complete, copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).

