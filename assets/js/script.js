const cityNameEl = document.querySelector("input");
const cityInputEl = document.getElementById("input-city");

// Clear starter text or existing city information
function clearWeatherData() {
  let currDayDataEl = document.getElementById("currDayData");
  let futureDayDataEl = document.getElementById("futureDayData");
  let starterTextCurrEl = document.getElementById("starterTextCurr");
  let starterTextFutureEl = document.getElementById("starterTextFuture")
  let formEl = document.querySelector("form");
  formEl.reset();

  if (!currDayDataEl.hasChildNodes()) {
    starterTextCurrEl.remove();
    starterTextFutureEl.remove();
  } else {
    currDayDataEl.replaceChildren();
    futureDayDataEl.replaceChildren();
  }
};

// Get Weather API URL using entered city
function getGeoCoordUrl(city) {
  let weatherAppId = "a77eee0f49abe8e6331cd9b225df2834";
  let geoCoordUrl =
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppId}`;
  return geoCoordUrl;
}

// Get name, latitude, and longitude for entered city
function getCityLatLon(cityUrl) {
  let cityData = fetch(cityUrl)
    .then((response) => response.json())
    .then((data) => {
      return cityInfo = {
        cityId: data[0].name,
        cityLat: data[0].lat,
        cityLon: data[0].lon
      };
    });

  // Using fetched city data call function for getting city data detail
  cityData.then((cityInfo) => {
    data = getWeatherData(cityInfo);
    return data;
  });
  return;
};

// Use city data (city name, lat, lon) to fetch detailed current and future data
function getWeatherData(cityData) {
  let city = cityData.cityId;
  let lat = cityData.cityLat;
  let lon = cityData.cityLon;
  let weatherAppId = "a77eee0f49abe8e6331cd9b225df2834";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${weatherAppId}`;

  fetch(weatherUrl)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      return (data);
    })
    .then(function (data) {
      getCurrentWeather(data, city);
      getFutureWeather(data, city);
      return;
    })
};

// Get UVI Color based on Index value
function getUviColor(uvi) {
  var uviNum = uvi, color = "";

  //Select correct UV background color based on Index value
  if (uviNum >= 11) {
    color = "violet";
  } else if (uviNum >= 8) {
    color = "red";
  } else if (uviNum >= 6) {
    color = "orange";
  } else if (uviNum >= 3) {
    color = "yellow";
  } else {
    color = "green";
  };

  return (color);
};

// Get current weather data
function getCurrentWeather(data, city) {
  let cityId = city;
  let cityLat = data.lat;
  let cityLon = data.lon;
  let longDate = data.current.dt;
  let d = new Date(longDate * 1000);
  let cDate = d.toDateString(longDate);
  let cTemp = Number.parseInt(data.current.temp);
  let cHumidity = data.current.humidity;
  let cUvi = Number.parseFloat(data.current.uvi).toFixed(2);
  let cUviColor = getUviColor(cUvi);
  let cWindSpeed = Number.parseInt(data.current.wind_speed);
  let cWeatherDesc = data.current.weather[0].description;
  let cWeatherIconId = getWeatherIcon(data.current.weather[0].icon);
  let cTimeZone = data.timezone;

  let cData = { cityId, cityLat, cityLon, cDate, cTemp, cHumidity, cUvi, cUviColor, cWindSpeed, cWeatherDesc, cWeatherIconId, cTimeZone };

  // Call function to populate current day weather cards
  populateCurrCard(cData);

  // Add user entered city to local storage
  addToLocalStorage(cData);
};

// Get future weather data
function getFutureWeather(data, city) {
  let cityId = city;
  let cityLat = data.lat;
  let cityLon = data.lon;
  let dTimeZone = data.timezone;
  let dailyWeather = data.daily;

  for (let i = 1; i < 6; i++) {
    let longDate = dailyWeather[i].dt;
    let d = new Date(longDate * 1000);
    let dDate = d.toDateString(longDate);
    let dTempL = Number.parseInt(dailyWeather[i].temp.min);
    let dTempH = Number.parseInt(dailyWeather[i].temp.max);
    let dHumidity = dailyWeather[i].humidity;
    let dUvi = dailyWeather[i].uvi;
    let dUviColor = getUviColor(dUvi);
    let dWindSpeed = Number.parseInt(dailyWeather[i].wind_speed);
    let dWeatherDesc = dailyWeather[i].weather[0].description;
    let dWeatherIconId = getWeatherIcon(dailyWeather[i].weather[0].icon);

    let fData = { cityId, cityLat, cityLon, dTimeZone, dDate, dTempL, dTempH, dHumidity, dUvi, dUviColor, dWindSpeed, dWeatherDesc, dWeatherIconId };

    // Call function to populate future or 5 days of weather cards
    populateFutureCards(fData);
  }
};

