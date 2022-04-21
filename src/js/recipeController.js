'use strict';

import * as modal from './modal';
import heroView from './views/heroView';
import htmlView from './views/htmlView';
import recipeView from './views/recipeView';

const controlLocalStorageData = function () {
  modal.loadDataFromLocalStorageOnLoad();
};

const controlHeroView = function () {
  // 1. Rending hero view logo animation on load event
  heroView.renderAnimation();
};

const controlUserNetworkStatus = function () {
  htmlView.renderErrorOnOffline();
};

const controlThemeChange = function (theme) {
  // 1. Storing theme in state when change
  modal.loadTheme(theme);
};

const controlThemeOnLoad = function () {
  htmlView.renderSavedTheme(modal.state.theme);
};

const controlRecipePage = async function () {
  const url = window.location.href;
  const url_str = new URL(url);
  console.log(url_str);

  const id = url_str.searchParams.get('id');
  if (!id) return;

  await modal.loadRecipe(id);

  recipeView.renderRecipe(modal.state.search.recipe);
};

const init = function () {
  controlLocalStorageData();
  controlUserNetworkStatus();
  controlHeroView();
  controlThemeOnLoad();

  controlRecipePage();

  htmlView.changeTheme(controlThemeChange);
};

init();
