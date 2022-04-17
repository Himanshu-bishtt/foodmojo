'use strict';

import * as modal from './modal';
import heroView from './views/heroView';
import searchView from './views/searchView';
import htmlView from './views/htmlView';

// if (module.hot) {
//   module.hot.accept();
// }

const controlLocalStorageData = function () {
  modal.loadDataFromLocalStorageOnLoad();
};

const controlHeroView = function () {
  // 1. Rending hero view logo animation on load event
  heroView.renderAnimation();
};

const controlThemeChange = function (theme) {
  // 1. Storing theme in state when change
  modal.loadTheme(theme);
};

const controlThemeOnLoad = function () {
  htmlView.renderSavedTheme(modal.state.theme);
};

const controlSearchResults = async function () {
  try {
    // 1. Getting query value from search view input form
    const query = searchView.getQuery();

    // 2. Loading search results based on query
    await modal.loadSearchResults(query);

    console.log(modal);
  } catch (err) {
    // 3. Error popup on hero view when wrong text is inputted into form
    heroView.renderErrorPopup(err);
  }
};

const controlUserLocation = async function () {
  try {
    // 1. Render spinner on hero view location
    heroView.renderSpinner();

    // 2. Async loading user location and storing in state
    await modal.loadUserLocation();

    // 3. Displaying user exact location on hero view
    heroView.renderUserLocation(modal.state.userLocation.userData.region);

    console.log(modal);
  } catch (err) {
    // 4. Display error popup, if user denied location
    heroView.renderErrorPopup(`${err.message}. Please reset permission`);

    // 5. Display error message on hero view.
    heroView.renderLocationErrorOnCancel();
  }
};

const controlUserLocationOnLoad = function () {
  const region = modal.state.userLocation.userData?.region;
  if (!region) {
    // heroView.renderLocationErrorOnCancel();
    return;
  }
  heroView.renderUserLocation(modal.state.userLocation.userData.region);
};

const init = function () {
  controlLocalStorageData();
  controlHeroView();
  controlThemeOnLoad();
  controlUserLocationOnLoad();
  searchView.addHandlerSearch(controlSearchResults);
  heroView.addHandlerLocation(controlUserLocation);
  htmlView.changeTheme(controlThemeChange);
};

init();
