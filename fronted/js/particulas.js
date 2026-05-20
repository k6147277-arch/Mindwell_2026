/* =========================
   PARTICULAS EMOJIS MINDWELL
========================= */

const background = document.getElementById("emoji-background");

/* EMOJIS */
const emojis = [
    "🧠",
    "💙",
    "😊",
    "🌱",
    "💬",
    "✨",
    "☁️",
    "🫶",
    "😌",
    "🌸"
];

/* CANTIDAD */
const particleCount = 35;

/* CREAR PARTICULAS */
for(let i = 0; i < particleCount; i++){

    createParticle();
}

/* FUNCION */
function createParticle(){

    const particle = document.createElement("div");

    particle.classList.add("emoji-particle");

    /* EMOJI RANDOM */
    particle.innerText =
        emojis[Math.floor(Math.random() * emojis.length)];

    /* POSICION RANDOM */
    particle.style.left =
        Math.random() * 100 + "vw";

    /* TAMAÑO RANDOM */
    const size =
        Math.random() * 25 + 20;

    particle.style.fontSize =
        size + "px";

    /* DURACION RANDOM */
    const duration =
        Math.random() * 15 + 15;

    particle.style.animationDuration =
        duration + "s";

    /* DELAY RANDOM */
    particle.style.animationDelay =
        Math.random() * 10 + "s";

    /* OPACIDAD RANDOM */
    particle.style.opacity =
        Math.random() * 0.2 + 0.08;

    /* CLICK INTERACTIVO */
    particle.addEventListener("click", () => {

        particle.style.transform =
            "scale(1.8) rotate(20deg)";

        particle.style.opacity = "0.8";

        setTimeout(() => {

            particle.style.transform = "";

        }, 400);
    });

    background.appendChild(particle);
}