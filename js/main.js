const formPlanta = document.getElementById("formPlanta");
const listaPlantas = document.getElementById("listaPlantas");
const plantCount = document.getElementById("plantCount");

// Recuperamos las plantas guardadas
let plantas = JSON.parse(localStorage.getItem("plantas")) || [];


// Mostramos las plantas que ya estaban guardadas
plantas.forEach(function(planta) {
    mostrarPlanta(planta);
});


// Agregar una nueva planta
formPlanta.addEventListener("submit", function(event) {

    event.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let frecuencia = document.getElementById("frecuencia").value;

    let ultimoRiego = new Date();

    let proximoRiego = new Date(ultimoRiego);

    proximoRiego.setDate(
        proximoRiego.getDate() + Number(frecuencia)
    );

    let planta = {
        nombre: nombre,
        frecuencia: frecuencia,
        ultimoRiego: ultimoRiego,
        proximoRiego: proximoRiego
    };

    // Agregamos la planta al array
    plantas.push(planta);

    // Guardamos el array actualizado
    localStorage.setItem("plantas", JSON.stringify(plantas));

    // Mostramos la planta
    mostrarPlanta(planta);

    // Limpiamos el formulario
    formPlanta.reset();
});


// Mostrar una planta
function mostrarPlanta(planta) {

    let fechaProximoRiego = new Date(planta.proximoRiego);

    let hoy = new Date();

    let diferencia = fechaProximoRiego - hoy;

    let diasFaltantes = Math.ceil(
        diferencia / (1000 * 60 * 60 * 24)
    );

    let tarjeta = document.createElement("div");
    tarjeta.className = "plant-card";

    tarjeta.innerHTML = `
        <h3>🌱 ${planta.nombre}</h3>

        <p>
            <strong>Riego:</strong> cada ${planta.frecuencia} días
        </p>

        <p>
            <strong>Último riego:</strong>
            ${new Date(planta.ultimoRiego).toLocaleDateString()}
        </p>

        <p>
            <strong>Próximo riego:</strong>
            ${fechaProximoRiego.toLocaleDateString()}
        </p>

        <p>
            <strong>Faltan ${diasFaltantes} días</strong> para regar
        </p>

        <div class="card-actions">
            <button class="water-button" type="button">💧 Regar ahora</button>
            <button class="delete-button" type="button" aria-label="Eliminar ${planta.nombre}" title="Eliminar planta">×</button>
        </div>
    `;

    let botonRegar = tarjeta.querySelector("button");
    let botonEliminar = tarjeta.querySelector(".delete-button");

    botonRegar.addEventListener("click", function() {

        // Actualizamos el último riego
        planta.ultimoRiego = new Date();

        // Calculamos nuevamente el próximo riego
        planta.proximoRiego = new Date(planta.ultimoRiego);

        planta.proximoRiego.setDate(
            planta.proximoRiego.getDate() + Number(planta.frecuencia)
        );

        // Guardamos nuevamente las plantas
        localStorage.setItem(
            "plantas",
            JSON.stringify(plantas)
        );

        // Actualizamos la tarjeta
        tarjeta.remove();

        mostrarPlanta(planta);
    });

    botonEliminar.addEventListener("click", function() {
        plantas = plantas.filter(function(plantaGuardada) {
            return plantaGuardada !== planta;
        });

        localStorage.setItem("plantas", JSON.stringify(plantas));
        tarjeta.remove();
        actualizarContador();
        actualizarEstadoVacio();
    });

    listaPlantas.appendChild(tarjeta);
    actualizarContador();
    actualizarEstadoVacio();
}

function actualizarContador() {
    plantCount.textContent = plantas.length;
}

function actualizarEstadoVacio() {
    let estadoVacio = listaPlantas.querySelector(".empty-state");

    if (plantas.length === 0 && !estadoVacio) {
        listaPlantas.innerHTML = '<div class="empty-state">Todavía no hay plantitas. La primera espera su lugar.</div>';
    } else if (plantas.length > 0 && estadoVacio) {
        estadoVacio.remove();
    }
}

actualizarContador();
actualizarEstadoVacio();