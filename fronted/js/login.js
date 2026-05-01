document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('formulario-login');
    const mensajeDiv = document.getElementById('mensaje-login');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // 1. Obtener valores de los inputs
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Limpiar mensajes previos
        mensajeDiv.textContent = "";

        try {
            // 2. Hacer la petición al backend (igual que en Postman)
            const response = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Éxito: Guardar datos en el navegador (localStorage)
                localStorage.setItem('usuario_id', data.user.id);
                localStorage.setItem('usuario_nombre', data.user.nombre);

                mensajeDiv.style.color = "green";
                mensajeDiv.textContent = "¡Bienvenido, " + data.user.nombre + "!";

                // Redirigir a la página principal después de 1.5 segundos
                setTimeout(() => {
                    window.location.href = '/fronted/html/index.html'; 
                }, 1500);

            } else {
                // 4. Error (Credenciales incorrectas)
                mensajeDiv.style.color = "red";
                mensajeDiv.textContent = data.message || "Error al iniciar sesión";
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            mensajeDiv.style.color = "orange";
            mensajeDiv.textContent = "No se pudo conectar con el servidor.";
        }
    });
});