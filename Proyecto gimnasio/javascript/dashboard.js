(() => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const dateLabel = document.getElementById('welcomeDate');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      toggle.textContent = isOpen ? '✕' : '☰';
    });
  }

  if (dateLabel) {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long'
    }).format(now);
    dateLabel.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Indicadores calculados con los datos guardados en este navegador.
  if (window.VF) {
    const set = (id, n) => { const el = document.getElementById(id); if (el) el.textContent = n; };
    set('statAsistencias', VF.leer('vf_asistencia_demo').length);
    set('statRutinas', VF.leer('vf_rutinas_demo').length);
    set('statFavoritos', VF.favoritos().length);
  }
})();
