class RecipeView {
  #parentElement = document.querySelector('.recipe');

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  renderRecipe(recipe) {
    this.#parentElement.innerHTML = '';

    const html = `
    <p class="recipe__title">${recipe.title}</p>
    <p class="recipe__publisher">${recipe.publisher}</p>
    <p class="recipe__servings">${recipe.servings}</p>
    <p class="recipe__time">${recipe.cooking_time}</p>
    <p>TEST</p>
    `;

    this.#parentElement.insertAdjacentHTML('beforeend', html);
  }
}

export default new RecipeView();
