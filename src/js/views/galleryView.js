import icons from '../../icons/icons.svg';

class GalleryView {
  _parentElement = document.querySelector('.gallery__grid');

  renderSpinner() {
    this._parentElement.innerHTML = '';

    const spinner = `
    <svg class="gallery__grid--spinner">
    <use href="${icons}#icon-loader"></use>
  </svg>
    `;

    this._parentElement.insertAdjacentHTML('beforeend', spinner);
  }
}

export default new GalleryView();
