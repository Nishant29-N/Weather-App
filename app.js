    // OpenWeatherMap API key and URL
    const apiKey = "3117d998cbd4164888930c357268e36e";
    const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";

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

        const response = await fetch(apiCall);
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Update the UI with the fetched weather details
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°C`;
            document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
            document.querySelector(".wind").innerHTML = `${data.wind.speed} km/h`;
        } else {
            alert("Location not found. Try entering a valid village, town, or city name.");
        }
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
        checkWeather(city);
    });

    // Event listener for Enter key press
    document.querySelector("input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const city = document.querySelector("input").value;
            checkWeather(city);
        }
    });

    // On page load, fetch weather based on user's location (only once on first load)
    window.onload = () => {
        getUserLocation();  // Get user's location and display the weather
    };


        // Change background based on whether it's day or night
        function changeBackground(hours) {
            const card = document.querySelector('.card');
            if (hours >= 6 && hours < 18) {
                card.style.backgroundImage = "url('https://img95.lovepik.com/photo/40104/2779.gif_wh300.gif')"; 
            } else {
                card.style.backgroundImage = "url('https://i.pinimg.com/originals/96/df/d4/96dfd411ab0e68f8bc1eb47e4eee8771.gif')";
            }
        }
