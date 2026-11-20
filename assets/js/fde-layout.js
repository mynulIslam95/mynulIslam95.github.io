(() => {
  'use strict';

  const roadmap = document.querySelector('.fde-milestones');
  const outline = document.querySelector('.fde-outline');
  const courseNav = document.querySelector('[data-python-course]');
  const milestones = roadmap ? [...roadmap.children] : [];

  const launch = document.querySelector('[data-fde-launch]');
  const launchScreen = document.querySelector('[data-fde-launch-screen]');

  let returnedCard;

  if (launch && launchScreen) {
    const cover = launch.closest('.fde-cover');
    const course = document.getElementById('roadmap');
    const roadmapTitle = document.getElementById('roadmap-title');
    function syncCourseView() {
      const target = document.getElementById(location.hash.slice(1));
      const inCourse = Boolean(target && course.contains(target));
      cover.hidden = inCourse;
      course.hidden = !inCourse;
      return inCourse ? target : null;
    }

    function navigateCourseView() {
      const target = syncCourseView();
      returnedCard = undefined;
      if (!target) return;

      const textbookLink = target.matches('article') && target.querySelector('.fde-step-link');
      if (textbookLink) {
        location.replace(textbookLink.href);
        return;
      }

      const saved = history.state?.fdeRoadmapReturn;
      const link = saved && document.getElementById(saved.id)?.querySelector('.fde-step-link');
      if (link) {
        window.scrollTo({ top: saved.y, behavior: 'instant' });
        returnedCard = { row: link.closest('li'), y: window.scrollY };
        link.focus({ preventScroll: true });
      } else if (target === course || target === roadmapTitle) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }

    function isPlainClick(event) {
      return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    }

    navigateCourseView();
    addEventListener('hashchange', () => {
      navigateCourseView();
      scheduleUpdate();
    });
    addEventListener('pageshow', (event) => {
      if (event.persisted && history.state?.fdeRoadmapReturn) navigateCourseView();
    });

    roadmap.addEventListener('click', (event) => {
      const link = event.target.closest('.fde-step-link');
      if (!link || !isPlainClick(event)) return;
      history.replaceState({
        ...history.state,
        fdeRoadmapReturn: { id: link.closest('article').id, y: window.scrollY }
      }, '');
    });

    launch.addEventListener('click', async (event) => {
      if (!isPlainClick(event)) return;
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

  const lessonLinks = courseNav ? [...courseNav.querySelectorAll('li a')] : [];
  const courseLinks = lessonLinks
    .filter((link) => link.hash && link.pathname === location.pathname)
    .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
    .filter(({ target }) => target);
  let currentCourseLink = lessonLinks.find((link) => link.hasAttribute('aria-current'));
  let completedSection = -1;

  function fillCourseThrough(selected) {
    const currentIndex = lessonLinks.indexOf(selected);
    lessonLinks.forEach((link, index) => {
      link.classList.toggle('is-reached', index <= currentIndex);
    });
  }

  fillCourseThrough(currentCourseLink);

  let frame;
  let currentMilestone;
  function updatePosition() {
    frame = undefined;
    const scrollRoot = document.scrollingElement;
    const atBottom = scrollRoot.scrollTop > 0 &&
      scrollRoot.scrollHeight - scrollRoot.clientHeight - scrollRoot.scrollTop <= 2;
    let nextMilestone;
    if (roadmap?.getClientRects().length) {
      const marker = innerHeight * 0.54;
      if (returnedCard && Math.abs(scrollRoot.scrollTop - returnedCard.y) > 2) returnedCard = undefined;
      nextMilestone = returnedCard?.row ?? (atBottom ? milestones.at(-1) :
        milestones.findLast((milestone) => milestone.getBoundingClientRect().top <= marker));
    }
    if (nextMilestone !== currentMilestone) {
      currentMilestone?.classList.remove('is-current');
      nextMilestone?.classList.add('is-current');
      currentMilestone = nextMilestone;
    }

    if (courseLinks.length) {
      const visible = courseLinks.findLast(({ target }) => target.getBoundingClientRect().top <= 150);
      const nextLink = (visible ?? courseLinks[0]).link;
      if (nextLink !== currentCourseLink) {
        currentCourseLink?.removeAttribute('aria-current');
        nextLink.setAttribute('aria-current', 'location');
        currentCourseLink = nextLink;
        fillCourseThrough(nextLink);
      }
    }

    const active = sections.findLastIndex((section) => section.getBoundingClientRect().top <= 150);
    // A section is completed after the reader reaches the next section or the page ends.
    if (courseNav) {
      const lastPassed = atBottom ? links.length - 1 : active - 1;
      while (completedSection < lastPassed) {
        const link = links[++completedSection];
        link.classList.add('is-complete');
        link.setAttribute('aria-label', link.textContent + ' (complete)');
        const mark = document.createElement('span');
        mark.className = 'fde-outline-check';
        mark.setAttribute('aria-hidden', 'true');
        mark.textContent = '✓';
        link.append(mark);
      }
    }
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
    addEventListener('hashchange', scheduleUpdate);
    addEventListener('pageshow', scheduleUpdate);
    updatePosition();
  }
})();
