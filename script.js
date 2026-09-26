let jugador = {
    nombre: "Alex",

    dinero: 1000,
    ahorros: 0,

    dia: 1,
    hora: 8,
    minutos: 0,

    salud: 100,
    energia: 100,
    hambre: 20,
    felicidad: 80,

    reputacion: 0,

    nivel: 1,
    xp: 0,

    trabajo: "Desempleado",

    casa: "Sin casa",
    vehiculo: "A pie",

    ropa: false,
    telefono: false,

    estudios: 0
};


const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo"
];


function guardarJuego() {

    localStorage.setItem(
        "neonCitySave",
        JSON.stringify(jugador)
    );
}


function cargarJuego() {

    let partida = localStorage.getItem("neonCitySave");

    if (partida) {

        jugador = JSON.parse(partida);

    }
}


function mostrarSeccion(nombre) {

    let secciones = document.querySelectorAll(".seccion");

    secciones.forEach(function(seccion) {
        seccion.classList.remove("activa");
    });

    let seleccionada = document.getElementById(nombre);

    if (seleccionada) {
        seleccionada.classList.add("activa");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function actualizarPantalla() {

    document.getElementById("nombreJugador").textContent =
        jugador.nombre;

    document.getElementById("dinero").textContent =
        Math.floor(jugador.dinero);

    document.getElementById("ahorros").textContent =
        Math.floor(jugador.ahorros);

    document.getElementById("dineroBancoPantalla").textContent =
        Math.floor(jugador.dinero);

    document.getElementById("nivel").textContent =
        jugador.nivel;

    document.getElementById("xp").textContent =
        jugador.xp;

    document.getElementById("salud").textContent =
        jugador.salud;

    document.getElementById("energia").textContent =
        jugador.energia;

    document.getElementById("hambre").textContent =
        jugador.hambre;

    document.getElementById("felicidad").textContent =
        jugador.felicidad;

    document.getElementById("trabajoActual").textContent =
        jugador.trabajo;

    document.getElementById("casaActual").textContent =
        jugador.casa;

    document.getElementById("vehiculoActual").textContent =
        jugador.vehiculo;

    document.getElementById("reputacion").textContent =
        jugador.reputacion;


    let nombreDia =
        diasSemana[(jugador.dia - 1) % 7];

    document.getElementById("fecha").textContent =
        nombreDia + ", día " + jugador.dia;


    let horaTexto =
        String(jugador.hora).padStart(2, "0") +
        ":" +
        String(jugador.minutos).padStart(2, "0");

    document.getElementById("hora").textContent =
        horaTexto;


    document.getElementById("saludBarra").style.width =
        jugador.salud + "%";

    document.getElementById("energiaBarra").style.width =
        jugador.energia + "%";

    document.getElementById("hambreBarra").style.width =
        jugador.hambre + "%";

    document.getElementById("felicidadBarra").style.width =
        jugador.felicidad + "%";

    document.getElementById("xpBarra").style.width =
        jugador.xp + "%";


    document.getElementById("estudioBarra").style.width =
        jugador.estudios + "%";

    document.getElementById("progresoEstudio").textContent =
        jugador.estudios;
}


function registrar(texto) {

    let registro =
        document.getElementById("registro");

    let nuevo = document.createElement("div");

    nuevo.className = "log";

    nuevo.textContent =
        "🕐 " +
        document.getElementById("hora").textContent +
        " — " +
        texto;

    registro.prepend(nuevo);

    if (registro.children.length > 15) {
        registro.removeChild(registro.lastChild);
    }
}


function pasarTiempo(minutos) {

    jugador.minutos += minutos;

    while (jugador.minutos >= 60) {

        jugador.minutos -= 60;
        jugador.hora++;

    }

    while (jugador.hora >= 24) {

        jugador.hora -= 24;

        nuevoDia();
    }

    jugador.hambre += Math.floor(minutos / 30);

    if (jugador.hambre > 100) {
        jugador.hambre = 100;
    }

    guardarJuego();
    actualizarPantalla();
}


function nuevoDia() {

    jugador.dia++;

    jugador.energia = 100;

    jugador.hambre += 10;

    if (jugador.hambre > 100) {
        jugador.hambre = 100;
    }

    jugador.felicidad -= 5;

    if (jugador.felicidad < 0) {
        jugador.felicidad = 0;
    }


    if (jugador.casa !== "Sin casa") {

        jugador.dinero -= 100;

        registrar(
            "Pagaste $100 de gastos de vivienda."
        );
    }


    if (jugador.dinero < 0) {
        jugador.dinero = 0;
    }

    registrar("🌅 Comenzó un nuevo día.");
}


function ganarXP(cantidad) {

    jugador.xp += cantidad;

    if (jugador.xp >= 100) {

        jugador.xp -= 100;

        jugador.nivel++;

        jugador.reputacion += 5;

        registrar(
            "🎉 Subiste al nivel " +
            jugador.nivel +
            "."
        );
    }
}


function trabajar(nombre, salario, energiaNecesaria, reputacionNecesaria) {

    if (jugador.reputacion < reputacionNecesaria) {

        alert(
            "Necesitas " +
            reputacionNecesaria +
            " de reputación."
        );

        return;
    }


    if (jugador.energia < energiaNecesaria) {

        alert(
            "No tienes suficiente energía."
        );

        return;
    }


    if (jugador.hora < 7 || jugador.hora >= 22) {

        alert(
            "Ahora no es horario de trabajo."
        );

        return;
    }


    jugador.trabajo = nombre;

    jugador.dinero += salario;

    jugador.energia -= energiaNecesaria;

    jugador.hambre += 10;

    jugador.reputacion += 2;

    ganarXP(15);

    pasarTiempo(60);

    registrar(
        "💼 Trabajaste como " +
        nombre +
        " y ganaste $" +
        salario +
        "."
    );

    guardarJuego();
    actualizarPantalla();
}


function comer() {

    if (jugador.dinero < 20) {

        alert("No tienes suficiente dinero.");

        return;
    }

    jugador.dinero -= 20;

    jugador.hambre -= 35;

    jugador.energia += 10;

    jugador.felicidad += 5;

    if (jugador.hambre < 0) {
        jugador.hambre = 0;
    }

    if (jugador.energia > 100) {
        jugador.energia = 100;
    }

    if (jugador.felicidad > 100) {
        jugador.felicidad = 100;
    }

    pasarTiempo(20);

    registrar("🍔 Comiste y recuperaste energía.");
}


function descansar() {

    jugador.energia += 20;

    jugador.felicidad += 5;

    pasarTiempo(30);

    if (jugador.energia > 100) {
        jugador.energia = 100;
    }

    if (jugador.felicidad > 100) {
        jugador.felicidad = 100;
    }

    registrar("🛋️ Descansaste durante 30 minutos.");
}


function dormir() {

    jugador.hora = 7;

    jugador.minutos = 0;

    jugador.energia = 100;

    jugador.salud += 15;

    jugador.hambre += 15;

    if (jugador.salud > 100) {
        jugador.salud = 100;
    }

    nuevoDia();

    guardarJuego();

    actualizarPantalla();

    registrar("🛏️ Dormiste y comenzaste un nuevo día.");
}


function comprarComida() {

    if (jugador.dinero < 20) {

        alert("No tienes suficiente dinero.");

        return;
    }

    jugador.dinero -= 20;

    jugador.hambre -= 40;

    jugador.energia += 15;

    if (jugador.hambre < 0) {
        jugador.hambre = 0;
    }

    if (jugador.energia > 100) {
        jugador.energia = 100;
    }

    registrar("🍔 Compraste comida.");

    guardarJuego();
    actualizarPantalla();
}


function comprarRopa() {

    if (jugador.ropa) {

        alert("Ya tienes ropa nueva.");

        return;
    }


    if (jugador.dinero < 120) {

        alert("Necesitas $120.");

        return;
    }

    jugador.dinero -= 120;

    jugador.ropa = true;

    jugador.felicidad += 20;

    jugador.reputacion += 3;

    if (jugador.felicidad > 100) {
        jugador.felicidad = 100;
    }

    registrar("👕 Compraste ropa nueva.");

    guardarJuego();
    actualizarPantalla();
}


function comprarTelefono() {

    if (jugador.telefono) {

        alert("Ya tienes un smartphone.");

        return;
    }


    if (jugador.dinero < 400) {

        alert("Necesitas $400.");

        return;
    }

    jugador.dinero -= 400;

    jugador.telefono = true;

    jugador.reputacion += 10;

    jugador.felicidad += 10;

    registrar("📱 Compraste un smartphone.");

    guardarJuego();
    actualizarPantalla();
}


function comprarAuto() {

    if (jugador.vehiculo !== "A pie") {

        alert("Ya tienes un vehículo.");

        return;
    }


    if (jugador.dinero < 2000) {

        alert("Necesitas $2000.");

        return;
    }

    jugador.dinero -= 2000;

    jugador.vehiculo = "🚗 Auto usado";

    jugador.reputacion += 10;

    jugador.felicidad += 10;

    registrar("🚗 Compraste un auto usado.");

    guardarJuego();
    actualizarPantalla();
}


function comprarDeportivo() {

    if (jugador.vehiculo === "🏎️ Auto deportivo") {

        alert("Ya tienes este vehículo.");

        return;
    }


    if (jugador.dinero < 50000) {

        alert("Necesitas $50.000.");

        return;
    }

    jugador.dinero -= 50000;

    jugador.vehiculo = "🏎️ Auto deportivo";

    jugador.reputacion += 30;

    jugador.felicidad += 30;

    if (jugador.felicidad > 100) {
        jugador.felicidad = 100;
    }

    registrar("🏎️ Compraste un auto deportivo.");

    guardarJuego();
    actualizarPantalla();
}


function comprarCasa() {

    if (jugador.casa !== "Sin casa") {

        alert("Ya tienes una casa.");

        return;
    }


    if (jugador.dinero < 15000) {

        alert("Necesitas $15.000.");

        return;
    }

    jugador.dinero -= 15000;

    jugador.casa = "🏠 Apartamento";

    jugador.felicidad += 25;

    jugador.reputacion += 15;

    if (jugador.felicidad > 100) {
        jugador.felicidad = 100;
    }

    registrar("🏠 Compraste tu propio apartamento.");

    guardarJuego();
    actualizarPantalla();
}


function depositar() {

    if (jugador.dinero < 100) {

        alert("No tienes $100.");

        return;
    }

    jugador.dinero -= 100;

    jugador.ahorros += 100;

    registrar("🏦 Depositaste $100 en el banco.");

    guardarJuego();
    actualizarPantalla();
}


function retirar() {

    if (jugador.ahorros < 100) {

        alert("No tienes $100 en ahorros.");

        return;
    }

    jugador.ahorros -= 100;

    jugador.dinero += 100;

    registrar("🏦 Retiraste $100 del banco.");

    guardarJuego();
    actualizarPantalla();
}


function estudiar() {

    if (jugador.dinero < 50) {

        alert("Necesitas $50.");

        return;
    }

    if (jugador.energia < 15) {

        alert("No tienes suficiente energía.");

        return;
    }

    jugador.dinero -= 50;

    jugador.energia -= 15;

    jugador.estudios += 10;

    jugador.reputacion += 5;

    ganarXP(10);

    if (jugador.estudios > 100) {
        jugador.estudios = 100;
    }

    pasarTiempo(90);

    registrar("🎓 Estudiaste programación.");

    guardarJuego();
    actualizarPantalla();
}


function visitar(lugar) {

    if (lugar === "Parque") {

        jugador.felicidad += 15;

        jugador.energia += 5;

        pasarTiempo(30);

        registrar("🌳 Visitaste el parque.");

    } else if (lugar === "Hospital") {

        jugador.salud += 30;

        pasarTiempo(45);

        if (jugador.salud > 100) {
            jugador.salud = 100;
        }

        registrar("🏥 Fuiste al hospital.");

    } else if (lugar === "Restaurante") {

        comer();

    } else if (lugar === "Universidad") {

        mostrarSeccion("estudios");

    } else if (lugar === "Banco") {

        mostrarSeccion("banco");

    } else if (lugar === "Concesionario") {

        mostrarSeccion("tienda");

    } else if (lugar === "Casa") {

        if (jugador.casa === "Sin casa") {

            alert("Todavía no tienes una casa.");

        } else {

            dormir();

        }

    } else {

        jugador.felicidad += 5;

        pasarTiempo(20);

        registrar(
            "🏙️ Visitaste el centro de Neon City."
        );
    }

    if (jugador.felicidad > 100) {
        jugador.felicidad = 100;
    }

    if (jugador.energia > 100) {
        jugador.energia = 100;
    }

    guardarJuego();
    actualizarPantalla();
}


function reiniciarJuego() {

    let confirmar =
        confirm(
            "¿Seguro que quieres comenzar una nueva partida?"
        );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem("neonCitySave");

    location.reload();
}


/* RELOJ DEL JUEGO */

setInterval(function() {

    jugador.minutos += 1;

    if (jugador.minutos >= 60) {

        jugador.minutos = 0;

        jugador.hora++;
    }

    if (jugador.hora >= 24) {

        jugador.hora = 0;

        nuevoDia();
    }

    actualizarPantalla();

    guardarJuego();

}, 5000);


/* INICIAR */

cargarJuego();

actualizarPantalla();

registrar("🌆 Bienvenido a Neon City.");
