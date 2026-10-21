(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');
  if (hero && !reduced && matchMedia('(pointer: fine)').matches) {
    let queued = false;
    hero.addEventListener('pointermove', event => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--gx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        hero.style.setProperty('--gy', `${((event.clientY - rect.top) / rect.height) * 100}%`);
        queued = false;
      });
    }, {passive: true});
  }
  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('flow-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {threshold: .08});
    document.querySelectorAll('.flow-reveal').forEach(element => observer.observe(element));
  }
  const toggle = document.getElementById('nav-toggle');
  if (toggle) {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') toggle.checked = false;
    });
    toggle.addEventListener('change', () => {
      document.querySelector('.burger')?.setAttribute('aria-expanded', String(toggle.checked));
    });
  }
})();
