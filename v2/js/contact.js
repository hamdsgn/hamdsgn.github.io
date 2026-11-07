const Contact = (() => {
  const { qs, qsa, toast } = Utils;

  function initCopy() {
    qsa("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const value = btn.dataset.copy;
        if (!value) return;

        try {
          await navigator.clipboard.writeText(value);
        } catch (err) {
          const temp = document.createElement("textarea");
          temp.value = value;
          temp.setAttribute("readonly", "");
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }

        const tag = qs(".contact__copy-tag", btn);
        if (tag) {
          const original = tag.textContent;
          tag.textContent = "copiado";
          setTimeout(() => {
            tag.textContent = original;
          }, 1800);
        }

        toast(`Email copiado: ${value}`);
      });
    });
  }

  function initForm() {
    const form = qs("#contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const required = qsa("[required]", form);
      let valid = true;
      let firstInvalid = null;

      required.forEach((input) => {
        const field = input.closest(".field");
        const value = input.value.trim();
        const empty = !value;
        const badEmail =
          input.type === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        const bad = empty || badEmail;

        if (field) field.classList.toggle("is-invalid", bad);
        if (bad && !firstInvalid) firstInvalid = input;
        if (bad) valid = false;
      });

      if (!valid) {
        toast("Revisa los campos marcados");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const subject = `Nuevo proyecto · ${data.name}`;
      const body = `Nombre: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;

      window.location.href = `mailto:cala_ham12@hotmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      form.reset();
      toast("Abriendo tu correo · Respondo en menos de 24 h");
    });

    qsa("input, textarea", form).forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.closest(".field");
        if (field) field.classList.remove("is-invalid");
      });
    });
  }

  function init() {
    initCopy();
    initForm();
  }

  return { init };
})();
