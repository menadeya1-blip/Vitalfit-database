document.addEventListener("DOMContentLoaded", () => {
    const onboardingForm = document.getElementById("onboardingForm");

    if (onboardingForm) {
        onboardingForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // aqui evitamos recarag de la pag

            // 1. Capturar elementos del DOM (Frangelis debe usar este ID en el HTML)
            const fullNameInput = document.getElementById("fullName");
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const weightInput = document.getElementById("weight"); 
            const heightInput = document.getElementById("height"); 
            const goalInput = document.getElementById("goal");     
            const clothingSizeInput = document.getElementById("clothingSize");

            // limpieza de valores
            const fullName = fullNameInput ? fullNameInput.value.trim() : "";
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Conversiones según tipos SQL decimaal e int
            const weightKg = weightInput && weightInput.value ? parseFloat(weightInput.value) : null;
            const heightCm = heightInput && heightInput.value ? parseInt(heightInput.value, 10) : null;
            const fitnessGoal = goalInput && goalInput.value ? goalInput.value : "MAINTAIN";
            const clothingSize = clothingSizeInput ? clothingSizeInput.value.trim() : null;

            // 2. Validaciones antes de enviar
            if (!fullName || !email || !password) {
                alert("Por favor, completa los campos obligatorios: Nombre completo, Correo y Contraseña.");
                return;
            }

            if (weightKg !== null && (isNaN(weightKg) || weightKg <= 0)) {
                alert("El peso ingresado debe ser mayor a 0 kg.");
                return;
            }

            if (heightCm !== null && (isNaN(heightCm) || heightCm <= 0)) {
                alert("La estatura ingresada debe ser mayor a 0 cm.");
                return;
            }

            // 3. Estructura del objeto JSON que se envía al Backend
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                weightKg: weightKg,
                heightCm: heightCm,
                clothingSize: clothingSize,
                fitnessGoal: fitnessGoal,
                darkMode: false
            };

            try {
                // 4. Petición POST al Endpoint de Spring Boot (Deya)
                const response = await fetch("http://localhost:8080/api/users/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    alert("¡Usuario registrado exitosamente en VitalFit!");
                    onboardingForm.reset();
                    // Redirección opcional
                    // window.location.href = "login.html";
                } else {
                    const errorData = await response.json().catch(() => null);
                    const mensajeError = errorData?.message || "No se pudo completar el registro.";
                    alert(`Error: ${mensajeError}`);
                }
            } catch (error) {
                console.error("Error al conectar con la API:", error);
                alert("Error de conexión. Verifica que el servidor Java esté iniciado en el puerto 8080.");
            }
        });
    }
});
