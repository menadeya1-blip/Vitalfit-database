// Alternar entre inicio de sesión y registro. Modo frontend sin servidor.
(() => {
  const loginBox = document.getElementById('login-container');
  const registerBox = document.getElementById('register-container');
  const btnShowRegister = document.getElementById('btn-show-register');
  const btnShowLogin = document.getElementById('btn-show-login');
  const registerForm = document.getElementById('registerForm');
  const btnRegistro = document.getElementById('btnRegistro');
  const spinnerText = document.getElementById('spinnerText');
  const spinnerLoading = document.getElementById('spinnerLoading');
  const mensajeExito = document.getElementById('mensajeExito');

  if (btnShowRegister && loginBox && registerBox) {
    btnShowRegister.addEventListener('click', () => {
      loginBox.classList.add('hidden');
      registerBox.classList.remove('hidden');
    });
  }

  if (btnShowLogin && loginBox && registerBox) {
    btnShowLogin.addEventListener('click', () => {
      registerBox.classList.add('hidden');
      loginBox.classList.remove('hidden');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!registerForm.reportValidity()) return;

      if (btnRegistro) btnRegistro.disabled = true;
      if (spinnerText) spinnerText.textContent = 'Guardando prueba...';
      if (spinnerLoading) spinnerLoading.style.display = 'inline-block';
      if (mensajeExito) {
        mensajeExito.textContent = 'Registro de demostración completado en este navegador. No se ha enviado al servidor.';
        mensajeExito.style.display = 'block';
      }

      // Solo para probar la interfaz; no reemplaza el registro real del backend.
      const values = Object.fromEntries(new FormData(registerForm).entries());
      try {
        const users = JSON.parse(localStorage.getItem('vitalfit_demo_users') || '[]');
        const exists = users.some(user => user.email && user.email.toLowerCase() === String(values.email || '').toLowerCase());
        if (exists) {
          if (mensajeExito) {
            mensajeExito.textContent = 'Ese correo ya está guardado en los datos de demostración de este navegador.';
          }
        } else {
          users.push({ ...values, password: undefined, demo: true });
          localStorage.setItem('vitalfit_demo_users', JSON.stringify(users));
        }
      } catch (err) {
        console.warn('No se pudo guardar el registro demo en este navegador.', err);
      }

      if (spinnerLoading) spinnerLoading.style.display = 'none';
      if (spinnerText) spinnerText.textContent = 'Registro de demostración listo';
      window.setTimeout(() => {
        registerForm.reset();
        if (registerBox) registerBox.classList.add('hidden');
        if (loginBox) loginBox.classList.remove('hidden');
        if (btnRegistro) btnRegistro.disabled = false;
        if (spinnerText) spinnerText.textContent = 'Crear mi cuenta';
        if (mensajeExito) mensajeExito.style.display = 'none';
      }, 2200);
    });
  }
})();
