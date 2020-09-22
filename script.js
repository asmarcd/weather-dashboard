// when a city is searched for, create a button. prepend that button to the top of teh list.
var currentWeatherBox = $('.current-weather');
// API call for current weather data

var cities = [];


$('.search-btn').click(function () {
    var cityLon = "";
    var cityLat = "";
    currentWeatherBox.empty();
    var cityNameInput = $('input').val().trim();
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
    });
    
    // This API call pulls in UV index information
    // $.ajax({
    //     url: 'http://api.openweathermap.org/data/2.5/uvi?lat=' + cityLat + '&lon=' + cityLon + '&appid=0cffa7a68e5c4f60668c3938360e6edd',
    //     method: 'GET'
    // }).then(function (response) {
    //     var uvIndex = $("<p>");
    //     uvIndex.text(`UV Index: `)
    //     console.log(cityLat);
    // });


// API call for 5 day forecast
$.ajax({
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityNameInput + '&appid=0cffa7a68e5c4f60668c3938360e6edd',
    method: 'GET'
}).then(function (response) {
    
    for (i=0; i<5; i++){

    }
    
    console.log(response);
});

});