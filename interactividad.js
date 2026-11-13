
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
// 4. SIMULADOR DE ANGULOS
// ============================================

const controlAngulo = document.querySelector(
    "#controlAngulo"
);

const valorAngulo = document.querySelector(
    "#valorAngulo"
);

const tipoAngulo = document.querySelector(
    "#tipoAngulo"
);

const ladoAngulo = document.querySelector(
    "#ladoAngulo"
);

const arcoAngulo = document.querySelector(
    "#arcoAngulo"
);

function actualizarAngulo() {

    const grados = Number(controlAngulo.value);

    const radianes = grados * Math.PI / 180;

    const centroX = 40;
    const centroY = 210;
    const radio = 180;

    const x = centroX + radio * Math.cos(radianes);
    const y = centroY - radio * Math.sin(radianes);

    // Actualizar el lado del ángulo
    ladoAngulo.setAttribute("x2", x);
    ladoAngulo.setAttribute("y2", y);

    // Dibujar el arco
    if (grados === 0) {

        arcoAngulo.setAttribute("d", "");

    } else if (grados === 360) {

        arcoAngulo.setAttribute(
            "d",
            `M ${centroX + radio} ${centroY}
             A ${radio} ${radio} 0 1 0
             ${centroX + radio - 0.01} ${centroY}`
        );

    } else {

        const grande = grados > 180 ? 1 : 0;

        arcoAngulo.setAttribute(
            "d",
            `M ${centroX + radio} ${centroY}
             A ${radio} ${radio} 0 ${grande} 0 ${x} ${y}`
        );

    }

    valorAngulo.textContent = grados + "°";

    // Identificar el tipo de ángulo
    if (grados === 0) {

        tipoAngulo.textContent = "Ángulo nulo";

    } else if (grados < 90) {

        tipoAngulo.textContent = "Ángulo agudo";

    } else if (grados === 90) {

        tipoAngulo.textContent = "Ángulo recto";

    } else if (grados < 180) {

        tipoAngulo.textContent = "Ángulo obtuso";

    } else if (grados === 180) {

        tipoAngulo.textContent = "Ángulo llano";

    } else if (grados < 360) {

        tipoAngulo.textContent = "Ángulo cóncavo";

    } else {

        tipoAngulo.textContent = "Ángulo completo";

    }

}

controlAngulo.addEventListener(
    "input",
    actualizarAngulo
);

actualizarAngulo();


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


// ============================================
// 10. PLANO CARTESIANO INTERACTIVO
// ============================================

const canvas = document.querySelector("#planoCanvas");

const ctx = canvas.getContext("2d");

const puntoX = document.querySelector("#puntoX");
const puntoY = document.querySelector("#puntoY");

const coordenadaMostrada = document.querySelector(
    "#coordenadaMostrada"
);

const centro = canvas.width / 2;
const escala = 25;

function dibujarPlano() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cuadrícula
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for (let i = 0; i <= canvas.width; i += escala) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();

    }

    // Ejes X y Y
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, centro);
    ctx.lineTo(canvas.width, centro);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centro, 0);
    ctx.lineTo(centro, canvas.height);
    ctx.stroke();

    // Nombres de los ejes
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px Arial";

    ctx.fillText("X", canvas.width - 20, centro - 10);
    ctx.fillText("Y", centro + 10, 20);

    // Numeración
    ctx.font = "11px Arial";
    ctx.fillStyle = "#475569";

    for (let i = -12; i <= 12; i++) {

        if (i === 0) continue;

        ctx.fillText(
            i,
            centro + i * escala - 4,
            centro + 15
        );

        ctx.fillText(
            i,
            centro + 7,
            centro - i * escala + 4
        );

    }

    ctx.fillText("0", centro + 5, centro + 15);

}

function dibujarPunto() {

    if (
        puntoX.value.trim() === "" ||
        puntoY.value.trim() === ""
    ) {

        coordenadaMostrada.textContent =
            "Introduce los dos valores.";

        dibujarPlano();

        return;
    }

    const x = Number(puntoX.value);
    const y = Number(puntoY.value);

    if (
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        Math.abs(x) > 12 ||
        Math.abs(y) > 12
    ) {

        coordenadaMostrada.textContent =
            "Utiliza valores entre -12 y 12.";

        dibujarPlano();

        return;
    }

    dibujarPlano();

    const px = centro + x * escala;
    const py = centro - y * escala;

    // Punto
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);

    ctx.fillStyle = "#dc2626";
    ctx.fill();

    // Etiqueta
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 14px Arial";

    ctx.fillText(
        `(${x}, ${y})`,
        px + 12,
        py - 12
    );

    coordenadaMostrada.textContent =
        `Punto representado: (${x}, ${y})`;

}

dibujarPlano();

dibujarPunto();


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
