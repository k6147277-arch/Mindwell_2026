// fronted/js/inicio_calendario.js

const calendar = document.getElementById("calendar-days-grid");
const monthLabel = document.getElementById("current-month-year");
const appointmentContainer = document.getElementById("appointment-list-container");
const psychologistContainer = document.getElementById("psychologist-list");
const searchInput = document.getElementById("search-input");

let currentDate = new Date();

// 1. DATOS DE PRUEBA (Acorde a los estados de tu CSS)
const citasDePrueba = [
    { fecha: "2026-5-15", hora: "09:00 AM", lugar: "Consultorio 201", especialista: "Dr. Eliel Urbina", estado: "agendada" },
    { fecha: "2026-5-15", hora: "02:30 PM", lugar: "En línea (Zoom)", especialista: "Dra. Amelia Rostrán", estado: "propuesta" },
    { fecha: "2026-5-20", hora: "10:00 AM", lugar: "Consultorio 104", especialista: "Lic. Carlos Mendoza", estado: "suspendida" },
    { fecha: "2026-5-22", hora: "04:00 PM", lugar: "En línea", especialista: "Dr. Eliel Urbina", estado: "agendada" }
];

const psicologosDePrueba = [
    { nombre: "Dr. Eliel Urbina", especialidad: "Psicología Clínica / Ansiedad", imagen: "https://via.placeholder.com/70" },
    { nombre: "Dra. Amelia Rostrán", especialidad: "Terapia de Pareja / Familiar", imagen: "https://via.placeholder.com/70" },
    { nombre: "Lic. Carlos Mendoza", especialidad: "Psicología Infantil / TDAH", imagen: "https://via.placeholder.com/70" },
    { nombre: "Dra. Elena Gómez", especialidad: "Neuropsicología / Estrés", imagen: "https://via.placeholder.com/70" }
];

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

    // Pintar días de la semana
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

    // Construcción de los días numéricos
    for (let d = 1; d <= lastDate; d++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = d;
        dayElement.classList.add("day-number");

        const cadenaFecha = `${year}-${month + 1}-${d}`;
        const citasDelDia = citasDePrueba.filter(c => c.fecha === cadenaFecha);

        // Aplicamos tus clases CSS de fondo directas (.green, .red, .yellow)
        if (citasDelDia.length > 0) {
            const estadoPrincipal = citasDelDia[0].estado;
            if (estadoPrincipal === "agendada") dayElement.classList.add("green");
            if (estadoPrincipal === "suspendida") dayElement.classList.add("red");
            if (estadoPrincipal === "propuesta") dayElement.classList.add("yellow");
        }

        // Evento de clic corregido con .classList.add
        dayElement.addEventListener("click", () => {
            document.querySelectorAll(".day-number").forEach(el => el.classList.remove("selected-day"));
            dayElement.classList.add("selected-day"); 
            
            mostrarDetallesCita(citasDelDia);
        });

        calendar.appendChild(dayElement);
    }
}

// 3. MOSTRAR EL DETALLE DE LA CITA (Usa tus bordes de color)
function mostrarDetallesCita(citas) {
    appointmentContainer.innerHTML = "";

    if (citas.length === 0) {
        appointmentContainer.innerHTML = `<p class="empty-message">Selecciona un día en el calendario.</p>`;
        return;
    }

    citas.forEach(cita => {
        const item = document.createElement("div");
        item.classList.add("appointment-item");

        // Usamos tus clases exactas de bordes izquierdos
        if (cita.estado === "agendada") item.classList.add("status-completed");
        if (cita.estado === "propuesta") item.classList.add("status-pending");
        if (cita.estado === "suspendida") item.classList.add("status-canceled");

        // Usamos tus clases de color de texto para resaltar la etiqueta del estado abajo
        let claseColorTexto = "";
        if (cita.estado === "agendada") claseColorTexto = "estado-completada";
        if (cita.estado === "propuesta") claseColorTexto = "estado-pendiente";
        if (cita.estado === "suspendida") claseColorTexto = "estado-cancelada";

        item.innerHTML = `
            <div class="appointment-info">
                <div class="time">⏰ ${cita.hora}</div>
                <div class="doctor">👤 ${cita.especialista}</div>
                <div class="doctor" style="margin-top: 2px;">📍 ${cita.lugar}</div>
                <div class="${claseColorTexto}" style="font-weight: bold; margin-top: 5px;">
                    • ${cita.estado.toUpperCase()}
                </div>
            </div>
        `;
        appointmentContainer.appendChild(item);
    });
}

// 4. FILTRADO DINÁMICO DE PSICÓLOGOS
function renderPsicologos(filtro = "") {
    psychologistContainer.innerHTML = "";

    const filtrados = psicologosDePrueba.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        p.especialidad.toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtrados.length === 0) {
        psychologistContainer.innerHTML = `<p class="empty-message">No se encontraron especialistas.</p>`;
        return;
    }

    filtrados.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("psychologist-card");

        card.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <div class="psychologist-details">
                <h4>${p.nombre}</h4>
                <p>${p.especialidad}</p>
                <button class="chat-btn" style="border: none; cursor: pointer;">Contactar</button>
            </div>
        `;
        psychologistContainer.appendChild(card);
    });
}

// Escuchador del buscador
searchInput.addEventListener("input", (e) => {
    renderPsicologos(e.target.value);
});

// 5. BOTONES NAV
document.getElementById("prev-month-btn").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("next-month-btn").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

// Inicialización
renderCalendar();
renderPsicologos();