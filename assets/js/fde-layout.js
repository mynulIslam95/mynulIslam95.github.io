(() => {
  'use strict';

  const roadmap = document.querySelector('.fde-milestones');
  const outline = document.querySelector('.fde-outline');
  const milestones = roadmap ? [...roadmap.children] : [];

  const launch = document.querySelector('[data-fde-launch]');
  const launchScreen = document.querySelector('[data-fde-launch-screen]');

  let returnedCard;

  if (launch && launchScreen) {
    const cover = launch.closest('.fde-cover');
    const course = document.getElementById('roadmap');
    const roadmapTitle = document.getElementById('roadmap-title');
    const topicView = document.querySelector('.fde-topic-view');
    const topicTitle = document.getElementById('fde-topic-title');
    const topicLabel = topicView.querySelector('[data-fde-topic-label]');
    const topicContent = topicView.querySelector('[data-fde-topic-content]');
    const returnLink = topicView.querySelector('[data-fde-return]');

    function syncCourseView() {
      const target = document.getElementById(location.hash.slice(1));
      const inCourse = Boolean(target && course.contains(target));
      const topic = inCourse && target.matches('.fde-milestones article') ? target : null;
      cover.hidden = inCourse;
      course.hidden = !inCourse || Boolean(topic);
      topicView.hidden = !topic;

      if (topic) {
        topicTitle.textContent = topic.querySelector('.fde-step-name').textContent;
        topicLabel.textContent = topic.querySelector('.fde-project-label')?.textContent ??
          'Topic ' + topic.querySelector('.fde-step-number').textContent;
        const copy = topic.querySelector('.fde-step-copy').cloneNode(true);
        copy.hidden = false;
        topicContent.replaceChildren(...copy.childNodes);
      }
      return inCourse ? target : null;
    }

    function navigateCourseView() {
      if (location.hash === '#fde-1-topic-1') {
        const pythonLink = document.querySelector('#fde-1-topic-1 .fde-step-link');
        location.replace(pythonLink.href);
        return;
      }
      const target = syncCourseView();
      returnedCard = undefined;

      if (!topicView.hidden) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        topicTitle.focus({ preventScroll: true });
      } else if (!course.hidden) {
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
    }

    function isPlainClick(event) {
      return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    }

    navigateCourseView();
    addEventListener('hashchange', () => {
      navigateCourseView();
      scheduleUpdate();
    });

    roadmap.addEventListener('click', (event) => {
      const link = event.target.closest('.fde-step-link');
      if (!link?.hash || !isPlainClick(event)) return;
      event.preventDefault();
      history.replaceState({
        ...history.state,
        fdeRoadmapReturn: { id: link.hash.slice(1), y: window.scrollY }
      }, '');
      history.pushState({ fdeTopicFromRoadmap: true }, '', link.hash);
      navigateCourseView();
      scheduleUpdate();
    });

    returnLink.addEventListener('click', (event) => {
      if (!isPlainClick(event) || !history.state?.fdeTopicFromRoadmap) return;
      event.preventDefault();
      history.back();
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
      if (returnedCard && Math.abs(scrollRoot.scrollTop - returnedCard.y) > 2) returnedCard = undefined;
      nextMilestone = returnedCard?.row ?? (atBottom ? milestones.at(-1) :
        milestones.findLast((milestone) => milestone.getBoundingClientRect().top <= marker));
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
    addEventListener('scroll', scheduleUpdate, { passive: true });
    addEventListener('resize', scheduleUpdate);
    addEventListener('pageshow', scheduleUpdate);
    updatePosition();
  }
})();
