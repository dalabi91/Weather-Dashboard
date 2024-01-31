$(document).ready(function () {
  //hide weather info card until a search is done
  $(".weatherInfo").css("display", "none");

  //open weather APIkey
  const apiKey = "b561e9c149f3178a4909a7f097b91445";
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey +
    "&units=metric";
  // event listener for the submit key
  $("#search-button").submit(function (event) {
    event.preventDefault();
    // console.log();
    const cityName = $("#search-input").val().trim();
    // if to check that cityName is not and empty string
    if (cityName !== "") {
      $("search-input").val("");
      // fetch current weather
      getCurrentWeather(cityName, apiKey);
      // fetch 5-days forecast
      getFiveDayForecast(cityName, apiKey);
      // add city to search history
      addSearchToHistory(cityName);
    }
  });

  // event listening for adding city to search history

  // function to fetch current weather data
  function getCurrentWeather() {
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
});
