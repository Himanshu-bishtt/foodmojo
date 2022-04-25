'use strict';

import 'core-js/stable';

import * as modal from './modal';
import heroView from './views/heroView';
import searchView from './views/searchView';
import htmlView from './views/htmlView';
import galleryView from './views/galleryView';
import recipeSectionView from './views/recipeSectionView';
import { cronJob } from './helper';

// if (module.hot) {
//   module.hot.accept();
// }
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

    window.location.href = `search.html?query=${query}`;
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

const controlRecommendedRecipes = async function () {
  try {
    // 1. Rendering spinner
    galleryView.renderSpinner();

    // 2. Loading recommended recipes and storing in state
    await modal.loadRecommenedRecipes();

    // 3. Rendering recommended recipes on gallery view
    galleryView.renderRecipes(modal.state.recommenedRecipes);
    // setTimeout(() => {
    // }, SPINNER_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    heroView.renderErrorPopup(err.message);
  }
};

const controlRecipeSection = async function (item) {
  try {
    // 1. Rendering spinner on recipe section
    recipeSectionView.renderSpinner();

    // 2. Loading results based on item clicked on view
    await modal.loadQueryResults(item);

    // 3. Generating required recipes to render
    modal.loadTabsRequiredRecipes(item);

    // 4. Rendering required recipes on view
    const requiredRecipes = modal.state.recipeTabsContent.find(
      i => i.query === item
    );

    // console.log(requiredRecipes);
    recipeSectionView.renderRecipes(requiredRecipes.requiredRecipes);
  } catch (err) {
    heroView.renderErrorPopup(err.message);
    recipeSectionView.renderError(
      `${err.message}. Please check your internet connection`
    );
  }
};

const controlRecipeSectionOnLoad = function () {
  if (!modal.state.activeTab) return;

  recipeSectionView.activeTab(modal.state.activeTab);

  const requiredRecipes = modal.state.recipeTabsContent.find(
    i => i.query === modal.state.activeTab
  );

  recipeSectionView.renderRecipes(requiredRecipes.requiredRecipes);
};

const init = function () {
  // Tasks to be performed when the page loads
  controlLocalStorageData();
  controlUserNetworkStatus();
  controlHeroView();
  controlThemeOnLoad();
  controlUserLocationOnLoad();
  controlRecommendedRecipes();
  controlRecipeSectionOnLoad();

  setInterval(() => {
    cronJob() && controlRecommendedRecipes();
  }, 1000);

  // Taks to be performed on user actions on view
  searchView.addHandlerSearch(controlSearchResults);
  heroView.addHandlerLocation(controlUserLocation);
  htmlView.changeTheme(controlThemeChange);
  recipeSectionView.addHandlerTabs(
    controlRecipeSection,
    modal.state.recipeTabs
  );
};

init();

// document

// document
//   .querySelector('.hero__form--input')
//   .addEventListener('focusout', function (e) {
//     console.log(e);
//     const suggestionBox = document.querySelector('.hero__form--suggestion-box');

//     suggestionBox.style.transform = 'translateY(2rem)';
//     suggestionBox.style.opacity = '0';
//   });
