document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar-days-grid");
    const monthText = document.getElementById("current-month-year");

    let currentDate = new Date();

    function renderCalendar(date) {
        calendar.innerHTML = "";

        const year = date.getFullYear();
        const month = date.getMonth();

        // Nombre del mes
        const monthNames = [
            "Enero","Febrero","Marzo","Abril","Mayo","Junio",
            "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
        ];

        monthText.textContent = `${monthNames[month]} ${year}`;

        // Primer día del mes
        const firstDay = new Date(year, month, 1).getDay();

        // Total de días
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Nombres de días
        const dayNames = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"];

        dayNames.forEach(day => {
            const div = document.createElement("div");
            div.classList.add("day-name");
            div.textContent = day;
            calendar.appendChild(div);
        });

        // Espacios vacíos antes del día 1
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            calendar.appendChild(empty);
        }

        // Días del mes
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement("div");
            day.classList.add("day-number");
            day.textContent = i;

            day.addEventListener("click", () => {
                document.querySelectorAll(".day-number").forEach(d => d.classList.remove("selected-day"));
                day.classList.add("selected-day");
            });

            calendar.appendChild(day);
        }
    }

    // Botones
    document.getElementById("prev-month-btn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById("next-month-btn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);
});