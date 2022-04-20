import icons from '../../icons/icons.svg';
class RecipeSectionView {
  #parentElement = document.querySelector('.recipes');

  renderSpinner() {
    this.#parentElement.querySelector('.recipes__content').innerHTML = '';

    const spinner = `
    <svg class="recipes__content--spinner spinner">
              <use href="${icons}#icon-loader"></use>
            </svg>
    `;

    this.#parentElement
      .querySelector('.recipes__content')
      .insertAdjacentHTML('beforeend', spinner);
  }

  renderError(msg) {
    this.#parentElement.querySelector('.recipes__content').innerHTML = '';

    const html = `
    <p class="text-center fs-1-5" style="color: red">
      ${msg}
    </p>
    `;
    this.#parentElement
      .querySelector('.recipes__content')
      .insertAdjacentHTML('beforeend', html);
  }

  #renderTabs(tabItems) {
    const tabsContainer = this.#parentElement.querySelector(
      '.recipes__tab--container'
    );

    tabsContainer.innerHTML = '';

    const tabs = tabItems
      .map((item, index) => {
        return `
        <button class="btn recipes__tab recipes__tab--${index + 1}" data-tab="${
          index + 1
        }">
            ${item.split('')[0].toUpperCase() + item.slice(1)}
          </button>
            `;
      })
      .join('');

    tabsContainer.insertAdjacentHTML('beforeend', tabs);
  }

  addHandlerTabs(handler, tabItems) {
    this.#renderTabs(tabItems);

    const allBtns = document.querySelectorAll('.recipes__tab');

    this.#parentElement
      .querySelector('.recipes__tab--container')
      .addEventListener('click', function (e) {
        if (!e.target.classList.contains('recipes__tab')) return;

        allBtns.forEach(btn => btn.classList.remove('recipes__tab--active'));

        e.target.classList.add('recipes__tab--active');
        handler(e.target.textContent.trim().toLowerCase());
      });
  }

  renderRecipes(data) {
    this.#parentElement.querySelector('.recipes__content').innerHTML = '';
    this.#parentElement
      .querySelector('.recipes__content')
      .insertAdjacentHTML('beforeend', this._generateMarkup(data));
  }

  _generateMarkup(data) {
    return data
      .map(recipe => {
        return `
        <a href="#${recipe.id}" title="${recipe.title}">
          <div class="recipe">
            <img class="recipe__image" src="${recipe.image_url}" alt="${recipe.title}" />
            <h3 class="recipe__name heading--tertiary mg-2">
              ${recipe.title}
            </h3>
          </div>
        </a>
      `;
      })
      .join('');
  }
}

export default new RecipeSectionView();
