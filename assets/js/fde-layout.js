(() => {
  'use strict';

  const roadmap = document.querySelector('.fde-milestones');
  const outline = document.querySelector('.fde-outline');
  const milestones = roadmap ? [...roadmap.children] : [];

  const launch = document.querySelector('[data-fde-launch]');
  const launchScreen = document.querySelector('[data-fde-launch-screen]');

  if (launch && launchScreen) {
    const cover = launch.closest('.fde-cover');
    const course = document.getElementById('roadmap');
    const roadmapTitle = document.getElementById('roadmap-title');

    function syncCourseView() {
      const target = document.getElementById(location.hash.slice(1));
      const showCourse = Boolean(target && course.contains(target));
      const changed = cover.hidden !== showCourse;
      cover.hidden = showCourse;
      course.hidden = !showCourse;
      return changed ? target : null;
    }

    function navigateCourseView() {
      const target = syncCourseView();
      if (target && !course.hidden) {
        if (target === course || target === roadmapTitle) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
          target.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      }
    }

    navigateCourseView();
    addEventListener('hashchange', navigateCourseView);


    launch.addEventListener('click', async (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (cover.classList.contains('is-launching')) return;

      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      cover.classList.add('is-launching');
      if (!reducedMotion) await pause(250);
      launchScreen.hidden = false;
      await pause(reducedMotion ? 1050 : 1450);

      if (location.hash !== launch.hash) history.pushState(null, '', launch.hash);
      syncCourseView();
      window.scrollTo({ top: 0, behavior: 'instant' });
      roadmapTitle.focus({ preventScroll: true });
      scheduleUpdate();
      launchScreen.classList.add('is-leaving');
      if (!reducedMotion) await pause(400);
      launchScreen.hidden = true;
      launchScreen.classList.remove('is-leaving');
      cover.classList.remove('is-launching');
    });
  }

  if (outline) {
    const menu = document.querySelector('.fde-lesson-menu');
    const compact = matchMedia('(max-width: 850px)');
    const sizeMenu = () => { menu.open = !compact.matches; };
    sizeMenu();
    compact.addEventListener('change', sizeMenu);
  }

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
  let currentMilestone;
  function updatePosition() {
    frame = undefined;
    let nextMilestone;
    if (roadmap?.getClientRects().length) {
      const scrollRoot = document.scrollingElement;
      const atBottom = scrollRoot.scrollTop > 0 &&
        scrollRoot.scrollHeight - scrollRoot.clientHeight - scrollRoot.scrollTop <= 2;
      const marker = innerHeight * 0.54;
      nextMilestone = atBottom ? milestones.at(-1) :
        milestones.findLast((milestone) => milestone.getBoundingClientRect().top <= marker);
    }
    if (nextMilestone !== currentMilestone) {
      currentMilestone?.classList.remove('is-current');
      nextMilestone?.classList.add('is-current');
      currentMilestone = nextMilestone;
    }

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
    roadmap?.addEventListener('toggle', scheduleUpdate, true);
    addEventListener('scroll', scheduleUpdate, { passive: true });
    addEventListener('resize', scheduleUpdate);
    addEventListener('pageshow', scheduleUpdate);
    updatePosition();
  }
})();
