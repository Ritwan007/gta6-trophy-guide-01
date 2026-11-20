// The roadmap, missables and 100% checklist views, all built from the
// official descriptions and the two 100% guides. The missables tab names
// the one possibly missable trophy and the one trophy whose method is
// still unconfirmed, and says plainly where the others were confirmed.
import { sourceLinks } from './sources.js';

export function renderRoadmap(containerEl, roadmap) {
  containerEl.innerHTML = `
    <p class="intro">Three steps to the platinum, in the order the official descriptions support. About 200 hours in all: 60–80 for the story, about 100 for the 100% checklist, about 10 for Strangers &amp; Freaks and clean-up.</p>
    ${roadmap.steps
      .map(
        (step) => `<section class="step">
          <h3>${step.title} <span class="hours">${step.hours}</span></h3>
          ${step.warning ? `<p class="warning">${step.warning}</p>` : ''}
          <p>${step.body}</p>
        </section>`,
      )
      .join('')}
    <section class="step">
      <h3>Watch out for</h3>
      <ul>${roadmap.notes.map((note) => `<li>${note}</li>`).join('')}</ul>
    </section>
    <p class="note">Roadmap sources: ${sourceLinks(['powerpyx', 'gtabase'])
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.short}</a>`)
      .join(' · ')}.</p>`;
}

export function renderMissables(containerEl, trophies) {
  const missable = trophies.filter((t) => t.missable);
  const unconfirmed = trophies.filter((t) => t.unconfirmed);
  const confirmed = trophies.filter((t) => [44, 45, 50, 51].includes(t.id));
  containerEl.innerHTML = `
    <p class="intro">Only one trophy is possibly missable, and only one trophy still has no confirmed method. Everything else can be earned after the story in free roam.</p>
    <section class="step"><h3>Possibly missable — 1</h3>
      ${missable
        .map(
          (t) => `<p><strong>${t.name}</strong> — ${t.description} ${t.guide}</p>
          <p class="note">Sources: ${sourceLinks(t.sources)
            .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.short}</a>`)
            .join(' · ')}.</p>`,
        )
        .join('')}
    </section>
    <section class="step"><h3>Method not confirmed yet — 1</h3>
      ${unconfirmed
        .map(
          (t) => `<p><strong>${t.name}</strong> — ${t.description} ${t.guide}</p>
          <p class="note">Sources: ${sourceLinks(t.sources)
            .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.short}</a>`)
            .join(' · ')}.</p>`,
        )
        .join('')}
    </section>
    <section class="step"><h3>Confirmed on 20 Nov 2026 — 4</h3>
      <p>These four were listed as unknown when the game launched, and their methods were confirmed by the PowerPyx trophy guide on 20 Nov 2026:</p>
      <ul>${confirmed.map((t) => `<li><strong>${t.name}</strong> — ${t.description}</li>`).join('')}</ul>
      <p class="note">Open any of the four in the checklist to read the confirmed method with its source.</p>
    </section>
    <section class="step"><h3>Safe for the rest</h3>
      <p>Every other trophy is reported as obtainable after the story in free roam. There is no mission replay, so keep a manual save at the start of each chapter, but no trophy besides Positive Mental Attitude can be locked out.</p>
    </section>`;
}

export function renderChecklist100(containerEl, roadmap, state, onToggle) {
  const groups = [];
  roadmap.checklist.forEach((item, index) => {
    if (!groups.includes(item.group)) groups.push(item.group);
  });
  const done = roadmap.checklist.filter((_, index) => state.checks100[index]).length;
  containerEl.innerHTML = `
    <p class="intro">The 35 requirements behind A Long Road, as the PowerPyx and GTABase 100% guides list them. The checklist only appears in the game after the credits, under Progress, then Stats, then 100% Completion, but progress made during the story already counts. Tick each requirement off here as you finish it: <strong>${done} of 35 done</strong>.</p>
    ${groups
      .map((group) => {
        const rows = roadmap.checklist
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => item.group === group);
        return `<section class="step"><h3>${group}</h3><table class="hundred">
          <thead><tr><th></th><th>Requirement</th><th>Target</th></tr></thead>
          <tbody>${rows
            .map(
              ({ item, index }) => `<tr>
                <td><input type="checkbox" data-check100="${index}" ${state.checks100[index] ? 'checked' : ''} aria-label="${item.name}"></td>
                <td>${item.name}</td>
                <td>${item.target === null ? '—' : item.target.toLocaleString('en-US') + (item.unit ? ' ' + item.unit : '')}</td>
              </tr>`,
            )
            .join('')}</tbody></table></section>`;
      })
      .join('')}
    <p class="note">Sources: ${sourceLinks(['powerpyx100', 'gtabase100'])
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.short}</a>`)
      .join(' · ')}. Checked ${roadmap.checked}.</p>`;
  containerEl.querySelectorAll('[data-check100]').forEach((box) => {
    box.addEventListener('change', () => onToggle(Number(box.dataset.check100)));
  });
}
