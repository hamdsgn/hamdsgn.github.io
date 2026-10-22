const Cursor = (() => {
  const { qs, lerp, isTouch, pointer, reducedMotion } = Utils;

  let cursor;
  let dot;
  let ring;
  let label;
  let ringX;
  let ringY;
  let scale = 1;

  function init() {
    if (isTouch) return;

    cursor = qs('#cursor');
    if (!cursor) return;

    dot = qs('.cursor__dot', cursor);
    ring = qs('.cursor__ring', cursor);
    label = qs('.cursor__label', cursor);

    ringX = pointer.x;
    ringY = pointer.y;

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));

    if (!reducedMotion.matches) requestAnimationFrame(render);
  }

  function onMove(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (dot) dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }

  function onOver(e) {
    const target = e.target.closest('a, button, [data-cursor]');
    if (!cursor) return;

    if (!target) {
      cursor.classList.remove('is-hover', 'is-view');
      label.textContent = '';
      return;
    }

    const kind = target.getAttribute('data-cursor');
    label.textContent = kind === 'view' ? 'Ver' : '';

    if (kind === 'view') {
      cursor.classList.add('is-view');
      cursor.classList.remove('is-hover');
    } else {
      cursor.classList.add('is-hover');
      cursor.classList.remove('is-view');
    }
  }

  function render() {
    ringX = lerp(ringX, pointer.x, 0.16);
    ringY = lerp(ringY, pointer.y, 0.16);
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
    requestAnimationFrame(render);
  }

  function show() {
    if (cursor) cursor.classList.add('is-visible');
  }

  return { init, show };
})();
