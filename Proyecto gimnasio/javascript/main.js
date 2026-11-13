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
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!registerForm.reportValidity()) return;

      const mostrarMensaje = (texto) => {
        if (!mensajeExito) return;
        mensajeExito.textContent = texto;
        mensajeExito.style.display = 'block';
      };

      if (btnRegistro) btnRegistro.disabled = true;
      if (spinnerText) spinnerText.textContent = 'Creando tu cuenta...';
      if (spinnerLoading) spinnerLoading.style.display = 'inline-block';

      // Convierte los campos del formulario al formato que espera RegisterRequest
      const form = new FormData(registerForm);
      const datos = {
        fullName: `${form.get('firstName')} ${form.get('lastName')}`.trim(),
        email: form.get('email'),
        password: form.get('password'),
        birthDate: form.get('birthDate'),
        acceptedTerms: form.get('acceptedTerms') === 'on',
        acceptedPrivacy: form.get('acceptedPrivacy') === 'on'
      };

      try {
        await window.VitalfitApi.register(datos);
        mostrarMensaje('Cuenta creada. Ya puedes iniciar sesión.');
        registerForm.reset();
        window.setTimeout(() => {
          if (registerBox) registerBox.classList.add('hidden');
          if (loginBox) loginBox.classList.remove('hidden');
          if (mensajeExito) mensajeExito.style.display = 'none';
        }, 2000);
      } catch (err) {
        // Muestra el mensaje del backend, por ejemplo "correo repetido" (409) o un error de validación (400)
        mostrarMensaje(err.message);
      } finally {
        if (spinnerLoading) spinnerLoading.style.display = 'none';
        if (spinnerText) spinnerText.textContent = 'Crear mi cuenta';
        if (btnRegistro) btnRegistro.disabled = false;
      }
    });
  }
})();
