const Scroll = (() => {
  const { qs, qsa, clamp, lerp, reducedMotion, isTouch } = Utils;

  const doc = document.documentElement;
  const header = qs('#header');
  const progress = qs('#scrollProgress');
  const timeline = qs('.timeline');
  const timelineFill = qs('#timelineFill');

  let target = window.scrollY;
  let current = window.scrollY;
  let maxScroll = 0;
  let raf = null;
  let driving = false;
  let checkReveals = () => {};
  let updateSpy = () => {};

  const listeners = [];

  function measure() {
    maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
  }

  function tick() {
    const diff = target - current;

    if (Math.abs(diff) < 0.4) {
      current = target;
      window.scrollTo(0, current);
      raf = null;
      driving = false;
      return;
    }

    current += diff * 0.1;
    window.scrollTo(0, current);
    raf = requestAnimationFrame(tick);
  }

  function scrollToY(y) {
    target = clamp(y, 0, maxScroll);

    if (raf === null) {
      current = window.scrollY;
      driving = true;
      raf = requestAnimationFrame(tick);
    }
  }

  function updateChrome() {
    const y = window.scrollY;

    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (progress) progress.style.width = `${maxScroll ? (y / maxScroll) * 100 : 0}%`;

    if (timeline && timelineFill) {
      const rect = timeline.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.7 - rect.top) / Math.max(rect.height, 1), 0, 1);
      timelineFill.style.height = `${p * 100}%`;
    }

    listeners.forEach((fn) => fn(y));

    checkReveals();
    updateSpy();
  }

  function onScroll() {
    if (driving) {
      if (Math.abs(window.scrollY - current) > 6) {
        driving = false;
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        target = window.scrollY;
        current = window.scrollY;
      }
    } else {
      target = window.scrollY;
      current = window.scrollY;
    }

    updateChrome();
  }

  function initSmooth() {
    if (isTouch || reducedMotion.matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      return;
    }

    window.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey) return;
        e.preventDefault();
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
        scrollToY(target + e.deltaY * unit);
      },
      { passive: false }
    );

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initAnchors() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href');
      if (!id || id === '#') {
        e.preventDefault();
        return;
      }

      const target_ = qs(id);
      if (!target_) return;

      e.preventDefault();
      const offset = header ? header.offsetHeight + 24 : 90;
      scrollToY(target_.getBoundingClientRect().top + window.scrollY - offset);
    });
  }

  function initReveals() {
    const items = [];
    let ready = false;

    const reveal = (el) => {
      el.style.setProperty('--reveal-delay', `${parseInt(el.dataset.delay || '0', 10)}ms`);
      el.classList.add('is-in');
    };

    qsa('[data-reveal]').forEach((el) => {
      items.push({ el, apply: reveal, done: false, blocked: el.getBoundingClientRect().top < window.innerHeight });
    });

    qsa('[data-split]').forEach((el) => {
      Utils.splitWords(el);

      const heading = el.closest('h1, h2');
      if (!heading) return;

      qsa('.words', heading).forEach((word, i) => {
        word.style.setProperty('--word-delay', `${i * 55}ms`);
      });

      if (!items.some((item) => item.el === heading)) {
        items.push({
          el: heading,
          apply: (h) => h.classList.add('is-in'),
          done: false,
          blocked: heading.getBoundingClientRect().top < window.innerHeight
        });
      }
    });

    function check() {
      const limit = window.innerHeight * 0.92;
      const ready2 = [];

      items.forEach((item) => {
        if (item.done) return;
        if (item.blocked && !ready) return;
        if (item.el.getBoundingClientRect().top < limit) ready2.push(item);
      });

      ready2.forEach((item) => {
        item.done = true;
        item.apply(item.el);
      });
    }

    let last = 0;

    function throttled() {
      const now = performance.now();
      if (now - last < 70) return;
      last = now;
      check();
    }

    document.addEventListener('portfolio:ready', () => {
      ready = true;
      check();
    });

    setTimeout(() => {
      ready = true;
      check();
    }, 5000);

    return throttled;
  }

  function initNavSpy() {
    const pairs = qsa('.nav__link')
      .map((link) => ({ link, el: qs(link.getAttribute('href')) }))
      .filter((pair) => pair.el);

    if (!pairs.length) return;

    function update() {
      const line = window.scrollY + window.innerHeight * 0.4;
      let active = null;

      pairs.forEach(({ link, el }) => {
        if (el.getBoundingClientRect().top + window.scrollY <= line) active = link;
      });

      pairs.forEach(({ link }) => link.classList.toggle('is-active', link === active));
    }

    return update;
  }

  function initTilt() {
    qsa('[data-tilt]').forEach((el) => {
      const base = (el.dataset.tiltBase || '0,0').split(',').map(Number);
      let tx = 0;
      let ty = 0;
      let cx = 0;
      let cy = 0;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        ty = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        tx = -((e.clientY - rect.top) / rect.height - 0.5) * 14;
      });

      el.addEventListener('mouseleave', () => {
        tx = 0;
        ty = 0;
      });

      const loop = () => {
        cx = lerp(cx, tx, 0.08);
        cy = lerp(cy, ty, 0.08);
        el.style.transform = `perspective(1100px) rotateX(${(base[0] + cy).toFixed(3)}deg) rotateY(${(base[1] + cx).toFixed(3)}deg)`;
        requestAnimationFrame(loop);
      };

      loop();
    });
  }

  function init() {
    measure();
    initSmooth();
    initAnchors();
    checkReveals = initReveals();
    updateSpy = initNavSpy();
    initTilt();

    window.addEventListener('resize', () => {
      measure();
      updateChrome();
    });

    updateChrome();
  }

  return {
    init,
    scrollToY,
    onScroll: (fn) => listeners.push(fn),
    get progress() {
      return current;
    }
  };
})();
