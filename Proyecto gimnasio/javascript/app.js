const loginForm = document.getElementById('loginForm');
const btnlogin = document.getElementById('btnlogin');
const spinnerTextlogin = document.getElementById('spinnerTextlogin');
const spinnerLoadingLogin = document.getElementById('spinnerLoadingLogin');
const mensajeErrorLogin = document.getElementById('mensajeErrorLogin');

if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (mensajeErrorLogin) mensajeErrorLogin.style.display = 'none';
        if('btnlogin') btnlogin.disabled = true;
        if(spinnerTextlogin) spinnerTextlogin.textContent = 'Iniciando...';
        if(spinnerLoadingLogin)spinnerLoadingLogin.style.display = 'inline-block';

        const formData = new FormData(loginForm);
        const params = new URLSearchParams(formData);

        try {
            const response = await fetch('/vitalfit/login', {
                method: 'POST',
                headers: {
                    'Content-Type':
                    'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: params.toString()
            });

            const data = await response.json();
            if(response.ok && data.success) {
                loginForm.reset();
               //redirigir al dashboard o vista principal tras login existoso
                window.location.href = data.redirectUrl || 'ejercicio.html';
            }
            else{
                //mostrar mesajes si las credenciales fallan cod 401
                alert(data.message || 'Credenciales invalidas.');
                if (mensajeErrorLogin){
                    mensajeErrorLogin.textContent = data.message|| 'Correo o contraseña invalidos.';
                    mensajeErrorLogin.style.display = 'block';
                }else{
                    alert(data.message||'Correo o contraseña invalidos.');
                    loginForm.reset();
                    restaurarBotonLogin();
                }
            }
        }catch(error){
            console.error('Error en el login: ', error);
            alert('Error de conexión con el servidor.');
            restaurarBotonLogin();
        }
    });
}

function restaurarBotonLogin(){
    if(btnlogin) btnlogin.disabled = false;
    if(spinnerTextlogin) spinnerTextlogin.textContent = 'Iniciar sesión';
    if (spinnerLoadingLogin) spinnerLoadingLogin.style.display = 'none';
}