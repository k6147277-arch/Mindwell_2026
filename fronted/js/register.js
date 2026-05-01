document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('formulario-registro');
    const mensajeDiv = document.getElementById('mensaje-registro');

    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('reg-nombre').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                mensajeDiv.style.color = "green";
                mensajeDiv.textContent = "¡Cuenta creada con éxito! Redirigiendo...";
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            } else {
                mensajeDiv.style.color = "red";
                mensajeDiv.textContent = data.message || "Error al registrar";
            }
        } catch (error) {
            mensajeDiv.style.color = "orange";
            mensajeDiv.textContent = "Error de conexión con el servidor.";
        }
    });
});