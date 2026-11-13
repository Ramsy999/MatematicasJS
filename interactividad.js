
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. MENÚ DINÁMICO
    // =====================================

    const enlaces = document.querySelectorAll("#menu a");
    const secciones = document.querySelectorAll("main section[id]");

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                enlaces.forEach(enlace => {
                    enlace.classList.toggle(
                        "activo",
                        enlace.getAttribute("href") === "#" + entrada.target.id
                    );
                });
            }
        });
    }, { rootMargin: "-25% 0px -65% 0px" });

    secciones.forEach(seccion => observador.observe(seccion));


    // =====================================
    // 2. APARTADOS DESPLEGABLES
    // =====================================

    document.querySelectorAll(".seccion").forEach(seccion => {
        const detalles = seccion.querySelectorAll("details");

        detalles.forEach(actual => {
            actual.addEventListener("toggle", () => {
                if (actual.open) {
                    detalles.forEach(otro => {
                        if (otro !== actual) otro.open = false;
                    });
                }
            });
        });
    });


    // =====================================
    // 3. BUSCADOR DE CONCEPTOS
    // =====================================

    const campoBusqueda = document.getElementById("buscarConcepto");
    const btnBuscar = document.getElementById("btnBuscar");
    const resultadoBusqueda = document.getElementById("resultadoBusqueda");

    function buscarConcepto() {
        const texto = campoBusqueda.value.trim().toLocaleLowerCase("es");

        document.querySelectorAll(".resaltado-busqueda").forEach(elemento => {
            elemento.classList.remove("resaltado-busqueda");
        });

        if (!texto) {
            resultadoBusqueda.textContent = "Escribe un concepto para buscar.";
            return;
        }

        const elementos = document.querySelectorAll(
            "main h2, main h3, main p, main li, main summary, main td"
        );

        const encontrado = Array.from(elementos).find(elemento =>
            elemento.textContent.toLocaleLowerCase("es").includes(texto)
        );

        if (encontrado) {
            const detalle = encontrado.closest("details");
            if (detalle) detalle.open = true;

            const seccion = encontrado.closest(".seccion");
            if (seccion) {
                seccion.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            encontrado.classList.add("resaltado-busqueda");
            resultadoBusqueda.textContent = "Concepto encontrado: " + encontrado.textContent.trim().slice(0, 100);
        } else {
            resultadoBusqueda.textContent = "No se encontró ese concepto. Intenta con otras palabras.";
        }
    }

    btnBuscar.addEventListener("click", buscarConcepto);
    campoBusqueda.addEventListener("keydown", e => {
        if (e.key === "Enter") buscarConcepto();
    });


    // =====================================
    // 4. FUNCIONES AUXILIARES
    // =====================================

    function numero(id) {
        const campo = document.getElementById(id);
        if (!campo || campo.value.trim() === "") return null;

        const valor = Number(campo.value);
        return Number.isFinite(valor) ? valor : null;
    }

    function mostrar(id, mensaje) {
        document.getElementById(id).textContent = mensaje;
    }

    function formato(valor, decimales = 4) {
        return Number(valor.toFixed(decimales)).toString();
    }


    // =====================================
    // 5. GRADOS, MINUTOS Y SEGUNDOS
    // =====================================

    window.dmsADec = function () {
        const g = numero("g");
        const m = numero("m");
        const s = numero("s");

        if (g === null || m === null || s === null) {
            mostrar("resDMS", "Completa los tres campos.");
            return;
        }

        if (g < 0 || m < 0 || m >= 60 || s < 0 || s >= 60) {
            mostrar("resDMS", "Revisa los datos: minutos y segundos deben estar entre 0 y 59.");
            return;
        }

        const resultado = g + m / 60 + s / 3600;

        mostrar("resDMS",
            `${g}° ${m}' ${s}" = ${formato(resultado, 6)}°`
        );
    };


    // =====================================
    // 6. GRADOS A RADIANES
    // =====================================

    window.decARad = function () {
        const grados = numero("des2");

        if (grados === null) {
            mostrar("resRad", "Introduce una cantidad de grados.");
            return;
        }

        const radianes = grados * Math.PI / 180;

        mostrar("resRad",
            `${formato(grados)}° = ${formato(radianes, 6)} rad`
        );
    };


    // =====================================
    // 7. RADIANES A GRADOS Y GMS
    // =====================================

    window.radAGrados = function () {
        const radianes = numero("rad2");

        if (radianes === null) {
            mostrar("resGrados", "Introduce una cantidad de radianes.");
            return;
        }

        const grados = radianes * 180 / Math.PI;
        const signo = grados < 0 ? -1 : 1;
        const absoluto = Math.abs(grados);

        const g = Math.floor(absoluto);
        const minutosCompletos = (absoluto - g) * 60;
        const m = Math.floor(minutosCompletos);
        const s = (minutosCompletos - m) * 60;

        mostrar("resGrados",
            `${formato(radianes)} rad = ${formato(grados, 6)}°\n` +
            `GMS: ${signo < 0 ? "-" : ""}${g}° ${m}' ${formato(s, 2)}"`
        );
    };


    // =====================================
    // 8. RECTANGULARES A POLARES
    // =====================================

    window.rectAPolar = function () {
        const x = numero("x");
        const y = numero("y");

        if (x === null || y === null) {
            mostrar("resPolar", "Introduce las coordenadas X y Y.");
            return;
        }

        const r = Math.sqrt(x * x + y * y);

        if (r === 0) {
            mostrar("resPolar", "r = 0. El ángulo no está definido en el origen.");
            return;
        }

        let angulo = Math.atan2(y, x) * 180 / Math.PI;
        if (angulo < 0) angulo += 360;

        mostrar("resPolar",
            `Radio: r = ${formato(r)}\nÁngulo: θ = ${formato(angulo)}°`
        );
    };


    // =====================================
    // 9. POLARES A RECTANGULARES
    // =====================================

    window.polarARect = function () {
        const r = numero("r2");
        const grados = numero("theta2");

        if (r === null || grados === null) {
            mostrar("resRect", "Introduce el radio y el ángulo.");
            return;
        }

        if (r < 0) {
            mostrar("resRect", "El radio debe ser positivo o cero.");
            return;
        }

        const radianes = grados * Math.PI / 180;
        const x = r * Math.cos(radianes);
        const y = r * Math.sin(radianes);

        mostrar("resRect",
            `x = ${formato(x)}\ny = ${formato(y)}\nPunto: (${formato(x)}, ${formato(y)})`
        );
    };


    // =====================================
    // 10. PLANO CARTESIANO INTERACTIVO
    // =====================================

    const canvas = document.getElementById("planoCanvas");
    const ctx = canvas.getContext("2d");
    const marco = document.getElementById("planoInteractivo");

    let escala = 30;
    let origenX = 0;
    let origenY = 0;
    let puntoX = 2;
    let puntoY = 3;

    let arrastrando = false;
    let movio = false;
    let inicioX = 0;
    let inicioY = 0;
    let ultimoX = 0;
    let ultimoY = 0;

    function ajustarCanvas() {
        const rect = marco.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (origenX === 0 && origenY === 0) {
            origenX = rect.width / 2;
            origenY = rect.height / 2;
        }

        dibujarPlano();
    }

    function dibujarPlano() {
        const ancho = canvas.clientWidth;
        const alto = canvas.clientHeight;

        ctx.clearRect(0, 0, ancho, alto);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, ancho, alto);

        // Cuadrícula
        const paso = escala;

        ctx.strokeStyle = "#e8ecf5";
        ctx.lineWidth = 1;
        ctx.beginPath();

        const inicioVertical = ((origenX % paso) + paso) % paso;
        for (let x = inicioVertical; x < ancho; x += paso) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, alto);
        }

        const inicioHorizontal = ((origenY % paso) + paso) % paso;
        for (let y = inicioHorizontal; y < alto; y += paso) {
            ctx.moveTo(0, y);
            ctx.lineTo(ancho, y);
        }
        ctx.stroke();

        // Ejes
        ctx.strokeStyle = "#263b80";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, origenY);
        ctx.lineTo(ancho, origenY);
        ctx.moveTo(origenX, 0);
        ctx.lineTo(origenX, alto);
        ctx.stroke();

        // Flechas de los ejes
        ctx.fillStyle = "#263b80";
        ctx.font = "bold 15px Arial";
        ctx.fillText("X", ancho - 18, origenY - 10);
        ctx.fillText("Y", origenX + 10, 18);

        // Numeración
        ctx.fillStyle = "#64718c";
        ctx.font = "11px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        for (let i = -Math.ceil(origenX / paso); i <= Math.ceil((ancho - origenX) / paso); i++) {
            if (i === 0) continue;
            const px = origenX + i * paso;
            ctx.fillText(i, px, origenY + 7);
        }

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (let i = -Math.ceil((alto - origenY) / paso); i <= Math.ceil(origenY / paso); i++) {
            if (i === 0) continue;
            const py = origenY - i * paso;
            ctx.fillText(i, origenX - 8, py);
        }

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("0", origenX + 7, origenY + 16);

        // Punto seleccionado
        const px = origenX + puntoX * escala;
        const py = origenY - puntoY * escala;

        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#e34c65";
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#bd2947";
        ctx.font = "bold 14px Arial";
        ctx.fillText(`(${puntoX}, ${puntoY})`, px + 12, py - 12);
    }

    function actualizarTextoPunto() {
        mostrar("coordenadaMostrada",
            `Punto actual: (${formato(puntoX)}, ${formato(puntoY)})`
        );
    }

    window.dibujarPunto = function () {
        const x = numero("puntoX");
        const y = numero("puntoY");

        if (x === null || y === null) {
            mostrar("coordenadaMostrada", "Introduce valores válidos para X y Y.");
            return;
        }

        puntoX = x;
        puntoY = y;

        dibujarPlano();
        actualizarTextoPunto();
    };

    function actualizarZoom() {
        mostrar("nivelZoom", `Zoom: ${Math.round(escala / 30 * 100)}%`);
    }

    function zoomEn(factor, centroX, centroY) {
        const escalaAnterior = escala;
        const nuevaEscala = Math.max(8, Math.min(100, escala * factor));

        const factorReal = nuevaEscala / escalaAnterior;

        origenX = centroX - (centroX - origenX) * factorReal;
        origenY = centroY - (centroY - origenY) * factorReal;

        escala = nuevaEscala;
        dibujarPlano();
        actualizarZoom();
    }

    document.getElementById("btnAcercar").addEventListener("click", () => {
        zoomEn(1.25, canvas.clientWidth / 2, canvas.clientHeight / 2);
    });

    document.getElementById("btnAlejar").addEventListener("click", () => {
        zoomEn(0.8, canvas.clientWidth / 2, canvas.clientHeight / 2);
    });

    document.getElementById("btnRestablecer").addEventListener("click", () => {
        escala = 30;
        origenX = canvas.clientWidth / 2;
        origenY = canvas.clientHeight / 2;
        puntoX = 2;
        puntoY = 3;

        document.getElementById("puntoX").value = 2;
        document.getElementById("puntoY").value = 3;

        dibujarPlano();
        actualizarTextoPunto();
        actualizarZoom();
    });

    // Arrastrar el plano con el ratón o el dedo
    canvas.addEventListener("pointerdown", e => {
        arrastrando = true;
        movio = false;
        inicioX = e.clientX;
        inicioY = e.clientY;
        ultimoX = e.clientX;
        ultimoY = e.clientY;
        canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener("pointermove", e => {
        if (!arrastrando) return;

        const dx = e.clientX - ultimoX;
        const dy = e.clientY - ultimoY;

        if (Math.abs(e.clientX - inicioX) > 3 ||
            Math.abs(e.clientY - inicioY) > 3) {
            movio = true;
        }

        origenX += dx;
        origenY += dy;

        ultimoX = e.clientX;
        ultimoY = e.clientY;

        dibujarPlano();
    });

    function terminarMovimiento(e) {
        if (!arrastrando) return;

        arrastrando = false;

        if (!movio) {
            const rect = canvas.getBoundingClientRect();
            const xPantalla = e.clientX - rect.left;
            const yPantalla = e.clientY - rect.top;

            puntoX = Math.round((xPantalla - origenX) / escala * 100) / 100;
            puntoY = Math.round((origenY - yPantalla) / escala * 100) / 100;

            document.getElementById("puntoX").value = puntoX;
            document.getElementById("puntoY").value = puntoY;

            actualizarTextoPunto();
            dibujarPlano();
        }
    }

    canvas.addEventListener("pointerup", terminarMovimiento);
    canvas.addEventListener("pointercancel", () => arrastrando = false);

    // Zoom con rueda del ratón
    canvas.addEventListener("wheel", e => {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        zoomEn(e.deltaY < 0 ? 1.12 : 0.89, x, y);
    }, { passive: false });

    // Pantalla completa
    document.getElementById("btnPantallaCompleta").addEventListener("click", async () => {
        try {
            if (!document.fullscreenElement) {
                await marco.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch {
            mostrar("coordenadaMostrada", "Tu navegador no permitió activar la pantalla completa.");
        }
    });

    document.addEventListener("fullscreenchange", () => {
        setTimeout(ajustarCanvas, 100);
        document.getElementById("btnPantallaCompleta").textContent =
            document.fullscreenElement ? "⛶ Reducir" : "⛶ Ampliar";
    });

    new ResizeObserver(ajustarCanvas).observe(marco);

    ajustarCanvas();
    actualizarTextoPunto();
    actualizarZoom();


    // =====================================
    // 11. TARJETAS DE ESTUDIO
    // =====================================

    const tarjetas = [
        {
            pregunta: "¿Qué es un ángulo recto?",
            respuesta: "Es aquel que mide exactamente 90 grados."
        },
        {
            pregunta: "¿Cuánto mide un ángulo llano?",
            respuesta: "Mide exactamente 180 grados."
        },
        {
            pregunta: "¿Qué son los ángulos complementarios?",
            respuesta: "Son dos ángulos cuya suma es igual a 90 grados."
        },
        {
            pregunta: "¿Qué son los ángulos suplementarios?",
            respuesta: "Son dos ángulos cuya suma es igual a 180 grados."
        },
        {
            pregunta: "¿Cuántos grados tiene una vuelta completa?",
            respuesta: "Una vuelta completa equivale a 360 grados."
        },
        {
            pregunta: "¿Cuántos radianes tiene una vuelta completa?",
            respuesta: "Tiene 2π radianes."
        },
        {
            pregunta: "¿Qué es la abscisa?",
            respuesta: "Es la coordenada horizontal X de un punto."
        },
        {
            pregunta: "¿Qué es la ordenada?",
            respuesta: "Es la coordenada vertical Y de un punto."
        },
        {
            pregunta: "¿Qué es un triángulo congruente?",
            respuesta: "Es aquel que tiene la misma forma y tamaño que otro."
        },
        {
            pregunta: "¿Qué es una coordenada polar?",
            respuesta: "Es una coordenada representada por un radio r y un ángulo θ."
        }
    ];

    let indiceTarjeta = 0;

    const tarjeta = document.getElementById("tarjeta");

    function actualizarTarjeta() {
        tarjeta.classList.remove("volteada");

        document.getElementById("preguntaTarjeta").textContent =
            tarjetas[indiceTarjeta].pregunta;

        document.getElementById("respuestaTarjeta").textContent =
            tarjetas[indiceTarjeta].respuesta;

        mostrar("contadorTarjetas",
            `Tarjeta ${indiceTarjeta + 1} de ${tarjetas.length}`
        );
    }

    function voltearTarjeta() {
        tarjeta.classList.toggle("volteada");
    }

    tarjeta.addEventListener("click", voltearTarjeta);
    tarjeta.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            voltearTarjeta();
        }
    });

    window.siguienteTarjeta = function () {
        indiceTarjeta = (indiceTarjeta + 1) % tarjetas.length;
        actualizarTarjeta();
    };

    window.anteriorTarjeta = function () {
        indiceTarjeta = (indiceTarjeta - 1 + tarjetas.length) % tarjetas.length;
        actualizarTarjeta();
    };

    actualizarTarjeta();


    // =====================================
    // 12. CUESTIONARIO
    // =====================================

    const preguntas = [
        {
            pregunta: "¿Cuánto mide un ángulo recto?",
            opciones: ["45°", "90°", "180°", "360°"],
            correcta: 1,
            explicacion: "Un ángulo recto mide exactamente 90°."
        },
        {
            pregunta: "¿Cuánto suman dos ángulos complementarios?",
            opciones: ["90°", "180°", "270°", "360°"],
            correcta: 0,
            explicacion: "Los ángulos complementarios suman 90°."
        },
        {
            pregunta: "¿Cuántos radianes equivalen a 180°?",
            opciones: ["π/2", "2π", "π", "3π"],
            correcta: 2,
            explicacion: "180° equivalen a π radianes."
        },
        {
            pregunta: "¿Cuál es la fórmula del radio en coordenadas polares?",
            opciones: ["x + y", "√(x² + y²)", "x - y", "x × y"],
            correcta: 1,
            explicacion: "El radio se calcula con r = √(x² + y²)."
        },
        {
            pregunta: "¿Qué coordenada representa el eje horizontal?",
            opciones: ["Y", "Z", "X", "θ"],
            correcta: 2,
            explicacion: "La abscisa X representa la posición horizontal."
        },
        {
            pregunta: "¿Qué caracteriza a los triángulos semejantes?",
            opciones: [
                "Mismo tamaño siempre",
                "Misma forma y lados proporcionales",
                "Todos sus lados diferentes",
                "No tienen ángulos iguales"
            ],
            correcta: 1,
            explicacion: "Los triángulos semejantes tienen ángulos correspondientes iguales y lados proporcionales."
        },
        {
            pregunta: "¿Cuánto mide una vuelta completa?",
            opciones: ["90°", "180°", "270°", "360°"],
            correcta: 3,
            explicacion: "Una vuelta completa equivale a 360°."
        },
        {
            pregunta: "¿Qué elementos forman una coordenada polar?",
            opciones: [
                "Abscisa y ordenada",
                "Radio y ángulo",
                "Dos radios",
                "Dos ángulos"
            ],
            correcta: 1,
            explicacion: "Una coordenada polar se expresa como (r, θ)."
        }
    ];

    let indicePregunta = 0;
    let puntuacion = 0;
    let respondida = false;

    const textoPregunta = document.getElementById("textoPregunta");
    const opcionesQuiz = document.getElementById("opcionesQuiz");
    const resultadoQuiz = document.getElementById("resultadoQuiz");
    const siguientePregunta = document.getElementById("siguientePregunta");

    function cargarPregunta() {
        respondida = false;

        const actual = preguntas[indicePregunta];

        textoPregunta.textContent = actual.pregunta;
        opcionesQuiz.innerHTML = "";
        resultadoQuiz.textContent = "";

        mostrar("puntuacion", `Puntuación: ${puntuacion} / ${preguntas.length}`);
        mostrar("progresoTexto",
            `Pregunta ${indicePregunta + 1} de ${preguntas.length}`
        );

        document.getElementById("barraProgreso").style.width =
            `${(indicePregunta / preguntas.length) * 100}%`;

        actual.opciones.forEach((opcion, i) => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = opcion;

            boton.addEventListener("click", () => comprobarRespuesta(i));

            opcionesQuiz.appendChild(boton);
        });

        siguientePregunta.textContent =
            indicePregunta === preguntas.length - 1 ? "Ver resultado" : "Siguiente pregunta";

        siguientePregunta.disabled = true;
    }

    function comprobarRespuesta(seleccion) {
        if (respondida) return;

        respondida = true;

        const actual = preguntas[indicePregunta];
        const botones = opcionesQuiz.querySelectorAll("button");

        botones.forEach((boton, i) => {
            boton.disabled = true;

            if (i === actual.correcta) {
                boton.classList.add("correcta");
            }

            if (i === seleccion && seleccion !== actual.correcta) {
                boton.classList.add("incorrecta");
            }
        });

        if (seleccion === actual.correcta) {
            puntuacion++;
            resultadoQuiz.textContent = "¡Correcto! " + actual.explicacion;
        } else {
            resultadoQuiz.textContent = "Respuesta incorrecta. " + actual.explicacion;
        }

        mostrar("puntuacion", `Puntuación: ${puntuacion} / ${preguntas.length}`);
        siguientePregunta.disabled = false;
    }

    siguientePregunta.addEventListener("click", () => {
        if (!respondida) return;

        if (indicePregunta < preguntas.length - 1) {
            indicePregunta++;
            cargarPregunta();
        } else {
            finalizarCuestionario();
        }
    });

    function finalizarCuestionario() {
        document.getElementById("barraProgreso").style.width = "100%";
        mostrar("progresoTexto", "Cuestionario terminado");

        textoPregunta.textContent = "¡Has terminado el cuestionario!";
        opcionesQuiz.innerHTML = "";

        const porcentaje = Math.round(puntuacion / preguntas.length * 100);

        resultadoQuiz.textContent =
            `Obtuviste ${puntuacion} de ${preguntas.length} respuestas correctas (${porcentaje}%).`;

        mostrar("puntuacion",
            porcentaje >= 80 ? "¡Excelente trabajo!" :
            porcentaje >= 60 ? "¡Buen esfuerzo! Sigue practicando." :
            "Puedes volver a estudiar y realizar otro intento."
        );

        siguientePregunta.textContent = "Volver a intentar";
        siguientePregunta.disabled = false;

        siguientePregunta.onclick = () => {
            indicePregunta = 0;
            puntuacion = 0;
            siguientePregunta.onclick = null;
            cargarPregunta();
        };
    }

    cargarPregunta();


    // =====================================
    // 13. VISOR PARA AMPLIAR IMÁGENES
    // =====================================

    const visor = document.createElement("div");
    visor.id = "visorImagen";
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-modal", "true");
    visor.setAttribute("aria-label", "Imagen ampliada");

    const imagenGrande = document.createElement("img");
    imagenGrande.alt = "Imagen ampliada";

    const cerrar = document.createElement("button");
    cerrar.id = "cerrarVisor";
    cerrar.type = "button";
    cerrar.textContent = "×";
    cerrar.setAttribute("aria-label", "Cerrar imagen");

    visor.append(imagenGrande, cerrar);
    document.body.appendChild(visor);

    function cerrarVisor() {
        visor.classList.remove("visible");
        imagenGrande.src = "";
    }

    document.querySelectorAll("main img").forEach(imagen => {
        imagen.addEventListener("click", () => {
            imagenGrande.src = imagen.src;
            imagenGrande.alt = imagen.alt;
            visor.classList.add("visible");
            cerrar.focus();
        });
    });

    cerrar.addEventListener("click", cerrarVisor);

    visor.addEventListener("click", e => {
        if (e.target === visor) cerrarVisor();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") cerrarVisor();
    });

});
