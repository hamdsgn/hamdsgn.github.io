const Utils = (() => {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isTouch = window.matchMedia('(hover: none)').matches;

  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  let toastTimer = null;

  function toast(message, duration = 2600) {
    const el = qs('#toast');
    if (!el) return;

    el.textContent = message;
    el.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), duration);
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  return { qs, qsa, clamp, lerp, reducedMotion, isTouch, pointer, toast, onReady };
})();
