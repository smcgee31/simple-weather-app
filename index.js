'use strict';

const config = {
  BASE_URL: 'http://api.apixu.com/v1',
  SECRET_KEY: '1c8abf4fe2fa433581930127172604'
};

const foo = '84058';

const getCurrentWeather = () => {
  return axios({
    method: 'GET',
    url: `${config.BASE_URL}/current.json?key=${config.SECRET_KEY}&q=${foo}`
  })
  .then((response) => {
    return handleResponse(response);
  })
  .catch(handleError)
};

const handleResponse = (response) => {
  const data = response.data;
  console.log(data);
};

const handleError = (error) => {
  console.error('Error occurred: ', error)
};