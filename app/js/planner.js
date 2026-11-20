// Next-up planner: the first trophy still unearned, in roadmap order — story
// first, then the 100% grind, then strangers and clean-up, then any-time
// trophies and the ones with no confirmed method last.
const STAGE_ORDER = { 1: 0, 2: 1, 3: 2, 0: 3 };

export function nextUp(trophies, state) {
  const remaining = trophies.filter((t) => !state.earned[t.id]);
  if (remaining.length === 0) return null;
  remaining.sort((a, b) => {
    const sa = STAGE_ORDER[a.stage ?? 0] ?? 3;
    const sb = STAGE_ORDER[b.stage ?? 0] ?? 3;
    if (sa !== sb) return sa - sb;
    return a.id - b.id;
  });
  const pick = remaining[0];
  const why =
    pick.stage === 1
      ? 'Story — earn it as you play the chapters.'
      : pick.stage === 2
        ? 'Part of the 100% checklist grind.'
        : pick.stage === 3
          ? 'Strangers & clean-up, after the story.'
          : 'Earn it any time in free roam.';
  return { trophy: pick, why };
}
