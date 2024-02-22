document.addEventListener("DOMContentLoaded", function () {
  // Hide cards until new search
  var weatherCards = document.querySelectorAll(".card-body");
  weatherCards.forEach(function (card) {
    card.style.display = "none";
  });
});

// API key for OpenWeatherMap API
const apiKey = "b561e9c149f3178a4909a7f097b91445";

// Function to fetch weather data from OpenWeatherMap API
function fetchWeather(city) {
  const apiKey = "b561e9c149f3178a4909a7f097b91445";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  return fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
}

// Function to display current weather
function displayCurrentWeather(data) {
  const cityName = data.city.name;
  const currentWeather = data.list[0];

  const temperature = currentWeather.main.temp;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;
  const weatherDescription = currentWeather.weather[0].description;
  const weatherIcon = currentWeather.weather[0].icon;

  // Create elements to display weather information
  const currentWeatherContainer = document.getElementById("today");
  currentWeatherContainer.innerHTML = ""; // Clear previous content

  const cityHeader = document.createElement("h2");
  cityHeader.textContent = `Current Weather in ${cityName}`;

  const temperatureParagraph = document.createElement("p");
  temperatureParagraph.textContent = `Temperature: ${temperature}°C`;

  const humidityParagraph = document.createElement("p");
  humidityParagraph.textContent = `Humidity: ${humidity}%`;

  const windSpeedParagraph = document.createElement("p");
  windSpeedParagraph.textContent = `Wind Speed: ${windSpeed} m/s`;

  const weatherDescriptionParagraph = document.createElement("p");
  weatherDescriptionParagraph.textContent = `Description: ${weatherDescription}`;

  const weatherIconImage = document.createElement("img");
  weatherIconImage.src = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
  weatherIconImage.alt = "Weather Icon";

  // Append elements to container
  currentWeatherContainer.appendChild(cityHeader);
  currentWeatherContainer.appendChild(temperatureParagraph);
  currentWeatherContainer.appendChild(humidityParagraph);
  currentWeatherContainer.appendChild(windSpeedParagraph);
  currentWeatherContainer.appendChild(weatherDescriptionParagraph);
  currentWeatherContainer.appendChild(weatherIconImage);
}

// Function to display 5-day forecast
function displayForecast(data) {
  const forecastList = data.list.slice(1, 6); // Slice to get next 5 days
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // Clear previous content

  const forecastHeader = document.createElement("h2");
  forecastHeader.textContent = "5-Day Forecast";

  const forecastRow = document.createElement("div");
  forecastRow.classList.add("row");

  forecastContainer.appendChild(forecastHeader);
  forecastContainer.appendChild(forecastRow);

  forecastList.forEach((day) => {
    const { dt_txt, main, weather } = day;
    const { temp, humidity } = main;
    const { icon } = weather[0];

    const forecastColumn = document.createElement("div");
    forecastColumn.classList.add("col-md-2");

    const dateHeader = document.createElement("h4");
    dateHeader.textContent = formatDate(dt_txt);

    const temperatureParagraph = document.createElement("p");
    temperatureParagraph.textContent = `Temperature: ${temp}°C`;

    const humidityParagraph = document.createElement("p");
    humidityParagraph.textContent = `Humidity: ${humidity}%`;

    const weatherIcon = document.createElement("img");
    weatherIcon.src = `http://openweathermap.org/img/wn/${icon}.png`;
    weatherIcon.alt = "Weather Icon";

    forecastColumn.appendChild(dateHeader);
    forecastColumn.appendChild(temperatureParagraph);
    forecastColumn.appendChild(humidityParagraph);
    forecastColumn.appendChild(weatherIcon);

    forecastRow.appendChild(forecastColumn);
  });
}

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Event listener for form submission
document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("search-input").value.trim();

    if (city) {
      fetchWeather(city)
        .then((weatherData) => {
          displayCurrentWeather(weatherData);
          displayForecast(weatherData);
          addToHistory(city);
          // // Clear the search input after search
          // cityInput.value = " "; // Set the value to an empty string
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          alert(
            "An error occurred while fetching weather data. Please try again later."
          );
        });
    } else {
      alert("Please enter a city name.");
    }
  });

// Function to add city to search history
function addToHistory(city) {
  const historyList = document.getElementById("history");
  const listItem = document.createElement("button");
  listItem.classList.add("list-group-item", "list-group-item-action");
  listItem.textContent = city;

  listItem.addEventListener("click", function () {
    fetchWeather(city)
      .then((weatherData) => {
        displayCurrentWeather(weatherData);
        displayForecast(weatherData);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert(
          "An error occurred while fetching weather data. Please try again later."
        );
      });
  });

  historyList.appendChild(listItem);
}
