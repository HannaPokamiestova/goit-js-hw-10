import "./css/styles.css";
import debounce from "lodash.debounce";
import Notiflix from "notiflix";
import { fetchCountries } from "./js/fetch-counties";

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
searchBox.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

const countryList = document.querySelector(".js-country-list");
const countryInfo = document.querySelector(".js-country-info");

let searchCountry = "";

function onInput() {
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
  searchCountry = searchBox.value.trim();

  if (!searchCountry.length) {
    return;
  }

  fetchCountries(searchCountry)
    .then((countries) => {
      if (countries.length >= 10) {
        Notiflix.Notify.info(
          "Too many matches found. Please enter a more specific name."
        );

        return;
      }

      if (countries.length >= 2) {
        printCountryList(countries);

        return;
      }

      printCountry(countries[0]);
    })
    .catch(() => {
      Notiflix.Notify.failure("Oops, there is no country with that name");
    });
}

function printCountryList(countries) {
  const countryListHTML = countries
    .map(
      (country) => `<li>
<img src="${country.flags.svg}" alt="${country.flags.alt}" width="40">
<span>${country.name.official}</span>
</li>`
    )
    .join("");
  countryList.innerHTML = countryListHTML;
}

function printCountry(country) {
  const countryHTML = `
    <div class="country-info__header">
        <img src="${country.flags.svg}" alt="${country.flags.alt}" width="40">
        <h1> ${country.name.official}</h1>
    </div>
    <div class="country-info__content">
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages).join(
          ","
        )}</p>
    </div>`;
  countryInfo.innerHTML = countryHTML;
}
