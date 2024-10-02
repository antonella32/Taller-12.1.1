document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://japceibal.github.io/japflix_api/movies-data.json'; 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el JSON');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('listaPeliculas', JSON.stringify(data));
            console.log('Películas guardadas en localStorage');
        })
        .catch(error => {
            console.error('No se cargo correctamente el JSON', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const lista = document.getElementById('lista');

    // Recuperar la lista de películas del localStorage
    const peliculas = JSON.parse(localStorage.getItem('listaPeliculas')) || [];

    // Función para filtrar y mostrar las películas
    function buscarPeliculas() {
        const termino = inputBuscar.value.trim().toLowerCase();
        lista.innerHTML = '';

        if (!termino) return;

        // Filtrar las películas basándose en los campos relevantes (palabras completas)
        const resultados = peliculas.filter(pelicula => 
            ['title', 'genres', 'tagline', 'overview']
            .some(attr => coincidePalabraExacta(pelicula[attr], termino))
        );

        // Mostrar los resultados
        resultados.length ? resultados.forEach(pelicula => mostrarPelicula(pelicula)) :
        mostrarMensaje('No se encontraron películas que coincidan con la búsqueda.');
    }

    // Función que verifica coincidencia exacta de palabras usando una expresión regular
    function coincidePalabraExacta(campo, termino) {
        if (!campo) return false;
        const regex = new RegExp(`\\b${termino}\\b`, 'i'); // \b asegura que sea una palabra completa
        return regex.test(campo.toString());
    }

    // Función para mostrar una película
    function mostrarPelicula(pelicula) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            <h3>${pelicula.title}</h3>
            <p>${pelicula.tagline}</p>
            <p>${generarEstrellas(pelicula.vote_average)}</p>
        `;
        lista.appendChild(li);
    }

    // Función para generar estrellas basadas en el voto promedio (vote_average)
    function generarEstrellas(vote_average) {
        const estrellas = Math.round(vote_average / 2); // 0 a 5 estrellas
        return Array(5).fill().map((_, i) =>
            `<span class="fa fa-star${i < estrellas ? ' checked' : ''}"></span>`
        ).join('');
    }

    // Mostrar mensaje cuando no hay resultados
    function mostrarMensaje(mensaje) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = mensaje;
        lista.appendChild(li);
    }

    // Agregar eventos al botón y al input
    btnBuscar.addEventListener('click', buscarPeliculas);
    inputBuscar.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') buscarPeliculas();
    });
});

