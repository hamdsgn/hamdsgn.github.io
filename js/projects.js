const Projects = (() => {
  const { qs, qsa, clamp, pointer } = Utils;

  const filters = qsa('.filter');
  const works = qsa('.work');
  const services = qsa('.service');
  const preview = qs('#svcPreview');

  function initFilters() {
    if (!filters.length) return;

    filters.forEach((btn) => {
      const count = works.filter((w) => w.dataset.category === btn.dataset.filter).length;
      const badge = qs('span', btn);
      if (badge) badge.textContent = btn.dataset.filter === 'all' ? works.length : count;
    });

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.filter;

        filters.forEach((f) => {
          const active = f === btn;
          f.classList.toggle('is-active', active);
          f.setAttribute('aria-selected', String(active));
        });

        works.forEach((work) => {
          const match = value === 'all' || work.dataset.category === value;
          work.classList.add('is-filtering');
        });

        setTimeout(() => {
          works.forEach((work) => {
            const match = value === 'all' || work.dataset.category === value;
            work.classList.toggle('is-hidden', !match);
            work.classList.remove('is-filtering');
          });
        }, 260);
      });
    });
  }

  function initPreview() {
    if (!preview || !services.length) return;

    const items = qsa('.svc-preview__item', preview);
    let visible = false;
    let raf = null;

    function place() {
      const x = clamp(pointer.x + 70, 150, window.innerWidth - 150);
      const y = clamp(pointer.y - 10, 180, window.innerHeight - 180);
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
      if (visible) raf = requestAnimationFrame(place);
    }

    function show(key) {
      items.forEach((item) => item.classList.toggle('is-active', item.dataset.preview === key));

      if (!visible) {
        visible = true;
        preview.classList.add('is-visible');
        raf = requestAnimationFrame(place);
      }
    }

    function hide() {
      visible = false;
      preview.classList.remove('is-visible');
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    services.forEach((service) => {
      service.addEventListener('mouseenter', () => show(service.dataset.media));
      service.addEventListener('mouseleave', hide);
    });
  }

  function init() {
    initFilters();
    initPreview();
  }

  return { init };
})();
