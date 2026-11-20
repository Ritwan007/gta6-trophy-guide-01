// The sources every guide in the Atlas cites. Keys are what trophies.json
// stores; the app renders the full name and link beside each guide.
export const SOURCES = {
  powerpyx: {
    name: 'PowerPyx — GTA 6 Trophy Guide & Roadmap',
    url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  },
  gtabase: {
    name: 'GTABase — GTA 6 Trophy Guide & Achievements List',
    url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series',
  },
  powerpyx100: {
    name: 'PowerPyx — GTA 6 100% Completion Checklist',
    url: 'https://www.powerpyx.com/gta-6-100-completion-checklist-guide/',
  },
  gtabase100: {
    name: 'GTABase — GTA 6 100% Completion Guide',
    url: 'https://www.gtabase.com/articles/gta-6/gta-6-100-completion-guide-interactive-checklist',
  },
  outputlag: {
    name: 'Output Lag — GTA 6 Trophy List (all 55)',
    url: 'https://outputlag.com/guides/gta-6-trophy-list/',
  },
  gtasix: {
    name: 'GTA Six How — Trophies',
    url: 'https://gtasix.how/trophies/',
  },
  keengamer: {
    name: 'KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap',
    url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/',
  },
  gtavibes: {
    name: 'GTA Vibes — GTA 6 Trophy List & Achievements',
    url: 'https://www.gtavibes.com/guides/gta-6-trophy-list-achievements',
  },
  vicecityhub: {
    name: 'GTA Vice City Hub — Achievements & Trophies',
    url: 'https://www.gtavicecityhub.com/achievements',
  },
};

export function sourceLink(key) {
  const s = SOURCES[key];
  if (!s) return '';
  return `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`;
}
