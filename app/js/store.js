// Saved progress for the Atlas: earned checkboxes and counter values, kept only
// in this browser's localStorage, with export to a file and import back.
export const STORAGE_KEY = 'leonida-trophy-atlas-v1';

export function blankState() {
  return { earned: {}, counts: {} };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return blankState();
    return {
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    };
  } catch {
    return blankState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the page still works for this visit.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

// A realistic mid-run state used only for screenshots (?demo=1). It never
// touches localStorage, so it cannot overwrite a real player's progress.
export function demoState() {
  const earnedIds = [2, 3, 8, 15, 16, 19, 20, 21, 28, 30, 32, 35, 42, 46, 48, 52, 53, 54, 55];
  const earned = {};
  for (const id of earnedIds) earned[id] = true;
  return {
    earned,
    counts: { 15: 120, 17: 20, 19: 12, 28: 9, 30: 1, 32: 31, 35: 64, 42: 30, 48: 210, 52: 98000, 53: 41000, 54: 3, 55: 4 },
  };
}

export function exportFile(state) {
  const blob = new Blob([JSON.stringify({ app: 'leonida-trophy-atlas', version: 1, ...state }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readImportFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file.');
  const earned = parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {};
  const counts = parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {};
  const cleanEarned = {};
  for (const [key, value] of Object.entries(earned)) {
    const id = Number(key);
    if (Number.isInteger(id) && id >= 1 && id <= 55 && value) cleanEarned[id] = true;
  }
  const cleanCounts = {};
  for (const [key, value] of Object.entries(counts)) {
    const id = Number(key);
    const n = Number(value);
    if (Number.isInteger(id) && id >= 1 && id <= 55 && Number.isFinite(n) && n >= 0) cleanCounts[id] = n;
  }
  return { earned: cleanEarned, counts: cleanCounts };
}
