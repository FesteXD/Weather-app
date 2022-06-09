const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const form = document.querySelector('form');
const weatherResult = document.getElementById('weather-result');
const condition = document.getElementById('condition');
const cityName = document.getElementById('city');
const temp = document.getElementById('temp');
const feelsLikeData = document.getElementById('feels-like-data');
const windData = document.getElementById('wind-data');
const humidityData = document.getElementById('humidity-data');
const slider = document.querySelector('.slider');

let city;
let tempDataImperial;
let feelsLikeDataImperial;
let windDataImperial;
let units = 'metric';

async function convertNameToCords() {
  try {
    let response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=760c1f0fb879d7814a0c107f1028662f`,
      {
        mode: 'cors',
      }
    );
    let getAPIData = await response.json();
    // console.log(getAPIData);
    return {
      lat: getAPIData[0].lat,
      lon: getAPIData[0].lon,
      name: getAPIData[0].name,
    };
  } catch (err) {
    console.log(err);
  }
}

async function searchForCityByCords(city) {
  try {
    let getCords = await convertNameToCords(city);
    let response;

    if (units == 'metric') {
      response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${getCords.lat}&lon=${getCords.lon}&units=metric&appid=760c1f0fb879d7814a0c107f1028662f`,
        {
          mode: 'cors',
        }
      );
    }
    if (units == 'imperial') {
      response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${getCords.lat}&lon=${getCords.lon}&units=imperial&appid=760c1f0fb879d7814a0c107f1028662f`,
        {
          mode: 'cors',
        }
      );
    }

    weatherResult.style.display = 'flex';

    getWeatherAPIData = await response.json();
    return {
      name: getCords.name,
      feels_like: getWeatherAPIData.main.feels_like,
      temp: Math.round(getWeatherAPIData.main.temp),
      wind: getWeatherAPIData.wind.speed,
      humidity: getWeatherAPIData.main.humidity,
      main: getWeatherAPIData.weather[0].main,
      description: getWeatherAPIData.weather[0].description,
    };
  } catch (err) {
    console.log(err);
    alert('City was not found, please try again');
  }
}

async function displayData() {
  let getData = await searchForCityByCords(city);
  condition.innerText = getData.description;
  cityName.innerText = getData.name;
  humidityData.innerText = `${getData.humidity} %`;

  if (units == 'metric') {
    temp.innerText = `${getData.temp} °C`;
    feelsLikeData.innerText = `${getData.feels_like} °C`;
    windData.innerText = `${getData.wind} km/h`;
  }
  if (units == 'imperial') {
    temp.innerText = `${getData.temp} °F`;
    feelsLikeData.innerText = `${getData.feels_like} °F`;
    windData.innerText = `${getData.wind} mph`;
  }
}

form.addEventListener('submit', (e) => {
  if (searchBar.value != '') {
    e.preventDefault();
    city = searchBar.value;
    displayData();
  }
  if (searchBar.value === '') {
    e.preventDefault();
    alert('Please type a city');
  }
});

slider.addEventListener('click', () => {
  if (units == 'metric') {
    units = 'imperial';
    displayData();
  } else {
    units = 'metric';
    displayData();
  }
});
