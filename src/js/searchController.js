'use strict';

import 'core-js/stable';

import * as modal from './modal';
import htmlView from './views/htmlView';
import paginationView from './views/paginationView';
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

    // searchPageView.renderResults(queryResults);

    const requiredRecipes = await modal.loadSearchResultsPerPage(query);

    console.log(requiredRecipes);

    searchPageView.renderResults(requiredRecipes);

    paginationView.renderButtons(modal.state.search, queryResults.recipes);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = async function (pageNum) {
  const query = new URL(window.location.href).searchParams.get('query');

  const queryResults = modal.state.allLoadedContent.find(
    results => results.query === query
  );

  searchPageView.renderResults(
    await modal.loadSearchResultsPerPage(query, pageNum)
  );

  paginationView.renderButtons(modal.state.search, queryResults.recipes);
};

const init = async function () {
  controlLocalStorageData();
  controlUserNetworkStatus();
  controlThemeOnLoad();
  controlSearchPageResults();

  htmlView.changeTheme(controlThemeChange);
  paginationView.addHandlerClick(controlPagination);

  // test
  // console.log(await modal.loadSearchResultsPerPage('pineapple', 1));
  // console.log(await modal.loadSearchResultsPerPage('pineapple', 2));
};

init();
