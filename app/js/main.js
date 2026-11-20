// Leonida Trophy Atlas boot: loads the trophy and roadmap data, wires the
// header progress, the tabs, the filters, the spoiler setting and the
// export and import controls, then renders the checklist.
import { loadState, saveState, toggleEarned, earnedCount, bumpCounter, toggleCheck100, exportState, importStateText, downloadFile } from './store.js';
import { KIND_ORDER, KIND_LABELS, filterTrophies } from './filters.js';
import { renderChecklistRows, renderDetail } from './renderChecklist.js';
import { renderNextUp } from './planner.js';
import { renderRoadmap, renderMissables, renderChecklist100 } from './renderRoadmap.js';

const state = loadState();
let trophies = [];
let roadmap = null;
let selectedId = null;
const filters = { earned: 'all', grade: 'all', kind: 'all', query: '' };

const $ = (id) => document.getElementById(id);

function refreshHeader() {
  const earned = earnedCount(state, trophies);
  $('earned-count').textContent = `${earned} / ${trophies.length}`;
  $('progress-fill').style.width = `${trophies.length ? (earned / trophies.length) * 100 : 0}%`;
  $('progress-text').textContent = `${trophies.length ? Math.round((earned / trophies.length) * 100) : 0}% to platinum`;
  $('spoiler-toggle').checked = state.spoilers;
}

function renderAll() {
  refreshHeader();
  const visible = filterTrophies(trophies, state, filters);
  $('result-count').textContent = `${visible.length} of ${trophies.length} trophies`;
  renderChecklistRows($('trophy-list'), visible, state, selectTrophy, selectedId);
  renderNextUp($('next-up'), trophies, state, (id) => {
    selectTrophy(id);
    document.getElementById('detail-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  const selected = trophies.find((t) => t.id === selectedId) || null;
  renderDetail($('detail-panel'), selected, state, (trophy, delta) => {
    bumpCounter(state, trophy.id, delta, trophy.counter.target);
    renderAll();
  });
  if (roadmap) {
    renderRoadmap($('roadmap-view'), roadmap);
    renderMissables($('missables-view'), trophies);
    renderChecklist100($('hundred-view'), roadmap, state, (index) => {
      toggleCheck100(state, index);
      renderAll();
    });
  }
}

function selectTrophy(id) {
  selectedId = id;
  renderAll();
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === name);
    tab.setAttribute('aria-selected', tab.dataset.tab === name ? 'true' : 'false');
  });
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.toggle('active', view.id === `view-${name}`);
  });
}

function buildKindFilters() {
  const bar = $('kind-filters');
  const all = document.createElement('button');
  all.type = 'button';
  all.textContent = 'All kinds';
  all.dataset.kind = 'all';
  all.className = 'chip active';
  bar.appendChild(all);
  KIND_ORDER.forEach((kind) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = KIND_LABELS[kind];
    button.dataset.kind = kind;
    button.className = 'chip';
    bar.appendChild(button);
  });
  bar.addEventListener('click', (event) => {
    const button = event.target.closest('[data-kind]');
    if (!button) return;
    filters.kind = button.dataset.kind;
    bar.querySelectorAll('.chip').forEach((chip) => chip.classList.toggle('active', chip === button));
    renderAll();
  });
}

async function loadData() {
  const [trophyRes, roadmapRes] = await Promise.all([
    fetch('data/trophies.json'),
    fetch('data/roadmap.json'),
  ]);
  if (!trophyRes.ok || !roadmapRes.ok) throw new Error('Could not load the trophy data.');
  trophies = (await trophyRes.json()).trophies;
  roadmap = await roadmapRes.json();
}

function wireControls() {
  buildKindFilters();
  $('search-box').addEventListener('input', (event) => {
    filters.query = event.target.value.trim();
    renderAll();
  });
  $('grade-filter').addEventListener('change', (event) => {
    filters.grade = event.target.value;
    renderAll();
  });
  $('earned-filter').addEventListener('change', (event) => {
    filters.earned = event.target.value;
    renderAll();
  });
  $('spoiler-toggle').addEventListener('change', (event) => {
    state.spoilers = event.target.checked;
    saveState(state);
    renderAll();
  });
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
  $('trophy-list').addEventListener('change', (event) => {
    const box = event.target.closest('[data-earned]');
    if (!box) return;
    toggleEarned(state, Number(box.dataset.earned));
    renderAll();
  });
  $('export-btn').addEventListener('click', () => {
    downloadFile('leonida-trophy-atlas-progress.json', exportState(state));
  });
  $('import-btn').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = importStateText(text);
      Object.assign(state, imported);
      saveState(state);
      selectedId = null;
      renderAll();
      $('import-note').textContent = 'Progress imported.';
    } catch {
      $('import-note').textContent = 'That file is not a Leonida Trophy Atlas progress export.';
    }
    event.target.value = '';
  });
  $('reset-btn').addEventListener('click', () => {
    if (!window.confirm('Clear all saved progress in this browser?')) return;
    Object.assign(state, { checks100: {}, counters: {}, earned: {}, spoilers: true });
    saveState(state);
    selectedId = null;
    renderAll();
  });
}

async function bootAtlas() {
  try {
    await loadData();
  } catch {
    $('trophy-list').innerHTML = '<p class="empty">The trophy data could not be loaded. Serve this folder with a static server and reload.</p>';
    return;
  }
  wireControls();
  renderAll();
}

bootAtlas();
