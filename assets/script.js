$(document).ready(function () {
  //hide weather info card until a search is done
  $(".weatherInfo").css("display", "none");

  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
  //open weather APIkey
  const apiKey = "b561e9c149f3178a4909a7f097b91445";
  // event listener for teh submit key
  // $("#search-form").submit(function (event) {
  //   event.preventDefault();
  //   console.log();
  // });
});
