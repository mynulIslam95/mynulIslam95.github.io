(() => {
  'use strict';
  const KEY = 'mynul-python-ai-v1';
  let progress;
  try { progress = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { progress = {}; }
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) progress = {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch {} };
  const normalize = text => String(text).replace(/\r\n/g, '\n').trim().split('\n').map(line => line.trimEnd()).join('\n');
  const drills = window.PYTHON_PRACTICE || [];
  const status = document.querySelector('[data-score]');
  function paint() {
    const checked = drills.filter(d => d.accept);
    const solved = checked.filter(d => progress[d.id]?.solved).length;
    if (status) status.textContent = `${solved} / ${checked.length} checked answers correct`;
    document.querySelectorAll('[data-chapter-status]').forEach(el => {
      el.textContent = progress[`chapter-${el.dataset.chapterStatus}`] ? 'Read' : 'Open';
    });
  }
  drills.forEach(d => {
    const card = document.getElementById(d.id);
    if (!card) return;
    const input = card.querySelector('textarea');
    const feedback = card.querySelector('[data-feedback]');
    input.value = progress[d.id]?.draft || '';
    if (progress[d.id]?.solved) { card.classList.add('is-solved'); feedback.textContent = 'Previously answered correctly. Try again whenever you want.'; }
    else if (input.value) feedback.textContent = 'Saved draft restored.';
    const draft = () => { progress[d.id] = { ...progress[d.id], draft: input.value }; save(); };
    input.addEventListener('input', draft);
    card.querySelector('[data-hint-button]').addEventListener('click', event => {
      const hint = card.querySelector('[data-hint]');
      hint.hidden = !hint.hidden;
      event.currentTarget.setAttribute('aria-expanded', String(!hint.hidden));
    });
    card.querySelector('[data-submit]').addEventListener('click', () => {
      if (!input.value.trim()) { feedback.textContent = 'Write an answer first.'; input.focus(); return; }
      draft();
      if (!d.accept) {
        feedback.textContent = 'Draft saved. This task is for self-review, not automatic grading. Open the commented answer, run your program locally and compare its behavior.';
      } else {
        const correct = d.accept.some(answer => normalize(answer) === normalize(input.value));
        if (correct) {
          progress[d.id].solved = true; save(); card.classList.add('is-solved');
          feedback.textContent = 'Correct. ' + d.why;
        } else feedback.textContent = 'Not yet. Compare spelling, case and line breaks, then use the hint and trace each line. Your answer is saved.';
        paint();
      }
    });
    card.querySelector('[data-answer-button]').addEventListener('click', event => {
      const answer = card.querySelector('[data-answer]');
      answer.hidden = !answer.hidden;
      event.currentTarget.setAttribute('aria-expanded', String(!answer.hidden));
    });
  });
  const complete = document.querySelector('[data-complete]');
  if (complete) {
    const key = `chapter-${document.body.dataset.chapter}`;
    const update = () => { complete.textContent = progress[key] ? 'Marked as read. Mark unread' : 'Mark chapter as read'; complete.setAttribute('aria-pressed', String(!!progress[key])); };
    complete.addEventListener('click', () => { progress[key] = !progress[key]; save(); update(); });
    update();
  }
  const search = document.querySelector('[data-search]');
  if (search) search.addEventListener('input', () => {
    const query = search.value.toLowerCase().trim(); let visible = 0;
    document.querySelectorAll('[data-course-card]').forEach(card => {
      card.hidden = !card.textContent.toLowerCase().includes(query);
      if (!card.hidden) visible++;
    });
    document.querySelector('[data-search-status]').textContent = visible ? `${visible} chapters and projects shown` : 'No matching chapters or projects.';
  });
  paint();
})();
