//Script para alternar entre Login y Registro
 
    const loginBox = document.getElementById('login-container');
    const registerBox = document.getElementById('register-container');
    const btnShowRegister = document.getElementById('btn-show-register');
    const btnShowLogin = document.getElementById('btn-show-login');

    btnShowRegister.addEventListener('click', () => {
      loginBox.classList.add('hidden');
      registerBox.classList.remove('hidden')
    });

    btnShowLogin.addEventListener('click', () => {
      registerBox.classList.add('hidden');
      loginBox.classList.remove('hidden')
    });

//Se realiza un FETCH para hacer una peticion al backend

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  

  //captura de los elementos de spinner y mensajes
      const btnRegistro = document.getElementById('btnRegistro');
      const spinnerText = document.getElementById('spinnerText');
      const spinnerLoading = document.getElementById('spinnerLoading');
      const mensajeExito = document.getElementById('mensajeExito');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita que la página se recargue automáticamente

      //mostrar spinner y desactivar boton antes de enviar peticion
      if(btnRegistro) btnRegistro.disabled = true;
      if(spinnerText) spinnerText.textContent = 'Procesando...';
      if(spinnerLoading) spinnerLoading.style.display = 'inline-block';
      if(mensajeExito) mensajeExito.style.display = 'none';

      // Capturar los datos del formulario
      const formData = new FormData(registerForm);
      const params = new URLSearchParams(formData);

      try {
        // Enviar la petición POST al Servlet en la ruta '/register'
        const response = await fetch('register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: params.toString()
        });

        //Apagar el spinner cuando el servidor ya respondio
        if(spinnerLoading) spinnerLoading.style.display = 'none';
  
        if (response.ok) {
          //si responde cod 200 ok
          if(mensajeExito) mensajeExito.style.display = 'block';
          if(spinnerText) spinnerText.textContent = '¡Registro exitoso!'
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 4000);
        } else if (response.status === 409) {
            //1. obtener y mostrar el msj del backend
            const errorMSj = await response.text();
            alert(errorMSj || 'El correo electrónico ya esta regsitrado.');
            //2. apagar el spinner y activar el btn
            if(spinnerLoading) spinnerLoading.style.display = 'none';
            if(btnRegistro) btnRegistro.disabled = false;
            if(spinnerText) spinnerText.textContent = "Resgistrarme e Iniciar onboarding";

            //3. Limpiar los campos del formulario
            registerForm.reset();
            loginForm.reset();
        } else {
          alert('Error al registrar el usuario. Revisa los datos.');
          //reactivar el boton para poder corregir
          if(btnRegistro) btnRegistro.disabled = false;
          if(spinnerText) spinnerText.textContent = 'Registrarme e Iniciar onboarding';
        }
      } catch (error) {
        console.error('Error de red o conexión con el servidor:', error);
        alert('No se pudo conectar con el servidor.');

        //en caso de fallo de conexion, restaurar boton
        if(spinnerLoading) spinnerLoading.style.display = 'none';
        if(btnRegistro) btnRegistro.disabled = 'false';
        if(spinnerText) spinnerText.textContent = 'Registrarme e Iniciar onboarding';
      }
    });
  }
});