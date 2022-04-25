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
    this.#showSuggestionBox();
    this.#hideSuggestionBox();
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  #showSuggestionBox() {
    this.#parentElement
      .querySelector('.hero__form--input')
      .addEventListener('focus', () => {
        const suggestionBox = this.#parentElement.querySelector(
          '.hero__form--suggestion-box'
        );

        suggestionBox.style.transform = 'translateY(0rem)';
        suggestionBox.style.opacity = '1';
        suggestionBox.style.visibility = 'visible';
      });
  }

  #hideSuggestionBox() {
    this.#parentElement
      .querySelector('.hero__form--input')
      .addEventListener('focusout', () => {
        const suggestionBox = this.#parentElement.querySelector(
          '.hero__form--suggestion-box'
        );

        suggestionBox.style.transform = 'translateY(2rem)';
        suggestionBox.style.opacity = '0';
        suggestionBox.style.visibility = 'hidden';
      });
  }
}

export default new SearchView();
