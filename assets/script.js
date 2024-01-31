$(document).ready(function () {
  //hide weather info card until a search is done
  $(".weatherInfo").css("display", "none");

  //open weather APIkey
  const apiKey = "b561e9c149f3178a4909a7f097b91445";

  // event listener for the submit key
  $("#search-button").on("click", getWeatherInfo);
  function getWeatherInfo(event) {
    event.preventDefault();
    // grab user city name input
    const userCityInput = $("#search-input").val().trim();
    // save user input
    saveUserCityInput();
    // if to check that userCityInput is not and empty string
    if (userCityInput !== "") {
      $("search-input").val("");
      // fetch current weather
      getCurrentWeather(userCityInput, apiKey);
      // fetch 5-days forecast
      getFiveDayForecast(userCityInput, apiKey);
      // add city to search history
      addSearchToHistory(userCityInput);
    }
  }

  // function to save input to local storage
  function saveUserCityInput() {
    const userCityInput = $("#search-input").val().trim();

    if (userCityInput !== "") {
      saveToLocalStorage("location", userCityInput);
    }
  }

  // event listening for adding city to search history
  $("#history").on("click", ".list-group-item", function () {
    const userCityInput = $(this).text();
    getCurrentWeather(userCityInput, apiKey);
    getFiveDayForecast(userCityInput, apiKey);
  });
  // function to fetch current weather data
  function getCurrentWeather(userCityInput, apiKey) {
    const weatherUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      userCityInput +
      "&appid=" +
      apiKey +
      "&units=metric";
    $.ajax({
      url: weatherUrl,
      method: "GET",
    }).then(function (response) {
      displayCurrentWeather(response);
    });
  }

  // Function to display current weather data
  function displayCurrentWeather(weatherData) {
    // Extract relevant information from the API response
    const city = weatherData.name; // Extract city name from the API response
    const date = dayjs.unix(weatherData.dt).format("MM/DD/YYYY"); // Extract and format the date from the API response
    const iconCode = weatherData.weather[0].icon; // Extract weather icon code from the API response
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`; // Construct the URL for the weather icon
    const temperature = (weatherData.main.temp - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius and fix the decimal places
    const humidity = weatherData.main.humidity; // Extract humidity from the API response
    const windSpeed = weatherData.wind.speed; // Extract wind speed from the API response

    //display current weather info
    const currentWeatherHTML = `<h2>${city} (${date}) <img src="${iconURL}" alt="${weatherData.weather[0].description}"></h2>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
    $("#today").html(currentWeatherHTML);
  }

  // function to fetch the 5-day forecast

  function getFiveDayForecast(userCityInput, apiKey) {
    const forecastUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      userCityInput +
      "&appid=" +
      apiKey +
      "&units=metric";

    $.ajax({
      url: forecastUrl,
      method: "GET",
    }).then(function (response) {
      displayFiveDayForecast(response);
    });
  }

  // to display 5 day forecast
  function displayFiveDayForecast(forecastData) {
    // Extract relevant information from the API response
    const forecastList = forecastData.list;
    let forecastHTML = "";

    for (let i = 0; i < forecastList.length; i += 8) {
      const date = dayjs.unix(forecastList[i].dt).format("MM/DD/YYYY");
      const iconURL = getWeatherIcon(forecastList[i].weather[0].icon);
      const temperature = (forecastList[i].main.temp - 273.15).toFixed(2); // Convert to Celsius
      const humidity = forecastList[i].main.humidity;

      forecastHTML += `<div class="col-lg-2 col-md-4 col-sm-6 mb-4">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h5 class="card-title">${date}</h5>
              <img src="${iconURL}" alt="${forecastList[i].weather[0].description}">
              <p class="card-text">Temp: ${temperature} °C</p>
              <p class="card-text">Wind: $${windSpeed} m/s</p>
              <p class="card-text">Humidity: ${humidity}%</p>
            </div>
          </div>
        </div>
      `;
    }

    $("#forecast").html(forecastHTML);
  }

  // Function to add city to search history
  function addSearchToHistory(userCityInput) {
    // Create a list item with the city name
    const listItem = $("<a>")
      .addClass("list-group-item list-group-item-action")
      .text(userCityInput);

    // Append the list item to the search history
    $("#history").prepend(listItem);
  }

  // Function to get weather icon URL
  function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  }

  // Function to clear weather information
  function clearHistory() {
    // $("#today").empty();
    // $("#forecast").empty();
    $("#history").empty();
    clearHistory(response);
  }
});
