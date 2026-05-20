// fronted/js/registro.js

document.getElementById('formulario-registro').addEventListener('submit', async (e) => {
    // 1. 🛑 Frenamos la recarga automática del formulario HTML
    e.preventDefault();

    // 2. Apuntamos a los elementos de la interfaz
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const contenedorMensaje = document.getElementById('mensaje-registro');

    // Limpiamos estilos de mensajes previos
    contenedorMensaje.textContent = "";
    contenedorMensaje.className = "";

    try {
        // 3. Conectamos con el backend de Node/Express que ya dejamos listo
        const response = await fetch('http://localhost:3000/api/usuarios/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        // 4. Procesamos la respuesta del servidor
        if (response.ok) {
            // Estilo visual de éxito (puedes agregar estilos CSS para .msg-exito en tu login.css)
            contenedorMensaje.style.color = "#4caf50"; 
            contenedorMensaje.textContent = "¡Cuenta creada con éxito! Redirigiendo...";

            // Limpiamos los campos del formulario
            document.getElementById('formulario-registro').reset();

            // Redirigimos automáticamente al Login después de 2 segundos para mejorar la experiencia
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } else {
            // Mostramos el error dinámico enviado desde tu controlador (ej: "El correo ya está registrado")
            contenedorMensaje.style.color = "#f44336";
            contenedorMensaje.textContent = data.message || "Error al intentar registrarse.";
        }

    } catch (error) {
        console.error("Error en la petición fetch:", error);
        contenedorMensaje.style.color = "#f44336";
        contenedorMensaje.textContent = "No se pudo conectar con el servidor backend. Inténtalo más tarde.";
    }
});