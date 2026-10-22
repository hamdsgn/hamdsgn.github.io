const Main = (() => {
  const { qs, qsa } = Utils;

  function initBurger() {
    const burger = qs('#burger');
    const nav = qs('#nav');
    if (!burger || !nav) return;

    const toggle = (open) => {
      burger.classList.toggle('is-open', open);
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('is-locked', open);
    };

    burger.addEventListener('click', () => {
      toggle(!burger.classList.contains('is-open'));
    });

    qsa('.nav__link', nav).forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) toggle(false);
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760 && nav.classList.contains('is-open')) toggle(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle(false);
    });
  }

  function initYear() {
    const year = qs('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function initMarquee() {
    qsa('[data-marquee]').forEach((track) => {
      const group = track.firstElementChild;
      if (!group) return;
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  function initCounters() {
    const nums = qsa('[data-count]');
    if (!nums.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';

      if (reduced) {
        el.textContent = `${target}${suffix}`;
        return;
      }

      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    nums.forEach((el) => {
      let done = false;

      const check = () => {
        if (done) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          done = true;
          run(el);
        }
      };

      Scroll.onScroll(check);
      check();
    });
  }

  function init() {
    initBurger();
    initYear();
    initMarquee();
    initCounters();
  }

  return { init };
})();

Utils.onReady(() => {
  Cursor.init();
  Scroll.init();
  Projects.init();
  Contact.init();
  Main.init();
  Preloader.init();
});
