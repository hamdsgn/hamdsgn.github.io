const Main = (() => {
  const { qs, qsa, reducedMotion } = Utils;

  function initBurger() {
    const burger = qs("#burger");
    const nav = qs("#nav");
    if (!burger || !nav) return;

    const toggle = (open) => {
      burger.classList.toggle("is-open", open);
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("is-locked", open);
      document.documentElement.classList.toggle("nav-open", open);
    };

    burger.addEventListener("click", () => {
      toggle(!burger.classList.contains("is-open"));
    });

    qsa(".nav__link", nav).forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) toggle(false);
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && nav.classList.contains("is-open")) {
        toggle(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) toggle(false);
    });
  }

  function initYear() {
    const year = String(new Date().getFullYear());
    qsa(".js-year").forEach((el) => {
      el.textContent = year;
    });
  }

  function initMarquee() {
    qsa("[data-marquee]").forEach((track) => {
      const group = track.firstElementChild;
      if (!group) return;

      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  function initCounters() {
    const nums = qsa("[data-count]");
    if (!nums.length) return;

    let started = false;

    const setFinal = (el) => {
      el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`;
    };

    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      if (Number.isNaN(target)) return;

      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const start = () => {
      if (started) return;
      started = true;

      if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        nums.forEach(setFinal);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            run(entry.target);
          });
        },
        { threshold: 0.5 }
      );

      nums.forEach((el) => observer.observe(el));
    };

    document.addEventListener("portfolio:ready", start, { once: true });
    if (!qs("#preloader")) start();
    window.setTimeout(start, 2600);
  }

  function initClock() {
    const clocks = qsa(".js-clock");
    if (!clocks.length) return;

    let formatter = null;

    try {
      formatter = new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Madrid",
      });
    } catch (err) {
      formatter = null;
    }

    const update = () => {
      const now = new Date();
      const text = formatter
        ? formatter.format(now)
        : now.toTimeString().slice(0, 5);

      clocks.forEach((el) => {
        el.textContent = text;
      });
    };

    update();
    window.setInterval(update, 30000);
  }

  function init() {
    initBurger();
    initYear();
    initMarquee();
    initCounters();
    initClock();
  }

  return { init };
})();
