let searchHist = [];
const apiKey = "4eb091e7f44c01b98c6dad3589d18b2f";
const searchInputEl= document.querySelector("#search-input");
const searchFormEl = document.querySelector("#search-form");
const forecastContEl = document.querySelector("#forecast-container");
const forecastTitleEl = document.querySelector("#forecast-title");
const searchHistCont = document.querySelector("#history");
const pastCityButtonEl = document.querySelector("#past-city-buttons");
const pastCityEl = document.querySelector("#past-city");
const weatherContEl = document.querySelector("#weather-container")

const saveSearch = () => {
  	localStorage.setItem("searchHist", JSON.stringify(searchHist));
};

const fetchWeather = (city) => {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
	fetch(apiUrl)
	.then(function(response) {
		response.json().then((data) => {
			showWeather(data, city);
		});
	});
};

const showWeather = (weather, searchCity) => {
	//clears old search
	forecastContEl.textContent= "";
	pastCityEl.textContent=searchCity;

	//shows todays weather
	let today = document.createElement("p")
	today.textContent=` ${moment(weather.dt.value).format("MMM DD, YYYY")} `;
	pastCityEl.appendChild(today);

	//weather icon
	const weatherIcon = document.createElement("img")
	weatherIcon.setAttribute("src", `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
	pastCityEl.appendChild(weatherIcon);

	//temperature data
	let tempEl = document.createElement("p");
	tempEl.textContent = `Temperature: ${weather.main.temp} °F`;
	tempEl.classList = "list-group"

	//humidity data
	let humidEl = document.createElement("p");
	humidEl.textContent = `Humidity: ${weather.main.humidity}%`;
	humidEl.classList = "list-group"

	//wind speed data
	let windEl = document.createElement("p");
	windEl.textContent = `Wind Speed: ${weather.wind.speed} MPH`;
	windEl.classList = "list-group"

	// //uv index data
	// let uviEl = document.createElement("p");
	// uviEl.textContent = `UV Index: ${weather.main.uvi}`;
	// uviEl.classList = "list-group"

	weatherContEl.appendChild(tempEl);
	weatherContEl.appendChild(humidEl);
	weatherContEl.appendChild(windEl);

	// let lat = weather.coord.lat;
	// let lon = weather.coord.lon;
	// fetchUvi(lat,lon)
}

// const fetchUvi = (lat,lon) => {
// 	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
// 	fetch(apiUrl)
// 	.then((response) => {
// 		response.json().then((data) => {
// 			showUv(data)
// 		});
// 	});
// }

// const showUv = (index) => {
// 	let uviEl = document.createElement("div");
// 	uviEl.textContent = `UV Index: `
// 	uviEl.classList = "list-group"
// 	uviValue = document.createElement("p")
// 	uviValue.textContent = index.value

// 	if(index.value <=2){
// 		uviValue.classList = "favorable"
// 	}else if(index.value >2 && index.value<=8) {
// 		uviValue.classList = "moderate"
// 	}else if(index.value >8) {
// 		uviValue.classList = "severe"
// 	}
// 	uviEl.appendChild(uviValue);
// 	weatherContEl.appendChild(uviEl);
// }

const fetchForecast = (city) => {
	const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
	fetch(apiUrl)
	.then(function(response){
		response.json().then(function(data){
			renderCurrentWeather(data);
		});
	});
};
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

const renderCurrentWeather = (weather) => {
	forecastContEl.textContent = "";
	forecastTitleEl.textContent = `5-Day Forecast:`;

	const forecast = weather.list;
		for(let i = 0; i < 5; i++) {
		let dailyForecast = forecast[i];
		
		let forecastEl=document.createElement("div");
		forecastEl.classList = "card bg-info m-2";

		let date = document.createElement("h5")
		date.textContent= moment.unix(dailyForecast.dt).format("MMM DD, YYYY");
		date.classList = "card-header text-center"
		forecastEl.appendChild(date);
		
		let weatherIcon = document.createElement("img")
		weatherIcon.classList = "card-body text-center";
		weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
		forecastEl.appendChild(weatherIcon);
		
		let forecastTempEl=document.createElement("span");
		forecastTempEl.classList = "card-body text-center";
		forecastTempEl.textContent = `${dailyForecast.main.temp} °F`;
		forecastEl.appendChild(forecastTempEl);

		let forecastHumEl=document.createElement("span");
		forecastHumEl.classList = "card-body text-center";
		forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
		forecastEl.appendChild(forecastHumEl);     
		forecastContEl.appendChild(forecastEl);
	}

}
const pastSearchHandler = (event) => {
	let city = event.target.getAttribute("data-city")
	if(city) {
		fetchWeather(city);
		fetchForecast(city);
	}
}

const pastSearchHist = (pastSearchHist) => {
	pastSearchHistEl = document.createElement("button");
	pastSearchHistEl.textContent = pastSearchHist;
	pastSearchHistEl.classList = "d-flex btn-light p-2";
	pastSearchHistEl.setAttribute("data-city",pastSearchHist)
	pastSearchHistEl.setAttribute("type", "submit");

	pastCityButtonEl.prepend(pastSearchHistEl);
}

searchFormEl.addEventListener("submit", formSubmit);
pastCityButtonEl.addEventListener("click", pastSearchHandler);
