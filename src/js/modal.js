import 'regenerator-runtime';

import { API_URL, MODAL_CLOSE_SEC } from './config';
import { cronJob, getLocation, getLocationCoords, loadAJAX } from './helper';

export const state = {
  search: {
    query: [],
    results: [],
  },
  recipeTabs: ['steak', 'pizza', 'noodles', 'pasta'],
  userLocation: {},
  recommenedRecipes: [],
  theme: 'light',
};

export const loadTheme = function (th) {
  state.theme = th;
  persistStateToLocalStorage();
};

export const loadQueryResults = async function (query) {
  try {
    // 1. If searched query is already in state, then return
    if (state.search.query.includes(query)) return;

    // 2. Getting search query data
    const result = await loadAJAX(`${API_URL}?search=${query}`);

    // 3. Pushing searched query into query state
    state.search.query.push(query);

    // 4. Pushing searched results into results state
    const { results, data } = result;
    state.search.results.push({ query, results, data });

    // 5. Storing state after every search into Local Storage
    persistStateToLocalStorage();
  } catch (err) {
    throw err;
  }
};

export const loadUserLocation = async function () {
  try {
    // 1. Getting users coordinates
    const geoCoords = await getLocationCoords();

    // 2. Storing user coordinates in userlocation state
    const { latitude: lat, longitude: lng } = geoCoords.coords;
    state.userLocation.userCoords = { lat, lng };

    // 3. Getting user location data by reverse geocoding
    const geoData = await getLocation(lat, lng);

    // 4. Storing user location data to userDate state
    const {
      country,
      state: st,
      city,
      timezone,
      region,
      staadress: address,
      postal,
    } = geoData;

    state.userLocation.userData = {
      country,
      st,
      city,
      timezone,
      region,
      address,
      postal,
    };

    // 5. Storing user location data into Local Storage
    persistStateToLocalStorage();
  } catch (err) {
    // 6. Storing location error also to userLocation state
    state.userLocation.message = err.message;

    // 7. Updating state into Local Storage
    persistStateToLocalStorage();
    throw err;
  }
};

export const loadRecommenedRecipes = async function () {
  try {
    if (state.recommenedRecipes.length === 0) {
      const recipes = await loadAJAX(
        `${API_URL}?search=${state.search.query.at(0) || 'pizza'}`
      );

      const { results: totalResults } = recipes;

      const uniqueValues = generateUniqueRandoms(totalResults);

      console.log(uniqueValues);
      uniqueValues.forEach(value => {
        state.recommenedRecipes.push(recipes.data.recipes.at(value));
      });
    } else if (cronJob()) {
      const recipes = await loadAJAX(
        `${API_URL}?search=${
          state.search.query.at(
            generateUniqueRandoms(state.search.query.length).at(0)
          ) || 'pizza'
        }`
      );

      const { results: totalResults } = recipes;

      const uniqueValues = generateUniqueRandoms(totalResults);

      state.recommenedRecipes = [];

      uniqueValues.forEach(value => {
        state.recommenedRecipes.push(recipes.data.recipes.at(value));
      });
    }

    persistStateToLocalStorage();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const generateRequiredRecipes = function (query) {
  const matchingRecipeResults = state.search.results.find(
    recipe => recipe.query === query
  );

  const { results: totalResults } = matchingRecipeResults;

  // const uniqueValues = generateUniqueRandoms(totalResults, 8);
  const uniqueValues = Array.from({ length: 8 }, (_, i) => i + 1);

  const requiredRecipes = uniqueValues.map(value =>
    matchingRecipeResults.data.recipes.at(value)
  );

  return requiredRecipes;
};

export const loadDataFromLocalStorageOnLoad = function () {
  // 1. Loading state data from local storage
  const data = JSON.parse(localStorage.getItem('state'));

  // 2. If no data is present, then return
  if (!data) return;

  // 3. Loading data into state
  state.search = data.search;
  state.userLocation = data.userLocation;
  state.recommenedRecipes = data.recommenedRecipes;
  state.theme = data.theme;
};

const persistStateToLocalStorage = function () {
  // 1. Storing entire state into Local Storage
  localStorage.setItem('state', JSON.stringify(state));
};

const removeStateFromLocalStorage = function () {
  localStorage.removeItem('state');
};

const randomNumberGenerator = function (value) {
  return Math.floor(Math.random() * value);
};

const generateUniqueRandoms = function (value, total = 4) {
  const randomValues = [];
  for (let i = 0; i < value; ++i) {
    randomValues.push(randomNumberGenerator(value));
  }
  return [...new Set(randomValues)].slice(0, total);
};
