const Work = (() => {
  const { qs, qsa, clamp, lerp } = Utils;

  let filterTimer = null;

  function initFilters() {
    const filters = qsa('.filter');
    const works = qsa('#works .work');
    if (!filters.length || !works.length) return;

    filters.forEach((btn) => {
      const key = btn.dataset.filter;
      const badge = qs('span', btn);
      if (!badge) return;

      badge.textContent =
        key === 'all'
          ? String(works.length)
          : String(works.filter((work) => work.dataset.category === key).length);
    });

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('is-active')) return;

        const value = btn.dataset.filter;

        filters.forEach((filter) => {
          const active = filter === btn;
          filter.classList.toggle('is-active', active);
          filter.setAttribute('aria-pressed', String(active));
        });

        clearTimeout(filterTimer);
        works.forEach((work) => work.classList.add('is-filtering'));

        filterTimer = setTimeout(() => {
          works.forEach((work) => {
            const match = value === 'all' || work.dataset.category === value;
            work.classList.toggle('is-hidden', !match);
            work.classList.remove('is-filtering');
          });
        }, 180);
      });
    });
  }

  function initPreview() {
    const list = qs('#works');
    const preview = qs('#workPreview');
    const image = qs('#workPreviewImg');
    const mono = qs('#workPreviewMono');

    if (!list || !preview || !image || !mono) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = null;
    let visible = false;
    let raf = null;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    function move(e) {
      const rect = preview.getBoundingClientRect();
      const width = rect.width || 240;
      const height = rect.height || 180;
      const gap = 36;

      let nextX = e.clientX + gap;
      if (nextX + width > window.innerWidth - 14) {
        nextX = e.clientX - width - gap;
      }

      tx = clamp(nextX, 14, Math.max(14, window.innerWidth - width - 14));
      ty = clamp(
        e.clientY - height / 2,
        14,
        Math.max(14, window.innerHeight - height - 14)
      );
    }

    function place() {
      x = lerp(x, tx, 0.2);
      y = lerp(y, ty, 0.2);
      preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(place);
    }

    function show(work, event) {
      const src = work.dataset.img || "";
      const monoText = work.dataset.mono || "";

      preview.classList.toggle("has-mono", Boolean(monoText));
      preview.classList.toggle("has-image", Boolean(src));

      if (src) {
        if (image.getAttribute("src") !== src) image.src = src;
        image.alt = "";
      } else {
        image.removeAttribute("src");
        image.alt = "";
      }

      mono.textContent = monoText;
      move(event);

      if (!visible) {
        x = tx;
        y = ty;
        visible = true;
        preview.classList.add("is-visible");
        raf = requestAnimationFrame(place);
      }
    }

    function hide() {
      visible = false;
      current = null;
      preview.classList.remove("is-visible");
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    list.addEventListener(
      "mousemove",
      (e) => {
        if (visible) move(e);
      },
      { passive: true }
    );

    list.addEventListener("mouseover", (e) => {
      const work = e.target.closest(".work");
      if (!work || !list.contains(work) || work === current) return;
      if (work.classList.contains("is-hidden")) return;

      current = work;
      show(work, e);
    });

    list.addEventListener("mouseout", (e) => {
      const work = e.target.closest(".work");
      if (!work || work !== current) return;

      const to = e.relatedTarget;
      if (to instanceof Node && work.contains(to)) return;

      hide();
    });

    list.addEventListener("mouseleave", hide);
  }

  function init() {
    initFilters();
    initPreview();
  }

  return { init };
})();
