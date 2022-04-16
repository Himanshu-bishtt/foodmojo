import 'regenerator-runtime';

import { API_URL } from './config';
import { getLocation, getLocationCoords, loadAJAX } from './helper';

export const state = {
  search: {
    query: [],
    results: [],
  },
  userLocation: {},
  recommenedRecipes: [],
};

export const loadSearchResults = async function (query) {
  try {
    const results = await loadAJAX(`${API_URL}?search=${query}`);
    state.search.query.push(query);
    state.search.results.push(results);

    persistStateToLocalStorage();
  } catch (err) {
    throw err;
  }
};

export const loadUserLocation = async function () {
  try {
    const geoCoords = await getLocationCoords();
    const { latitude: lat, longitude: lng } = geoCoords.coords;

    state.userLocation.userCoords = { lat, lng };

    const geoData = await getLocation(lat, lng);

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
    persistStateToLocalStorage();
  } catch (err) {
    state.userLocation.message = err.message;
    persistStateToLocalStorage();
    throw err;
  }
};

// export const loadRecommenedRecipes = async function () {
//   try {
//     if (
//       state.search.query.length === 0 &&
//       state.recommenedRecipes.length === 0 &&
//       state.search.results.length === 0
//     ) {
//       // load 1 recipe each (pizza, noodles, pasta, burger)
//       const recipes = await Promise.all([
//         loadAJAX(`${API_URL}?search=pizza`),
//         loadAJAX(`${API_URL}?search=noodles`),
//         loadAJAX(`${API_URL}?search=pasta`),
//         loadAJAX(`${API_URL}?search=burger`),
//       ]);

//       console.log(recipes);
//     }

//     if (state.search.query.length !== 0) {
//       const recipes = Promise.all([]);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

const persistStateToLocalStorage = function () {
  localStorage.setItem('state', JSON.stringify(state));
};

const removeStateFromLocalStorage = function () {
  localStorage.removeItem('state');
};
