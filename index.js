'use strict';

const config = {
  BASE_URL: 'http://api.apixu.com/v1',
  SECRET_KEY: '1c8abf4fe2fa433581930127172604'
};

const weatherDisplay = document.querySelector('#weatherDisplay');
const results = {
    city: ''
  , state: ''
  , updateTime: ''
  , url: ''
  , condition: ''
  , currTemp: ''
  , feelsLikeTemp: ''
  , windDir: ''
  , windSpeed: ''
}

function runWeather() {
  let radios = document.querySelectorAll('input[ type = "radio" ]:checked');
  if (radios.length < 1) {
    console.error('Temperature scale not selected');
    alert('Please select a temperature scale');
    return;
  }

  let scaleCheck = document.querySelector('input[ name = "scaleCheck" ]:checked').value;
  let zipcode = document.getElementById('zipcodeInput').value;

  return getCurrentWeather(zipcode)
  .then((response) => {
    return handleResponse(response, scaleCheck)
  })
  .then((results) => {
    return displayWeather(results);
  })
  .catch((error) => {
    console.error('error:', error);
  });
}

function getCurrentWeather(zipcode) {
  return axios({
    method: 'GET',
    url: `${config.BASE_URL}/current.json?key=${config.SECRET_KEY}&q=${zipcode}`
  });
}

function handleResponse(response, scaleCheck) {
  if (scaleCheck === 'celsius') {
      results.city = `${response.data.location.name}`
    , results.state = `${response.data.location.region}`
    , results.updateTime = `${response.data.current.last_updated}`
    , results.url = `http:${response.data.current.condition.icon}`
    , results.condition = `${response.data.current.condition.text}`
    , results.currTemp = `${response.data.current.temp_c}`
    , results.feelsLikeTemp = `${response.data.current.feelslike_c}`
    , results.windDir = `${response.data.current.wind_dir}`
    , results.windSpeed = `${response.data.current.wind_kph}kph`
  } else {
      results.city = `${response.data.location.name}`
    , results.state = `${response.data.location.region}`
    , results.updateTime = `${response.data.current.last_updated}`
    , results.url = `http:${response.data.current.condition.icon}`
    , results.condition = `${response.data.current.condition.text}`
    , results.currTemp = `${response.data.current.temp_f}`
    , results.feelsLikeTemp = `${response.data.current.feelslike_f}`
    , results.windDir = `${response.data.current.wind_dir}`
    , results.windSpeed = `${response.data.current.wind_mph}mph`
  }
  return results;
}

function displayWeather(results) {
  function html() {
    return `
      <div id="weatherDisplay">
        <div id="location">
          <h3 class="cityState">${results.city}, ${results.state}</h3>
          <p class="updateTime">${results.updateTime}</p>
        </div>
        <div id="temp">
          <img src="${results.url}" alt="weather_image">
          <p class="generalCondition">${results.condition}</p>
          <p class="currTemp">${results.currTemp}</p>
          <p class="feelsLikeTemp">${results.feelsLikeTemp}</p>
        </div>
        <div id="wind">
          <p class="windDir">${results.windDir}</p>
          <p class="windSpeed">${results.windSpeed}</p>
        </div>
      </div>
    `;
  }

  weatherDisplay.innerHTML = html();
}
