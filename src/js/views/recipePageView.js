class RecipePageView {
  #parentElement = document.querySelector('.recipe__content');

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  renderRecipe(recipe) {
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
    `;

    this.#parentElement.insertAdjacentHTML('beforeend', html);
  }
}

export default new RecipePageView();
