$(document).ready(function () {
  //hide weather info card until a search is done
  $(".weatherInfo").css("display", "none");

  //open weather APIkey
  const apiKey = "b561e9c149f3178a4909a7f097b91445";
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
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
      // add city to search history
    }
  });

  // event listening for adding city to search history

  // function to fetch current weather data
});
