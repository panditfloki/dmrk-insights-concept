(async () => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  const targets = Array.from(document.querySelectorAll('[data-reveal]'));
  const opacity = element => Number(getComputedStyle(element).opacity);
  assert(window.scrollY === 0, 'Start at scroll 0 on a fresh production load');
  assert(!matchMedia('(prefers-reduced-motion: reduce)').matches, 'Normal-motion check requires reduced motion off');
  assert(targets.length > 0, 'No reveal targets found');
  const hero = Array.from(document.querySelectorAll('[data-reveal-group="hero"]'));
  assert(hero.length > 0 && hero.every(element => opacity(element) === 1), 'Hero must be visible before scrolling');
  const below = targets.filter(element => element.getBoundingClientRect().top >= innerHeight);
  assert(below.length > 0, 'Viewport must leave targets below fold');
  assert(below.every(element => opacity(element) === 0), `Below-fold invariant failed: ${below.filter(element => opacity(element) === 0).length}/${below.length} hidden`);
  console.log('PASS initial computed styles', { hero: hero.length, classifiedBelow: below.length, hiddenBelow: below.length });
  let observedIntermediate = false;
  const pending = new Map();
  below.forEach((element, index) => {
    const key = element.dataset.revealGroup ?? `solo:${index}`;
    const group = pending.get(key) ?? [];
    group.push(element);
    pending.set(key, group);
  });
  for (const [name, elements] of pending) {
    const top = elements[0].getBoundingClientRect().top + scrollY - innerHeight * 0.6;
    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    const deadline = performance.now() + 1500 + elements.length * 150;
    while (performance.now() < deadline && !elements.every(element => opacity(element) === 1)) {
      observedIntermediate ||= elements.some(element => opacity(element) > 0 && opacity(element) < 1);
      await wait(20);
    }
    assert(elements.every(element => opacity(element) === 1), `Group ${name} did not finish visible`);
  }
  assert(observedIntermediate, 'No intermediate opacity observed; animation may have been removed');
  console.log('PASS all groups animate to visible', { groups: pending.size, observedIntermediate });
  return { pass: true, targets: targets.length, initiallyHidden: below.length, groups: pending.size };
})()
