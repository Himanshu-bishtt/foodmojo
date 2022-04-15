import 'regenerator-runtime';

import { API_URL } from './config';
import { loadAJAX } from './helper';

export const state = {
  search: {
    query: [],
    results: [],
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
