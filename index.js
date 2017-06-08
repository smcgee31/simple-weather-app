'use strict';

const config = {
  BASE_URL: 'http://api.apixu.com/v1',
  SECRET_KEY: '1c8abf4fe2fa433581930127172604'
};

const weatherDisplay = document.querySelector('#weatherDisplay');
// Need a check to see whether the user wants C or F degrees

const displayCurrentWeather = () => {
  return getCurrentWeather()
  .then((data) => {
    if (degreesCheck === 'Celsius') {
      return map.celsius(data);
    }
      return map.farenheit(data);
  })
  .then((map) => {
    // do something with the mapped data
  });
}

const getCurrentWeather = () => {
  let zipcode = document.getElementById('zipcodeInput').value;
  return axios({
    method: 'GET',
    url: `${config.BASE_URL}/current.json?key=${config.SECRET_KEY}&q=${zipcode}`
  });
};

const icon = (url) => {
  return axios({
    method: 'GET',
    url: `http:${url}`
  });
}

const handleResponse = (response) => {
  console.log(response.data);
  const current = response.data.current;
  const condition = current.condition;
  const location = response.data.location;
  const url = condition.icon;

  return icon(url)
    .then()

};

const map = (data) => {
  let farenheit = {
      city: ''
    , state: ''
    , last_updated: ''
    , condition: ''
    , currentTemp: ''
    , feelsLike: ''
    , windDirection: ''
    , windSpeed: ''
  };


}

const html_farenheit = () => {
  return `
    <div id="weatherDisplay">
      <div id="location">
        <h3 class="cityState">${location.name}, ${location.region}</h3>
        <p class="updateTime">${current.last_updated}</p>
      </div>
      <div id="temp">
        <img src="http:${condition.icon}" alt="weather_image">
        <p class="generalCondition">${condition.text}</p>
        <p class="currTemp">${current.temp_f}</p>
        <p class="feelsLikeTemp">${current.feelslike_f}</p>
      </div>
      <div id="wind">
        <p class="windDir">${current.wind_dir}</p>
        <p class="windSpeed">${current.wind_mph}</p>
      </div>
    </div>
  `
}

  weatherDisplay.innerHTML = html_farenheit;

const handleError = (error) => {
  console.error('Error occurred: ', error)
};