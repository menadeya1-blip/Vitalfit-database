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
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!loginForm.reportValidity()) return;

      const mostrarError = (texto) => {
        if (!mensajeErrorLogin) return;
        mensajeErrorLogin.textContent = texto;
        mensajeErrorLogin.style.display = 'block';
      };

      if (mensajeErrorLogin) {
        mensajeErrorLogin.textContent = '';
        mensajeErrorLogin.style.display = 'none';
      }
      if (btnlogin) btnlogin.disabled = true;
      if (spinnerTextlogin) spinnerTextlogin.textContent = 'Entrando...';
      if (spinnerLoadingLogin) spinnerLoadingLogin.style.display = 'inline-block';

      // Convierte los campos del formulario al formato que espera LoginRequest
      const form = new FormData(loginForm);
      const datos = {
        email: (form.get('email') || '').toString().trim(),
        password: form.get('password')
      };

      try {
        const usuario = await window.VitalfitApi.login(datos);
        // Guardamos el id del usuario para usarlo en las siguientes pantallas
        sessionStorage.setItem('vitalfit_user_id', usuario.id);
        window.location.href = 'dashboard.html';
      } catch (err) {
        // 401: credenciales incorrectas. 403: la cuenta aún requiere consentimiento parental.
        mostrarError(err.message);
        restaurarBotonLogin();
      }
    });
  }

  // Al volver al login, limpiar el estado visual del botón.
  window.addEventListener('pageshow', restaurarBotonLogin);
})();