// Get weather icon using the weather API's icon URL and icon ID
function getWeatherIcon(dIconId) {
  let weatherIconUrl = `http://openweathermap.org/img/wn/${dIconId}@2x.png`;
  return weatherIconUrl;
};

// Populate current day weather card
function populateCurrCard(cData) {
  let currDay = document.getElementById("currDayData");

  let resultsCardCurrData = document.createElement("div");
  resultsCardCurrData.setAttribute("id", "currentCard");
  resultsCardCurrData.setAttribute("class", "card small blue-grey darken-1 col s12");
  currDay.appendChild(resultsCardCurrData);

  let resultsCardCurrImg = document.createElement("div");
  resultsCardCurrImg.setAttribute("class", "card-image valign-wrapper");
  resultsCardCurrData.appendChild(resultsCardCurrImg);

  let resultsCurrIconImg = document.createElement("img");
  resultsCurrIconImg.setAttribute("id", "currWeatherIcon");
  resultsCurrIconImg.setAttribute("src", `${cData.cWeatherIconId}`);
  resultsCurrIconImg.setAttribute("alt", `${cData.cWeatherIconDesc}`);
  resultsCardCurrImg.appendChild(resultsCurrIconImg);

  let resultsCurrIconTitle = document.createElement("span");
  resultsCurrIconTitle.setAttribute("id", "currCardTitle");
  resultsCurrIconTitle.setAttribute("class", "card-title black-text left-align");
  resultsCurrIconTitle.textContent = cData.cityId + ", " + cData.cDate;
  resultsCardCurrImg.appendChild(resultsCurrIconTitle);

  let resultsCurrCardContent = document.createElement("div");
  resultsCurrCardContent.setAttribute("class", "card-content white-text left-align");
  resultsCardCurrData.appendChild(resultsCurrCardContent);

  let currDayTemp = document.createElement("p");
  currDayTemp.setAttribute("id", "currTemp");
  currDayTemp.setAttribute("class", "currDayData left-align");
  currDayTemp.textContent = "Temp: " + cData.cTemp + "°F";
  resultsCurrCardContent.appendChild(currDayTemp);

  let currDayHumidity = document.createElement("p");
  currDayHumidity.setAttribute("id", "currHumidity");
  currDayHumidity.setAttribute("class", "currDayData left-align");
  currDayHumidity.textContent = "Humidity: " + cData.cHumidity + "%";
  resultsCurrCardContent.appendChild(currDayHumidity);

  let currDayWindSpeed = document.createElement("p");
  currDayWindSpeed.setAttribute("id", "currWindSpeed");
  currDayWindSpeed.setAttribute("class", "currDayData left-align");
  currDayWindSpeed.textContent = "Wind: " + cData.cWindSpeed + " MPH";
  resultsCurrCardContent.appendChild(currDayWindSpeed);

  let currDayUvi = document.createElement("p");
  currDayUvi.setAttribute("id", "currUvi");
  currDayUvi.setAttribute("class", "currDayData left-align");
  currDayUvi.innerHTML = `UV Index:
  <span style="background-color: ${cData.cUviColor}">${cData.cUvi}</span>
  `;
  resultsCurrCardContent.appendChild(currDayUvi);
};

