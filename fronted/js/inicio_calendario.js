const calendar = document.getElementById("calendar-days-grid");
const monthLabel = document.getElementById("current-month-year");

let currentDate = new Date();

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

    // Nombres de días
    const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    days.forEach(d => {
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

    // Días del mes
    for (let d = 1; d <= lastDate; d++) {
        const day = document.createElement("div");
        day.textContent = d;
        day.classList.add("day-number");

        day.addEventListener("click", () => {
            document.querySelectorAll(".day-number").forEach(el =>
                el.classList.remove("selected-day")
            );
            day.classList.add("selected-day");

            document.getElementById("appointment-list-container").innerHTML =
                `<p>Cita simulada el día ${d}</p>`;
        });

        calendar.appendChild(day);
    }
}

// botones
document.getElementById("prev-month-btn").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("next-month-btn").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

// iniciar
renderCalendar();