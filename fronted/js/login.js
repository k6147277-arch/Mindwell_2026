// fronted/js/login.js

document.getElementById('formulario-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura los datos usando los IDs exactos 
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const contenedorMensaje = document.getElementById('mensaje-login');

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardamos la sesión 
            localStorage.setItem('token', data.token);
            
            contenedorMensaje.style.color = "#4caf50";
            contenedorMensaje.textContent = "¡Bienvenido! Entrando...";

            // Redirección inmediata al menú de inicio que me pediste
            setTimeout(() => {
                window.location.href = "index.html"; 
            }, 1000);
        } else {
            // Muestra el mensaje exacto del backend 
            contenedorMensaje.style.color = "#f44336";
            contenedorMensaje.textContent = data.mensaje; 
        }
    } catch (error) {
        console.error(error);
        contenedorMensaje.style.color = "#f44336";
        contenedorMensaje.textContent = "Error de conexión con el servidor.";
    }
});