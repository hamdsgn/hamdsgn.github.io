const Contact = (() => {
  const { qs, qsa, toast } = Utils;

  function initCopy() {
    qsa('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const value = btn.dataset.copy;

        try {
          await navigator.clipboard.writeText(value);
          toast(`Email copiado: ${value}`);
        } catch (err) {
          const temp = document.createElement('textarea');
          temp.value = value;
          temp.setAttribute('readonly', '');
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          toast(`Email copiado: ${value}`);
        }
      });
    });
  }

  function initForm() {
    const form = qs('#contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const required = qsa('[required]', form);
      let valid = true;

      required.forEach((input) => {
        const field = input.closest('.field');
        const empty = !input.value.trim();
        const badEmail = input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value);

        if (field) field.classList.toggle('is-invalid', empty || badEmail);
        if (empty || badEmail) valid = false;
      });

      if (!valid) {
        toast('Revisa los campos marcados ✕');
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const subject = `Nuevo proyecto · ${data.type || 'consulta'}`;
      const body = `Nombre: ${data.name}\nEmail: ${data.email}\nTipo: ${data.type}\nPresupuesto: ${data.budget}\n\n${data.message}`;

      window.location.href = `mailto:cala_ham12@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      form.reset();
      toast('Mensaje enviado. Te respondo en menos de 24 h ✦');
    });

    qsa('input, select, textarea', form).forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.closest('.field');
        if (field) field.classList.remove('is-invalid');
      });
    });
  }

  function init() {
    initCopy();
    initForm();
  }

  return { init };
})();
