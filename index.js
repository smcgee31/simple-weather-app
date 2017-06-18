'use strict';

const config = {
  BASE_URL: 'https://api.apixu.com/v1',
  SECRET_KEY: '1c8abf4fe2fa433581930127172604'
};

let coords;
const submit = document.querySelector('#locationInput');
const weatherDisplay_f = document.querySelector('#weatherDisplay_f');
const weatherDisplay_c = document.querySelector('#weatherDisplay_c');
const results = {
    city:          ''
  , state:         ''
  , updateTime:    ''
  , url:           ''
  , condition:     ''
  , currTemp:      ''
  , feelsLikeTemp: ''
  , windDir:       ''
  , windSpeed:     ''
}

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(a)  {
    if(a.latitude) {
      coords = `${a.latitude}, ${a.longitude}`;
      runWeather(coords);
    }

    if (a.address) {
      coords = `${a.postalCode}`;
      runWeather(coords);
    }

    if (a.coords) {
      coords = `${a.coords.latitude}, ${a.coords.longitude}`;
      runWeather(coords);
    }
  }); 
}

submit.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.key === 'Enter') {
    runWeather(coords);
  }
});

function toggle() {
  document.querySelector('#flip-toggle').classList.toggle('hover');
}

function runWeather() {
  let radios = document.querySelectorAll('input[ type = "radio" ]:checked');
  if (radios.length < 1) {
    console.error('Temperature scale not selected');
    alert('Please select a temperature scale');
    return;
  }

  let location = document.getElementById('locationInput').value;

  return getCurrentWeather(location || coords)
  .then((response) => {
    return mapCurrent(response)
  })
  .then((results) => {
    return displayWeather(results);
  })
  .catch((error) => {
    swal('Oops...',
    `${error.response.data.error.message} Invalid location.`,
    'error');
  });
}

function getCurrentWeather(location) {
  return axios({
    method: 'GET',
    url: `${config.BASE_URL}/current.json?key=${config.SECRET_KEY}&q=${location}`
  });
}

function mapCurrent(response) {
    results.city        = `${response.data.location.name}`;
    results.state       = `${response.data.location.region}`;
    results.updateTime  = `${response.data.current.last_updated}`;
    results.condition   = `${response.data.current.condition.text}`;
    results.currTemp_f  = `${response.data.current.temp_f}`;
    results.currTemp_c  = `${response.data.current.temp_c}`;
    results.feelslike_f = `${response.data.current.feelslike_f}`;
    results.feelslike_c = `${response.data.current.feelslike_c}`;
    results.windDir     = `${response.data.current.wind_dir}`;
    results.wind_mph    = `${response.data.current.wind_mph}`;
    results.wind_kph    = `${response.data.current.wind_kph}`;
    results.url         = `https:${response.data.current.condition.icon}`;

  return results;
}

function displayWeather(results) {

  weatherDisplay_f.innerHTML = `
    <div class="card">
      <div class="location">
        <p class="cityState">${results.city}, ${results.state}</p>
        <p class="updateTime">Last updated: ${results.updateTime}</p>
      </div>
      <div class="temp">
        <img src="${results.url}" alt="weather_image">
        <p class="generalCondition">${results.condition}</p>
        <p class="currTemp">${results.currTemp_f}<span class="degMarker">&deg;F</span></p>
        <p class="feelsLikeTemp">(feels like ${results.feelslike_f}&deg;)</p>
      </div>
      <div class="wind">
        <p class="windDir">Winds from the ${results.windDir}</p>
        <p class="windSpeed">at ${results.wind_mph} mph</p>
      </div>
    </div>
  `;

  weatherDisplay_c.innerHTML = `
    <div class="card">
      <div class="location">
        <p class="cityState">${results.city}, ${results.state}</p>
        <p class="updateTime">Last updated: ${results.updateTime}</p>
      </div>
      <div class="temp">
        <img src="${results.url}" alt="weather_image">
        <p class="generalCondition">${results.condition}</p>
        <p class="currTemp">${results.currTemp_c}<span class="degMarker">&deg;C</span></p>
        <p class="feelsLikeTemp">(feels like ${results.feelslike_c}&deg;)</p>
      </div>
      <div class="wind">
        <p class="windDir">Winds from the ${results.windDir}</p>
        <p class="windSpeed">at ${results.wind_kph} kph</p>
      </div>
    </div>
  `;

  return results;
}
