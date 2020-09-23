// when a city is searched for, create a button. prepend that button to the top of teh list.
var currentWeatherBox = $('.current-weather');
// API call for current weather data

var cities = [];
var cityNameInput = "";
var cityLon = "";
var cityLat = "";

$('.search-btn').click(function () {

    currentWeatherBox.empty()
    cityNameInput = $('input').val().trim();
    cities.push(cityNameInput);

    // This API call pulls all info in the current weather section except for UV index
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNameInput + '&appid=0cffa7a68e5c4f60668c3938360e6edd',
        method: 'GET'
    }).then(function (response) {
        var cityNameTitle = $("<div>");
        var iconURL = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
        var temp = $("<p>");
        var tempFar = ((response.main.temp - 273.15) * 9 / 5 + 32);
        var windSpeed = $("<p>");

        cityNameTitle.html(`<h3 class = 'city-name'>${response.name} - ${moment().format('M/D/YY')}</h3> - <img src='${iconURL}' alt='weather icon'>`);
        currentWeatherBox.append(cityNameTitle);

        temp.text(`Temperature: ${tempFar.toFixed(1)}° F`);
        currentWeatherBox.append(temp);

        windSpeed.text(`Wind Speed: ${response.wind.speed}mph`);
        currentWeatherBox.append(windSpeed);

        cityLon = response.coord.lon;
        cityLat = response.coord.lat;


    createButton();
    getUV();
    getFiveDay();

})
}); 

    function createButton() {
        var cityButton = $("<button class = 'new-btn'>");
        cityButton.text(cityNameInput);
        $(".search-box").append(cityButton);
    };

    // This API call pulls in UV index information
    function getUV() {
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/uvi?lat=' + cityLat + '&lon=' + cityLon + '&appid=0cffa7a68e5c4f60668c3938360e6edd',
            method: 'GET'
        }).then(function (response) {
            var uvIndex = $("<p>");
            var indexNumber = response.value
            uvIndex.text(`UV Index: ${indexNumber}`);
            currentWeatherBox.append(uvIndex);

            if (indexNumber < 3) {
                uvIndex.attr("class", "low")
            } else if (indexNumber > 3 && indexNumber < 5) {
                uvIndex.attr("class", "moderate")
            } else {
                uvIndex.attr("class", "high")
            };
        });

    };


    // API call for 5 day forecast
    function getFiveDay() {
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityNameInput + '&appid=0cffa7a68e5c4f60668c3938360e6edd',
            method: 'GET'
        }).then(function (forecastApi) {
            $('.forecast-holder').empty();
            for (i = 7; i < 36; i += 7) {
                var daily = forecastApi.list[i]
                var forecastDaily = $("<div class = 'col-md-3 forecast'>");
                $('.forecast-holder').append(forecastDaily);

                var dailyTime = $("<p>");
                dailyTime.text(daily.dt_txt);
                forecastDaily.append(dailyTime);

                var iconURL = `http://openweathermap.org/img/wn/${daily.weather[0].icon}.png`;
                var weatherIcon = $("<img>");
                weatherIcon.attr("src", iconURL);
                forecastDaily.append(weatherIcon);

                var dailyTemp = $("<p>");
                var dailyTempFar = ((daily.main.temp - 273.15) * 9 / 5 + 32);
                dailyTemp.text(`Temperature: ${dailyTempFar.toFixed(1)}° F`);
                forecastDaily.append(dailyTemp);

                var dailyHumidity = $("<p>");
                dailyHumidity.text(`Humidity: ${daily.main.humidity}%`);
                forecastDaily.append(dailyHumidity);

            }
        });
    }