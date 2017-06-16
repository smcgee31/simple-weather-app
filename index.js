'use strict';

const config = {
  BASE_URL: 'https://api.apixu.com/v1',
  SECRET_KEY: '1c8abf4fe2fa433581930127172604'
};

const submit = document.querySelector('#locationInput');
const weatherDisplay = document.querySelector('#weatherDisplay');
let coords;

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

submit.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.key === 'Enter') {
    runWeather(coords);
  }
});

function runWeather() {
  let radios = document.querySelectorAll('input[ type = "radio" ]:checked');
  if (radios.length < 1) {
    console.error('Temperature scale not selected');
    alert('Please select a temperature scale');
    return;
  }

  let scaleCheck = document.querySelector('input[ name = "scaleCheck" ]:checked').value;
  let location = document.getElementById('locationInput').value;

  return getCurrentWeather(location || coords)
  .then((response) => {
    return handleResponse(response, scaleCheck)
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

function handleResponse(response, scaleCheck) {
    results.city          = `${response.data.location.name}`;
    results.state         = `${response.data.location.region}`;
    results.updateTime    = `${response.data.current.last_updated}`;
    results.condition     = `${response.data.current.condition.text}`;
    results.currTemp      = `${response.data.current.temp_f}`;
    results.feelsLikeTemp = `${response.data.current.feelslike_f}`;
    results.windDir       = `${response.data.current.wind_dir}`;
    results.windSpeed     = `${response.data.current.wind_mph} mph`;
    results.url           = `https:${response.data.current.condition.icon}`;
    
  if (scaleCheck === 'celsius') {
    results.currTemp      = `${response.data.current.temp_c}`;
    results.feelsLikeTemp = `${response.data.current.feelslike_c}`;
    results.windSpeed     = `${response.data.current.wind_kph} kph`;
  }

  return results;
}

function handleError(response) {
  console.error('ERROR:', response);
}

function displayWeather(results) {
  function html() {
    return `
      <div class="card card-2">
        <div id="location">
          <p class="cityState">${results.city}, ${results.state}</p>
          <p class="updateTime">Last updated: ${results.updateTime}</p>
        </div>
        <div id="temp">
          <img src="${results.url}" alt="weather_image">
          <p class="generalCondition">${results.condition}</p>
          <p class="currTemp">${results.currTemp}<span class="degMarker">&deg;F</span></p>
          <p class="feelsLikeTemp">(feels like ${results.feelsLikeTemp}&deg;)</p>
        </div>
        <div id="wind">
          <p class="windDir">Winds from the ${results.windDir}</p>
          <p class="windSpeed">at ${results.windSpeed}</p>
        </div>
      </div>
    `;
  }

  return weatherDisplay.innerHTML = html();
}
