// OpenWeatherMap API key and URL
const apiKey = "3117d998cbd4164888930c357268e36e";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric";

// Function to fetch weather based on city name or latitude/longitude
async function checkWeather(city = null, lat = null, lon = null) {
    let apiCall;
    if (city) {
        // Search by city name
        apiCall = `${apiURL}&q=${city}&appid=${apiKey}`;
    } else if (lat && lon) {
        // Search by latitude and longitude
        apiCall = `${apiURL}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    } else {
        return;
    }

    try {
        const response = await fetch(apiCall);
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Update the UI with the fetched weather details
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°C`;
            document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
            document.querySelector(".wind").innerHTML = `${data.wind.speed} km/h`;
            updateWeatherIcon(data.weather[0].icon);
            changeBackground(new Date().getHours());

            // Fetch the 5-day forecast
            fetchForecast(data.coord.lat, data.coord.lon);
        } else {
            alert("Location not found. Try entering a valid village, town, or city name.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please try again.");
    }
}

// Function to fetch the 5-day forecast
async function fetchForecast(lat, lon) {
    const forecastApiCall = `${forecastURL}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(forecastApiCall);
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Update the UI with the fetched forecast data
            const forecastContainer = document.querySelector(".forecast-container");
            forecastContainer.innerHTML = "";
            data.list.forEach((forecast) => {
                if (forecast.dt_txt.includes("12:00:00")) { // Take only the midday forecast
                    const forecastHTML = `
                        <div class="forecast-item">
                            <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
                            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon">
                            <p>Temp: ${Math.round(forecast.main.temp)}°C</p>
                            <p>Humidity: ${forecast.main.humidity}%</p>
                            <p>Wind: ${forecast.wind.speed} km/h</p>
                        </div>
                    `;
                    forecastContainer.innerHTML += forecastHTML;
                }
            });
        } else {
            alert("Failed to fetch forecast data. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert("Failed to fetch forecast data. Please try again.");
    }
}

// Function to update the weather icon
function updateWeatherIcon(icon) {
    const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector(".weather-icon").src = iconURL;
}

// Function to get the user's current location using the Geolocation API
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Fetch the weather using the user's current location
            checkWeather(null, lat, lon);
        }, (error) => {
            console.error("Geolocation error: ", error);
            alert("Unable to retrieve your location. Please allow location access.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Event listener for search button click
document.querySelector("button").addEventListener("click", () => {
    const city = document.querySelector("input").value;
    if (city.trim() !== "") {
        checkWeather(city);
    } else {
        alert("Please enter a valid city name.");
    }
});

// Event listener for Enter key press
document.querySelector("input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = document.querySelector("input").value;
        if (city.trim() !== "") {
            checkWeather(city);
        } else {
            alert("Please enter a valid city name.");
        }
    }
});

// On page load, fetch weather based on user's location (only once on first load)
window.onload = () => {
    getUserLocation();  // Get user's location and display the weather
};

// Change background based on whether it's day or night
function changeBackground(hours) {
    const card = document.querySelector('.card'); // Make sure this element exists in your HTML
    if (hours >= 6 && hours < 18) {
        card.style.backgroundImage = "url('https://img95.lovepik.com/photo/40104/2779.gif_wh300.gif')";
    } else {
        card.style.backgroundImage = "url('https://i.pinimg.com/originals/96/df/d4/96dfd411ab0e68f8bc1eb47e4eee8771.gif')";
    }
}