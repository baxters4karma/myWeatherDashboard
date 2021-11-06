// Get weather data
function getWeather(userCityLat, userCityLon, cityName) {
  var cityLat = userCityLat;
  var cityLon = userCityLon;  
  var weatherCity = cityName;  
  var weatherBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?";  
  var weatherCityLat = "lat=" + cityLat;
  var weatherCityLon = "&lon=" + cityLon;  
  var weatherExclude = "&exclude=minutely,hourly,alerts";
  var weatherUnits = "&units=imperial";
  var weatherAppId = "&appid=8c2f82b97567bfc31f8b04c83b3f13c5";  
  var weatherIcon = "https://openweathermap.org/img/wn/";
  var requestUrl =
    weatherBaseUrl +
    weatherCityLat + 
    weatherCityLon + 
    weatherExclude +
    weatherUnits + 
    weatherAppId;    

  fetch(requestUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {      
        var currWeather = data.current;
        var longDate = currWeather.dt;
        var d = new Date(longDate * 1000);
        var cDate = d.toDateString(longDate);
        var cTemp = currWeather.temp;
        var cHumidity = currWeather.humidity;
        var cWindSpeed = currWeather.wind_speed;
        var cUvi = currWeather.uvi;
        populateCurrCard(weatherCity, cDate, cTemp, cHumidity, cWindSpeed, cUvi);

        var dailyWeather = data.daily;
        for (i = 1; i < 6; i++) {
          var longDate = dailyWeather[i].dt;          
          var d = new Date(longDate * 1000);          
          var sDate = d.toDateString(longDate);          
          var dTempL = dailyWeather[i].temp.max;
          var dTempH = dailyWeather[i].temp.min;
          var dHumidity = dailyWeather[i].humidity;
          var dWindSpeed = dailyWeather[i].wind_speed;
          var dUvi = dailyWeather[i].uvi;
          populateFutureCards(sDate, dTempL, dTempH, dHumidity, dWindSpeed, dUvi);
        }
    });
}

function populateCurrCard(city, date, temp, windSpeed, humidity, uvi) {
  var currDay = document.getElementById("currDayData");

  var currDayTitle = document.createElement("h4");
  currDayTitle.setAttribute("id", "card-title");
  currDayTitle.setAttribute("class", "card-title");
  currDayTitle.textContent = city + " (" + date + ")";
  currDay.appendChild(currDayTitle);

  var currDayTemp = document.createElement("p");
  currDayTemp.setAttribute("id", "currTemp");
  currDayTemp.textContent = "Temp: " + temp;
  currDay.appendChild(currDayTemp);

  var currDayWindSpeed = document.createElement("p");
  currDayWindSpeed.setAttribute("id", "currWindSpeed");
  currDayWindSpeed.textContent = "Wind: " + windSpeed + " MPH";
  currDay.appendChild(currDayWindSpeed);

  var currDayHumidity = document.createElement("p");
  currDayHumidity.setAttribute("id", "currHumidity");
  currDayHumidity.textContent = "Humidity: " + humidity + ` %`;
  currDay.appendChild(currDayHumidity);

  var currDayUvi = document.createElement("p");
  currDayUvi.setAttribute("id", "currUvi");
  currDayUvi.textContent = "UV Index: " + uvi;
  currDay.appendChild(currDayUvi);

}

function populateFutureCards(date, tempL, tempH, humidity, windSpeed) {
  var results = document.getElementById("card-data");  

  var resultsTitle = document.createElement("p");
  resultsTitle.setAttribute("id", "card-title");
  resultsTitle.setAttribute("class", "card-title");
  resultsTitle.textContent = date;
  results.appendChild(resultsTitle);
  
  var resultsIcon = document.createElement("p");
  resultsIcon.setAttribute("id", "icon");
  resultsIcon.textContent = "icon here";
  results.appendChild(resultsIcon);
  
  var resultsTemp = document.createElement("p");
  resultsTemp.setAttribute("id", "temp");  
  resultsTemp.textContent = "Temp: " + tempH + " / " + tempL;
  results.appendChild(resultsTemp);

  var resultsWind = document.createElement("p");
  resultsWind.setAttribute("id", "wind");
  resultsWind.textContent = "Wind: " + windSpeed + " MPH";
  results.appendChild(resultsWind);
  
  var resultsHumidity = document.createElement("p");
  resultsHumidity.setAttribute("id", "humidity");
  resultsHumidity.textContent = "Humidity: " + humidity + ` %`;
  results.appendChild(resultsHumidity);

}