// Populate future day weather cards
function populateFutureCards(fData) {
  let futureDay = document.getElementById("futureDayData");

  let resultsCardData = document.createElement("div");
  resultsCardData.setAttribute("id", "futureCard");
  resultsCardData.setAttribute("class", "card small blue-grey darken-1 col s12 m3 l2.5");
  futureDay.appendChild(resultsCardData);

  let resultsCardImg = document.createElement("div");
  resultsCardImg.setAttribute("class", "card-image");
  resultsCardData.appendChild(resultsCardImg);

  let resultsIconImg = document.createElement("img");
  resultsIconImg.setAttribute("id", "futureWeatherIcon");
  resultsIconImg.setAttribute("src", `${fData.dWeatherIconId}`);
  resultsIconImg.setAttribute("alt", `${fData.dWeatherDesc}`);
  resultsCardImg.appendChild(resultsIconImg);

  let resultsIconTitle = document.createElement("span");
  resultsIconTitle.setAttribute("id", "futureCardTitle");
  resultsIconTitle.setAttribute("class", "card-title black-text left-align");
  resultsIconTitle.textContent = fData.dDate;
  resultsCardImg.appendChild(resultsIconTitle);

  let resultsCardContent = document.createElement("div");
  resultsCardContent.setAttribute("class", "card-content white-text left-align");
  resultsCardData.appendChild(resultsCardContent);

  let resultsTemp = document.createElement("p");
  resultsTemp.setAttribute("id", "temp");
  resultsTemp.textContent = "Temp: (L) " +
    fData.dTempL + "°F" + " / (H) " + fData.dTempH + "°F";
  resultsCardContent.appendChild(resultsTemp);

  let resultsHumidity = document.createElement("p");
  resultsHumidity.setAttribute("id", "humidity");
  resultsHumidity.textContent = "Humidity: " + fData.dHumidity + "%";
  resultsCardContent.appendChild(resultsHumidity);

  let resultsWind = document.createElement("p");
  resultsWind.setAttribute("id", "wind");
  resultsWind.textContent = "Wind: " + fData.dWindSpeed + " MPH";
  resultsCardContent.appendChild(resultsWind);

  let resultsUvi = document.createElement("p");
  resultsUvi.setAttribute("id", "futureUvi");
  resultsUvi.setAttribute("class", "futureDayData left-align");
  resultsUvi.innerHTML = `UV Index:
  <span style="background-color: ${fData.dUviColor}">${fData.dUvi}</span>
  `;
  resultsCardContent.appendChild(resultsUvi);
};

// Add current city to left nav under Search button
function addCityToHistory(city) {
  let searchedCityEl = document.getElementById("localStorage");
  let searchedCollectionItem = document.createElement("button");
  searchedCollectionItem.setAttribute("type", "button");
  searchedCollectionItem.setAttribute("id", "savedCity");
  searchedCollectionItem.setAttribute("onclick", "searchedCityBtn(event)");
  searchedCollectionItem.setAttribute("class", "collection-item");
  searchedCollectionItem.textContent = `${city} `;
  searchedCityEl.appendChild(searchedCollectionItem);
};

// Check saved city list and do not add city if already existing
function checkSavedCities(city) {
  let savedCitiesEl = document.querySelectorAll("#localStorage");
  savedCitiesEl.forEach((savedCityEl) => {
    let savedCities = savedCityEl.textContent.split(" ");
    if (savedCityEl.textContent === "" ||
      !savedCities.includes(city)) {
      addCityToHistory(city);
    }
  })
}

// Add cities array to local storage, checking to see if data element exists.
// If data is not available, it is created to store searched cities
function addToLocalStorage(cities) {
  if (!JSON.parse(localStorage.getItem("data"))) {
    localStorage.setItem("data", JSON.stringify([cities]));
  } else {
    let arrLocalStorage = JSON.parse(localStorage.getItem("data"));
    if (Array.prototype.includes.call(arguments, cities.cityId)) {
      let isMatch = true;
    } else {
      isMatch = false;
    }

    if (!isMatch) {
      arrLocalStorage.push(cities);
      localStorage.setItem("data", JSON.stringify(arrLocalStorage));
    }
  }
}

// Display current and future weather data for searched/saved city
function searchedCityBtn(e) {
  let city = e.target.innerText;
  clearWeatherData();
  let cityUrl = getGeoCoordUrl(city);
  getCityLatLon(cityUrl);
};

// Display current and future weather data for entered city
function searchBtn() {
  let city = cityNameEl.value.trim();
  clearWeatherData();
  let cityUrl = getGeoCoordUrl(city);
  getCityLatLon(cityUrl);
  checkSavedCities(city);
};

// Call function when Search button is clicked
document.getElementById("get-location").onclick = function () {
  searchBtn();
};

// Call function when enter key is pressed after city is entered in text input field
cityInputEl.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBtn();
  }
});