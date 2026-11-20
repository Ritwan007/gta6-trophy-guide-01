// The checklist view: trophy rows and the guide detail panel beside them.
// Rows show the grade badge, the official name and description, the
// progress counter where one applies, and the missable and unconfirmed
// tags. The detail panel shows the full guide with its named sources.
import { GRADE_LABELS, KIND_LABELS, isMasked } from './filters.js';
import { counterValue } from './store.js';
import { sourceLinks } from './sources.js';

function gradeBadge(trophy) {
  return `<span class="badge grade-${trophy.grade}" title="${GRADE_LABELS[trophy.grade]}">${GRADE_LABELS[trophy.grade]}</span>`;
}

function counterChip(trophy, state) {
  if (!trophy.counter) return '';
  const value = counterValue(state, trophy.id);
  const done = value >= trophy.counter.target;
  return `<span class="counter ${done ? 'done' : ''}">${value}/${trophy.counter.target} ${trophy.counter.unit}</span>`;
}

function tagRow(trophy) {
  const tags = [];
  if (trophy.missable) tags.push('<span class="tag tag-missable">Possibly missable</span>');
  if (trophy.unconfirmed) tags.push('<span class="tag tag-unconfirmed">Method not confirmed yet</span>');
  trophy.kinds.forEach((kind) => {
    tags.push(`<span class="tag">${KIND_LABELS[kind] || kind}</span>`);
  });
  return tags.join(' ');
}

export function renderChecklistRows(listEl, trophies, state, onSelect, selectedId) {
  if (trophies.length === 0) {
    listEl.innerHTML = '<p class="empty">No trophies match these filters. Clear the search or pick another filter.</p>';
    return;
  }
  listEl.innerHTML = trophies
    .map((trophy) => {
      const earned = Boolean(state.earned[trophy.id]);
      const masked = isMasked(trophy, state);
      const name = masked ? 'Hidden story trophy' : trophy.name;
      const description = masked ? 'Earn this trophy to reveal its name and description.' : trophy.description;
      return `<article class="row ${earned ? 'earned' : ''} ${selectedId === trophy.id ? 'selected' : ''}" data-id="${trophy.id}" tabindex="0" role="button" aria-label="${masked ? 'Hidden story trophy' : trophy.name}">
        <label class="tick" title="Mark earned">
          <input type="checkbox" data-earned="${trophy.id}" ${earned ? 'checked' : ''} aria-label="Earned: ${masked ? 'hidden story trophy' : trophy.name}">
          <span class="box" aria-hidden="true">${earned ? '✓' : ''}</span>
        </label>
        <div class="row-main">
          <div class="row-top">${gradeBadge(trophy)}<h3>${name}</h3>${counterChip(trophy, state)}</div>
          <p class="desc">${description}</p>
          <div class="tags">${tagRow(trophy)}</div>
        </div>
      </article>`;
    })
    .join('');
  listEl.querySelectorAll('.row').forEach((row) => {
    row.addEventListener('click', (event) => {
      if (event.target.closest('input[type="checkbox"]')) return;
      onSelect(Number(row.dataset.id));
    });
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(Number(row.dataset.id));
      }
    });
  });
}

export function renderDetail(panelEl, trophy, state, onCounter) {
  if (!trophy) {
    panelEl.innerHTML = '<p class="empty">Pick a trophy on the left to read its guide, sources and progress counter.</p>';
    return;
  }
  const earned = Boolean(state.earned[trophy.id]);
  const masked = isMasked(trophy, state);
  const name = masked ? 'Hidden story trophy' : trophy.name;
  const description = masked ? 'Earn this trophy to reveal its name and description.' : trophy.description;
  const links = sourceLinks(trophy.sources)
    .map((source) => `<li><a href="${source.url}" target="_blank" rel="noopener">${source.label}</a></li>`)
    .join('');
  let counterBlock = '';
  if (trophy.counter) {
    const value = counterValue(state, trophy.id);
    counterBlock = `<section class="counter-box">
      <h4>Your progress</h4>
      <div class="stepper">
        <button type="button" data-step="-1" aria-label="Decrease counter">−</button>
        <strong>${value} / ${trophy.counter.target} ${trophy.counter.unit}</strong>
        <button type="button" data-step="1" aria-label="Increase counter">+</button>
      </div>
      ${trophy.counter.note ? `<p class="note">${trophy.counter.note}.</p>` : ''}
    </section>`;
  }
  panelEl.innerHTML = `<article class="detail">
    <div class="detail-head">${gradeBadge(trophy)}<div><h2>${name}</h2><p class="official">Official description: ${description}</p></div></div>
    <p class="earned-line">${earned ? '✓ Earned — ticked in your tracker.' : 'Not earned yet.'} Roadmap stage ${trophy.stage} of 3.</p>
    <div class="tags">${tagRow(trophy)}</div>
    <section><h4>Guide</h4><p class="guide">${trophy.guide}</p></section>
    ${counterBlock}
    <section><h4>Sources</h4><ul class="sources">${links}</ul>
    <p class="note">Every fact above comes from the sources listed here. The guide is written in this atlas's own words; only the official name and description are shown as PlayStation publishes them.</p></section>
  </article>`;
  panelEl.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => onCounter(trophy, Number(button.dataset.step)));
  });
}
