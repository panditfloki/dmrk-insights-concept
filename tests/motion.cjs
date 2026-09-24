const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');

const source = ts.transpileModule(fs.readFileSync('components/Motion.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;

function target(top, group) {
  return { top, dataset: { revealGroup: group }, style: {}, getBoundingClientRect() { return { top: this.top }; } };
}

function run({ reduced = false, fail, targets = [target(120, 'hero'), target(900, 'cards'), target(1000, 'cards')] } = {}) {
  const animations = [];
  const errors = [];
  const listeners = new Map();
  const frames = new Map();
  let frameId = 0;
  let cleanup;
  let dependencies;
  let reverted = 0;
  let stuck;
  const context = {
    add(callback) { callback(); },
    revert() {
      reverted++;
      targets.forEach(element => { delete element.style.opacity; delete element.style.transform; });
    }
  };
  const gsap = {
    registerPlugin() { if (fail === 'plugin') throw Error('plugin failed'); },
    context() { return context; },
    set(elements, values) {
      elements.forEach(element => {
        element.style.opacity = String(values.opacity);
        element.style.transform = `translateY(${values.y}px)`;
      });
    },
    to(elements, to) {
      const animation = { elements, to, plays: 0, play() {
        if (fail === 'play') throw Error('play failed');
        this.plays++;
      } };
      animations.push(animation);
      if (fail === 'animation') throw Error('animation failed after hiding');
      return animation;
    }
  };
  const sandbox = {
    exports: {},
    require(name) {
      if (name === 'react') return { useEffect(callback, deps) { dependencies = deps; cleanup = callback(); } };
      if (name === 'next/navigation') return { usePathname: () => '/test-route' };
      if (name === 'gsap') return { gsap };
      if (name === 'gsap/ScrollTrigger') return { ScrollTrigger: { create() { if (fail === 'navbar') throw Error('navbar failed'); } } };
      throw Error(`Unexpected module ${name}`);
    },
    document: {
      body: { scrollHeight: 2400 },
      querySelectorAll: () => targets,
      querySelector: () => ({ setAttribute(name, value) { stuck = value; } })
    },
    window: {
      innerHeight: 800,
      matchMedia: () => ({ matches: reduced }),
      addEventListener: (name, callback) => listeners.set(name, callback),
      removeEventListener: name => listeners.delete(name),
      requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame: id => frames.delete(id)
    },
    console: { error: (...args) => errors.push(args), log() {} }
  };
  vm.runInNewContext(source, sandbox);
  sandbox.exports.default();
  function flushFrames() {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(callback => callback());
  }
  return { targets, animations, errors, cleanup, dependencies, stuck, listeners, frames, flushFrames, reverted: () => reverted };
}

const normal = run();
assert.equal(normal.targets[0].style.opacity, undefined);
assert.equal(normal.animations.length, 1);
assert.equal(normal.animations[0].elements.length, 2);
assert.equal(normal.animations[0].to.paused, true);
assert.equal(normal.animations[0].to.scrollTrigger, undefined);
assert.equal(normal.targets.filter(element => element.top >= 800 && element.style.opacity === '0').length, 2);
assert.equal(normal.targets[1].style.transform, 'translateY(18px)');
assert.equal(normal.animations[0].to.opacity, 1);
assert.equal(normal.animations[0].to.y, 0);
assert.equal(normal.animations[0].to.ease, 'power3.out');
assert.equal(normal.animations[0].to.duration, 0.7);
assert.equal(normal.animations[0].to.stagger, 0.15);
assert.equal(normal.dependencies[0], '/test-route');
normal.flushFrames();
assert.equal(normal.animations[0].plays, 0);
normal.targets[1].top = 705;
normal.listeners.get('scroll')();
normal.flushFrames();
assert.equal(normal.animations[0].plays, 0);
normal.targets[1].top = 704;
normal.listeners.get('scroll')();
normal.flushFrames();
assert.equal(normal.animations[0].plays, 1);
assert.equal(normal.listeners.size, 0);
normal.cleanup();
assert.equal(normal.reverted(), 1);
assert.ok(normal.targets.every(element => element.style.opacity === undefined));
console.log('PASS: viewport content never hidden; below-fold tweens paused until 88% threshold; once-only playback');

const boundary = run({ targets: [target(-100, 'shared'), target(799, 'shared'), target(800, 'shared')] });
assert.equal(boundary.animations[0].elements.length, 1);
assert.equal(boundary.animations[0].elements[0], boundary.targets[2]);
console.log('PASS: restored scroll, viewport boundary and mixed-position groups');

const jump = run();
jump.flushFrames();
jump.targets[1].top = -100;
jump.listeners.get('scroll')();
jump.listeners.get('scroll')();
assert.equal(jump.frames.size, 1);
jump.flushFrames();
assert.equal(jump.animations[0].plays, 1);
const resize = run();
resize.flushFrames();
resize.targets[1].top = 500;
resize.listeners.get('resize')();
resize.flushFrames();
assert.equal(resize.animations[0].plays, 1);
const unmount = run();
unmount.cleanup();
assert.equal(unmount.listeners.size, 0);
assert.equal(unmount.frames.size, 0);
console.log('PASS: fast scroll jumps, resize, frame coalescing and unmount cleanup');

const reduced = run({ reduced: true });
assert.equal(reduced.animations.length, 0);
assert.equal(reduced.stuck, 'true');
assert.ok(reduced.targets.every(element => element.style.opacity === undefined));
console.log('PASS: reduced motion does not hide targets');

for (const fail of ['plugin', 'animation', 'navbar']) {
  const result = run({ fail });
  assert.equal(result.errors.length, 1);
  assert.ok(result.targets.every(element => element.style.opacity === '1' && element.style.transform === 'none'));
  assert.equal(result.reverted(), fail === 'plugin' ? 0 : 1);
}
console.log('PASS: plugin, partially initialized animation and navbar failures restore visibility');

const playbackFailure = run({ fail: 'play' });
playbackFailure.targets[1].top = 500;
playbackFailure.flushFrames();
assert.equal(playbackFailure.errors.length, 1);
assert.ok(playbackFailure.targets.every(element => element.style.opacity === '1'));
assert.equal(playbackFailure.listeners.size, 0);
console.log('PASS: asynchronous playback failure restores visibility and removes listeners');

const css = fs.readFileSync('app/globals.css', 'utf8');
const layout = fs.readFileSync('app/layout.tsx', 'utf8');
assert.match(css, /\[data-reveal\]\s*\{\s*opacity:\s*1\s*;/);
assert.doesNotMatch(css, /\.js\s+\[data-reveal\]/);
assert.doesNotMatch(layout, /classList\.add\(['"]js['"]\)/);
console.log('PASS: stylesheet defaults visible without the animation bundle or JavaScript');
