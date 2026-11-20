// Roadmap, missables, the 100% checklist and the sources tab.
import { escapeHtml } from './util.js';
import { SOURCES } from './sources.js';

export function renderRoadmap(stepsEl, roadmap) {
  stepsEl.innerHTML = '';
  for (const step of roadmap.steps) {
    const li = document.createElement('li');
    const points = step.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
    li.innerHTML =
      `<h3>${escapeHtml(step.title)} <span class="hours">${escapeHtml(step.hours)}</span></h3>` +
      `<p>${escapeHtml(step.text)}</p><ul>${points}</ul>`;
    stepsEl.appendChild(li);
  }
}

export function renderMissables(missableEl, unknownEl, trophies) {
  const missable = trophies.filter((t) => t.missable);
  missableEl.innerHTML =
    '<table><thead><tr><th>Trophy</th><th>What can be missed</th><th>How to stay safe</th></tr></thead><tbody>' +
    missable
      .map(
        (t) =>
          `<tr><td><strong>${escapeHtml(t.name)}</strong><br><span class="small">${escapeHtml(t.description)}</span></td>` +
          `<td>${escapeHtml(t.missableNote || '')}</td>` +
          `<td>Do the balcony meditation in Chapter 1, and keep a manual save at the start of every chapter.</td></tr>`,
      )
      .join('') +
    '</tbody></table>';
  const unknown = trophies.filter((t) => t.unknown);
  unknownEl.innerHTML =
    '<table><thead><tr><th>Trophy</th><th>What its description says</th><th>Status</th></tr></thead><tbody>' +
    unknown
      .map(
        (t) =>
          `<tr><td><strong>${escapeHtml(t.name)}</strong></td>` +
          `<td>${escapeHtml(t.description)}</td>` +
          `<td><span class="tag unknown">No confirmed method — checked 20 Nov 2026</span></td></tr>`,
      )
      .join('') +
    '</tbody></table>';
}

export function renderHundred(listEl, roadmap) {
  const rows = roadmap.hundred.map(
    (item) =>
      `<tr><td>${escapeHtml(item.name)}</td><td class="need">${escapeHtml(item.need)}</td><td>${escapeHtml(item.note)}</td></tr>`,
  );
  listEl.innerHTML =
    '<table><thead><tr><th>Requirement</th><th>Needed</th><th>Note</th></tr></thead><tbody>' +
    rows.join('') +
    '</tbody></table>';
}

export function renderSources(listEl) {
  const entries = Object.entries(SOURCES).map(
    ([, s]) => `<li><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a></li>`,
  );
  listEl.innerHTML = `<ul class="sources">${entries.join('')}</ul>`;
}
