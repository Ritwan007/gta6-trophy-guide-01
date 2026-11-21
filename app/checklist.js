// The checklist view: kind chips, grade/status/search filters, the spoiler rule,
// the trophy rows and the detail panel with the guide, its sources and its counter.
import { saveState } from './store.js';

const KIND_LABELS = [
  ['all', 'All 55'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectibles', 'Collectibles'],
  ['activities', 'Activities'],
  ['questlines', 'Questlines'],
  ['crime', 'Crime'],
  ['money', 'Money'],
  ['hundred', '100%'],
  ['unconfirmed', 'Unconfirmed'],
];

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

let selectedId = null;

export function kindMatches(t, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return !!t.missable;
  if (kind === 'hundred') return t.kind === 'hundred' || !!(t.counter && t.counter.hundred);
  if (kind === 'unconfirmed') return t.unconfirmed === true;
  return t.kind === kind;
}

export function isMasked(t, state) {
  return state.spoiler && t.hidden && !state.earned.includes(t.name);
}

function fmtMoney(n) {
  return '$' + n.toLocaleString('en-US');
}

function counterText(t, state) {
  if (!t.counter) return '';
  const v = state.counters[t.id] || 0;
  const target = t.counter.target;
  const shown = t.counter.money ? fmtMoney(v) : String(v);
  const targetShown = t.counter.money ? fmtMoney(target) : String(target);
  return `${t.counter.label}: ${shown} / ${targetShown}`;
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderChecklist(trophies, state, onProgress) {
  const list = document.getElementById('trophyList');
  const chips = document.getElementById('kindChips');
  const detail = document.getElementById('detail');
  const earned = new Set(state.earned);

  chips.replaceChildren();
  for (const [kind, label] of KIND_LABELS) {
    const b = el('button', 'chip' + (state.kind === kind ? ' active' : ''), label);
    b.type = 'button';
    b.addEventListener('click', () => {
      state.kind = kind;
      saveState(state);
      renderChecklist(trophies, state, onProgress);
    });
    chips.append(b);
  }

  const q = state.search.trim().toLowerCase();
  const shown = trophies.filter((t) => {
    if (!kindMatches(t, state.kind)) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.status === 'earned' && !earned.has(t.name)) return false;
    if (state.status === 'unearned' && earned.has(t.name)) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });

  const count = document.getElementById('resultCount');
  if (state.kind === 'unconfirmed' && shown.length === 0) {
    count.textContent = 'Showing 0 of 55 trophies — no trophy is unconfirmed right now.';
  } else {
    count.textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  }

  list.replaceChildren();
  if (shown.length === 0) {
    const empty = el('li', 'empty');
    if (state.kind === 'unconfirmed') {
      empty.textContent = 'All five trophies that had no confirmed method at launch (In The Beginning…, Capital Offense, Bad Luck I Guess, The Truth Is Out There, Ten Pin) now have methods published by PowerPyx on 21 November 2026. They are flagged as newly confirmed in their guides. GTABase still lists their exact steps as unconfirmed.';
    } else {
      empty.textContent = 'No trophies match these filters. Clear the search or pick another filter.';
    }
    list.append(empty);
  }
  for (const t of shown) {
    const masked = isMasked(t, state);
    const li = el('li', 'row' + (earned.has(t.name) ? ' earned' : '') + (selectedId === t.id ? ' selected' : ''));
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Earned: ' + (masked ? 'hidden trophy' : t.name));
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) state.earned.push(t.name);
      else state.earned = state.earned.filter((n) => n !== t.name);
      saveState(state);
      onProgress();
      renderChecklist(trophies, state, onProgress);
    });
    const body = el('div', 'rowbody');
    const name = el('div', 'rowname', masked ? 'Hidden trophy' : t.name);
    const desc = el('div', 'rowdesc', masked ? 'Hidden — earn it to reveal the name and description.' : t.description);
    const meta = el('div', 'rowmeta');
    meta.append(el('span', 'badge ' + t.grade, GRADE_LABEL[t.grade]));
    if (t.gs) meta.append(el('span', 'tag', t.gs + 'G'));
    if (t.hidden) meta.append(el('span', 'tag hidden', 'Hidden'));
    if (t.missable) meta.append(el('span', 'tag missable', 'Possibly missable'));
    if (t.newly_confirmed) meta.append(el('span', 'tag new', 'Newly confirmed'));
    if (t.counter && !masked) meta.append(el('span', 'counter', counterText(t, state)));
    body.append(name, desc, meta);
    li.append(box, body);
    li.addEventListener('click', () => {
      selectedId = t.id;
      renderChecklist(trophies, state, onProgress);
    });
    list.append(li);
  }

  renderDetail(trophies, state, onProgress);
}

