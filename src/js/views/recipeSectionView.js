import icons from '../../icons/icons.svg';
class RecipeSectionView {
  _parentElement = document.querySelector('.recipes');

  renderSpinner() {
    this._parentElement.querySelector('.recipes__content').innerHTML = '';

    const spinner = `
    <svg class="recipes__content--spinner spinner">
              <use href="${icons}#icon-loader"></use>
            </svg>
    `;

    this._parentElement
      .querySelector('.recipes__content')
      .insertAdjacentHTML('beforeend', spinner);
  }

  addHandlerTabs(handler) {
    const allBtns = document.querySelectorAll('.recipes__tab');

    this._parentElement
      .querySelector('.recipes__tab--container')
      .addEventListener('click', function (e) {
        if (!e.target.classList.contains('recipes__tab')) return;

        allBtns.forEach(btn => btn.classList.remove('recipes__tab--active'));

        e.target.classList.add('recipes__tab--active');
        handler(e.target.textContent.trim().toLowerCase());
      });
  }

  renderRecipes(data) {
    this._parentElement.querySelector('.recipes__content').innerHTML = '';
    this._parentElement
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
