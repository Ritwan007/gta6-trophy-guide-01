// Saved progress for the Leonida Trophy Atlas: earned ticks, per-trophy
// counters, 100% checklist ticks and the spoiler setting, all in
// localStorage. Export writes the same shape to a file; import reads it
// back and replaces the saved state.
export const STORAGE_KEY = 'leonida-trophy-atlas-v1';

export function blankState() {
  return { checks100: {}, counters: {}, earned: {}, spoilers: true };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    const state = blankState();
    if (parsed && typeof parsed === 'object') {
      if (parsed.earned && typeof parsed.earned === 'object') state.earned = parsed.earned;
      if (parsed.counters && typeof parsed.counters === 'object') state.counters = parsed.counters;
      if (parsed.checks100 && typeof parsed.checks100 === 'object') state.checks100 = parsed.checks100;
      if (typeof parsed.spoilers === 'boolean') state.spoilers = parsed.spoilers;
    }
    return state;
  } catch {
    return blankState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: the app keeps working in memory.
  }
}

export function isEarned(state, id) {
  return Boolean(state.earned[id]);
}

export function toggleEarned(state, id) {
  if (state.earned[id]) delete state.earned[id];
  else state.earned[id] = true;
  saveState(state);
  return state;
}

export function earnedCount(state, trophies) {
  return trophies.filter((t) => state.earned[t.id]).length;
}

export function counterValue(state, id) {
  const value = Number(state.counters[id]);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function setCounter(state, id, value, target) {
  const clamped = Math.max(0, Math.min(target || 0, Math.floor(Number(value) || 0)));
  if (clamped === 0) delete state.counters[id];
  else state.counters[id] = clamped;
  saveState(state);
  return state;
}

export function bumpCounter(state, id, delta, target) {
  return setCounter(state, id, counterValue(state, id) + delta, target);
}

export function toggleCheck100(state, index) {
  if (state.checks100[index]) delete state.checks100[index];
  else state.checks100[index] = true;
  saveState(state);
  return state;
}

export function exportState(state) {
  return JSON.stringify(
    { app: 'leonida-trophy-atlas', version: 1, exportedAt: new Date().toISOString(), ...state },
    null,
    2,
  );
}

export function importStateText(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file.');
  const state = blankState();
  if (parsed.earned && typeof parsed.earned === 'object') state.earned = parsed.earned;
  if (parsed.counters && typeof parsed.counters === 'object') state.counters = parsed.counters;
  if (parsed.checks100 && typeof parsed.checks100 === 'object') state.checks100 = parsed.checks100;
  if (typeof parsed.spoilers === 'boolean') state.spoilers = parsed.spoilers;
  return state;
}

export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
