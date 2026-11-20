(() => {
  'use strict';

  const roadmap = document.querySelector('.fde-milestones');
  const outline = document.querySelector('.fde-outline');
  const milestones = roadmap ? [...roadmap.children] : [];

  if (outline) {
    const menu = document.querySelector('.fde-lesson-menu');
    const compact = matchMedia('(max-width: 850px)');
    const sizeMenu = () => { menu.open = !compact.matches; };
    sizeMenu();
    compact.addEventListener('change', sizeMenu);
  }

  // A roadmap link may target a topic inside two collapsed disclosures.
  roadmap?.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    const target = link && document.getElementById(link.hash.slice(1));
    if (target instanceof HTMLDetailsElement) target.open = true;
  });

  const headings = outline ? [...document.querySelectorAll(
    'main h2[id], main section[id] > h2, main .debug-box[id] > h2'
  )] : [];
  const sections = headings.map((heading) => heading.id ? heading : heading.parentElement);
  const links = headings.map((heading, index) => {
    const link = document.createElement('a');
    link.href = '#' + sections[index].id;
    link.textContent = heading.textContent;
    return link;
  });

  if (links.length) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'On this page');
    const label = document.createElement('p');
    label.textContent = 'On this page';
    nav.append(label, ...links);
    outline.append(nav);
    outline.hidden = false;
    document.body.classList.add('fde-has-outline');
  }

  let frame;
  function updatePosition() {
    frame = undefined;
    const roadmapMarker = innerHeight * 0.68;
    const entered = (element) => element.getBoundingClientRect().top <= roadmapMarker;
    milestones.forEach((milestone) => milestone.classList.toggle('is-reached', entered(milestone)));

    const active = sections.findLastIndex((section) => section.getBoundingClientRect().top <= 150);
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (frame === undefined) frame = requestAnimationFrame(updatePosition);
  }

  if (milestones.length || sections.length) {
    addEventListener('scroll', scheduleUpdate, { passive: true });
    addEventListener('resize', scheduleUpdate);
    addEventListener('pageshow', scheduleUpdate);
    updatePosition();
  }
})();
