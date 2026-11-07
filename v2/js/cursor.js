const Cursor = (() => {
  const { qs, lerp, isTouch, pointer, reducedMotion } = Utils;

  let cursor;
  let dot;
  let ring;
  let label;
  let ringX = 0;
  let ringY = 0;
  let scale = 1;
  let targetScale = 1;

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
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseenter', show);

    if (!reducedMotion.matches) requestAnimationFrame(render);
  }

  function onMove(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;

    if (dot) {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }

    if (reducedMotion.matches) {
      ringX = e.clientX;
      ringY = e.clientY;
      apply();
    }
  }

  function onOver(e) {
    if (!cursor) return;

    const target =
      e.target instanceof Element
        ? e.target.closest('a, button, [data-cursor]')
        : null;

    if (!target) {
      cursor.classList.remove('is-hover', 'is-view');
      if (label) label.textContent = '';
      targetScale = 1;
      if (reducedMotion.matches) applyScale();
      return;
    }

    const kind = target.getAttribute('data-cursor');

    if (label) label.textContent = kind === 'view' ? 'Ver' : '';

    if (kind === 'view') {
      cursor.classList.add('is-view');
      cursor.classList.remove('is-hover');
      targetScale = 2.15;
    } else {
      cursor.classList.add('is-hover');
      cursor.classList.remove('is-view');
      targetScale = 1.55;
    }

    if (reducedMotion.matches) applyScale();
  }

  function applyScale() {
    scale = targetScale;
    apply();
  }

  function apply() {
    if (ring) {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
    }
  }

  function render() {
    ringX = lerp(ringX, pointer.x, 0.18);
    ringY = lerp(ringY, pointer.y, 0.18);
    scale = lerp(scale, targetScale, 0.16);
    apply();
    requestAnimationFrame(render);
  }

  function show() {
    if (cursor) cursor.classList.add('is-visible');
  }

  function hideCursor() {
    if (cursor) cursor.classList.remove('is-visible');
  }

  return { init, show };
})();
