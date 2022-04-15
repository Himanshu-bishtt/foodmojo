'use strict';

import * as modal from './modal';
import heroView from './views/heroView';
import searchView from './views/searchView';

import { MODAL_CLOSE_SEC } from './config';

if (module.hot) {
  module.hot.accept();
}

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

const init = function () {
  controlHeroView();
  searchView.addHandlerSearch(controlSearchResults);
};

init();
