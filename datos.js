let key = 'c7353c0c3321a0d9d8d0c331f0c885f4';  // Tu clave de API de OpenWeatherMap
let ciudad = document.getElementById('city');
let boton = document.getElementById('btn');
let resultado = document.getElementById('resultado');
let weatherIcon = document.getElementById('weather-icon');  // Elemento para la imagen del clima

let map;  // Variable global para almacenar el mapa
let marker;  // Variable global para almacenar el marcador

// Función para pedir los datos del clima
let get_weather = (lat, lon, city_name = null) => {
    // Definir la URL de la API en base a la ciudad o las coordenadas
    let url = city_name 
        ? `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${key}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;

    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);

            // Obtener el ícono del clima
            let icon_code = data.weather[0].icon;
            let icon_url = `https://openweathermap.org/img/wn/${icon_code}@2x.png`;

            // Mostrar los datos del clima
            document.getElementById('city-name').innerText = data.name;
            document.getElementById('temperature').innerText = `${data.main.temp}°C`;
            document.getElementById('weather-description').innerText = data.weather[0].description;

            // Mostrar la imagen del clima
            weatherIcon.src = icon_url;
            weatherIcon.style.display = 'block';

            // Coordenadas de la ciudad
            let lat = data.coord.lat;
            let lon = data.coord.lon;

            // Inicializar el mapa solo si aún no existe
            if (!map) {
                map = L.map('map').setView([lat, lon], 13);

                // Añadir el "tile layer"
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
            } else {
                // Actualizar la vista del mapa
                map.setView([lat, lon], 13);
            }

            // Si ya existe un marcador, eliminarlo
            if (marker) {
                map.removeLayer(marker);
            }

            // Crear y agregar un nuevo marcador
            marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${data.name}</b><br>Lat: ${lat}<br>Lon: ${lon}`)
                .openPopup();
        })
        .catch((error) => {
            console.error("Error al cargar los datos: ", error);
            resultado.innerHTML = "Error al cargar los datos.";
        });
};

// Obtener el clima al hacer clic en el botón
boton.addEventListener('click', () => {
    let city_name = ciudad.value;
    get_weather(null, null, city_name);
});

// Geolocalización automática
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            get_weather(lat, lon);
        },
        (error) => {
            console.error("Error de geolocalización: ", error);
        }
    );
} else {
    console.log("Geolocalización no soportada en este navegador.");
}