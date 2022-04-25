import icons from '../../icons/icons.svg';

class SearchPageView {
  #parentElement = document.querySelector('.results');

  renderSpinner() {
    this.#parentElement.querySelector('.results__container').innerHTML = '';

    const spinner = `
    <svg class="spinner">
      <use href="${icons}#icon-loader"></use>
    </svg>
    `;

    this.#parentElement
      .querySelector('.results__container')
      .insertAdjacentHTML('beforeend', spinner);
  }

  #renderSearchInfo(results) {
    this.#parentElement.querySelector('.results__heading').innerHTML = '';

    const html = `
    <h2 class="heading--primary">${results.query}</h2>
          <p class="results__count mg-1">
            Total results: <span class="results__count--number">${results.results}</span>
          </p>
    `;
    this.#parentElement
      .querySelector('.results__heading')
      .insertAdjacentHTML('beforeend', html);
  }

  renderResults(results) {
    this.#renderSearchInfo(results);
    this.#parentElement.querySelector('.results__container').innerHTML = '';

    this.#parentElement
      .querySelector('.results__container')
      .insertAdjacentHTML('beforeend', this.#generateMarkup(results));
  }

  #generateMarkup(results) {
    return results.recipes
      .map(
        recipe =>
          `<a href="./recipe.html?id=${recipe.id}" title="${recipe.title}">
    <div class="results__item">
      <img
        class="results__item--image"
        src="${recipe.image_url}"
        alt="${recipe.title}"
      />
      <div class="results__item--info">
        <h3 class="results__item--title">
          ${recipe.title}
        </h3>
        <h3 class="results__item--publisher">${recipe.publisher}</h3>
      </div>
    </div>
  </a>
    `
      )
      .join('');
  }
}

export default new SearchPageView();
