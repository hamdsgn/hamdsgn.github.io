const Utils = (() => {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isTouch = window.matchMedia('(hover: none)').matches;

  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const toastEl = () => qs('#toast');

  let toastTimer = null;

  function toast(message, duration = 2600) {
    const el = toastEl();
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), duration);
  }

  function splitWords(el) {
    const frag = document.createDocumentFragment();
    const counter = { i: 0 };

    const wrapWord = (text) => {
      const mask = document.createElement('span');
      mask.className = 'word-mask';

      const inner = document.createElement('span');
      inner.className = 'words';
      inner.textContent = text;
      inner.style.setProperty('--word-delay', `${counter.i++ * 65}ms`);

      mask.appendChild(inner);
      return mask;
    };

    // Elementos con degradado (background-clip: text): no se pueden partir en
    // palabras porque el degradado solo se pinta sobre el texto directo del
    // elemento. Se mueven enteros dentro de la máscara.
    const wrapElement = (node) => {
      const mask = document.createElement('span');
      mask.className = 'word-mask';

      const inner = document.createElement('span');
      inner.className = 'words';
      inner.style.setProperty('--word-delay', `${counter.i++ * 65}ms`);

      inner.appendChild(node);
      mask.appendChild(inner);
      return mask;
    };

    const process = (node, target) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (!part.trim()) {
              target.appendChild(document.createTextNode(' '));
              return;
            }
            target.appendChild(wrapWord(part));
          });
          return;
        }

        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.classList && child.classList.contains('grad-text')) {
            target.appendChild(wrapElement(child));
            return;
          }

          const clone = child.cloneNode(false);
          target.appendChild(clone);
          process(child, clone);
        }
      });
    };

    process(el, frag);
    el.textContent = '';
    el.appendChild(frag);
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  return { qs, qsa, clamp, lerp, reducedMotion, isTouch, pointer, toast, splitWords, onReady };
})();
