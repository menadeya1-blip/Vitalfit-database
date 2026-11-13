// Inicio de sesión (index.html). Usa VitalfitApi (api.js) y la vista de main.js.
(function () {
  'use strict';

  const SESSION_KEY = 'vitalfit_user_id';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const msg = document.getElementById('loginMensaje');
    const boton = document.getElementById('btnLogin');
    const spinner = document.getElementById('loginSpinner');
    const texto = document.getElementById('loginTexto');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.hidden = true;
      if (!form.reportValidity()) return;

      boton.disabled = true;
      spinner.hidden = false;
      texto.textContent = 'Iniciando...';

      try {
        const usuario = await window.VitalfitApi.login({
          email: document.getElementById('login_email').value.trim(),
          password: document.getElementById('login_password').value
        });
        sessionStorage.setItem(SESSION_KEY, String(usuario.id));

        if (!usuario.fitnessGoal) {
          // Cuenta sin onboarding terminado: completar el paso 2
          window.VitalfitUI.mostrarOnboarding(usuario.id);
        } else {
          window.location.href = 'ejercicio.html';
        }
      } catch (err) {
        if (err.status === 403) {
          window.VitalfitUI.mostrarPendiente();
        } else {
          msg.textContent = err.message;
          msg.hidden = false;
        }
      } finally {
        boton.disabled = false;
        spinner.hidden = true;
        texto.textContent = 'Iniciar sesión';
      }
    });
  });
})();
