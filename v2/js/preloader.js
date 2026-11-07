const Preloader = (() => {
  const { qs, reducedMotion } = Utils;

  const el = qs("#preloader");
  const counter = qs("#preloaderCount");
  const bar = qs("#preloaderBar");

  let value = 0;
  let done = false;
  let finished = false;
  let timer = null;

  function tick() {
    if (done) return;

    const step = Math.max(1, Math.ceil((100 - value) / 10));
    value = Math.min(100, value + step);
    render();

    if (value >= 100) {
      done = true;
      timer = setTimeout(finish, 240);
      return;
    }

    timer = setTimeout(tick, 26 + Math.random() * 44);
  }

  function render() {
    if (counter) counter.textContent = String(value).padStart(3, "0");
    if (bar) bar.style.width = `${value}%`;
  }

  function finish() {
    if (finished) return;
    finished = true;

    clearTimeout(timer);

    if (el) {
      el.classList.add("is-done");
      el.setAttribute("aria-hidden", "true");
      window.setTimeout(() => el.classList.add("is-gone"), 900);
    }

    document.body.classList.remove("is-locked");
    Cursor.show();
    document.dispatchEvent(new CustomEvent("portfolio:ready"));
  }

  function init() {
    if (!el) {
      finish();
      return;
    }

    document.body.classList.add("is-locked");
    render();

    if (reducedMotion.matches) {
      value = 100;
      render();
      done = true;
      timer = setTimeout(finish, 160);
      return;
    }

    tick();

    window.setTimeout(() => {
      if (!done) {
        done = true;
        finish();
      }
    }, 6500);
  }

  return { init, finish };
})();

Utils.onReady(() => {
  Cursor.init();
  Reveal.init();
  Work.init();
  Contact.init();
  Main.init();
  Preloader.init();
});
