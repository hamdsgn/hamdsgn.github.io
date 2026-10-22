const Preloader = (() => {
  const { qs } = Utils;

  const el = qs('#preloader');
  const counter = qs('#preloaderCount');
  const bar = qs('#preloaderBar');

  let value = 0;
  let done = false;

  function tick() {
    if (done) return;

    const remaining = 100 - value;
    const step = Math.max(1, Math.ceil(remaining / 9));

    value = Math.min(100, value + step);
    render();

    if (value >= 100) {
      done = true;
      setTimeout(finish, 260);
      return;
    }

    setTimeout(tick, 22 + Math.random() * 42);
  }

  function render() {
    if (counter) counter.textContent = String(value).padStart(3, '0');
    if (bar) bar.style.width = `${value}%`;
  }

  function finish() {
    if (!el) return;
    el.classList.add('is-done');
    document.body.classList.remove('is-locked');
    Cursor.show();
    document.dispatchEvent(new CustomEvent('portfolio:ready'));
  }

  function init() {
    if (!el) {
      document.dispatchEvent(new CustomEvent('portfolio:ready'));
      return;
    }

    document.body.classList.add('is-locked');
    render();
    tick();
  }

  return { init, finish };
})();
