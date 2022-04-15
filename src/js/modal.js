import 'regenerator-runtime';

import { API_URL } from './config';
import { loadAJAX } from './helper';

export const state = {
  search: {
    query: [],
    results: [],
  },
  userLocation: {},
};

export const loadSearchResults = async function (query) {
  try {
    const results = await loadAJAX(`${API_URL}?search=${query}`);
    state.search.query.push(query);
    state.search.results = results;
  } catch (err) {
    throw err;
  }
};

export const loadUserGeolocation = async function () {
  try {
    const data = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    state.userLocation.lat = data.coords.latitude;
    state.userLocation.lng = data.coords.longitude;
  } catch (err) {
    state.userLocation.message = err.message;
  }

  console.log(state.userLocation);

  // navigator.geolocation.getCurrentPosition(
  //   success => {
  //     state.userLocation.lat = success.coords.latitude;
  //     state.userLocation.lng = success.coords.longitude;
  //   },
  //   error => {
  //     state.userLocation.message = error.message;
  //   }
  // );
};
