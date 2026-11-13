
"use strict";

// ============================================
// 1. MENU DINAMICO
// ============================================

const enlacesMenu = document.querySelectorAll("#menu a");

const secciones = document.querySelectorAll(
    "main section[id]"
);

// Detectar cuando se presiona un enlace
enlacesMenu.forEach(enlace => {

    enlace.addEventListener("click", function() {

        enlacesMenu.forEach(item => {
            item.classList.remove("activo");
        });

        this.classList.add("activo");

    });

});

// Detectar la sección visible
const observador = new IntersectionObserver(entradas => {

    entradas.forEach(entrada => {

        if (entrada.isIntersecting) {

            enlacesMenu.forEach(enlace => {
                enlace.classList.remove("activo");
            });

            const activo = document.querySelector(
                `#menu a[href="#${entrada.target.id}"]`
            );

            if (activo) {
                activo.classList.add("activo");
            }

        }

    });

}, {
    rootMargin: "-20% 0px -70% 0px"
});

secciones.forEach(seccion => {
    observador.observe(seccion);
});


// ============================================
// 2. BUSCADOR DE CONCEPTOS
// ============================================

const buscarConcepto = document.querySelector(
    "#buscarConcepto"
);

const btnBuscar = document.querySelector(
    "#btnBuscar"
);

const resultadoBusqueda = document.querySelector(
    "#resultadoBusqueda"
);

function buscar() {

    const texto = buscarConcepto.value
        .trim()
        .toLowerCase();

    if (texto === "") {

        resultadoBusqueda.textContent =
            "Escribe un concepto para buscar.";

        return;
    }

    const elementos = document.querySelectorAll(
        "main h2, main h3, main h4, main p, main li, main td, main summary"
    );

    const encontrado = Array.from(elementos).find(
        elemento => {

            return elemento.textContent
                .toLowerCase()
                .includes(texto);

        }
    );

    if (encontrado) {

        resultadoBusqueda.textContent =
            "Concepto encontrado: " + encontrado.textContent.trim();

        encontrado.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // Abrir el apartado desplegable si es necesario
        const detalle = encontrado.closest("details");

        if (detalle) {
            detalle.open = true;
        }

    } else {

        resultadoBusqueda.textContent =
            "No se encontró el concepto.";

    }

}

btnBuscar.addEventListener("click", buscar);

buscarConcepto.addEventListener("keydown", evento => {

    if (evento.key === "Enter") {
        buscar();
    }

});


// ============================================
// 3. CONTENIDO DESPLEGABLE
// ============================================

// Permite que solo un desplegable del mismo grupo
// permanezca abierto a la vez.

const desplegables = document.querySelectorAll(
    ".seccion details"
);

desplegables.forEach(actual => {

    actual.addEventListener("toggle", function() {

        if (this.open) {

            const grupo = this.parentElement;

            grupo.querySelectorAll(":scope > details").forEach(
                otro => {

                    if (otro !== this) {
                        otro.open = false;
                    }

                }
            );

        }

    });

});




// ============================================
// 5. CONVERSIONES GMS A GRADOS DECIMALES
// ============================================

function dmsADec() {

    const g = Number(document.querySelector("#g").value);
    const m = Number(document.querySelector("#m").value);
    const s = Number(document.querySelector("#s").value);

    const resultado = document.querySelector("#resDMS");

    if (
        !document.querySelector("#g").value.trim() ||
        !document.querySelector("#m").value.trim() ||
        !document.querySelector("#s").value.trim()
    ) {

        resultado.textContent =
            "Completa todos los campos.";

        return;
    }

    if (
        !Number.isFinite(g) ||
        !Number.isFinite(m) ||
        !Number.isFinite(s) ||
        g < 0 || g > 360 ||
        m < 0 || m >= 60 ||
        s < 0 || s >= 60 ||
        (g === 360 && (m !== 0 || s !== 0))
    ) {

        resultado.textContent =
            "Verifica los grados, minutos y segundos.";

        return;
    }

    const decimal = g + m / 60 + s / 3600;

    resultado.textContent =
        `${g}° ${m}' ${s}" = ${decimal.toFixed(8)}°`;
}


// ============================================
// 6. GRADOS DECIMALES A RADIANES
// ============================================

