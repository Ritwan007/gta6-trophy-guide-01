// Leonida Trophy Atlas — boot, tabs, filters, progress header and the
// next-up planner. All data lives in app/data; nothing is fetched from the
// network, and the app works with the network off.
import { loadState, saveState, clearState, demoState, exportFile, readImportFile } from './store.js';
import { filterTrophies } from './filters.js';
import { renderList, renderDetail } from './renderChecklist.js';
import { renderRoadmap, renderMissables, renderHundred, renderSources } from './renderRoadmap.js';
import { nextUp } from './planner.js';

const params = new URLSearchParams(location.search);
const isDemo = params.get('demo') === '1';

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function gradeTotals(trophies) {
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) totals[t.grade] = (totals[t.grade] || 0) + 1;
  return totals;
}

function renderProgress(trophies, state) {
  const earned = trophies.filter((t) => state.earned[t.id]).length;
  const totals = gradeTotals(trophies);
  const got = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (state.earned[t.id]) got[t.grade] += 1;
  document.getElementById('earnedCount').textContent = String(earned);
  const fill = document.getElementById('progressFill');
  fill.style.width = `${Math.round((earned / trophies.length) * 100)}%`;
  document.getElementById('progressBar').setAttribute('aria-valuenow', String(earned));
  document.getElementById('gradeCounts').textContent =
    `Platinum ${got.platinum}/${totals.platinum} · Gold ${got.gold}/${totals.gold} · Silver ${got.silver}/${totals.silver} · Bronze ${got.bronze}/${totals.bronze}`;
  document.getElementById('platinumLine').textContent =
    earned >= trophies.length
      ? 'Platinum earned — Vice Got a Price!'
      : `${trophies.length - earned} trophies to the platinum.`;
  const pick = nextUp(trophies, state);
  const strip = document.getElementById('nextup');
  if (pick) {
    strip.hidden = false;
    document.getElementById('nextupName').textContent = pick.trophy.name;
    document.getElementById('nextupWhy').textContent = pick.why;
    document.getElementById('nextupGo').onclick = () => selectTrophy(pick.trophy.id);
  } else {
    strip.hidden = true;
  }
}

let trophies = [];
let state = loadState();
let selectedId = null;
let currentView = 'checklist';

function readFilters() {
  return {
    q: document.getElementById('searchBox').value,
    kind: document.getElementById('kindFilter').value,
    grade: document.getElementById('gradeFilter').value,
    status: document.getElementById('statusFilter').value,
    spoilersOn: document.getElementById('spoilerToggle').checked,
  };
}

function refresh() {
  const opts = readFilters();
  const shown = filterTrophies(trophies, state, opts);
  document.getElementById('resultCount').textContent =
    `${shown.length} of ${trophies.length} trophies shown` +
    (opts.spoilersOn ? ' · story spoilers hidden until earned' : '');
  renderList(document.getElementById('trophyList'), shown, state, { ...opts, selectedId }, {
    onToggle: (id, checked) => {
      if (checked) state.earned[id] = true;
      else delete state.earned[id];
      persist();
      refresh();
    },
    onSelect: (id) => selectTrophy(id),
  });
  const selected = trophies.find((t) => t.id === selectedId) || null;
  renderDetail(document.getElementById('detailPanel'), selected, state, {
    onCount: (id, step) => {
      const t = trophies.find((x) => x.id === id);
      const next = Math.max(0, Math.min(t.target, (state.counts[id] || 0) + step));
      state.counts[id] = next;
      persist();
      refresh();
    },
  });
  renderProgress(trophies, state);
}

function persist() {
  if (!isDemo) saveState(state);
}

function selectTrophy(id) {
  selectedId = id;
  showView('checklist');
  refresh();
  const panel = document.getElementById('detailPanel');
  if (panel && window.innerWidth <= 900) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showView(name) {
  currentView = name;
  for (const btn of document.querySelectorAll('.tabs button')) {
    const active = btn.dataset.view === name;
    btn.classList.toggle('active', active);
    if (active) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  }
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${name}`;
  }
}

async function boot() {
  const data = await loadJson('data/trophies.json');
  trophies = data.trophies;
  const roadmap = await loadJson('data/roadmap.json');
  if (isDemo) state = demoState();
  renderRoadmap(document.getElementById('roadmapSteps'), roadmap);
  renderMissables(
    document.getElementById('missableList'),
    document.getElementById('unknownList'),
    trophies,
  );
  renderHundred(document.getElementById('hundredList'), roadmap);
  renderSources(document.getElementById('sourceList'));

  for (const btn of document.querySelectorAll('.tabs button')) {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  }
  for (const id of ['searchBox', 'kindFilter', 'gradeFilter', 'statusFilter', 'spoilerToggle']) {
    document.getElementById(id).addEventListener('input', refresh);
  }
  document.getElementById('exportBtn').addEventListener('click', () => exportFile(state));
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state = await readImportFile(file);
      persist();
      selectedId = null;
      refresh();
    } catch {
      alert('That file is not a valid Atlas progress export.');
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies and counters?')) return;
    state = { earned: {}, counts: {} };
    clearState();
    selectedId = null;
    refresh();
  });

  // Screenshot and deep-link parameters: ?view=roadmap, ?trophy=28,
  // ?kind=missable, ?spoilers=1, ?demo=1 (seeded mid-run state, in memory).
  if (params.get('spoilers') === '1') document.getElementById('spoilerToggle').checked = true;
  if (params.get('kind')) document.getElementById('kindFilter').value = params.get('kind');
  const trophyParam = Number(params.get('trophy'));
  if (Number.isInteger(trophyParam) && trophies.some((t) => t.id === trophyParam)) selectedId = trophyParam;
  const viewParam = params.get('view');
  if (viewParam && document.getElementById(`view-${viewParam}`)) showView(viewParam);
  // With nothing selected and spoilers off, open the next trophy on the road
  // so the guide pane is never an empty box on first load.
  if (!selectedId && !document.getElementById('spoilerToggle').checked) {
    const pick = nextUp(trophies, state);
    if (pick) selectedId = pick.trophy.id;
  }
  refresh();
}

boot().catch((error) => {
  document.getElementById('trophyList').innerHTML =
    `<li class="trophyrow"><div>Could not load the trophy list: ${error.message}</div></li>`;
});
