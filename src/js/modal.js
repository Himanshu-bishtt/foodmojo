import 'regenerator-runtime';

import { API_URL } from './config';
import {
  cronJob,
  getLocation,
  getLocationCoords,
  loadAJAX,
  generateUniqueRandoms,
} from './helper';

export const state = {
  allLoadedContent: [],
  search: {
    query: [],
    results: [],
    recipe: {},
  },
  recipeTabs: ['steak', 'pizza', 'noodles', 'pasta'],
  activeTab: '',
  recipeTabsContent: [],
  userLocation: {},
  recommenedRecipes: [],
  theme: 'light',
};

export const loadTheme = function (th) {
  state.theme = th;
  persistStateToLocalStorage();
};

export const loadRecipe = async function (id) {
  try {
    const result = await loadAJAX(`${API_URL}${id}`);
    state.search.recipe = result.data.recipe;

    persistStateToLocalStorage();
  } catch (err) {
    throw err;
  }
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

    if (state.search.results.length !== 0) {
      state.search.results = [];
      state.search.results.push({ query, results, recipes: data.recipes });
    } else {
      state.search.results.push({ query, results, recipes: data.recipes });
    }

    state.allLoadedContent.push({ query, results, recipes: data.recipes });

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
      // Case 1: No recommended recipes are in the state

      // 1. Loading pizza recipes in recommendation by default
      const recipes = await loadAJAX(
        `${API_URL}?search=${state.search.query.at(0) || 'pizza'}`
      );

      // 2. Generating 4 unique random values less than number of results (0 < x < totalResults), which act as indexs to retrieve that index
      const { results: totalResults } = recipes;
      const uniqueValues = generateUniqueRandoms(totalResults);

      // 3. Creating side effects by pushing the recipes into recommenedRecipes state.
      uniqueValues.forEach(value => {
        state.recommenedRecipes.push(recipes.data.recipes.at(value));
      });
    } else if (cronJob()) {
      // Case 2: New day begin, so load new recipes

      // 1. Loading query recipes which are stored in query state at random or pizza if no query is stored.
      const recipes = await loadAJAX(
        `${API_URL}?search=${
          state.search.query.at(
            generateUniqueRandoms(state.search.query.length).at(0)
          ) || 'pizza'
        }`
      );

      // 2. Generating 4 unique random values less than number of results (0 < x < totalResults), which act as indexs to retrieve that index
      const { results: totalResults } = recipes;
      const uniqueValues = generateUniqueRandoms(totalResults);

      // 3. Emptying recommened recipes array before loading new recipes.
      state.recommenedRecipes = [];

      // 4. Creating side effects by pushing the recipes into recommenedRecipes state.
      uniqueValues.forEach(value => {
        state.recommenedRecipes.push(recipes.data.recipes.at(value));
      });
    }

    // 5. Persisting data to local storage
    persistStateToLocalStorage();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadTabsRequiredRecipes = function (query) {
  // 0. If tab recipe is already loaded, then return
  if (state.recipeTabsContent.find(item => item.query === query)) {
    state.activeTab = query;
    persistStateToLocalStorage();
    return;
  }

  state.activeTab = query;

  // 1. searching for results which matches with query param
  const matchingRecipeResults = state.allLoadedContent.find(
    recipe => recipe.query === query
  );

  const { results: totalResults } = matchingRecipeResults;

  const uniqueValues = generateUniqueRandoms(totalResults, 8);
  // const uniqueValues = Array.from({ length: 8 }, (_, i) => i + 1);

  // 2. Generating required recipes which are array elements from 1 to 8
  const requiredRecipes = uniqueValues.map(value =>
    matchingRecipeResults.recipes.at(value)
  );

  state.recipeTabsContent.push({ query, requiredRecipes });

  persistStateToLocalStorage();
};

export const loadDataFromLocalStorageOnLoad = function () {
  // 1. Loading state data from local storage
  const data = JSON.parse(localStorage.getItem('state'));

  // 2. If no data is present, then return
  if (!data) return;

  // 3. Loading data into state
  state.allLoadedContent = data.allLoadedContent;
  state.search = data.search;
  state.activeTab = data.activeTab;
  state.recipeTabsContent = data.recipeTabsContent;
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