function decARad() {

    const gradosInput = document.querySelector("#des2");
    const resultado = document.querySelector("#resRad");

    if (gradosInput.value.trim() === "") {

        resultado.textContent =
            "Introduce los grados decimales.";

        return;
    }

    const grados = Number(gradosInput.value);

    if (!Number.isFinite(grados)) {

        resultado.textContent =
            "Introduce un número válido.";

        return;
    }

    const radianes = grados * Math.PI / 180;

    resultado.textContent =
        `${grados}° × π / 180 = ${radianes.toFixed(8)} rad`;
}


// ============================================
// 7. RADIANES A GRADOS Y GMS
// ============================================

function radAGrados() {

    const radInput = document.querySelector("#rad2");
    const resultado = document.querySelector("#resGrados");

    if (radInput.value.trim() === "") {

        resultado.textContent =
            "Introduce los radianes.";

        return;
    }

    const radianes = Number(radInput.value);

    if (!Number.isFinite(radianes)) {

        resultado.textContent =
            "Introduce un número válido.";

        return;
    }

    const grados = radianes * 180 / Math.PI;

    // Obtener signo y valor absoluto
    const signo = grados < 0 ? "-" : "";
    const absoluto = Math.abs(grados);

    const g = Math.floor(absoluto);

    const minutosCompletos = (absoluto - g) * 60;

    const m = Math.floor(minutosCompletos);

    const s = (minutosCompletos - m) * 60;

    resultado.textContent =
        `Grados decimales: ${grados.toFixed(8)}°
         | GMS: ${signo}${g}° ${m}' ${s.toFixed(4)}"`;
}


// ============================================
// 8. RECTANGULARES A POLARES
// ============================================

function rectAPolar() {

    const xInput = document.querySelector("#x");
    const yInput = document.querySelector("#y");

    const resultado = document.querySelector("#resPolar");

    if (
        xInput.value.trim() === "" ||
        yInput.value.trim() === ""
    ) {

        resultado.textContent =
            "Completa las coordenadas X y Y.";

        return;
    }

    const x = Number(xInput.value);
    const y = Number(yInput.value);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {

        resultado.textContent =
            "Introduce coordenadas válidas.";

        return;
    }

    if (x === 0 && y === 0) {

        resultado.textContent =
            "El origen tiene radio 0; su ángulo no está definido.";

        return;
    }

    const r = Math.sqrt(x * x + y * y);

    let theta = Math.atan2(y, x) * 180 / Math.PI;

    if (theta < 0) {
        theta += 360;
    }

    resultado.textContent =
        `Radio: ${r.toFixed(6)}
         | Ángulo: ${theta.toFixed(6)}°`;
}


// ============================================
// 9. POLARES A RECTANGULARES
// ============================================

function polarARect() {

    const rInput = document.querySelector("#r2");
    const thetaInput = document.querySelector("#theta2");

    const resultado = document.querySelector("#resRect");

    if (
        rInput.value.trim() === "" ||
        thetaInput.value.trim() === ""
    ) {

        resultado.textContent =
            "Completa el radio y el ángulo.";

        return;
    }

    const r = Number(rInput.value);
    const theta = Number(thetaInput.value);

    if (
        !Number.isFinite(r) ||
        !Number.isFinite(theta) ||
        r < 0
    ) {

        resultado.textContent =
            "Introduce valores válidos. El radio no puede ser negativo.";

        return;
    }

    const radianes = theta * Math.PI / 180;

    const x = r * Math.cos(radianes);
    const y = r * Math.sin(radianes);

    resultado.textContent =
        `X = ${x.toFixed(6)}
         | Y = ${y.toFixed(6)}`;
}



/* ==========================================
   PLANO CARTESIANO INTERACTIVO
========================================== */

// Obtener elementos HTML

const canvas = document.getElementById("planoCanvas");
const ctx = canvas.getContext("2d");

const plano = document.getElementById("planoInteractivo");

const inputX = document.getElementById("coordenadaX");
const inputY = document.getElementById("coordenadaY");

const resultado = document.getElementById("resultadoCoordenadas");
const nivelZoom = document.getElementById("nivelZoom");

const btnGraficar = document.getElementById("btnGraficar");
const btnAcercar = document.getElementById("btnAcercar");
const btnAlejar = document.getElementById("btnAlejar");
const btnRestablecer = document.getElementById("btnRestablecer");
const btnPantallaCompleta =
    document.getElementById("btnPantallaCompleta");


// ==========================================
// VARIABLES DEL PLANO
// ==========================================

let escala = 30;

let desplazamientoX = 0;
let desplazamientoY = 0;

let puntoX = 2;
let puntoY = 3;

let arrastrando = false;

let inicioX = 0;
let inicioY = 0;

