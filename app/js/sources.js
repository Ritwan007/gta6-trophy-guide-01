// Cited sources for the Leonida Trophy Atlas. Every guide names its sources
// from this table, so a reader can check any fact at its origin. Only pages
// opened and verified at build time are listed here.
export const SOURCES = {
  gtabase: {
    label: 'GTABase — GTA 6 Trophy Guide & Achievements List',
    short: 'GTABase trophy list',
    url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series',
  },
  gtabase100: {
    label: 'GTABase — GTA 6 100% Completion Guide & Interactive Checklist',
    short: 'GTABase 100% guide',
    url: 'https://www.gtabase.com/articles/gta-6/gta-6-100-completion-guide-interactive-checklist',
  },
  gtasixhow: {
    label: 'GTA Six How — Trophies',
    short: 'GTA Six How',
    url: 'https://gtasix.how/trophies/',
  },
  gtavibes: {
    label: 'GTA Vibes — GTA 6 Trophy List & Achievements',
    short: 'GTA Vibes',
    url: 'https://www.gtavibes.com/guides/gta-6-trophy-list-achievements',
  },
  keengamer: {
    label: 'KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap',
    short: 'KeenGamer',
    url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/',
  },
  outputlag: {
    label: 'Output Lag — GTA 6 Trophy List',
    short: 'Output Lag',
    url: 'https://outputlag.com/guides/gta-6-trophy-list/',
  },
  powerpyx: {
    label: 'PowerPyx — GTA 6 Trophy Guide & Roadmap',
    short: 'PowerPyx trophy guide',
    url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  },
  powerpyx100: {
    label: 'PowerPyx — GTA 6 100% Completion Checklist & Guide',
    short: 'PowerPyx 100% guide',
    url: 'https://www.powerpyx.com/gta-6-100-completion-checklist-guide/',
  },
  vicecityhub: {
    label: 'GTA Vice City Hub — Achievements',
    short: 'GTA Vice City Hub',
    url: 'https://www.gtavicecityhub.com/achievements',
  },
};

// The two full guides that cover all 55 trophies. Every trophy cites at
// least these two; checklist trophies add the two 100% guides.
export const PRIMARY_SOURCES = ['powerpyx', 'gtabase'];

export function sourceLinks(keys) {
  return (keys || PRIMARY_SOURCES).map((key) => SOURCES[key]).filter(Boolean);
}
