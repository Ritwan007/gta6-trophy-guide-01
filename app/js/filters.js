// Filtering, searching and the spoiler rule for the checklist.
export const KIND_LABELS = {
  story: 'Story',
  questline: 'Character questline',
  collectible: 'Collectible',
  activity: 'Activity',
  crime: 'Crime & heist',
  money: 'Money & property',
  misc: 'Miscellaneous',
  completion: '100% Completion',
  platinum: 'Platinum',
};

export function kindLabel(trophy) {
  if (trophy.grade === 'platinum') return 'Platinum';
  return KIND_LABELS[trophy.kind] || trophy.kind || '';
}

// The spoiler setting hides the name and description of story trophies until
// the player earns them. Hidden (secret) trophies stay visible once the
// player turns spoilers off — the setting is about story, not secrecy.
export function displayName(trophy, state, spoilersOn) {
  if (spoilersOn && trophy.kind === 'story' && !state.earned[trophy.id]) return 'Hidden story trophy';
  return trophy.name;
}

export function displayDescription(trophy, state, spoilersOn) {
  if (spoilersOn && trophy.kind === 'story' && !state.earned[trophy.id]) return 'Hidden until earned.';
  return trophy.description;
}

export function filterTrophies(trophies, state, opts) {
  const q = (opts.q || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (opts.kind && opts.kind !== 'all') {
      if (opts.kind === 'missable') {
        if (!t.missable) return false;
      } else if (opts.kind === 'unknown') {
        if (!t.unknown) return false;
      } else if (t.kind !== opts.kind) {
        return false;
      }
    }
    if (opts.grade && opts.grade !== 'all' && t.grade !== opts.grade) return false;
    if (opts.status === 'earned' && !state.earned[t.id]) return false;
    if (opts.status === 'remaining' && state.earned[t.id]) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${kindLabel(t)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
