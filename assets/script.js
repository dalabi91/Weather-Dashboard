$(document).ready(function () {
  // Hide cards until new search
  $(".card-body").css("display", "none");

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

    const temperature = Math.round(currentWeather.main.temp);
    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
    const weatherDescription = currentWeather.weather[0].description;
    const weatherIcon = currentWeather.weather[0].icon;

    // Create elements to display weather information
    $("#today").html(""); // Clear previous content

    const cityHeader = $("<h2>").text(`Current Weather in ${cityName}`);

    const temperatureParagraph = $("<p>").text(`Temperature: ${temperature}°C`);

    const humidityParagraph = $("<p>").text(`Humidity: ${humidity}%`);

    const windSpeedParagraph = $("<p>").text(`Wind Speed: ${windSpeed} m/s`);

    const weatherDescriptionParagraph = $("<p>").text(
      `Description: ${weatherDescription}`
    );

    const weatherIconImage = $("<img>")
      .attr("src", `http://openweathermap.org/img/wn/${weatherIcon}.png`)
      .attr("alt", "Weather Icon");

    // Append elements to container
    $("#today").append(
      cityHeader,
      temperatureParagraph,
      humidityParagraph,
      windSpeedParagraph,
      weatherDescriptionParagraph,
      weatherIconImage
    );
  }

  // Function to display 5-day forecast

  // function displayForecast(data) {
  //   const forecastList = data.list.slice(1, 6); // Slice to get next 5 days
  //   const forecastContainer = $("#forecast");
  //   forecastContainer.html(""); // Clear previous content

  //   const forecastHeader = $("<h2>").text("5-Day Forecast");
  //   forecastContainer.append(forecastHeader);

  //   const forecastRow = $("<div>").addClass("row");
  //   forecastContainer.append(forecastRow);

  //   forecastList.forEach((day) => {
  //     const { dt_txt, main, weather } = day;
  //     const { temp, humidity } = main;
  //     const { icon } = weather[0];
  //     // Round temperature to the nearest whole number
  //     const roundedTemp = Math.round(temp);

  //     const forecastColumn = $("<div>").addClass("col-md-2");

  //     const dateHeader = $("<h4>").text(formatDate(dt_txt));

  //     const temperatureParagraph = $("<p>").text(
  //       `Temperature: ${roundedTemp}°C`
  //     );

  //     const humidityParagraph = $("<p>").text(`Humidity: ${humidity}%`);

  //     const weatherIcon = $("<img>")
  //       .attr("src", `http://openweathermap.org/img/wn/${icon}.png`)
  //       .attr("alt", "Weather Icon");

  //     forecastColumn.append(
  //       dateHeader,
  //       temperatureParagraph,
  //       humidityParagraph,
  //       weatherIcon
  //     );

  //     forecastRow.append(forecastColumn);
  //   });
  // }

  function displayForecast(data) {
    const forecastList = data.list.slice(1, 6); // Slice to get next 5 days
    const forecastContainer = $("#forecast");
    forecastContainer.empty(); // Clear previous content

    const forecastRow = $("<div>").addClass("row"); // Create a row container

    forecastList.forEach((day, index) => {
      const { dt_txt, main, weather, wind } = day;
      const { temp, humidity } = main;
      const { icon } = weather[0];
      const { speed } = wind;

      // Create card elements
      const cardColumn = $("<div>").addClass("col-lg-2 col-md-4 col-sm-6 mb-4");
      const card = $("<div>").addClass("card");
      const cardBody = $("<div>").addClass("card-body");
      const dateHeader = $("<h5>")
        .addClass("card-title")
        .text(formatDate(dt_txt));
      const iconImage = $("<img>")
        .addClass("weather-icon")
        .attr("src", `http://openweathermap.org/img/wn/${icon}.png`);
      const temperatureParagraph = $("<p>")
        .addClass("card-text")
        .text(`Temperature: ${Math.round(temp)}°C`);
      const windParagraph = $("<p>")
        .addClass("card-text")
        .text(`Wind: ${speed} m/s`);
      const humidityParagraph = $("<p>")
        .addClass("card-text")
        .text(`Humidity: ${humidity}%`);

      // Append elements to card
      cardBody.append(
        dateHeader,
        iconImage,
        temperatureParagraph,
        windParagraph,
        humidityParagraph
      );
      card.append(cardBody);
      cardColumn.append(card);

      // Append card column to the forecast row
      forecastRow.append(cardColumn);
    });

    // Append the forecast row to the forecast container
    forecastContainer.append(forecastRow);
  }

  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-UK", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // Event listener for form submission
  $("#search-form").submit(function (event) {
    event.preventDefault();
    const city = $("#search-input").val().trim();

    if (city) {
      fetchWeather(city)
        .then((weatherData) => {
          displayCurrentWeather(weatherData);
          displayForecast(weatherData);
          addToHistory(city);
          unhideCards(); // Unhide cards after search
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

  // Event listener for clear button
  var clearHistory = $("#clear-button");
  clearHistory.on("click", function (event) {
    event.preventDefault();
    window.localStorage.clear();
    searches = [];
    $(".list-group").empty();
  });

  // Function to unhide cards
  function unhideCards() {
    $(".card-body").css("display", "block");
  }

  // Function to add city to search history
  function addToHistory(city) {
    const listItem = $("<button>")
      .addClass("list-group-item list-group-item-action")
      .text(city);

    listItem.click(function () {
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

    $("#history").append(listItem);
  }
});
