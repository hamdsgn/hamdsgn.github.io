const Reveal = (() => {
  const { qs, qsa, reducedMotion } = Utils;

  let started = false;

  function init() {
    initHeader();
    initSpy();

    const start = () => {
      if (started) return;
      started = true;
      document.documentElement.classList.add('is-ready');
      initReveals();
    };

    document.addEventListener('portfolio:ready', start, { once: true });

    if (!qs('#preloader')) start();
    window.setTimeout(start, 2600);
  }

  function initHeader() {
    const header = qs('#header');
    if (!header) return;

    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initReveals() {
    const els = qsa('[data-reveal], .line');
    if (!els.length) return;

    els.forEach((el) => {
      if (el.hasAttribute('data-reveal') && el.dataset.delay) {
        el.style.setProperty('--reveal-delay', `${el.dataset.delay}ms`);
      }
    });

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-inview'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));
  }

  function initSpy() {
    const links = qsa('.nav__link');
    if (!links.length) return;

    const items = links
      .map((link) => {
        const href = link.getAttribute('href');
        const section = href && href.startsWith('#') ? qs(href) : null;
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!items.length) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const probe = window.innerHeight * 0.35;
      let active = null;

      // Conserva la última sección pasada para que el footer no deje el nav sin estado.
      items.forEach((item) => {
        const rect = item.section.getBoundingClientRect();
        if (rect.top <= probe) active = item.link;
      });

      links.forEach((link) => {
        const on = link === active;
        link.classList.toggle('is-active', on);
        if (on) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  return { init, initSpy };
})();

/* El spy necesita el DOM listo; se llama desde el arranque global. */
