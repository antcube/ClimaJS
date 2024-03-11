const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const ciudadInput = document.querySelector('#ciudad');
const paisInput = document.querySelector('#pais');
const boton = document.querySelector('input[type="submit"]');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);   
})

function buscarClima(e) {
    e.preventDefault();

    const ciudad = ciudadInput.value.trim();
    const pais = paisInput.value;

    // Validación
    if(ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    disableButton();

    mostrarSpinner();

    setTimeout(() => {
        consultarAPI(ciudad, pais);
    }, 1000);
}

function mostrarError(mensaje) {
    disableButton();

    const alertaExiste = document.querySelector('.alerta');

    if(!alertaExiste) {
        const alerta = document.createElement('DIV');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center','alerta')

        const p = document.createElement('P');
        p.classList.add('font-bold');
        p.textContent = 'Error!!!'

        const span = document.createElement('SPAN');
        span.classList.add('block');
        span.textContent = mensaje;

        alerta.appendChild(p);
        alerta.appendChild(span);

        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
            enableButton();
        }, 2000);
    }
}

function consultarAPI(ciudad, pais) {
    const appID = '7b6b4ccee0f8c912e2459a3648fd6cb9';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();

            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            }

            mostrarClima(datos);

            enableButton();
        })
        .catch(e => {
            mostrarError(`Hubo un error al realizar la solicitud: ${e.message}`);
        });
}

function mostrarClima(datos) {
    const { name, main: {temp, temp_max, temp_min} } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('P');
    nombreCiudad.classList.add('font-bold', 'text-2xl');
    nombreCiudad.textContent = `Clima en ${name}`;

    const actual = document.createElement('P');
    actual.classList.add('font-bold', 'text-6xl');
    actual.innerHTML = `${centigrados} &#8451;`;

    const tempMaxima = document.createElement('P');
    tempMaxima.classList.add('text-xl');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;

    const tempMinimo = document.createElement('P');
    tempMinimo.classList.add('text-xl');
    tempMinimo.innerHTML = `Min: ${min} &#8451;`;

    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center', 'text-white')
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinimo);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

const limpiarHTML = () => {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);
}

function disableButton() {
    boton.disabled = true;
    ciudadInput.disabled = true;
    paisInput.disabled = true;
    boton.classList.add('disabled');
}

function enableButton() {
    boton.disabled = false;
    ciudadInput.disabled = false;
    paisInput.disabled = false;
    boton.classList.remove('disabled');
}