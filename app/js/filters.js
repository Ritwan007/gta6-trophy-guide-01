// Filtering, searching and the spoiler rule for the trophy checklist.
// A story trophy stays masked while spoilers are on and it is unearned:
// its name and description read as hidden until the player earns it.
export const KIND_LABELS = {
  '100%': '100%',
  activities: 'Activities',
  collectibles: 'Collectibles',
  crime: 'Crime',
  money: 'Money',
  missable: 'Missable',
  questlines: 'Questlines',
  story: 'Story',
  unconfirmed: 'Unconfirmed',
};

export const KIND_ORDER = ['story', 'missable', 'collectibles', 'activities', 'questlines', 'crime', 'money', '100%', 'unconfirmed'];

export const GRADE_LABELS = {
  bronze: 'Bronze',
  gold: 'Gold',
  platinum: 'Platinum',
  silver: 'Silver',
};

export function isStoryTrophy(trophy) {
  return trophy.kinds.includes('story');
}

export function isMasked(trophy, state) {
  return state.spoilers && isStoryTrophy(trophy) && !state.earned[trophy.id];
}

export function trophyMatches(trophy, state, filters) {
  if (filters.kind !== 'all' && !trophy.kinds.includes(filters.kind)) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.earned === 'earned' && !state.earned[trophy.id]) return false;
  if (filters.earned === 'remaining' && state.earned[trophy.id]) return false;
  if (filters.query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(filters.query.toLowerCase())) return false;
  }
  return true;
}

export function filterTrophies(trophies, state, filters) {
  return trophies.filter((trophy) => trophyMatches(trophy, state, filters));
}

export function gradeRank(grade) {
  return { platinum: 0, gold: 1, silver: 2, bronze: 3 }[grade] ?? 4;
}

export function sortForRoadmap(trophies) {
  return [...trophies].sort((a, b) => a.stage - b.stage || gradeRank(a.grade) - gradeRank(b.grade) || a.id - b.id);
}
