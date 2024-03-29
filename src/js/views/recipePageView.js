import icons from '../../icons/icons.svg';
import { Fraction } from 'fractional';

class RecipePageView {
  #parentElement = document.querySelector('.recipe__content');
  #errorMessage = 'No recipe found with that id. Please try again!';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  renderSpinner() {
    this.#parentElement.innerHTML = '';

    const spinner = `
    <svg class="spinner">
      <use href="${icons}#icon-loader"></use>
    </svg>
    `;

    this.#parentElement.insertAdjacentHTML('beforeend', spinner);
  }

  renderError(msg = this.#errorMessage) {
    this.#parentElement.innerHTML = '';

    const html = `
      <p class="text-center fs-2" style="color: red">${msg}</p>
    `;

    this.#parentElement.insertAdjacentHTML('beforeend', html);
  }

  renderRecipe(recipe) {
    document.title = `FoodMojo | ${recipe.title} by ${recipe.publisher}`;
    this.#parentElement.innerHTML = '';

    const html = `
      <figure class="recipe__fig">
        <img
          src="${recipe.image_url}"
          alt="${recipe.title}"
          class="recipe__img"
        />
        <h1 class="recipe__title">
          <span>${recipe.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__details--time">
          <svg>
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span>${recipe.cooking_time} MINUTES</span>
        </div>

        <div class="recipe__details--servings">
          <svg>
            <use href="${icons}#icon-users"></use>
          </svg>
          <span>${recipe.servings} SERVINGS</span>
        </div>
      </div>

      <div class="recipe__ingredients">
        <h3 class="heading--secondary mg-5">Recipe Ingredients</h3>
        <ul class="recipe__ingredient-list">
          ${this.#renderIngredients(recipe.ingredients)}
        </ul>
      </div>
    `;

    this.#parentElement.insertAdjacentHTML('beforeend', html);
  }

  #renderIngredients(ingredients) {
    const html = ingredients
      .map(ing => {
        return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            ing.quantity ? new Fraction(ing.quantity).toString() : ''
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
        </li>
        `;
      })
      .join('');

    return html;
  }
}

export default new RecipePageView();