let movimientoRealizado = false;


// ==========================================
// AJUSTAR TAMAÑO DEL CANVAS
// ==========================================

function ajustarCanvas() {

    const rect = canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dibujarPlano();
}


// ==========================================
// DIBUJAR PLANO CARTESIANO
// ==========================================

function dibujarPlano() {

    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;

    if (!ancho || !alto) return;

    ctx.clearRect(0, 0, ancho, alto);

    // Posición del origen

    const origenX = ancho / 2 + desplazamientoX;
    const origenY = alto / 2 + desplazamientoY;

    // Calcular límites visibles

    const izquierda = Math.floor(
        (0 - origenX) / escala
    );

    const derecha = Math.ceil(
        (ancho - origenX) / escala
    );

    const arriba = Math.floor(
        (origenY - alto) / escala
    );

    const abajo = Math.ceil(
        origenY / escala
    );


    // ======================================
    // CUADRÍCULA
    // ======================================

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e2e8f0";

    ctx.beginPath();

    for (let x = izquierda; x <= derecha; x++) {

        const posicion = origenX + x * escala;

        ctx.moveTo(posicion, 0);
        ctx.lineTo(posicion, alto);

    }

    for (let y = arriba; y <= abajo; y++) {

        const posicion = origenY - y * escala;

        ctx.moveTo(0, posicion);
        ctx.lineTo(ancho, posicion);

    }

    ctx.stroke();


    // ======================================
    // EJES X E Y
    // ======================================

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;

    ctx.beginPath();

    // Eje X

    ctx.moveTo(0, origenY);
    ctx.lineTo(ancho, origenY);

    // Eje Y

    ctx.moveTo(origenX, 0);
    ctx.lineTo(origenX, alto);

    ctx.stroke();


    // ======================================
    // FLECHAS DE LOS EJES
    // ======================================

    ctx.fillStyle = "#111827";

    // Flecha X positiva

    ctx.beginPath();
    ctx.moveTo(ancho - 10, origenY - 5);
    ctx.lineTo(ancho, origenY);
    ctx.lineTo(ancho - 10, origenY + 5);
    ctx.fill();

    // Flecha Y positiva

    ctx.beginPath();
    ctx.moveTo(origenX - 5, 10);
    ctx.lineTo(origenX, 0);
    ctx.lineTo(origenX + 5, 10);
    ctx.fill();


    // ======================================
    // NÚMEROS DE LOS EJES
    // ======================================

    ctx.fillStyle = "#334155";
    ctx.font = "12px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    if (escala >= 15) {

        for (let x = izquierda; x <= derecha; x++) {

            if (x === 0) continue;

            const posicion = origenX + x * escala;

            if (posicion > 10 && posicion < ancho - 10) {

                if (origenY > 15 && origenY < alto - 15) {

                    ctx.fillText(
                        x,
                        posicion,
                        origenY + 5
                    );

                }

            }

        }

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (let y = arriba; y <= abajo; y++) {

            if (y === 0) continue;

            const posicion = origenY - y * escala;

            if (posicion > 10 && posicion < alto - 10) {

                if (origenX > 30 && origenX < ancho - 20) {

                    ctx.fillText(
                        y,
                        origenX - 7,
                        posicion
                    );

                }

            }

        }

    }


    // ======================================
    // LETRAS X E Y
    // ======================================

    ctx.font = "bold 17px Arial";
    ctx.fillStyle = "#111827";

    ctx.textAlign = "right";
    ctx.fillText("X", ancho - 12, origenY - 12);

    ctx.textAlign = "left";
    ctx.fillText("Y", origenX + 10, 20);


    // ======================================
    // ORIGEN
    // ======================================

    ctx.font = "12px Arial";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "left";
    ctx.fillText("(0,0)", origenX + 6, origenY + 5);


    // ======================================
    // DIBUJAR PUNTO SELECCIONADO
    // ======================================

    const px = origenX + puntoX * escala;
    const py = origenY - puntoY * escala;

    ctx.beginPath();

    ctx.arc(px, py, 6, 0, Math.PI * 2);

    ctx.fillStyle = "#dc2626";
    ctx.fill();

    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 2;
    ctx.stroke();


    // Etiqueta del punto

    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    ctx.fillText(
        `(${puntoX}, ${puntoY})`,
        px + 10,
        py - 5
    );


    // Mostrar zoom

    nivelZoom.textContent =
        "Zoom: " + Math.round((escala / 30) * 100) + "%";

}


