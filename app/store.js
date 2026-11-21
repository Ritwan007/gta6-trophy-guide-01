// Saved progress for the Leonida Trophy Atlas: earned ticks, per-trophy counters,
// the 100% checklist, and the reader's settings. Everything lives in localStorage.
const KEY = 'leonida-trophy-atlas-v1';

export function defaultState() {
  return {
    earned: [],
    counters: {},
    hundred: {},
    spoiler: true,
    view: 'checklist',
    kind: 'all',
    grade: 'all',
    status: 'all',
    search: '',
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function downloadProgress(state) {
  const payload = {
    app: 'leonida-trophy-atlas',
    savedAt: new Date().toISOString(),
    earned: state.earned,
    counters: state.counters,
    hundred: state.hundred,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Validate an imported file: only known trophy names and sane numbers survive.
export function parseImport(text, trophies, hundredItems) {
  const data = JSON.parse(text);
  const names = new Set(trophies.map((t) => t.name));
  const earned = Array.isArray(data.earned) ? data.earned.filter((n) => names.has(n)) : [];
  const counters = {};
  if (data.counters && typeof data.counters === 'object') {
    for (const t of trophies) {
      const v = data.counters[t.id];
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) counters[t.id] = Math.floor(v);
    }
  }
  const hundred = {};
  if (data.hundred && typeof data.hundred === 'object') {
    for (const item of hundredItems) {
      const v = data.hundred[item.id];
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) hundred[item.id] = Math.floor(v);
    }
  }
  return { earned, counters, hundred };
}
