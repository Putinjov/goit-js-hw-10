import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name) {
  return axios.get(`${BASE_URL}/name/${name}?fields=name,flags,languages,capital,population`);
}

export default fetchCountries;