// ==========================================
// GRAFICAR PUNTO MANUALMENTE
// ==========================================

function graficarPunto() {

    const x = Number(inputX.value);
    const y = Number(inputY.value);

    if (
        inputX.value.trim() === "" ||
        inputY.value.trim() === "" ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
    ) {

        alert("Introduce coordenadas válidas.");

        return;

    }

    puntoX = x;
    puntoY = y;

    dibujarPlano();

    resultado.textContent =
        `Punto seleccionado: (${puntoX}, ${puntoY})`;

}

btnGraficar.addEventListener("click", graficarPunto);


// ==========================================
// CONVERTIR POSICIÓN DEL RATÓN A COORDENADAS
// ==========================================

function obtenerCoordenadas(evento) {

    const rect = canvas.getBoundingClientRect();

    const xPantalla = evento.clientX - rect.left;
    const yPantalla = evento.clientY - rect.top;

    const origenX = canvas.clientWidth / 2 + desplazamientoX;
    const origenY = canvas.clientHeight / 2 + desplazamientoY;

    const x = (xPantalla - origenX) / escala;
    const y = (origenY - yPantalla) / escala;

    return {
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100
    };

}


// ==========================================
// MOVER EL PLANO CON EL RATÓN O EL DEDO
// ==========================================

canvas.addEventListener("pointerdown", function(evento) {

    arrastrando = true;
    movimientoRealizado = false;

    inicioX = evento.clientX - desplazamientoX;
    inicioY = evento.clientY - desplazamientoY;

    canvas.setPointerCapture(evento.pointerId);

});


canvas.addEventListener("pointermove", function(evento) {

    if (!arrastrando) return;

    const nuevaX = evento.clientX - inicioX;
    const nuevaY = evento.clientY - inicioY;

    if (
        Math.abs(nuevaX - desplazamientoX) > 2 ||
        Math.abs(nuevaY - desplazamientoY) > 2
    ) {

        movimientoRealizado = true;

    }

    desplazamientoX = nuevaX;
    desplazamientoY = nuevaY;

    dibujarPlano();

});


canvas.addEventListener("pointerup", function(evento) {

    if (!arrastrando) return;

    arrastrando = false;

    if (movimientoRealizado) return;

    // Si fue un clic y no un arrastre,
    // seleccionar las coordenadas del plano.

    const coordenadas = obtenerCoordenadas(evento);

    puntoX = coordenadas.x;
    puntoY = coordenadas.y;

    inputX.value = puntoX;
    inputY.value = puntoY;

    resultado.textContent =
        `Punto seleccionado: (${puntoX}, ${puntoY})`;

    dibujarPlano();

});


canvas.addEventListener("pointercancel", function() {

    arrastrando = false;

});


// ==========================================
// ACERCAR Y ALEJAR EL PLANO
// ==========================================

function cambiarZoom(factor, centroX, centroY) {

    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;

    const origenX = ancho / 2 + desplazamientoX;
    const origenY = alto / 2 + desplazamientoY;

    const puntoAntesX = (centroX - origenX) / escala;
    const puntoAntesY = (origenY - centroY) / escala;

    const nuevaEscala = Math.max(
        10,
        Math.min(100, escala * factor)
    );

    escala = nuevaEscala;

    desplazamientoX =
        centroX - ancho / 2 - puntoAntesX * escala;

    desplazamientoY =
        centroY - alto / 2 + puntoAntesY * escala;

    dibujarPlano();

}


// Botón acercar

btnAcercar.addEventListener("click", function() {

    cambiarZoom(
        1.2,
        canvas.clientWidth / 2,
        canvas.clientHeight / 2
    );

});


// Botón alejar

btnAlejar.addEventListener("click", function() {

    cambiarZoom(
        0.8,
        canvas.clientWidth / 2,
        canvas.clientHeight / 2
    );

});


// Zoom con la rueda del ratón

canvas.addEventListener("wheel", function(evento) {

    evento.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const centroX = evento.clientX - rect.left;
    const centroY = evento.clientY - rect.top;

    const factor = evento.deltaY < 0 ? 1.1 : 0.9;

    cambiarZoom(factor, centroX, centroY);

}, { passive: false });


// ==========================================
// RESTABLECER VISTA
// ==========================================

btnRestablecer.addEventListener("click", function() {

    escala = 30;

    desplazamientoX = 0;
    desplazamientoY = 0;

    dibujarPlano();

});


// ==========================================
// PANTALLA COMPLETA
// ==========================================

