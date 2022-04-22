'use strict';

import 'core-js/stable';

import * as modal from './modal';
import htmlView from './views/htmlView';
import recipePageView from './views/recipePageView';

const controlLocalStorageData = function () {
  modal.loadDataFromLocalStorageOnLoad();
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
  controlThemeOnLoad();
  controlRecipePage();

  htmlView.changeTheme(controlThemeChange);
};

init();
