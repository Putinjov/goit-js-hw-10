import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const name = event.target.value.trim();
  
  if (!name) {
    clearMarkup();
    return;
  }
  
  fetchCountries(name)
    .then(response => {
      const countries = response.data;
      if (countries.length > 10) {
        clearMarkup();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length > 1 && countries.length <= 10) {
        clearMarkup();
        renderCountryList(countries);
      } else if (countries.length === 1) {
        clearMarkup();
        renderCountryInfo(countries[0]);
      } 
    })
    .catch(error => {
      clearMarkup()
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}


function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
      <style>
        .country-list{list-tyle: none;}
        .country-item{display: flex;}
        .country-name{margin-left: 10px; font-weight: 700;}
        </style>
      <li class="country-item">
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag" width=60;>
        <p class="country-name">${country.name.common}</p>
      </li>
      `;
    })
    .join('');

  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = `
  <style>
    .country-flag{width: 100px;}
  </style>
  <div class="country-card">
    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
    <div class="country-details">
      <h2 class="country-name">${country.name.common}</h2>
      <p><span class="country-detail">Capital:</span> ${country.capital}</p>
      <p><span class="country-detail">Population:</span> ${country.population}</p>
      <p><span class="country-detail">Languages:</span> ${Object.values(country.languages).join(', ')}</p>
    </div>
  </div>
  `;

  countryInfo.innerHTML = markup;
}