btnPantallaCompleta.addEventListener("click", async function() {

    try {

        if (!document.fullscreenElement) {

            await plano.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.error(
            "Error al cambiar la pantalla:",
            error
        );

    }

});


// Redibujar al entrar o salir de pantalla completa

document.addEventListener("fullscreenchange", function() {

    setTimeout(ajustarCanvas, 100);

});


// ==========================================
// ADAPTAR A CAMBIOS DE TAMAÑO
// ==========================================

const observadorPlano = new ResizeObserver(function() {

    ajustarCanvas();

});

observadorPlano.observe(canvas);


// ==========================================
// INICIAR PLANO
// ==========================================

ajustarCanvas();

graficarPunto();



// ============================================
// 11. TARJETAS DE ESTUDIO
// ============================================

const tarjetas = [

    {
        pregunta: "¿Qué es un ángulo?",
        respuesta: "Es la abertura formada por dos semirrectas con un origen común."
    },

    {
        pregunta: "¿Cuánto mide un ángulo recto?",
        respuesta: "Exactamente 90 grados."
    },

    {
        pregunta: "¿Qué es un ángulo suplementario?",
        respuesta: "Dos ángulos cuya suma es 180 grados."
    },

    {
        pregunta: "¿Cuánto equivale una vuelta completa en radianes?",
        respuesta: "2π radianes."
    },

    {
        pregunta: "¿Qué es la abscisa?",
        respuesta: "Es la coordenada horizontal X."
    },

    {
        pregunta: "¿Qué es la ordenada?",
        respuesta: "Es la coordenada vertical Y."
    },

    {
        pregunta: "¿Qué es un triángulo semejante?",
        respuesta: "Tiene la misma forma que otro, aunque su tamaño puede ser diferente."
    },

    {
        pregunta: "¿Qué es un triángulo congruente?",
        respuesta: "Tiene exactamente la misma forma y tamaño que otro."
    },

    {
        pregunta: "¿Qué representa r en coordenadas polares?",
        respuesta: "La distancia desde el polo hasta el punto."
    },

    {
        pregunta: "¿Qué es el argumento polar?",
        respuesta: "Es el ángulo θ medido desde el eje polar."
    }

];

let indiceTarjeta = 0;

const tarjeta = document.querySelector("#tarjeta");

const preguntaTarjeta = document.querySelector(
    "#preguntaTarjeta"
);

const respuestaTarjeta = document.querySelector(
    "#respuestaTarjeta"
);

const contadorTarjetas = document.querySelector(
    "#contadorTarjetas"
);

function mostrarTarjeta() {

    tarjeta.classList.remove("volteada");

    preguntaTarjeta.textContent =
        tarjetas[indiceTarjeta].pregunta;

    respuestaTarjeta.textContent =
        tarjetas[indiceTarjeta].respuesta;

    contadorTarjetas.textContent =
        `Tarjeta ${indiceTarjeta + 1} de ${tarjetas.length}`;

}

function siguienteTarjeta() {

    indiceTarjeta++;

    if (indiceTarjeta >= tarjetas.length) {
        indiceTarjeta = 0;
    }

    mostrarTarjeta();

}

function anteriorTarjeta() {

    indiceTarjeta--;

    if (indiceTarjeta < 0) {
        indiceTarjeta = tarjetas.length - 1;
    }

    mostrarTarjeta();

}

tarjeta.addEventListener("click", () => {

    tarjeta.classList.toggle("volteada");

});

mostrarTarjeta();


// ============================================
// 12. MINI CUESTIONARIO
// ============================================

const preguntas = [

    {
        pregunta: "¿Cuánto mide un ángulo llano?",
        opciones: ["90°", "180°", "360°"],
        respuesta: 1,
        explicacion: "Un ángulo llano mide exactamente 180°."
    },

    {
        pregunta: "¿Cuánto suman dos ángulos complementarios?",
        opciones: ["90°", "180°", "360°"],
        respuesta: 0,
        explicacion: "Los ángulos complementarios suman 90°."
    },

    {
        pregunta: "¿Cuántos radianes tiene una vuelta completa?",
        opciones: ["π", "2π", "4π"],
        respuesta: 1,
        explicacion: "Una vuelta completa equivale a 2π radianes."
    },

    {
        pregunta: "¿Cuál es la coordenada horizontal?",
        opciones: ["Y", "R", "X"],
        respuesta: 2,
        explicacion: "La abscisa es la coordenada X."
    },

    {
        pregunta: "¿Qué caracteriza a los triángulos semejantes?",
        opciones: [
            "Misma forma",
            "Mismo tamaño siempre",
            "Todos sus ángulos son diferentes"
        ],
        respuesta: 0,
        explicacion: "Los triángulos semejantes tienen la misma forma y lados proporcionales."
    },

    {
        pregunta: "¿Cuál es la fórmula para obtener el radio polar?",
        opciones: [
            "r = x + y",
            "r = √(x² + y²)",
            "r = x - y"
        ],
        respuesta: 1,
        explicacion: "El radio se calcula con el teorema de Pitágoras."
    },

    {
        pregunta: "¿Qué mide un ángulo recto?",
        opciones: ["45°", "90°", "180°"],
        respuesta: 1,
        explicacion: "El ángulo recto mide 90°."
    },

    {
        pregunta: "¿Qué representa el polo?",
        opciones: [
            "El origen del plano polar",
            "La distancia del punto",
            "El ángulo de inclinación"
        ],
        respuesta: 0,
        explicacion: "El polo es el origen del sistema de coordenadas polares."
    }

];

let indicePregunta = 0;
let puntuacion = 0;
let respondida = false;

const textoPregunta = document.querySelector(
    "#textoPregunta"
);

const opcionesQuiz = document.querySelector(
    "#opcionesQuiz"
);

const resultadoQuiz = document.querySelector(
    "#resultadoQuiz"
);

const siguientePregunta = document.querySelector(
    "#siguientePregunta"
);

const puntuacionHTML = document.querySelector(
    "#puntuacion"
);

function mostrarPregunta() {

    respondida = false;

    resultadoQuiz.textContent = "";

    siguientePregunta.textContent = "Siguiente pregunta";

    siguientePregunta.disabled = true;

    if (indicePregunta >= preguntas.length) {

        terminarQuiz();

        return;
    }

    const actual = preguntas[indicePregunta];

    textoPregunta.textContent =
        `${indicePregunta + 1}. ${actual.pregunta}`;

    opcionesQuiz.innerHTML = "";

    actual.opciones.forEach((opcion, indice) => {

        const boton = document.createElement("button");

        boton.textContent = opcion;

        boton.className = "opcion";

        boton.addEventListener("click", () => {

            comprobarRespuesta(indice, boton);

        });

        opcionesQuiz.appendChild(boton);

    });

    puntuacionHTML.textContent =
        `Aciertos: ${puntuacion} / ${preguntas.length}`;

}

function comprobarRespuesta(indice, botonSeleccionado) {

    if (respondida) return;

    respondida = true;

    const actual = preguntas[indicePregunta];

    const botones = opcionesQuiz.querySelectorAll("button");

    botones.forEach((boton, indice) => {

        boton.disabled = true;

        if (indice === actual.respuesta) {
            boton.classList.add("correcta");
        }

    });

    if (indice === actual.respuesta) {

        puntuacion++;

        resultadoQuiz.textContent =
            "¡Correcto! " + actual.explicacion;

    } else {

        botonSeleccionado.classList.add("incorrecta");

        resultadoQuiz.textContent =
            "Respuesta incorrecta. " + actual.explicacion;

    }

    puntuacionHTML.textContent =
        `Aciertos: ${puntuacion} / ${preguntas.length}`;

    siguientePregunta.disabled = false;

    if (indicePregunta === preguntas.length - 1) {
        siguientePregunta.textContent = "Ver resultados";
    }

}

function terminarQuiz() {

    textoPregunta.textContent =
        "¡Has terminado el cuestionario!";

    opcionesQuiz.innerHTML = "";

    resultadoQuiz.textContent =
        `Tu puntuación final es ${puntuacion} de ${preguntas.length}.`;

    let mensaje = "";

    if (puntuacion === preguntas.length) {

        mensaje = "¡Excelente! Dominas estos conceptos.";

    } else if (puntuacion >= 5) {

        mensaje = "¡Buen trabajo! Sigue practicando.";

    } else {

        mensaje = "Repasa los temas y vuelve a intentarlo.";

    }

    puntuacionHTML.textContent = mensaje;

    siguientePregunta.textContent = "Volver a empezar";

    siguientePregunta.disabled = false;

}

siguientePregunta.addEventListener("click", () => {

    if (indicePregunta >= preguntas.length) {

        indicePregunta = 0;
        puntuacion = 0;

    } else {

        indicePregunta++;

    }

    mostrarPregunta();

});

mostrarPregunta();





// ============================================
// FIN DEL PROGRAMA
// ============================================
