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

/* Learning pages: progressive enhancement without hiding content. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (preference.matches) return;
      const animation = entry.target.animate(
        [{opacity: 0.3, transform: 'translateY(18px)'}, {opacity: 1, transform: 'translateY(0)'}],
        {duration: 580, easing: 'cubic-bezier(0.22, 1, 0.36, 1)'}
      );
      running.add(animation);
      animation.onfinish = () => running.delete(animation);
      animation.oncancel = () => running.delete(animation);
    });
  }, {threshold: 0.08});
  document.querySelectorAll('.learning-card:not(.flow-reveal), .method-grid article, .rm-module > summary, .rm-toc, .learn-hero .lede, #roadmap > .wrap > h2').forEach(element => observer.observe(element));
  function reduce(event) {
    if (event.matches) {
      observer.disconnect();
      running.forEach(animation => animation.cancel());
      running.clear();
    }
  }
  if (preference.addEventListener) preference.addEventListener('change', reduce);
})();
