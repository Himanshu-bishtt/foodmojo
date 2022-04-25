'use strict';

import 'core-js/stable';

import * as modal from './modal';
import htmlView from './views/htmlView';
import searchPageView from './views/searchPageView';

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

const controlSearchPageResults = function () {
  // searchPageView.renderSpinner();

  try {
    searchPageView.renderSpinner();

    const query = new URL(window.location.href).searchParams.get('query');

    const queryResults = modal.state.allLoadedContent.find(
      results => results.query === query
    );

    searchPageView.renderResults(queryResults);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  controlLocalStorageData();
  controlUserNetworkStatus();
  controlThemeOnLoad();
  controlSearchPageResults();

  htmlView.changeTheme(controlThemeChange);
};

init();
