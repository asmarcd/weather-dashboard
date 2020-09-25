// Global Variables
var currentWeatherBox = $('.current-weather');
var cities = [];
var cityNameInput = "";
var cityLon = "";
var cityLat = "";

// Click even for main Search button, based on what's in the user input field
$('.search-btn').click(function () {
    currentWeatherBox.empty()
    cityNameInput = $('input').val().trim();
    ajaxCall(cityNameInput);
});

// This API call pulls all info in the current weather section except for UV index
function ajaxCall(cityNameInput) {
    currentWeatherBox.empty()

    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNameInput + '&appid=0cffa7a68e5c4f60668c3938360e6edd',
        method: 'GET'
    }).then(function (response) {
        // Displays header with city name and weather icon
        var cityNameTitle = $("<div>");
        var iconURL = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
        cityNameTitle.html(`<h3 class = 'city-name'>${response.name} - ${moment().format('M/D/YY')}</h3> - <img src='${iconURL}' alt='weather icon'>`);
        currentWeatherBox.append(cityNameTitle);

        // Displays temperature in degrees F
        var temp = $("<p>");
        var tempFar = ((response.main.temp - 273.15) * 9 / 5 + 32);
        temp.text(`Temperature: ${tempFar.toFixed(1)}° F`);
        currentWeatherBox.append(temp);

        // Displays wind speed
        var windSpeed = $("<p>");
        windSpeed.text(`Wind Speed: ${response.wind.speed}mph`);
        currentWeatherBox.append(windSpeed);

        // Sets variables for longitude and latitude needed for UV index search
        cityLon = response.coord.lon;
        cityLat = response.coord.lat;

        // Runs other functions needed to display relevant info
        createButton();
        getUV();
        getFiveDay();

        // Pushes name of input city to cities array for future reference
        cities.push(cityNameInput);
    })
}

// This function creates the city buttons and gives them the ability to be clicked upon to redo the original search
function createButton() {
    var cityButton = $("<button class = 'search-btn new-btn'>");
    cityButton.text(cityNameInput);

    // Only append a new button if that city does not already exist in the array
    if (!cities.includes(cityNameInput)) {
        $(".search-box").append(cityButton)
    };

    cityButton.click(function () {
        ajaxCall(cityButton.text());
        getUV(cityButton.text());
        getFiveDay(cityButton.text());
    });
};

// This API call pulls in UV index information and sets the background color accordingly
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
        
        // The 5 day forecast comes in 3 hour blocks, so requires this indexing by 7s to function properly and display the next day, rather than the next set of 3 hours. 
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