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
    this.renderSuggestionList();
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  renderSuggestionList() {
    this.#parentElement.querySelector('.suggestion-box__list').innerHTML = '';

    const suggestionItems = [
      'pizza',
      'pasta',
      'carrot',
      'pineapple',
      'cauliflower pizza crust',
    ];

    this.#parentElement
      .querySelector('.suggestion-box__list')
      .insertAdjacentHTML(
        'beforeend',
        this.#generateSuggestionList(suggestionItems)
      );
  }

  #generateSuggestionList(items) {
    return items
      .map(
        item => `
      <a href="./search.html?query=${item}"><li class="suggestion-box__item">${item}</li></a>
    `
      )
      .join('');
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
