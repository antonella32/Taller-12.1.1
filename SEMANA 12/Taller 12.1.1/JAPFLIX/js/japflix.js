document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://japceibal.github.io/japflix_api/movies-data.json'; 
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const lista = document.getElementById('lista');

    // cargar las pelis desde el JSON y guardarlas en el localStorage
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
            console.error('No se cargó correctamente el JSON', error);
        });

    // filtrar y mostrar las peliculas 
    function buscarPeliculas() {
        const termino = inputBuscar.value.trim().toLowerCase(); //trim es para ignorar los espacios en la busqueda
        lista.innerHTML = '';

        if (!termino) return;

        // Recuperar las películas del localStorage
        const peliculas = JSON.parse(localStorage.getItem('listaPeliculas')) || [];

        // Filtrar title, genres, tagline, overview
        const resultados = peliculas.filter(pelicula =>
            ['title', 'genres', 'tagline', 'overview']
            .some(attr => coincide(pelicula[attr], termino))
        );

        //resultados
        if (resultados.length) {
            resultados.forEach(pelicula => mostrarPelicula(pelicula));
        } else {
            mostrarMensaje('No se encontraron coincidencias');
        }
    }
    function coincide(campo, termino) {
        if (!campo) return false;
        const regex = new RegExp(`${termino}`, 'i'); 
        return regex.test(campo.toString());
    }
    

    // lista de pelis
    function mostrarPelicula(pelicula) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
            <h3>${pelicula.title}</h3>
            <p>${pelicula.tagline}</p>
            <p>${Estrellas(pelicula.vote_average)}</p>
        `;
        lista.appendChild(li);
    }

    //funcion para mostrar la puntuacion
    function Estrellas(vote_average) {
        const estrellas = Math.round(vote_average / 2); // 0 a 5 estrellas
        return Array(5).fill().map((_, i) =>
            `<span class="fa fa-star${i < estrellas ? ' checked' : ''}"></span>`
        ).join('');
    }

    //mensaje para cuando no hay resultados
    function mostrarMensaje(mensaje) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = mensaje;
        lista.appendChild(li);
    }

    //evento al boton y al buscador
    btnBuscar.addEventListener('click', buscarPeliculas);
    inputBuscar.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') buscarPeliculas(); //se puede usar enter
    });
});
