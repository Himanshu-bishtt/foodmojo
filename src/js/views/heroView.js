import { MODAL_CLOSE_SEC } from '../config';
import icons from '../../icons/icons.svg';

class HeroView {
  _parentElement = document.querySelector('.hero');

  renderAnimation() {
    window.addEventListener('load', () => {
      this._parentElement.querySelector(
        '.hero__content--heading'
      ).style.filter = 'blur(0)';

      this._parentElement.querySelector(
        '.hero__content--heading'
      ).style.letterSpacing = '0';
    });
  }

  renderErrorPopup(msg) {
    const errorPopup = this._parentElement.querySelector('.hero__error-popup');
    errorPopup.textContent = msg;
    errorPopup.style.opacity = 1;
    errorPopup.style.transform = 'scale(1)';

    setTimeout(() => {
      errorPopup.style.opacity = 0;
      errorPopup.style.transform = 'scale(0)';
    }, MODAL_CLOSE_SEC * 1000);
  }

  _generateMarkup(element, html) {
    element.innerHTML = '';
    element.insertAdjacentHTML('beforeend', html);
  }

  renderSpinner() {
    const element = this._parentElement.querySelector('.hero__form--location');

    const spinner = `
      <svg class="hero__form--spinner">
        <use href="${icons}#icon-loader"></use>
      </svg>
    `;

    this._generateMarkup(element, spinner);
  }

  renderUserLocation(region) {
    const element = this._parentElement.querySelector('.hero__form--location');

    const html = `
      <img src="/location-48.5100a1b2.png" alt="location icon" />
      <p class="hero__form--location-user">${region}</p>
    `;

    this._generateMarkup(element, html);
  }

  renderLocationErrorOnCancel() {
    const element = this._parentElement.querySelector('.hero__form--location');

    const html = `
      <img src="/location-48.5100a1b2.png" alt="location icon" />
      <p class="hero__form--location-user">Location denied</p>
    `;

    this._generateMarkup(element, html);
  }

  addHandlerLocation(handler) {
    const detectLocationBtn = this._parentElement.querySelector(
      '.hero__form--location-btn'
    );

    if (!detectLocationBtn) return;

    detectLocationBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new HeroView();
