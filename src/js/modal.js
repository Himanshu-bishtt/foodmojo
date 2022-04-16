import 'regenerator-runtime';

import { API_URL } from './config';
import { getLocation, getLocationCoords, loadAJAX } from './helper';

export const state = {
  search: {
    query: [],
    results: [],
  },
  userLocation: {
    // userCoords: {},
    // userData: {},
  },
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

export const loadUserLocation = async function () {
  try {
    const geoCoords = await getLocationCoords();
    const { latitude: lat, longitude: lng } = geoCoords.coords;

    // const userCoords = [lat, lng];

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

    // const userData = [country, st, city, timezone, region, address, postal];

    state.userLocation.userData = {
      country,
      st,
      city,
      timezone,
      region,
      address,
      postal,
    };
  } catch (err) {
    state.userLocation.message = err.message;
    throw err;
  }
};
