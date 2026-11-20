// Checklist rows and the guide detail panel.
import { escapeHtml } from './util.js';
import { displayName, displayDescription, kindLabel } from './filters.js';
import { sourceLink } from './sources.js';

function gradeBadge(grade) {
  return `<span class="badge ${grade}">${escapeHtml(grade)}</span>`;
}

function targetChip(trophy, state) {
  if (!trophy.target) return '';
  const have = state.counts[trophy.id] || 0;
  const unit = trophy.targetUnit ? ` ${escapeHtml(trophy.targetUnit)}` : '';
  return `<span class="counterchip">${have}/${trophy.target}${unit}</span>`;
}

function tagsFor(trophy) {
  const tags = [];
  if (trophy.hidden) tags.push('<span class="tag hidden">Hidden</span>');
  if (trophy.missable) tags.push('<span class="tag missable">Possibly missable</span>');
  if (trophy.unknown) tags.push('<span class="tag unknown">Method not confirmed</span>');
  return tags.join('');
}

export function renderList(listEl, trophies, state, opts, callbacks) {
  listEl.innerHTML = '';
  for (const t of trophies) {
    const li = document.createElement('li');
    li.className = 'trophyrow' + (state.earned[t.id] ? ' earned' : '') + (opts.selectedId === t.id ? ' selected' : '');
    li.dataset.id = String(t.id);
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = Boolean(state.earned[t.id]);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      callbacks.onToggle(t.id, box.checked);
    });
    const badge = document.createElement('span');
    badge.innerHTML = gradeBadge(t.grade);
    const main = document.createElement('div');
    main.innerHTML =
      `<div class="tname">${escapeHtml(displayName(t, state, opts.spoilersOn))}</div>` +
      `<div class="tdesc">${escapeHtml(displayDescription(t, state, opts.spoilersOn))}</div>` +
      `<div class="tmeta"><span class="tag">${escapeHtml(kindLabel(t))}</span>${tagsFor(t)}</div>`;
    const chip = document.createElement('span');
    chip.innerHTML = targetChip(t, state);
    li.append(box, badge, main, chip);
    li.addEventListener('click', () => callbacks.onSelect(t.id));
    listEl.appendChild(li);
  }
}

function stageText(trophy) {
  if (trophy.stage === 1) return 'Step 1 — play the story.';
  if (trophy.stage === 2) return 'Step 2 — the 100% checklist, after the credits.';
  if (trophy.stage === 3) return 'Step 3 — Strangers & Freaks and clean-up.';
  return 'Any time, in free roam.';
}

export function renderDetail(panel, trophy, state, callbacks) {
  if (!trophy) {
    panel.innerHTML = '<p class="detailhint">Pick a trophy on the left to read its guide, its sources, and when to earn it.</p>';
    return;
  }
  const have = state.counts[trophy.id] || 0;
  const counter = trophy.target
    ? `<div class="counterbox" role="group" aria-label="Progress counter">
        <button type="button" data-step="-1" aria-label="Decrease count">−</button>
        <span class="count">${have} / ${trophy.target}${trophy.targetUnit ? ' ' + escapeHtml(trophy.targetUnit) : ''}</span>
        <button type="button" data-step="1" aria-label="Increase count">+</button>
        <span class="small">Your count — saved in this browser.</span>
      </div>`
    : '';
  const missable = trophy.missable
    ? `<p><span class="tag missable">Possibly missable</span> ${escapeHtml(trophy.missableNote || '')}</p>`
    : '<p>No missable moment: this trophy stays available in free roam after the story.</p>';
  const unknown = trophy.unknown
    ? '<p><span class="tag unknown">Method not confirmed yet</span> Checked 20 November 2026 — no guide we cite has confirmed the exact steps. This entry says so instead of guessing.</p>'
    : '';
  const sources = (trophy.sources || ['powerpyx', 'gtabase'])
    .map((key) => `<li>${sourceLink(key)}</li>`)
    .join('');
  panel.innerHTML =
    `<h2>${escapeHtml(trophy.name)}</h2>` +
    `<p>${gradeBadge(trophy.grade)} <span class="tag">${escapeHtml(kindLabel(trophy))}</span>${tagsFor(trophy)}</p>` +
    `<p class="official">Official description: “${escapeHtml(trophy.description)}”</p>` +
    `<h3>How to unlock it</h3><p>${escapeHtml(trophy.guide)}</p>` +
    unknown +
    `<h3>Sources</h3><ul class="sources">${sources}</ul>` +
    `<h3>When</h3><p>${stageText(trophy)}</p>` +
    `<h3>Missable?</h3>${missable}` +
    (trophy.target ? `<h3>Progress target</h3>${counter}` : '') +
    `<p class="small">Guide text is original to this atlas. The official name and description are shown as PlayStation publishes them.</p>`;
  for (const btn of panel.querySelectorAll('.counterbox button')) {
    btn.addEventListener('click', () => callbacks.onCount(trophy.id, Number(btn.dataset.step)));
  }
}
