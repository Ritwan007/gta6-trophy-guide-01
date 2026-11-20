// The Next-up planner: the first unearned trophy in roadmap order, so the
// player always knows what to chase next without scrolling the list.
import { sortForRoadmap } from './filters.js';

export function nextUpTrophy(trophies, state) {
  const ordered = sortForRoadmap(trophies);
  return ordered.find((trophy) => !state.earned[trophy.id]) || null;
}

export function renderNextUp(cardEl, trophies, state, onJump) {
  const next = nextUpTrophy(trophies, state);
  if (!next) {
    cardEl.innerHTML = '<strong>Platinum earned.</strong> Every one of the 55 trophies is ticked. Vice Got a Price! is yours.';
    return;
  }
  const stageNames = { 1: 'Step 1 — story', 2: 'Step 2 — 100%', 3: 'Step 3 — clean-up' };
  cardEl.innerHTML = `<span class="next-label">Next up</span>
    <strong>${next.name}</strong>
    <span class="next-meta">${stageNames[next.stage] || ''} · ${next.grade}</span>
    <span class="next-desc">${next.description}</span>
    <button type="button" class="btn-small">Open its guide</button>`;
  cardEl.querySelector('button').addEventListener('click', () => onJump(next.id));
}
