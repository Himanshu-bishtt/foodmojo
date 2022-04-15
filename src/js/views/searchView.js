class SearchView {
  _parentElement = document.querySelector('.hero__form--form');

  getQuery() {
    const query = this._parentElement.querySelector('.hero__form--input').value;
    this._clearInput();
    return query.toLowerCase();
  }

  _clearInput() {
    this._parentElement.querySelector('.hero__form--input').value = '';
    this._parentElement.querySelector('.hero__form--input').blur();
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
