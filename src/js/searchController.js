'use strict';

import 'core-js/stable';

import * as modal from './modal';
import heroView from './views/heroView';
import htmlView from './views/htmlView';
import searchView from './views/searchView';
import paginationView from './views/paginationView';
import searchPageView from './views/searchPageView';

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

const controlSearchPageResults = async function () {
  try {
    searchPageView.renderSpinner();

    const query = new URL(window.location.href).searchParams.get('query');

    await modal.loadQueryResults(query);

    const queryResults = modal.state.allLoadedContent.find(
      results => results.query === query
    );

    searchPageView.renderPageTitle(queryResults);

    searchPageView.renderSearchInfo(queryResults);

    const requiredRecipes = await modal.loadSearchResultsPerPage(query);

    console.log(requiredRecipes);

    searchPageView.renderResults(requiredRecipes);

    paginationView.renderButtons(modal.state.search, queryResults.recipes);

    // history.pushState(null, '', `search.html?query=${query}&page=1`);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = async function (pageNum) {
  const query = new URL(window.location.href).searchParams.get('query');

  const queryResults = modal.state.allLoadedContent.find(
    results => results.query === query
  );

  // htmlView.scrollToTop();
  searchPageView.scrollIntoSection();

  searchPageView.renderResults(
    await modal.loadSearchResultsPerPage(query, pageNum)
  );

  paginationView.renderButtons(modal.state.search, queryResults.recipes);

  history.pushState(null, '', `search.html?query=${query}&page=${pageNum}`);
};

const init = async function () {
  controlLocalStorageData();
  controlUserNetworkStatus();
  controlHeroView();
  controlThemeOnLoad();
  controlUserLocationOnLoad();
  controlSearchPageResults();

  htmlView.changeTheme(controlThemeChange);
  htmlView.clearAppData();
  heroView.addHandlerLocation(controlUserLocation);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  // test
  // console.log(await modal.loadSearchResultsPerPage('pineapple', 1));
  // console.log(await modal.loadSearchResultsPerPage('pineapple', 2));
};

init();