function renderDetail(trophies, state, onProgress) {
  const detail = document.getElementById('detail');
  detail.replaceChildren();
  const t = trophies.find((x) => x.id === selectedId) || trophies[0];
  if (!t) return;
  const masked = isMasked(t, state);
  const earned = state.earned.includes(t.name);

  const head = el('div', 'rowmeta');
  head.append(el('span', 'badge ' + t.grade, GRADE_LABEL[t.grade]));
  if (t.gs) head.append(el('span', 'tag', t.gs + 'G · Gamerscore via GTABase'));
  if (t.missable) head.append(el('span', 'tag missable', 'Possibly missable'));
  if (t.newly_confirmed) head.append(el('span', 'tag new', 'Newly confirmed 21 Nov 2026'));
  detail.append(head);
  detail.append(el('h2', '', masked ? 'Hidden trophy' : t.name));
  detail.append(el('p', 'official', masked ? 'Hidden on PlayStation until earned.' : 'Official description: “' + t.description + '”'));

  if (masked) {
    detail.append(el('p', '', 'This trophy is hidden on PlayStation. Tick its checkbox to mark it earned and reveal its name, description and guide.'));
    return;
  }

  if (t.missable && t.missable_note) {
    const warn = el('div', 'warn');
    warn.append(el('strong', '', 'Possibly missable. '));
    warn.append(document.createTextNode(t.missable_note));
    detail.append(warn);
  }

  detail.append(el('p', 'guide', t.guide));

  if (t.counter) {
    const v = state.counters[t.id] || 0;
    const step = el('div', 'stepper');
    const minus = el('button', '', '−');
    minus.type = 'button';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(t.counter.target * 4);
    input.value = String(v);
    input.setAttribute('aria-label', t.counter.label);
    const plus = el('button', '', '+');
    plus.type = 'button';
    const target = el('span', 'target', 'of ' + (t.counter.money ? fmtMoney(t.counter.target) : t.counter.target) + ' — ' + t.counter.label);
    const bump = t.counter.money ? 10000 : 1;
    const setVal = (nv) => {
      const clamped = Math.max(0, Math.min(t.counter.target * 4, nv));
      state.counters[t.id] = clamped;
      saveState(state);
      onProgress();
      renderChecklist(trophies, state, onProgress);
    };
    minus.addEventListener('click', () => setVal(v - bump));
    plus.addEventListener('click', () => setVal(v + bump));
    input.addEventListener('change', () => setVal(parseInt(input.value, 10) || 0));
    step.append(minus, input, plus, target);
    detail.append(el('h3', '', 'Your progress'));
    detail.append(step);
    if (t.counter.hundred) {
      detail.append(el('p', 'counter', '100% checklist needs ' + (t.counter.money ? fmtMoney(t.counter.hundred) : t.counter.hundred) + ' for this one.'));
    }
  }

  const stageNames = { 1: 'Roadmap step 1 — play the story', 2: 'Roadmap step 2 — 100% checklist', 3: 'Roadmap step 3 — Strangers & Freaks and cleanup' };
  detail.append(el('p', 'counter', stageNames[t.stage] || ''));
  detail.append(el('p', 'counter', earned ? 'Earned — ticked in your checklist.' : 'Not earned yet — tick the checkbox when it pops.'));

  const src = el('div', 'sources');
  src.append(el('strong', '', 'Sources'));
  const ul = document.createElement('ul');
  for (const s of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    ul.append(li);
  }
  src.append(ul);
  detail.append(src);
}
