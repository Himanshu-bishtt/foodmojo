'use strict';

import 'core-js/stable';

import * as modal from './modal';
import heroView from './views/heroView';
import htmlView from './views/htmlView';
import searchView from './views/searchView';
import recipePageView from './views/recipePageView';

const controlLocalStorageData = function () {
  modal.loadDataFromLocalStorageOnLoad();
};

const controlUserNetworkStatus = function () {
  htmlView.renderErrorOnOffline();
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
  // 1. Retreving region's from userLocation in modal
  const region = modal.state.userLocation.userData?.region;

  // 2. If region is undefined means user has reject the GPS request
  if (!region) {
    return;
  }

  // 3. Else render user's region location on hero view
  heroView.renderUserLocation(modal.state.userLocation.userData.region);
};

const controlSearchResults = async function () {
  try {
    // 1. Getting query value from search view input form
    const query = searchView.getQuery();

    // 2. Loading search results based on query
    await modal.loadQueryResults(query);

    window.location.href = `./search.html?query=${query}`;
  } catch (err) {
    // 3. Error popup on hero view when wrong text is inputted into form
    heroView.renderErrorPopup(err);
  }
};

const controlRecipePage = async function () {
  try {
    const url = window.location.href;
    const url_str = new URL(url);

    const id = url_str.searchParams.get('id');
    if (!id) return;

    recipePageView.renderSpinner();

    await modal.loadRecipe(id);

    recipePageView.renderRecipe(modal.state.search.recipe);
  } catch (err) {
    recipePageView.renderError();
  }
};

const init = function () {
  controlLocalStorageData();
  controlUserNetworkStatus();
  controlHeroView();
  controlThemeOnLoad();
  controlUserLocationOnLoad();
  controlRecipePage();

  htmlView.changeTheme(controlThemeChange);
  heroView.addHandlerLocation(controlUserLocation);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
