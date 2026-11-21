// Leonida Trophy Atlas — boot: load the trophy list, the 100% checklist and the
// roadmap, wire the tabs, the filters, export/import and the progress bar.
import { loadState, saveState, downloadProgress, parseImport } from './store.js';
import { renderChecklist } from './checklist.js';
import { renderRoadmap, renderHundred, renderMissables } from './pages.js';

const state = loadState();
const trophiesDoc = await (await fetch('data/trophies.json')).json();
const hundredDoc = await (await fetch('data/hundred.json')).json();
const roadmapDoc = await (await fetch('data/roadmap.json')).json();
const trophies = trophiesDoc.trophies;

const VIEWS = ['checklist', 'roadmap', 'hundred', 'missables'];

function updateProgress() {
  const earned = state.earned.length;
  document.getElementById('barFill').style.width = (earned / trophies.length) * 100 + '%';
  document.getElementById('progressText').textContent = `${earned} of ${trophies.length} earned`;
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    counts[t.grade][1] += 1;
    if (state.earned.includes(t.name)) counts[t.grade][0] += 1;
  }
  document.getElementById('gradeCounts').textContent =
    `Platinum ${counts.platinum[0]}/${counts.platinum[1]} · Gold ${counts.gold[0]}/${counts.gold[1]} · Silver ${counts.silver[0]}/${counts.silver[1]} · Bronze ${counts.bronze[0]}/${counts.bronze[1]}`;
}

function showView(view) {
  if (!VIEWS.includes(view)) view = 'checklist';
  state.view = view;
  saveState(state);
  for (const v of VIEWS) {
    document.getElementById('view-' + v).hidden = v !== view;
    document.querySelector(`.tabs [data-view="${v}"]`).classList.toggle('active', v === view);
  }
  if (view === 'roadmap') renderRoadmap(document.getElementById('view-roadmap'), roadmapDoc);
  if (view === 'hundred') renderHundred(document.getElementById('view-hundred'), hundredDoc, state, updateProgress);
  if (view === 'missables') renderMissables(document.getElementById('view-missables'), trophies);
  location.hash = view;
}

for (const btn of document.querySelectorAll('.tabs [data-view]')) {
  btn.addEventListener('click', () => showView(btn.dataset.view));
}
window.addEventListener('hashchange', () => showView(location.hash.slice(1)));

const gradeFilter = document.getElementById('gradeFilter');
const earnedFilter = document.getElementById('earnedFilter');
const searchBox = document.getElementById('searchBox');
const spoilerToggle = document.getElementById('spoilerToggle');
gradeFilter.value = state.grade;
earnedFilter.value = state.status;
searchBox.value = state.search;
spoilerToggle.checked = state.spoiler;
gradeFilter.addEventListener('change', () => {
  state.grade = gradeFilter.value;
  saveState(state);
  renderChecklist(trophies, state, updateProgress);
});
earnedFilter.addEventListener('change', () => {
  state.status = earnedFilter.value;
  saveState(state);
  renderChecklist(trophies, state, updateProgress);
});
searchBox.addEventListener('input', () => {
  state.search = searchBox.value;
  saveState(state);
  renderChecklist(trophies, state, updateProgress);
});
spoilerToggle.addEventListener('change', () => {
  state.spoiler = spoilerToggle.checked;
  saveState(state);
  renderChecklist(trophies, state, updateProgress);
});

document.getElementById('exportBtn').addEventListener('click', () => downloadProgress(state));
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const imported = parseImport(await file.text(), trophies, hundredDoc.items);
    state.earned = imported.earned;
    state.counters = imported.counters;
    state.hundred = imported.hundred;
    saveState(state);
    updateProgress();
    renderChecklist(trophies, state, updateProgress);
  } catch {
    alert('That file is not a Leonida Trophy Atlas progress file.');
  }
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks, counters and 100% progress?')) return;
  state.earned = [];
  state.counters = {};
  state.hundred = {};
  saveState(state);
  updateProgress();
  renderChecklist(trophies, state, updateProgress);
});

updateProgress();
renderChecklist(trophies, state, updateProgress);
showView(location.hash.slice(1) || state.view || 'checklist');
