let searchHist = [];
const apiKey = "4eb091e7f44c01b98c6dad3589d18b2f";
var searchInputEl= document.querySelector("#search-input");
var searchFormEl = document.querySelector("#search-form");
var forecastContEl = document.querySelector("#forecast-container");
var forecastTitleEl = document.querySelector("#forecast-title");
var searchHistCont = document.querySelector("#history");
var pastCityButtonEl = document.querySelector("#past-city-button")
var weatherContEl = document.querySelector("#weather-container")

const formSubmit = (event) => {
  event.preventDefault();
  let city = searchInputEl.value.trim();
  if(city) {
      fetchWeather(city);
      fetchForecast(city);
      searchHist.unshift({city});
      searchInputEl.value = "";
  } else{
      alert("Please enter a city!");
  }
  saveSearch();
  pastSearchHist(city);
}

const saveSearch = () => {
  localStorage.setItem("searchHist", JSON.stringify(searchHist));
};

const fetchWeather = (city) => {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  fetch(apiUrl)
  .then(function(response){
      response.json().then(function(data) {
          showWeather(data, city);
      });
  });
};

const showWeather = (weather, searchCity) => {
 //clears old search
 forecastContEl.textContent= "";
 citySearchInputEl.textContent=searchCity;

 //shows todays weather
 var today = document.createElement("p")
 today.textContent=` ${moment(weather.dt.value).format("M/D/YYYY")} `;
 citySearchInputEl.appendChild(today);

 //weather icon
 var weatherIcon = document.createElement("img")
 weatherIcon.setAttribute("src", `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
 citySearchInputEl.appendChild(weatherIcon);

 //temperature data
 var tempEl = document.createElement("p");
 tempEl.textContent = `Temperature: ${weather.main.temp} °F`;
 tempEl.classList = "list-group-item"

 //humidity data
 var humidEl = document.createElement("p");
 humidEl.textContent = `Humidity: ${weather.main.humidity}%`;
 humidEl.classList = "list-group-item"

 //wind speed data
 var windSpeedEl = document.createElement("p");
 windSpeedEl.textContent = `Wind Speed: ${weather.wind.speed} MPH`;
 windSpeedEl.classList = "list-group-item"

 weatherContEl.appendChild(temperatureEl);
 weatherContEl.appendChild(humidityEl);
 weatherContEl.appendChild(windSpeedEl);

 var lat = weather.coord.lat;
 var lon = weather.coord.lon;
 fetchUvi(lat,lon)
}

const fetchUvi = (lat,lon) => {
  var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&long=${lon}`
  fetch(apiUrl)
  .then(function(response) {
      response.json().then(function(data){
          showUv(data)
      });
  });
}

const showUv = (index) => {
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = `UV Index: `
  uvIndexEl.classList = "list-group-item"

  uvIndexValue = document.createElement("p")
  uvIndexValue.textContent = index.value

  if(index.value <=2){
    uvIndexValue.classList = "favorable"
  }else if(index.value >2 && index.value<=8) {
    uvIndexValue.classList = "moderate"
  }else if(index.value >8) {
    uvIndexValue.classList = "severe"
  }
  uvIndexEl.appendChild(uvIndexValue);

  //append index to current weather
  weatherContEl.appendChild(uvIndexEl);
}

const fetchForecast = (city) => {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiUrl)
  .then(function(response){
      response.json().then(function(data){
         renderCurrentWeather(data);
      });
  });
};

const renderCurrentWeather = (weather) => {
  forecastContEl.textContent = "";
  forecastTitleEl.textContent = `5-Day Forecast:`;

  var forecast = weather.list;
      for(var i = 0; i < forecast.length; i++) {
     var dailyForecast = forecast[i];
      
     var forecastEl=document.createElement("div");
     forecastEl.classList = "card bg-primary text-light m-2";

     var date = document.createElement("h5")
     date.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
     date.classList = "card-header text-center"
     forecastEl.appendChild(date);
     
     var weatherIcon = document.createElement("img")
     weatherIcon.classList = "card-body text-center";
     weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
     forecastEl.appendChild(weatherIcon);
    
     var forecastTempEl=document.createElement("span");
     forecastTempEl.classList = "card-body text-center";
     forecastTempEl.textContent = `${dailyForecast.main.temp} °F`;
      forecastEl.appendChild(forecastTempEl);

     const forecastHumEl=document.createElement("span");
     forecastHumEl.classList = "card-body text-center";
     forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
     forecastEl.appendChild(forecastHumEl);     
      forecastContEl.appendChild(forecastEl);
  }

}

const pastSearchHist = (pastSearchHist) => {
  pastSearchHistEl = document.createElement("button");
  pastSearchHistEl.textContent = pastSearchHist;
  pastSearchHistEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchHistEl.setAttribute("data-city",pastSearchHist)
  pastSearchHistEl.setAttribute("type", "submit");

  pastCityButtonEl.prepend(pastSearchHistEl);
}


const pastSearchHandler = (event) => {
  var city = event.target.getAttribute("data-city")
  if(city) {
      fetchWeather(city);
      fetchForecast(city);
  }
}

searchFormEl.addEventListener("submit", formSubmit);
pastCityButtonEl.addEventListener("click", pastSearchHandler);
