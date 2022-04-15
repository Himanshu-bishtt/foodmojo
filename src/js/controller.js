'use strict';

import * as modal from './modal';
import heroView from './views/heroView';
import searchView from './views/searchView';

import { MODAL_CLOSE_SEC } from './config';

// if (module.hot) {
//   module.hot.accept();
// }

const controlHeroView = function () {
  heroView.renderAnimation();
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    await modal.loadSearchResults(query);

    console.log(modal);
  } catch (err) {
    heroView.renderErrorPopup(err);
  }
};

const controlUserLocation = async function () {
  try {
    heroView.renderSpinner();

    await modal.loadUserGeolocation();

    heroView.renderUserLocation();
  } catch (err) {
    heroView.renderErrorPopup(`${err.message}. Please reset permission`);
    heroView.renderLocationErrorOnCancel();
  }
};

const init = function () {
  controlHeroView();
  searchView.addHandlerSearch(controlSearchResults);
  heroView.addHandlerLocation(controlUserLocation);
};

init();
