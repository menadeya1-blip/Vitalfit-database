/*
 * VitalFit - modo demostración de frontend.
 * No realiza peticiones al servidor. Cuando el backend esté listo,
 * este archivo podrá conectarse al endpoint acordado por el equipo.
 * IMPORTANTE: este modo NO autentica de forma segura; es solo para pruebas.
 */
(() => {
  // Visitar el inicio equivale a cerrar la sesión de demostración.
  try { localStorage.removeItem('vitalfit_demo_session'); } catch (err) { /* sin almacenamiento */ }
  const loginForm = document.getElementById('loginForm');
  const btnlogin = document.getElementById('btnlogin');
  const spinnerTextlogin = document.getElementById('spinnerTextlogin');
  const spinnerLoadingLogin = document.getElementById('spinnerLoadingLogin');
  const mensajeErrorLogin = document.getElementById('mensajeErrorLogin');

  function restaurarBotonLogin() {
    if (btnlogin) btnlogin.disabled = false;
    if (spinnerTextlogin) spinnerTextlogin.textContent = 'Iniciar sesión';
    if (spinnerLoadingLogin) spinnerLoadingLogin.style.display = 'none';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!loginForm.reportValidity()) return;

      if (mensajeErrorLogin) {
        mensajeErrorLogin.textContent = '';
        mensajeErrorLogin.style.display = 'none';
      }
      if (btnlogin) btnlogin.disabled = true;
      if (spinnerTextlogin) spinnerTextlogin.textContent = 'Entrando en modo demo...';
      if (spinnerLoadingLogin) spinnerLoadingLogin.style.display = 'inline-block';

      // Guardamos solo una marca de sesión de demostración en este navegador.
      const email = (new FormData(loginForm).get('email') || '').toString().trim();
      try {
        localStorage.setItem('vitalfit_demo_session', JSON.stringify({ email, demo: true }));
      } catch (err) {
        console.warn('No se pudo guardar la sesión de demostración en este navegador.', err);
      }

      // La página de panel está en la misma carpeta que index.html.
      window.location.href = 'dashboard.html';
    });
  }

  // Al volver al login, limpiar el estado visual del botón.
  window.addEventListener('pageshow', restaurarBotonLogin);
})();
