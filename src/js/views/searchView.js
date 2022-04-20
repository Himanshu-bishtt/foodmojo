class SearchView {
  #parentElement = document.querySelector('.hero__form--form');

  getQuery() {
    const query = this.#parentElement.querySelector('.hero__form--input').value;
    this.#clearInput();
    return query.toLowerCase();
  }

  #clearInput() {
    this.#parentElement.querySelector('.hero__form--input').value = '';
    this.#parentElement.querySelector('.hero__form--input').blur();
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
