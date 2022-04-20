import icons from '../../icons/icons.svg';

class GalleryView {
  #parentElement = document.querySelector('.gallery__grid');

  renderSpinner() {
    this.#parentElement.innerHTML = '';

    const spinner = `
    <svg class="gallery__grid--spinner spinner">
    <use href="${icons}#icon-loader"></use>
  </svg>
    `;

    this.#parentElement.insertAdjacentHTML('beforeend', spinner);
  }

  renderRecipes(data) {
    this.#parentElement.innerHTML = '';

    this.#parentElement.insertAdjacentHTML(
      'beforeend',
      this.#generateMarkup(data)
    );
  }

  #generateMarkup(data) {
    const tags = [
      "Today's Special",
      'Quick & Easy',
      "Everyone's fav",
      'Worth The Effort',
    ];
    return data
      .map((recipe, i) => {
        return `
        <a href="#${recipe.id}" class="gallery__grid--item gallery__grid--item-1" title="${recipe.title}">
          <div style="height: 100%">
            <p class="grid__item--tag">${tags[i]}</p>
            <img class="grid__item--image" src="${recipe.image_url}" alt="${recipe.title}" />

            <div class="grid__item--info">
              <h2 class="heading--teritary">${recipe.title}</h2>
              <p class="mg-1"> Publisher:
                ${recipe.publisher}
              </p>
            </div>
          </div>
        </a>
      
      `;
      })
      .join('');
  }
}

export default new GalleryView();
