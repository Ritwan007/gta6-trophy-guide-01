// The Roadmap, 100% Checklist and Missables views, built from the data files.
import { saveState } from './store.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderRoadmap(host, roadmap) {
  host.replaceChildren();
  host.append(el('h2', '', 'Roadmap to the platinum — about 200 hours'));
  host.append(el('p', '', 'Three steps, in order. The times are PowerPyx and GTABase\'s estimates: the story takes 60 to 80 hours, the 100% checklist about 100 hours, and the Strangers & Freaks cleanup about 10 hours.'));

  const warn = el('div', 'warn');
  warn.append(el('strong', '', 'Read this first — the one possibly missable trophy. '));
  warn.append(document.createTextNode(roadmap.warning));
  host.append(warn);

  const steps = el('div', 'steps');
  for (const s of roadmap.steps) {
    const card = el('div', 'step');
    card.append(el('h3', '', `Step ${s.n}: ${s.title}`));
    card.append(el('p', 'hours', s.hours));
    const ul = document.createElement('ul');
    for (const p of s.points) {
      ul.append(el('li', '', p));
    }
    card.append(ul);
    steps.append(card);
  }
  host.append(steps);

  const notes = el('div', 'step');
  notes.append(el('h3', '', 'Two warnings that are not trophies'));
  const ul = document.createElement('ul');
  for (const n of roadmap.notes) ul.append(el('li', '', n));
  notes.append(ul);
  host.append(notes);
}

export function renderHundred(host, hundred, state, onProgress) {
  host.replaceChildren();
  host.append(el('h2', '', '100% Completion Checklist — 35 requirements'));
  host.append(el('p', '', 'This is the checklist behind A Long Road, the gold 100% trophy. It appears under Progress, then Stats, then 100% Completion after the credits, but progress made during the story already counts. Nothing on it is missable. It is closer to 60% true completion: most items only need part of a set. Only robberies, underwater discoveries, shooting ranges, drone races and Bret\'s Target Decks need everything. Sources: PowerPyx 100% checklist guide and GTABase 100% guide.'));

  const done = hundred.items.filter((it) => (state.hundred[it.id] || 0) >= it.target).length;
  const bar = el('div', 'bar');
  const fill = el('div', '');
  fill.id = 'hundredFill';
  fill.style.width = Math.round((done / hundred.items.length) * 100) + '%';
  fill.style.height = '100%';
  fill.style.background = 'linear-gradient(90deg, #ff5e8a, #ff6b4a, #d4af5a)';
  bar.append(fill);
  host.append(bar);
  host.append(el('p', 'resultcount', `${done} of ${hundred.items.length} requirements done`));

  const table = el('table', 'hundred');
  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  for (const h of ['Done', 'Requirement', 'Progress']) hr.append(el('th', h === 'Progress' ? 'num' : '', h));
  thead.append(hr);
  table.append(thead);
  const tbody = document.createElement('tbody');
  let group = '';
  for (const it of hundred.items) {
    if (it.group !== group) {
      group = it.group;
      const gr = document.createElement('tr');
      gr.className = 'grouphead';
      const td = document.createElement('td');
      td.colSpan = 3;
      td.textContent = group;
      gr.append(td);
      tbody.append(gr);
    }
    const tr = document.createElement('tr');
    const v = state.hundred[it.id] || 0;
    const isDone = v >= it.target;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isDone;
    box.setAttribute('aria-label', it.name);
    box.addEventListener('change', () => {
      state.hundred[it.id] = box.checked ? it.target : 0;
      saveState(state);
      onProgress();
      renderHundred(host, hundred, state, onProgress);
    });
    const tdBox = document.createElement('td');
    tdBox.append(box);
    const tdName = el('td', '', it.name + (it.note ? ' — ' + it.note : ''));
    const tdProg = el('td', 'num', '');
    if (it.target > 1) {
      const minus = el('button', '', '−');
      minus.type = 'button';
      const plus = el('button', '', '+');
      plus.type = 'button';
      const step = it.step || 1;
      const setVal = (nv) => {
        state.hundred[it.id] = Math.max(0, Math.min(it.target, nv));
        saveState(state);
        onProgress();
        renderHundred(host, hundred, state, onProgress);
      };
      minus.addEventListener('click', () => setVal(v - step));
      plus.addEventListener('click', () => setVal(v + step));
      const fmt = (n) => (it.money ? '$' + n.toLocaleString('en-US') : String(n));
      tdProg.append(minus, document.createTextNode(` ${fmt(v)} / ${fmt(it.target)} `), plus);
    } else {
      tdProg.textContent = isDone ? 'Done' : '—';
    }
    tr.append(tdBox, tdName, tdProg);
    tbody.append(tr);
  }
  table.append(tbody);
  host.append(table);
}

export function renderMissables(host, trophies) {
  host.replaceChildren();
  host.append(el('h2', '', 'Missable trophies'));
  host.append(el('p', '', 'Good news first: by both full guides\' judgement there is only one possibly missable trophy in the whole list, and even that one is unconfirmed. Every other trophy can be earned in free roam after the story. The catch is that there is no mission replay and no New Game Plus, so keep a manual save at the start of each chapter — 15 manual save slots, plus one autosave.'));

  const flagged = trophies.filter((t) => t.missable);
  for (const t of flagged) {
    const card = el('div', 'step');
    card.append(el('h3', '', t.name + ' — ' + t.grade));
    card.append(el('p', 'official', 'Official description: “' + t.description + '”'));
    const warn = el('div', 'warn');
    warn.append(el('strong', '', 'Possibly missable. '));
    warn.append(document.createTextNode(t.missable_note));
    card.append(warn);
    card.append(el('p', 'guide', t.guide));
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
    card.append(src);
    host.append(card);
  }

  const safe = el('div', 'step');
  safe.append(el('h3', '', 'Everything else is safe'));
  const ul = document.createElement('ul');
  for (const line of [
    'All 12 story trophies and the 7 character questline trophies land by playing the story and stay available after it.',
    'Some optional missions disappear after a while and some quest givers go away for a chapter — Kenton, for example — but every trophy-related character comes back, so nothing is locked out.',
    'A few magazine collectibles sit in story buildings that become inaccessible, but duplicates exist elsewhere and you never need all of them.',
    'Cheats disable trophies and saving: keep them off your trophy run.',
    'The Irredeemable criminal profile is permanent and makes police more aggressive. Avoid excessive violence if you care about it.',
  ]) ul.append(el('li', '', line));
  safe.append(ul);
  host.append(safe);
}
