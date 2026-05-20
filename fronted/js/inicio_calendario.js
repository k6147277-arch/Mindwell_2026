// fronted/js/inicio_calendario.js

const calendar = document.getElementById("calendar-days-grid");
const monthLabel = document.getElementById("current-month-year");
const appointmentContainer = document.getElementById("appointment-list-container");
const psychologistContainer = document.getElementById("psychologist-list");
const searchInput = document.getElementById("search-input");

let currentDate = new Date();
let citasDelMes = []; // Se llenará con datos reales del Backend

// Obtener el token de autenticación para saber quién está logueado
const token = localStorage.getItem('token');

// 1. CARGAR CITAS DESDE EL BACKEND
async function obtenerCitasServidor() {
    if (!token) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Enero es 0, ocupamos formato 1-12

    try {
        // Le pedimos al backend las citas de este mes y año específicos para el usuario actual
        const response = await fetch(`http://localhost:3000/api/citas?year=${year}&month=${month}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            citasDelMes = await response.json();
            renderCalendar(); // Dibujamos el calendario con los colores reales
        }
    } catch (error) {
        console.error("Error al obtener citas:", error);
    }
}

// 2. RENDERIZAR EL CALENDARIO
function renderCalendar() {
    calendar.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];

    monthLabel.textContent = `${monthNames[month]} ${year}`;

    // Días de la semana
    const daysOfWeek = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    daysOfWeek.forEach(d => {
        const el = document.createElement("div");
        el.textContent = d;
        el.classList.add("day-name");
        calendar.appendChild(el);
    });

    // Espacios vacíos
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    // Días numéricos
    for (let d = 1; d <= lastDate; d++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = d;
        dayElement.classList.add("day-number");

        // Formato ISO estándar YYYY-MM-DD para comparar de forma precisa con el backend
        const mesFormateado = String(month + 1).padStart(2, '0');
        const diaFormateado = String(d).padStart(2, '0');
        const fechaString = `${year}-${mesFormateado}-${diaFormateado}`;

        // Filtrar si el día del bucle coincide con la fecha de alguna cita en la BD
        const citasDelDia = citasDelMes.filter(c => {
            // Cortamos la fecha por si viene con formato Timestamp completo de la BD (YYYY-MM-DD)
            const fechaCitaCorta = c.fecha.split('T')[0]; 
            return fechaCitaCorta === fechaString;
        });

        // Pintamos el día de acuerdo al estado de la cita real
        if (citasDelDia.length > 0) {
            const estado = citasDelDia[0].estado.toLowerCase();
            if (estado === "agendada") dayElement.classList.add("green");
            if (estado === "suspendida") dayElement.classList.add("red");
            if (estado === "propuesta") dayElement.classList.add("yellow");
        }

        // Click para ver el desglose en la columna central
        dayElement.addEventListener("click", () => {
            document.querySelectorAll(".day-number").forEach(el => el.classList.remove("selected-day"));
            dayElement.classList.add("selected-day");
            mostrarDetallesCita(citasDelDia);
        });

        calendar.appendChild(dayElement);
    }
}

// 3. MOSTRAR DETALLES EN LA COLUMNA CENTRAL
function mostrarDetallesCita(citas) {
    appointmentContainer.innerHTML = "";

    if (citas.length === 0) {
        appointmentContainer.innerHTML = `<p class="empty-message">Selecciona un día en el calendario.</p>`;
        return;
    }

    citas.forEach(cita => {
        const item = document.createElement("div");
        item.classList.add("appointment-item");

        if (cita.estado === "agendada") item.classList.add("status-completed");
        if (cita.estado === "propuesta") item.classList.add("status-pending");
        if (cita.estado === "suspendida") item.classList.add("status-canceled");

        let claseColorTexto = "";
        if (cita.estado === "agendada") claseColorTexto = "estado-completada";
        if (cita.estado === "propuesta") claseColorTexto = "estado-pendiente";
        if (cita.estado === "suspendida") claseColorTexto = "estado-cancelada";

        item.innerHTML = `
            <div class="appointment-info">
                <div class="time">⏰ ${cita.hora}</div>
                <div class="doctor">👤 ${cita.psicologo.nombre}</div>
                <div class="doctor" style="margin-top: 2px;">📍 ${cita.lugar}</div>
                <div class="${claseColorTexto}" style="font-weight: bold; margin-top: 5px;">
                    • ${cita.estado.toUpperCase()}
                </div>
            </div>
        `;
        appointmentContainer.appendChild(item);
    });
}

// 4. CARGAR Y FILTRAR PSICÓLOGOS DESDE EL BACKEND EN TIEMPO REAL
async function buscarPsicologosBackend(busqueda = "") {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/psicologos?search=${busqueda}`);
        if (!response.ok) throw new Error("Error al traer psicólogos");

        const psicologos = await response.json();
        psychologistContainer.innerHTML = "";

        if (psicologos.length === 0) {
            psychologistContainer.innerHTML = `<p class="empty-message">No se encontraron especialistas.</p>`;
            return;
        }

        psicologos.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("psychologist-card");

            card.innerHTML = `
                <img src="${p.foto || 'https://via.placeholder.com/70'}" alt="${p.nombre}">
                <div class="psychologist-details">
                    <h4>${p.nombre}</h4>
                    <p>${p.especialidad || 'Psicólogo General'}</p>
                    <button class="chat-btn" style="border: none; cursor: pointer;">Contactar</button>
                </div>
            `;
            psychologistContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        psychologistContainer.innerHTML = `<p class="empty-message">Error al conectar con el servidor.</p>`;
    }
}

// Escuchador del buscador (Llama directamente al backend con retraso controlado)
let temporizadorBusqueda;
searchInput.addEventListener("input", (e) => {
    clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = setTimeout(() => {
        buscarPsicologosBackend(e.target.value);
    }, 300); // Espera 300ms a que el usuario termine de teclear antes de ir al servidor
});

// 5. CONTROLES DEL MES
document.getElementById("prev-month-btn").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    obtenerCitasServidor();
};

document.getElementById("next-month-btn").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    obtenerCitasServidor();
};

// Carga Inicial al entrar a la página
obtenerCitasServidor();
buscarPsicologosBackend();